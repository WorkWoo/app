// Config
var cfg = require('workwoo-utils').config;

var mongoose = require('mongoose');
var qpcache = require('workwoo-utils').cache;
var utility = require('workwoo-utils').utility;
var log = require('workwoo-utils').logger;

var Counter = require('workwoo-utils').counter;
var Collection = require('../models/collection');

// Custom modules
var fieldTypes = require('workwoo-utils').fieldType.getFieldTypesArray();

var widget = 'Item';
log.registerWidget(widget);

var Schema = mongoose.Schema;
var itemSchema = new Schema({});

itemSchema.statics.getCollections = function(org, callback) {
	try {
		log.info('|Item.getCollections| org -> ' + org, widget);
		// Check to see if the collection is in the cache before looking in the db
		var collectionInfo = qpcache.get(org);
		if(collectionInfo) {
			log.info('|Collection.getCollections| Cached collections found', widget);
			return callback(null, collectionInfo);
		}
		log.info('|Item.getCollections| Cached collections NOT found, looking in DB...', widget);
		
		Collection.find({ _org: org})
			.populate('_org')
			.exec(
			function (error, collections) {
				if (error) {
					return callback(error, false);
				}
				
				if (!collections) { 
					log.info('|Item.getCollections| No collections found', widget);
					return callback(null, null);
				}
				var collectionsObject = {};
				var modelsObject = {};
				for (var i=0; i<collections.length; i++) {
					collectionsObject[collections[i].name] = collections[i];
					modelsObject[collections[i].name] = createItemSchema(collections[i]);
				}

				// Save the collection info for this org to the cache
				var collectionInfo = {
					collections: collectionsObject,
					models: modelsObject,
					fieldTypes: fieldTypes
				};

				log.info('|Item.getCollections| Attempting to cach collections for org -> ' + org, widget);
				qpcache.save(org, collectionInfo);

				return callback(null, collectionInfo);
			}
		);

	} catch (error) {
		log.error('|Item.getCollections| Unknown -> ' + error, widget);
		return callback(error, false);
	}
};

//	options = {
// 		[mandatory] org: String org ID
// 		[mandatory] collectionName: String collection name
// 		[optional]  sortField: String field name   --|
// 		[optional]  sortOrder: String asc or desc  --| Mandatory together   
// 		[optional]  lastFieldValue: String field value
//		[optional]  lastItemID: String document ID
// 		[optional]  searchTerm: String
//	};
itemSchema.statics.getItems = function(options, callback) {
	try {
		log.info('|Item.getItems|', widget);

		// If no collection or org was given, return an error
		if (!options.org || !options.collectionName) {
			log.error('|Item.getItems.find| Org or collection not given', widget);
			return callback(true, null);
		}

		// Try to get a cached model for the given collection. If one does not exist, create and cache it.
		var collectionInfo = qpcache.get(options.org);
		var Item = collectionInfo.models[options.collectionName];
		
		// Build the result, which will contain not only the items but information about the resulting set
		var result = {
			lastFieldValue: null,
			lastItemID: null,
			total: 0,
			items: []
		}

		// Before we do the actual search to get the results to return,
		//  we need to count the total number of possible items.
		// No sorting or pagination is necessary at this point.
		var countQuery = {
			_org: options.org,
			collectionName: options.collectionName
		};

		if (options.searchTerm) {
			countQuery['$text'] = { $search: options.searchTerm.toLowerCase() };
		}

		if (options.additionalQuery) {
			for (var property in options.additionalQuery) {
				countQuery[property] = options.additionalQuery[property];
			}
		}

		Item.count(countQuery, function(error, count){
			if (error) {
				log.error('|Item.getItems.count| Unknown -> ' + error, widget);
				return callback(error, null);
			}

			// If the count was zero, we can return now since we know there are no matching items
			result.total = count;
			if (result.total == 0) {
				log.info('|Item.getItems.count| No items found', widget);
				return callback(null, result);
			}
			

			// Define the sort criteria if given. If not, add a default "_id desc" criteria.
			var sortCriteria = {}
			if (options.sortField && options.sortOrder) {
				sortCriteria[options.sortField] = options.sortOrder;
				// Add "_id desc" as a second level sort, to handle sorting on non-unique values
				sortCriteria._id = 'desc';
			} else {
				// If no sort was given, default to just the _id.
				options.sortField = '_id';
				options.sortOrder = 'desc'; // assign values to the sort options so they can be passed to the anchor criteria
				sortCriteria[options.sortField] = options.sortOrder;
			}
			

			// ########## Begin building the actual "Find" query.

			// Default query criteria
			var defaultQuery = {};
			defaultQuery._org = options.org;
			defaultQuery.collectionName = options.collectionName;

			// Add the search term, if one was given
			var searchQuery = {};
			if (options.searchTerm) {
				searchQuery['$text'] = { $search: options.searchTerm.toLowerCase() };
			}

			// Add the additional query criteria, if given
			if (options.additionalQuery) {
				for (var property in options.additionalQuery) {
					searchQuery[property] = options.additionalQuery[property];
				}
			}

			// Add ther anchor query, if anchor criteria was given
			var anchorQuery = {};
			if (options.lastFieldValue && options.lastItemID) {
				anchorQuery = createItemAnchorQuery(options.sortOrder, options.sortField, options.lastFieldValue, options.lastItemID);
			}

			var fullQuery = { $and: [defaultQuery, searchQuery, anchorQuery] };

			// Lastly, grab the limit and reference fields for this collection so that they can be populated
			var itemsPerPage = 40; // #################### TODO: Move to config
			var referenceFields = collectionInfo.collections[options.collectionName].referenceFields;

			Item.find(fullQuery)
				.sort(sortCriteria)
				.limit(itemsPerPage)
				.populate('_created_by', 'firstName lastName')
				.populate('_updated_by', 'firstName lastName')
				.populate(referenceFields)
				.exec( function (error, items) {
					if (error) {
						log.error('|Item.getItems.find| Unknown -> ' + error, widget);
						return callback(error, result);
					}

					if (!items || items.length == 0) { // Should have been handled in count
						log.info('|Item.getItems.find| No items found', widget);
						return callback(null, result);
					}

					// Now that we have the items, get what we need about the result set
					result.newAnchorValue = items[items.length-1][options.sortField];
					result.newAnchorID = items[items.length-1]._id;
					result.items = items;

					// Log and return the result
					log.info('|Item.getItems| Returning [' + items.length + '] items out of [' + result.total + ']', widget);
					return callback(null, result);
				}
			);
		});
	} catch (error) {
		log.error('|Item.getItems| Unknown -> ' + error, widget);
		return callback(error, false);
	}
};


function createItemAnchorQuery(sortOrder, sortField, lastFieldValue, lastItemID) {
	try {
		log.info('|Item.createItemAnchorQuery|', widget);

		// The first part of the query is to add the simple 'Greater than' or
		// 'less than' criteria, which returns items before or after the last
		// one that was returned, depending on the sort order that was given.
		var greaterLessThanCriteria = {};
		if (sortOrder == 'asc') {
			greaterLessThanCriteria[sortField] = { $gt: lastFieldValue };
		} else if (sortOrder == 'desc') {
			greaterLessThanCriteria[sortField] = { $lt: lastFieldValue };
		}

		// The second part is a little trickier. We need to get those items
		// that have the same value as the last record but a greater ID.
		var equalToCriteria = {};
		equalToCriteria[sortField] = { $eq: lastFieldValue };
		equalToCriteria._id = { $lt: lastItemID };

		// Combine the two into an OR and return.
		var anchorQuery = { $or: [greaterLessThanCriteria, equalToCriteria] };
		return anchorQuery;

	} catch (error) {
		log.error('|Item.createItemAnchorQuery| Unknown -> ' + error, widget);
	}
}


itemSchema.statics.update = function(org, collectionName, itemID, updatedItem, createRevision, callback) {
	try {
		log.info('|Item.update| org -> ' + org + ' collectionName -> ' + collectionName + ' itemID -> ' + itemID, widget);

		// Try to get a cached model for the given collection. If one does not exist, create and cache it.
		var collectionInfo = qpcache.get(org);
		var Item = collectionInfo.models[collectionName];

		var findQuery = {
			_id: itemID,
			_org: org,
			collectionName: collectionName
		};

		// Grab the reference fields so that they can be populated
		var collectionObject = qpcache.get(org).collections[collectionName];
		var referenceFields = collectionObject.referenceFields;
		var collectionType = collectionObject.collectionType;

		// Execute the update
		Item.findOne(findQuery)
			.exec(
			function (error, item) {
				if (error) {
					log.error('|Item.update| Unknown error -> ' + error, widget);
					return callback(error, false);
				}

				if (!item) { 
					log.info('|Item.update| Item not found -> ' + itemID, widget);
					return callback(null, false);
				}

				log.info('|Item.update| Found item for update -> ' + itemID, widget);
				for (var field in updatedItem) {
					item[field] = updatedItem[field];
				}

				// If this is a revisionable item and this is a new revision
				if (collectionType == 'static-revisionable' && createRevision) {
					var newItem = {};
					newItem._parent = item._id;
					newItem.revision = item.revision + 1;
					newItem._created_by = item._updated_by;
					newItem.isCurrentRevision = true;

					var itemFields = collectionObject.fields;
					for (var i=0; i<itemFields.length; i++) {
						newItem[itemFields[i].name] = item[itemFields[i].name];
					}

					ItemCollection.createNewItem(org, collectionName, newItem, function (error, newItem) {
						if (error) {
							log.error('|Item.update| Unknown error -> ' + error, widget);
							return callback(error, false);
						}

						if (!newItem) { 
							log.info('|Item.update| Item not saved -> ' + itemID, widget);
							return callback(null, false);
						}

						Item.findById(item._id)
							.exec(
							function (error, previousRevision) {
								if (error) {
									log.error('|Item.update| Unknown error -> ' + error, widget);
									return callback(error, false);
								}

								if (previousRevision) {
									previousRevision.isCurrentRevision = false;
									previousRevision.save(function (error) {
										if (error) {
											log.error('|Item.updateItem| Unknown error while updating -> ' + error, widget);
											return callback(error, false);
										}
									});
								}

								return callback(null, newItem);
							}
						);

					});
				} else { // Otherwise if not revisionable or this is not a new revision, just save the item
					item.save(function (error) {
						if (error) {
							log.error('|Item.update| Unknown error while updating -> ' + error, widget);
							return callback(error, false);
						}

						// If the save was successful, populate the reference fields and return the newly updated item
						item.populate(referenceFields, function(error, item) {
							if (error) {
								log.error('|Item.update| Unknown error populating references after update -> ' + error, widget);
								return callback(error, false);
							}
							return callback(null, item);
						});
					});
				}
			}
		);
	} catch (error) {
		log.error('|Item.update| -> ' + error, widget);
		return callback(error, false);
	}
};


itemSchema.statics.create = function(org, collectionName, newItemDetails, callback) {
	try {
		log.info('|Item.create| org -> ' + org + ' collectionName -> ' + collectionName, widget);

		// Try to get a cached model for the given collection. If one does not exist, create and cache it.
		var collectionInfo = qpcache.get(org);
		var Item = collectionInfo.models[collectionName];

		var newItem = new Item(newItemDetails);
		newItem._org = org;
		newItem.collectionName = collectionName;

		// Grab the reference fields so that they can be populated
		var referenceFields = qpcache.get(org).collections[collectionName].referenceFields

		newItem.save(function (error) {
			if (error) {
				log.error('|Item.create| Unknown error while creating new item -> ' + error, widget);
				return callback(error, false);
			}

			// If the insert was successful, populate the reference fields and return the newly created item
			newItem.populate(referenceFields, function(error, newItem) {
				if (error) {
					log.error('|Item.create| Unknown error populating references after insert -> ' + error, widget);
					return callback(error, false);
				}
				log.info('|Item.create| New item created successfully', widget);
				return callback(null, newItem);
			});

		});
	} catch (error) {
		log.error('|Item.create| -> ' + error, widget);
		return callback(error, false);
	}
};


itemSchema.statics.deleteItems = function(org, collectionName, itemIDs, callback) {
	try {
		log.info('|Item.deleteItems| org -> ' + org + ' collectionName -> ' + collectionName + ' items -> ' + itemIDs, widget);

		// Try to get a cached model for the given collection. If one does not exist, create and cache it.
		var collectionInfo = qpcache.get(org);
		var Item = collectionInfo.models[collectionName];

		var deleteQuery = {
			_org: org,
			collectionName: collectionName,
			_id: { $in: itemIDs }
		};

		Item.remove(deleteQuery, function(error) {
		    if (error) {
				log.error('|Item.deleteItems| Unknown error while deleting item -> ' + error, widget);
				return callback(error, false);
		    } else {
		    	return callback(null, 'Delete successful');
		    }
		});
	} catch (error) {
		log.error('|Item.deleteItems| -> ' + error, widget);
		return callback(error, false);
	}
};

function createItemSchema(collectionObject) {
	try {
		log.info('|Item.createItemSchema| Creating Schema...', widget);

		// First, create the object with the default system fields
		var itemModel = {
			_org: { type: Schema.Types.ObjectId, ref: 'Org', required: true },
			collectionName: { type: String, required: true },
			_created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    		_updated_by: { type: Schema.Types.ObjectId, ref: 'User' }
		};

		// Then, add the type-specific fields for revisionable items
		if (collectionObject.collectionType == 'static-revisionable') {
			itemModel.revision = { type: Number, default: 0 };
			itemModel.isCurrentRevision = { type: Boolean, default: true };
			itemModel._parent = { type: Schema.Types.ObjectId, ref: collectionObject._org._id + '_' + collectionObject.name };
		}

		// Then add each custom user-defined field
		var itemFields = collectionObject.fields;
		for (var i=0; i<itemFields.length; i++) {

			// First, handle if it's a reference field
			if (itemFields[i].dbType == 'SingleReference') {
				itemModel[itemFields[i].name] = { type: Schema.Types.ObjectId, ref: collectionObject._org._id + '_' + itemFields[i].referenceTo };
			} else if(itemFields[i].dbType == 'ReferenceList') {

				var listItemSchema = new Schema({
					qty: { type: Number },
					_id: { type: Schema.Types.ObjectId, ref: collectionObject._org._id + '_' + itemFields[i].referenceTo }
				});

				//itemModel[itemFields[i].name] = { type: [Schema.Types.ObjectId], ref: collectionObject._org._id + '_' + itemFields[i].referenceTo };
				itemModel[itemFields[i].name] = [listItemSchema];

			} else {
				itemModel[itemFields[i].name] = { type: itemFields[i].dbType };
			}
		}

		var newItemSchema = new Schema(itemModel, cfg.mongoose.options);

		// Inject counter pre save hook
		newItemSchema.pre('save', function(next) {
			var item = this;
			if (this.isNew && (!this.revision || this.revision == 0)) {
				Counter.increment(item.collectionName, this._org, function(error, incrementedNumber) {
					item.number = incrementedNumber;
					next();
				});
			} else {
				next();
			}
		});

		// Finally, delete the old, then create and return the new mongoose model
		
		var newModelName = collectionObject._org._id + '_' + collectionObject.name;
		if (mongoose.models[newModelName]) {
			delete mongoose.models[newModelName];
		}
		var NewItem = mongoose.model(newModelName, newItemSchema, 'items');
		return NewItem;

	} catch (error) {
		log.error('|Item.createItemSchema| -> ' + error, widget);
	}
}


itemSchema.pre('save', function(next) {
	var currentDate = new Date();
	this.updated_at = currentDate;

	if (!this.created_at)
    	this.created_at = currentDate;

	next();
});


var Item = mongoose.model('Item', itemSchema);
module.exports = Item;
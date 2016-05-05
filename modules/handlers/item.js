// Config
var cfg = require('workwoo-utils').config;

// Mongoose
var Item = require('../models/item');
var Org = require('workwoo-utils').org;

// Custom modules
var mailer = require('workwoo-utils').mailer;
var utility = require('workwoo-utils').utility;
var log = require('workwoo-utils').logger;
var widget = 'item';
log.registerWidget(widget);

exports.getCollections = function(req, res) {
	try {
		log.info('|item.getCollections|');
		
		Item.getCollections(req.session.userprofile.org._id, function(error, collectionsObject){
			if (error) {
				log.error('|item.getItems| Unknown error -> ' + error, widget);
			} else {
				res.send(JSON.stringify({ collections: collectionsObject.collections, fieldTypes: collectionsObject.fieldTypes, collectionTypes: collectionsObject.collectionTypes }));
			}
		});

	} catch (error) {
		utility.logObject(error);
		log.error('|item.getCollections| -> ' + error, widget);
	}
};

exports.getItems = function(req, res) {
	try {
		var collectionName = req.query.collectionName;
		var sortField = req.query.sortField;
		var sortOrder = req.query.sortOrder;
		var lastFieldValue = req.query.anchorValue; // null anchor value is OK, if querying from the newest to oldest
		var lastItemID = req.query.anchorID;
		var searchTerm = req.query.searchTerm;
		var additionalQuery = req.query.additionalQuery;
		var itemCount = 40; // #################### TODO: Move to config;
		
		if (req.query.itemCount &&  parseInt(req.query.itemCount) != 'NaN') {
			itemCount = parseInt(req.query.itemCount);
		}

		log.info('|item.getItems| collectionName -> ' + collectionName, widget);
		log.info('|item.getItems| sortField -> ' + sortField, widget);
		log.info('|item.getItems| sortOrder -> ' + sortOrder, widget);
		log.info('|item.getItems| lastFieldValue -> ' + lastFieldValue, widget);
		log.info('|item.getItems| lastItemID -> ' + lastItemID, widget);
		log.info('|item.getItems| searchTerm -> ' + searchTerm, widget);
		log.info('|item.getItems| additionalQuery -> ' + additionalQuery, widget);
		log.info('|item.getItems| itemCount -> ' + itemCount, widget);

		if (!collectionName) {
			log.error('|item.getItems| No collectionName given', widget);
			res.status(500);
			var errorMessage = {error: 'No collectionName given'};
			res.send(JSON.stringify(errorMessage));
		}

		var options = {
			org: req.session.userprofile.org._id,
			collectionName: collectionName,
			sortField: sortField,
			sortOrder: sortOrder,
			lastFieldValue: lastFieldValue,
			lastItemID: lastItemID,
			searchTerm: searchTerm,
			itemCount: itemCount
		};

		if (additionalQuery) {
			options.additionalQuery = JSON.parse(additionalQuery);
		} else {
			options.additionalQuery = null;
		}

		Item.getItems(options, function(error, result){
			if (error) {
				log.error('|item.getItems| Unknown error  -> ' + error, widget);
			} else {
				res.send(JSON.stringify({ result: result }));
			}
		});

	} catch (error) {
		log.error('|item.getItems| -> ' + error, widget);
	}
};


exports.getOneItem = function(req, res) {
	try {
		var collectionName = req.query.collectionName;
		var itemNumber = req.query.itemNumber;
		log.info('|item.getOneItem| Collection -> ' + collectionName + ', Item number -> ' + itemNumber, widget);

		var options = {
			org: req.session.userprofile.org._id,
			collectionName: collectionName,
			sortField: null,
			sortOrder: null,
			lastFieldValue: null,
			lastItemID: null,
			searchTerm: null,
			additionalQuery: { number: itemNumber },
		};

		Item.getItems(options, function(error, result){ // anchorID null
			if (error) {
				log.error('|mainapp.getOneItem| Unknown error  -> ' + error, widget);
			} else {
				log.info('|mainapp.getOneItem| Returning ' + result.items.length + ' item', widget);
				res.send(JSON.stringify({ item: result.items[0] }));
			}
		});

	} catch (error) {
		log.error('|item.getOneItem| -> ' + error, widget);
	}
};


exports.update = function(req, res) {
	try {
		var collectionName = req.body.collectionName;
		var itemID = req.body.itemID;
		var updatedItem = req.body.updatedItem;
		var createRevision = req.body.createRevision;

		log.info('|item.update| Collection -> ' + collectionName + ', Item ID -> ' + itemID, widget);

		updatedItem._updated_by = req.session.userprofile.id;
		
		Item.update(req.session.userprofile.org._id, collectionName, itemID, updatedItem, createRevision, function(error, item){
			if (error) {
				log.error('|item.update| Unknown -> ' + error, widget);
			} else {
				log.info('|item.update| Returning updated item', widget);
				res.send(JSON.stringify({ item: item }));
			}
		});
	} catch (error) {
		log.error('|item.update| Unknown -> ' + error, widget);
	}
};


exports.create = function(req, res) {
	try {
		var collectionName = req.body.collectionName;
		var newItem = req.body.newItem;

		log.info('|item.create| Collection -> ' + collectionName, widget);

		newItem._created_by = req.session.userprofile.id;
		newItem._updated_by = req.session.userprofile.id;

		Item.create(req.session.userprofile.org._id, collectionName, newItem, function(error, item){
			if (error) {
				log.error('|item.create| Unknown -> ' + error, widget);
			} else {
				log.info('|item.create| Returning newly created item', widget);
				res.send(JSON.stringify({ item: item }));
			}
		});
	} catch (error) {
		log.error('|item.create| -> ' + error, widget);
	}
};


exports.deleteItems = function(req, res) {
	try {
		var collectionName = req.body.collectionName;
		var itemIDs = req.body.itemIDs;

		log.info('|item.deleteItems| Collection -> ' + collectionName + ', Items -> ' + itemIDs, widget);

		Item.deleteItems(req.session.userprofile.org._id, collectionName, itemIDs, function(error, result){
			if (error) {
				log.error('|item.deleteItems| Unknown error  -> ' + error, widget);
			} else {
				res.send(JSON.stringify({ result: result }));
			}
		});
	} catch (error) {
		log.error('|item.deleteItems| -> ' + error, widget);
	}
};


exports.search = function(req, res) {
	try {
		var collectionName = req.query.collectionName;
		var searchTerm = req.query.searchTerm;

		if (!collectionName || !searchTerm) {
			log.error('| item.searchItems| Incomplete params -> ' + collectionName + ', ' + searchTerm, widget);
		}

		log.info('|item.searchItems| Collection -> ' + collectionName, widget);
		log.info('|item.searchItems| Search term -> ' + searchTerm, widget);

		var query = { 
			$text: { $search: searchTerm.toLowerCase() }
		};

		Item.getItems(req.session.userprofile.org._id, collectionName, query, function(error, items){
			if (error) {
				log.error('|item.searchItems| Unknown error  -> ' + error, widget);
			} else {
				log.info('|item.searchItems| Returning ' + items.length + ' items', widget);
				res.send(JSON.stringify({ items: items }));
			}
		});

	} catch (error) {
		log.error('|item.searchItems| -> ' + error, widget);
	}
};

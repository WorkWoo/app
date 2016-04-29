// Config
var cfg = require('workwoo-utils').config;

// Mongoose
var Collection = require('../models/collection');
var Item = require('../models/item');
var Counter = require('workwoo-utils').counter;
var Org = require('workwoo-utils').org;

var inflect = require('i')(true);

// Custom modules
var fieldTypes = require('workwoo-utils').fieldType.getFieldTypesObject();
var qpcache = require('workwoo-utils').cache;
var utility = require('workwoo-utils').utility;
var log = require('workwoo-utils').logger;
var widget = 'Collection Handler';
log.registerWidget(widget);


exports.create = function(req, res) {
	try {
		log.info('|collection.create|', widget);

		// TODO: Scrub request body
		if (!req.body.collection) {
			log.error('|collection.create| No collection given');
			utility.errorResponseJSON(res, 'No collection given');
		}

		var orgID = req.session.userprofile.org._id;

		// First, set the propeties that can be directly saved.
		var newCollection = new Collection();
		newCollection._org = orgID;
		newCollection.collectionType = req.body.collection.collectionType;
		newCollection.numberPrefix = req.body.collection.numberPrefix.toUpperCase();
		newCollection.icon = req.body.collection.icon;
		newCollection.displayField = req.body.collection.displayField;
		newCollection.stateChoices = req.body.collection.stateChoices;


		// Then, calculate the collection name and labels, since the
		// user only provides the "Plural" value for the collection.
		newCollection.pluralLabel = inflect.pluralize(req.body.collection.pluralLabel);
		newCollection.pluralLabel = inflect.titleize(newCollection.pluralLabel);

		newCollection.singleLabel = inflect.singularize(newCollection.pluralLabel);
		newCollection.singleLabel = inflect.titleize(newCollection.singleLabel);

	 	newCollection.name = newCollection.pluralLabel.toLowerCase().replace(/ /g,''); // Lowercase and remove spaces
		
		// Now iterate through each field to do several thing:
		// 1. Lowercase and remove space from the provided field names
		// 2. Count the number of fields for list views.
		// 3. Record the reference fields.
		// 4. The DB Type, based on the display type.
		var processedFields = [];
		var referenceFields = '';
		var listFieldCount = 0;
		for (var i=0; i<req.body.collection.fields.length; i++) {
			var field = req.body.collection.fields[i];
			
			if(field.showOnList) {
				listFieldCount++;
			}

			// Translate the display types into db types
			if (field.displayType == 'text' || field.displayType == 'textarea' || field.displayType == 'choice' || field.displayType == 'autonumber' || field.displayType == 'state' || field.displayType == 'currency' || field.displayType == 'phone') {
				field.dbType = 'String';
				if (field.displayType == 'state') {
					field.choices = newCollection.stateChoices;
				}
			} else if (field.displayType == 'datetime') {
				field.dbType = 'Date';
			} else if (field.displayType == 'SingleReference') {
				field.dbType = 'SingleReference';
			} else if (field.displayType == 'ReferenceList') {
				field.dbType = 'ReferenceList';
			} else if(field.displayType == 'checkbox') {
				field.dbType = 'boolean';
			}

			// If the field if a reference, store it at the top level
			if (field.dbType == 'SingleReference' || field.dbType == 'ReferenceList') {
				referenceFields += field.name + ' ';
			}

			if (field.displayType == 'state') {
				field.dbType = 'String';
				field.choices = newCollection.stateChoices;
			} else {
				var fieldType = fieldTypes[field.displayType];

				if (fieldType) {
					field.dbType = fieldType.dbType;
				}

				// If the field if a reference, store it at the top level
				if (field.dbType == 'SingleItemReference' || field.dbType == 'ListItemReference') {
					referenceFields += field.name + ' ';
				}
			}


			processedFields.push(field);
		}

		// Save the calculated field info.
		newCollection.referenceFields = referenceFields;
		newCollection.listColumnCount = listFieldCount;
		newCollection.fields = processedFields;

		// First, create the counter for this collection
		var newCounter = new Counter();
		newCounter._org = orgID;
		newCounter.collection = newCollection.name
		newCounter.prefix = newCollection.numberPrefix;
		newCounter.save(function(error, savedCounter){
    		if (error || !savedCounter) {
				log.error('|Collection.create.save.counter.save| Unknown -> ' + error, widget);
				utility.errorResponseJSON(res, 'Unknown error creating collection');
    		} else {
	    		// If creation of the counter was successful, save the collection
	    		newCollection._counter = savedCounter._id;
		    	newCollection.save(function(error, savedCollection) {
		    		if (error || !savedCollection) {
						log.error('|Collection.create.save| Unknown -> ' + error, widget);
						utility.errorResponseJSON(res, 'Unknown error creating collection');
		    		}

		    		// Now that the collection and counter have bee created, update the org's primaryCollection if this is their first setup
			    	Org.findById(orgID, function(error, org) {
			    		if (error) {
							log.error('|Collection.create.save.org.find| Unknown -> ' + error, widget);
							utility.errorResponseJSON(res, 'Unknown error creating collection');
						} else {
							if (!org.primaryCollection) {
								org.primaryCollection = savedCollection.name;
								org.save(function(error, org) {
									// Before returning, reload the cache for this org, since a change to collections was made.
						    		qpcache.delete(orgID);
						    		Item.getCollections(orgID, function(error, collectionsObject){
										if (error) {
											log.error('|collection.create| Unknown error -> ' + error, widget);
										} else {
											req.session.userprofile.org.primaryCollection = savedCollection.name;
											res.send(JSON.stringify({ collections: collectionsObject.collections }));
										}
									});
					    		});
							} else {
								// Before returning, reload the cache for this org, since a change to collections was made.
					    		qpcache.delete(orgID);
					    		Item.getCollections(orgID, function(error, collectionsObject){
									if (error) {
										log.error('|collection.create| Unknown error -> ' + error, widget);
									} else {
										res.send(JSON.stringify({ collections: collectionsObject.collections }));
									}
								});
							}
						}
			    	});
	 			});
    		}
		});

	} catch (error) {
		log.error('|collection.create| Unknown -> ' + error, widget);
		utility.errorResponseJSON(res, 'Unknown error creating collection');
	}
};


exports.update = function(req, res) {
	try {
		log.info('|collection.update|', widget);
		var orgID = req.session.userprofile.org._id;


		// TODO: Scrub request body
		var updatedCollection = req.body.collection;

		// Enforce Org Separation
		if (updatedCollection._org != orgID) {
			log.error('|collection.update| UNAUTHORIZED', widget);
    		utility.errorResponseJSON(res, 'UNAUTHORIZED');
		}

    	Collection.update(updatedCollection, function(error, updatedCollection) {
    		if (error) {
    			log.error('|collection.update| Unknown -> ' + error, widget);
    			utility.errorResponseJSON(res, 'Unknown error updating collections');
    		} else {

    			// Before returning, clear the cache for this org, since a change to collections was made.
	    		qpcache.delete(orgID);
	    		Item.getCollections(orgID, function(error, collectionsObject){
					if (error) {
						log.error('|collection.create| Unknown error -> ' + error, widget);
					} else {
						res.send(JSON.stringify({ collections: collectionsObject.collections }));
					}
				});
    		}
    	});

	} catch (error) {
		log.error('|collection.update| Unknown -> ' + error, widget);
		utility.errorResponseJSON(res, 'Unknown error updating collection');
	}
};


exports.getAll = function(req, res) {
	try {
		log.info('|collection.getAll|', widget);

		// TODO: Scrub request body
		var orgID = req.session.userprofile.org._id;
		
		Collection.find({ _org: orgID })
			.exec(
			function (error, collections) {
				if (error) {
					log.error('|collection.getAll| Unknown -> ' + error, widget);
					utility.errorResponseJSON(res, 'Unknown error getting collections');
				} else {
					res.send(JSON.stringify({ collections: collections }));
				}
			});
	} catch (error) {
		log.error('|collection.getAll| Unknown -> ' + error, widget);
		utility.errorResponseJSON(res, 'Unknown error getting collections');
	}
};


exports.getOne = function(req, res) {
	try {
		log.info('|collection.getOne|', widget);

		// TODO: Scrub request body
		var collectionName = req.query.collectionName;

		var orgID = req.session.userprofile.org._id;
		
		Collection.find({ _org: orgID, name: collectionName })
			.exec(
			function (error, collections) {
				if (error) {
					log.error('|collection.getOne| Unknown -> ' + error, widget);
					utility.errorResponseJSON(res, 'Unknown error getting collection');
				} else {
					res.send(JSON.stringify({ collection: collections[0] }));
				}
			});
	} catch (error) {
		log.error('|collection.getOne| Unknown -> ' + error, widget);
		utility.errorResponseJSON(res, 'Unknown error getting collection');
	}
};

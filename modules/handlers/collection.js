// Config
var cfg = require('../config/config');

// Mongoose
var Collection = require('../models/collection');
var Counter = require('../models/counter');
var Item = require('../models/item');

var inflect = require('i')(true);

// Custom modules
var qpcache = require('quikpaper-utils').qpCache;
var utility = require('quikpaper-utils').qpUtility;
var log = require('quikpaper-utils').qpLogger;
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
		newCollection.numberPrefix = req.body.collection.numberPrefix;
		newCollection.icon = req.body.collection.icon;
		newCollection.displayField = req.body.collection.displayField;


		// Then, calculate the collection name and labels, since the
		// user only provides the "Plural" value for the collection.
		newCollection.pluralLabel = req.body.collection.pluralLabel;
		newCollection.singleLabel = inflect.singularize(newCollection.pluralLabel);
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
			if (field.displayType == 'text' || field.displayType == 'textarea' || field.displayType == 'choice' || field.displayType == 'autonumber' || field.displayType == 'state') {
				field.dbType = 'String';
				if (field.displayType == 'state') {
					newCollection.stateChoices = field.choices;
				}
			} else if (field.displayType == 'datetime') {
				field.dbType = 'Date';
			} else if (field.displayType == 'SingleReference') {
				field.dbType = 'SingleReference';
			} else if (field.displayType == 'ReferenceList') {
				field.dbType = 'ReferenceList';
			}

			// If the field if a reference, store it at the top level
			if (field.dbType == 'SingleReference' || field.dbType == 'ReferenceList') {
				referenceFields += field.name + ' ';
			}

			processedFields.push(field);
		}

		// Save the calculated field info.
		newCollection.referenceFields = referenceFields;
		newCollection.listColumnCount = listFieldCount;
		newCollection.fields = processedFields;

    	newCollection.save(function(error, savedCollection) {
    		if (error || !savedCollection) {
				log.error('|Collection.create.save| Unknown -> ' + error, widget);
				utility.errorResponseJSON(res, 'Unknown error creating collection');
    		}

    		// Now create the counter for this collection
    		var newCounter = new Counter();
    		newCounter._org = orgID;
    		newCounter.col = savedCollection.name;
 			newCounter.prefix = savedCollection.numberPrefix;

 			newCounter.save(function(){
	    		if (error) {
					log.error('|Collection.save.counter.save| Unknown -> ' + error, widget);
					utility.errorResponseJSON(res, 'Unknown error creating collection');
	    		}
	    		// Before returning, reload the cache for this org, since a change to collections was made.
	    		qpcache.delete(orgID);
	    		Item.getCollections(orgID, function(error, collectionsObject){
					if (error) {
						log.error('|collection.create| Unknown error -> ' + error, widget);
					} else {
						res.send(JSON.stringify({ collections: collectionsObject.collections }));
					}
				});
 			});
		});

	} catch (error) {
		log.error('|collection.update| Unknown -> ' + error, widget);
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
		if (updatedCollection._org._id != orgID) {
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

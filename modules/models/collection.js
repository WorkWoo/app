// Config
var cfg = require('workwoo-utils').config;

// Logging
var log = require('workwoo-utils').logger;
var widget = 'Collection Model';
log.registerWidget(widget);

var inflect = require('i')(true);

// Mongoose
var Counter = require('workwoo-utils').counter;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
	_org: { type: Schema.Types.ObjectId, ref: 'Org', required: true },
 	name: { type: String, required: true },
 	collectionType: { type: String, required: true },
 	displayField: { type: String, required: true },
	singleLabel: { type: String, required: true },
	pluralLabel: { type: String, required: true },
	numberPrefix: { type: String, required: true },
	icon: { type: String, required: true },
	listColumnCount: { type: Number, required: true },
	referenceFields: { type: String, required: false },
	stateChoices: { type: [String], required: false },
	fields: { type: Array, required: true },
}, cfg.mongoose.options);


collectionSchema.statics.update = function(updatedCollection, callback) {
	try {
    	Collection.findById(updatedCollection._id, function(error, collection) {
    		if (error) {
				log.error('|Collection.update| Unknown -> ' + error, widget);
				return callback(error, null);
			} else {
				log.info('Found collection to update -> ' + collection._id, widget);

				// First, update the simple fields that can be directly saved.
				collection.icon = updatedCollection.icon;
				collection.displayField = updatedCollection.displayField;
				collection.numberPrefix = updatedCollection.numberPrefix;

				// First, calculate the collection name and labels, since the
				// user only provides the "Plural" value for the collection.
				collection.pluralLabel = updatedCollection.pluralLabel;
				collection.singleLabel = inflect.singularize(collection.pluralLabel);
			 	collection.name = collection.pluralLabel.toLowerCase().replace(/ /g,''); // Lowercase and remove spaces
				
				// Now iterate through each field to do several thing:
				// 1. Lowercase and remove space from the provided field names
				// 2. Count the number of fields for list views.
				// 3. Record the reference fields.
				// 4. The DB Type, based on the display type.
				var updatedFields = [];
				var referenceFields = '';
				var listFieldCount = 0;
				for (var i=0; i<updatedCollection.fields.length; i++) {
					var field = updatedCollection.fields[i];
					
					if(field.showOnList) {
						listFieldCount++;
					}

					// Translate the display types into db types
					if (field.displayType == 'text' || field.displayType == 'textarea' || field.displayType == 'choice' || field.displayType == 'autonumber' || field.displayType == 'state') {
						field.dbType = 'String';
						if (field.displayType == 'state') {
							field.choices = collection.stateChoices;
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

					updatedFields.push(field);
				}

				// Save the calculated field info.
				collection.referenceFields = referenceFields;
				collection.listColumnCount = listFieldCount;
				collection.fields = updatedFields;
				
		    	collection.save(function(error, savedCollection) {
		    		if (error) {
						log.error('|Collection.update.save| Unknown -> ' + error, widget);
						return callback(error, null);
		    		}

		    		log.info('ORG: ' + savedCollection._org);
		    		log.info('COLLECTION: ' + savedCollection.name);

		    		// Before returning, update the counter for this collection
		    		Counter.findOne({ _org: savedCollection._org, col: savedCollection.name })
		    			.exec(
		    			function(error, counter) {
			    			if (error) {
			    				log.error('|Collection.update.save.counter.find| Unknown -> ' + error, widget);
								return callback(error, null);
			    			}

		    				log.info('Counter: ' + counter);

		    				counter.prefix = savedCollection.numberPrefix;
		    				counter.save(function(error, savedCounter){
			    				if (error) {
			    					log.error('|Collection.update.save.counter.save| Unknown -> ' + error, widget);
									return callback(error, null);
			    				}

		    					log.info('Collection updated successfully -> ' + savedCollection._id);
								return callback(null, savedCollection);
		    				});
		    			}
		    		);
		    	});	
			}
    	});
	} catch(error) {
		log.error('|Collection.update| Unknown -> ' + error, widget);
		return callback(error, false);
	}
};


var Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;
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

// Custom modules
var fieldTypes = require('../types/fieldType').getFieldTypesObject();

var collectionSchema = new Schema({
	_org: { type: Schema.Types.ObjectId, ref: 'Org', required: true },
	_counter: { type: Schema.Types.ObjectId, ref: 'Counter', required: true },
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
				collection.numberPrefix = updatedCollection.numberPrefix.toUpperCase();

				// First, calculate the collection name and labels, since the
				// user only provides the "Plural" value for the collection.
				collection.pluralLabel = inflect.pluralize(updatedCollection.pluralLabel);
				collection.pluralLabel = inflect.titleize(collection.pluralLabel);

				collection.singleLabel = inflect.singularize(collection.pluralLabel);
				collection.singleLabel = inflect.titleize(collection.singleLabel);

			 	collection.name = collection.pluralLabel.toLowerCase().replace(/ /g,''); // Lowercase and remove spaces
				collection.stateChoices = updatedCollection.stateChoices;

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
					if (field.displayType == 'state') {
						field.dbType = 'String';
						field.choices = updatedCollection.stateChoices;
					} else {
						var fieldType = fieldTypes[field.displayType];

						if (fieldType) {
							field.dbType = fieldType.dbType;
						}

						// If the field if a reference, store it at the top level
						if (field.dbType == 'itemReference' || field.dbType == 'itemReferenceList') {
							referenceFields += field.name + ' ';
						}
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

		    		// Before returning, update the counter for this collection
		    		Counter.findOne({ _id: savedCollection._counter, _org: savedCollection._org })
		    			.exec(
		    			function(error, counter) {
			    			if (error) {
			    				log.error('|Collection.update.save.counter.find| Unknown -> ' + error, widget);
								return callback(error, null);
			    			}

		    				counter.prefix = savedCollection.numberPrefix;
		    				counter.collectionName = savedCollection.name;
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
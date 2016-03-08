var cfg = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orgSchema = new Schema({
	name: { type: String, required: true, unique: true },
 	city: { type: String },
 	state: { type: String },
 	country: { type: String },
 	emailAddress: {type: String },
	_created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    _updated_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, cfg.mongoose.options);

var Org = mongoose.model('Org', orgSchema);

module.exports = Org;
var cfg = require('../config/config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Counter = require('../models/counter');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	emailAddress: { type: String, required: true, unique: true },
	password: { type: String, required: true },
 	firstName: { type: String, required: true },
 	lastName: { type: String, required: true },
	_org: { type: Schema.Types.ObjectId, ref: 'Org' },
	phone: String,
	role: String,
	number: String,
	state: String,
	resetPwdToken: String,
    resetPwd: Boolean,
    resetPwdExpiration: Date,
	_created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    _updated_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, cfg.mongoose.options);


// Encrypt password when creating a new user
userSchema.pre('save', function(next) {
	var user = this;
	if (this.isNew) {
    	bcrypt.genSalt(10, function(err, salt) {
	    	bcrypt.hash(user.password, salt, function(err, hash) {
	    		user.password = hash;
	    		user.resetPwdToken = '';
				user.resetPwd = false;
				user.resetPwdExpiration = '';
				next();		
	    	});
		});
	} else {
		next();	
	}

});		

// Set counter when creating a new user
userSchema.pre('save', function(next) {
	var user = this;
	if (this.isNew) {
		Counter.increment('users', this._org, function(error, autonumber) {
			user.number = autonumber;
			next();
		});
	} else {
		next();
	}
});	

// Remove user data not needed by app
userSchema.post('save', function(user, next) {
	user.password = '';
	user.resetPwdToken = '';
    next();
});

// Populate org reference
userSchema.post('save', function(user, next) {
	user.populate('_org', function(error, user) {
		if (error) { next(error); }
		next();
	});
});

var User = mongoose.model('User', userSchema);

module.exports = User;

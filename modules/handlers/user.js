// Config
var cfg = require('workwoo-utils').config;

// Mongoose
var User = require('workwoo-utils').user;
var Org = require('workwoo-utils').org;

// Custom modules
var mailer = require('workwoo-utils').mailer;
var utility = require('workwoo-utils').utility;
var log = require('workwoo-utils').logger;
var widget = 'user-management';
log.registerWidget(widget);

exports.setIsNewUser = function(req, res) {
	try {
		log.info('|user.setIsNewUser|', widget);

		var userId = req.session.userprofile.id;

		User.findById(userId, function(error, user) {
    		if (error) {
				log.error('|user.setIsNewUser.findById| Unknown  -> ' + error, widget);
				utility.errorResponseJSON(res, 'Error occurred setting is new user');
			} else {			
				user.newUser = req.body.setIsNewUser;

		    	user.save(function(error, user) {
		    		req.session.userprofile.newUser = user.newUser;
					res.send(JSON.stringify({result: true}));
		    	});
			}
    	});

	} catch (error) {
		log.error('|user.create| Unknown -> ' + error, widget);
		utility.errorResponseJSON(res, 'Error occurred setting is new user');
	}
};

exports.create = function(req, res) {
	try {
		log.info('|user.create|', widget);

		// TODO: Scrub request body

		var newUser = new User();

		newUser.firstName = req.body.user.firstName;
 		newUser.lastName = req.body.user.lastName;
		newUser.emailAddress = req.body.user.emailAddress;
		newUser.phone = req.body.user.phone;
		newUser.role = req.body.user.role;
		newUser.state = 'active';

		newUser.password = req.body.user.password;
		newUser._org = req.session.userprofile.org._id;
		newUser._created_by = req.session.userprofile.id;
    	newUser._updated_by = req.session.userprofile.id;
						
    	newUser.save(function(error, user) {
    		if (error) {
				log.error('|user.create.save| Unknown  -> ' + error, widget);
				utility.errorResponseJSON(res, 'Error occurred creating user');
			} else {
				log.info('|user.create| New user created -> ' + user._id, widget);				
				res.send(JSON.stringify({ user: user }));
			}
    	});

	} catch (error) {
		log.error('|user.create| Unknown -> ' + error, widget);
		utility.errorResponseJSON(res, 'Error occurred creating user');
	}
};


exports.update = function(req, res) {
	try {
		log.info('|user.update|', widget);

		// TODO: Scrub request body
		var userId = req.body.user._id;

		if (!userId) {
			log.error('|user.update| No user ID given' + error, widget);
			utility.errorResponseJSON(res, 'No user ID given');
		}
						
    	User.findById(userId, function(error, user) {
    		if (error) {
				log.error('|user.update.findById| Unknown  -> ' + error, widget);
				utility.errorResponseJSON(res, 'Error occurred updating user');
			} else {			
				user.firstName = req.body.user.firstName;
		 		user.lastName = req.body.user.lastName;
				user.emailAddress = req.body.user.emailAddress;
				user.phone = req.body.user.phone;
				user.role = req.body.user.role;
				user.state = req.body.user.state;
		    	user._updated_by = req.session.userprofile.id;

		    	user.save(function(error, user) {
					res.send(JSON.stringify(user));
		    	});
			}
    	});

	} catch (error) {
		log.error('|user.update| Unknown -> ' + error, widget);
		utility.errorResponseJSON(res, 'Error occurred updating user');
	}
};


exports.deleteMultiple = function(req, res) {
	try {
		log.info('|user.deleteMultiple|', widget);

		// TODO: Scrub request body
		var userIDs = req.body.users;

		log.info('|user.deleteMultiple| Deleting users: ' + userIDs, widget);

		var query = { _id: { $in: userIDs } };			
    	User.remove(query, function(error) {
    		if (error) {
				log.error('|user.deleteMultiple.remove| Unknown  -> ' + error, widget);
				utility.errorResponseJSON(res, 'Error occurred deleting users');
			} else {			
				res.send(JSON.stringify({result: true}));
			}
    	});

	} catch (error) {
		log.error('|user.deleteMultiple| -> ' + error, widget);
		utility.errorResponseJSON(res, 'Error occurred deleting users');
	}
};


exports.getUser = function(req, res) {
	try {
		log.info('|user.getUser|', widget);

		// TODO: Scrub request body
		var userNumber = req.query.userNumber;
		log.info('|user.getUser| Getting user -> ' + userNumber, widget);

		if (!userNumber) {
			log.error('|user.getUser| No user number given' + error, widget);
			utility.errorResponseJSON(res, 'No user number given');
		}

		var query = {
			_org: req.session.userprofile.org._id,
			number: userNumber
		};

		// Need to exclude??
		//resetPwdToken
		//resetPwd
		//resetPwdExpiration,

		User.findOne(query, '-password')
			.populate('_org _created_by _updated_by')
			.exec(
			function (error, user) {
				if (error) {
					log.error('|user.getUser.findOne| Unknown  -> ' + error, widget);
					utility.errorResponseJSON(res, 'Error occurred getting user');
				} else {		
					log.info('|user.getUser| User found -> ' + user);	
					res.send(JSON.stringify({ user: user }));
				}
			});
	} catch (error) {
		log.error('|user.getUser| Unknown -> ' + error, widget);
		utility.errorResponseJSON(res, 'Error occurred getting users');
	}
};


exports.getAll = function(req, res) {
	try {
		log.info('|user.getAll|', widget);

		// TODO: Scrub request body
		var orgID = req.session.userprofile.org._id;

		User.find({_org: orgID}, '-password')
			.populate('_org _created_by _updated_by')
			.exec(
			function (error, users) {
				if (error) {
					log.error('|user.getAll.find| Unknown -> ' + error, widget);
					utility.errorResponseJSON(res, 'Error occurred getting users');
				} else {			
					res.send(JSON.stringify({ users: users }));
				}
			});
	} catch (error) {
		log.error('|user.getAll| Unknown -> ' + error, widget);
		utility.errorResponseJSON(res, 'Error occurred getting users');
	}
};


exports.getUserProfile = function(req, res) {
	try {
		log.info('|user.getUserProfile|');
		res.send(JSON.stringify(req.session.userprofile));
	} catch (error) {
		log.error('|user.getUserProfile| Unknown -> ' + error, widget);
	}
};


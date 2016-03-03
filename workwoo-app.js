// Config
var cfg = require('./modules/config/config');

// Web - Session
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');

// Authentication Strategy
var passport = require('passport');

// Mongoose
var mongoose = require('mongoose');

// Custom modules
var item = require('./modules/handlers/item.js');
var collection = require('./modules/handlers/collection.js');
var user = require('./modules/handlers/user.js');


var utility = require('quikpaper-utils').qpUtility;
var log = require('quikpaper-utils').qpLogger;
var widget = 'quikpaper-app';
log.registerWidget(widget);


// For now, this function simply checks the user's authentication status.
// In the future, this function can also do additional validation checks.
function validateRequest() {
	return function(req, res, next) {
		log.info('|validateRequest|');
		if (!req.isAuthenticated || !req.isAuthenticated()) {
			log.info('|validateRequest| -> User not authenticated. Sending 401', widget);

			res.status(401);
			var errorMessage = {error: 'Not authenticated'};
			return res.send(JSON.stringify(errorMessage));
		}
		log.info('|validateRequest| -> User authenticated', widget);
		next();
	}
}


/*
* This function initializes the express app along with mongoose and passport.
* We do not start the app until we've successfully setup mongoDB w/ mongoose.
*/
(function startup() {
	try {
		log.info('| ################## App Startup ################## |', widget);

		// 1. Initialize mongoose
		initializeMongoose();

		// 2. Initialize express
		var app = initializeApp();

		// 3. Start app
		app.listen(process.env.PORT || cfg.port);

	} catch (error) {
		log.error('| ################## App Startup Error ################## | -> ' + error, widget);
	}
})();


function initializeMongoose() {
	try {
		log.info('|initializeMongoose|', widget);

		// TODO: Setup more options
		var options = {
			server: { poolSize: cfg.mongo.poolSize, socketOptions: cfg.mongo.keepAlive }
		}

		mongoose.connect(cfg.mongo.uri, options);

		var db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function() {
		  log.info('|initializeMongoose| -> Successful connection made to mongoDB', widget);
		});

	} catch (error) {
		log.error('|initializeMongoose| Unknown -> ' + error, widget);
		process.exit(0);
	}
}

function initializeApp() {
	try {
		log.info('|initializeApp|', widget);

		var app = express();
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());
		app.use(express.static('public'));

		// Session setup
		app.use(session({
			name: cfg.session.name,
			secret: cfg.session.secret,
			cookie: cfg.session.cookie,
			//domain: cfg.session.domain,    //################ ASK RYAN
			resave: false,
			saveUninitialized: false,
			store: new MongoStore({ 
				mongooseConnection: mongoose.connection, // Reuse our mongoose connection pool
				ttl: cfg.session.store.ttl,
				autoRemove: cfg.session.store.autoRemove,
				touchAfter: cfg.session.store.touchAfter
			}),
		}));

		// Passport setup
		app.use(passport.initialize());
		app.use(passport.session());
		passport.serializeUser(function(user, done) {
			done(null, user.id);
		});
		passport.deserializeUser(function(id, done) {
			done(null, id);
		});
		
		// Global-use routes
		app.route('/getUserProfile').get(validateRequest(), user.getUserProfile);

		// Item CRUD routes
		app.route('/getCollections').get(validateRequest(), item.getCollections);
		app.route('/getItems').get(validateRequest(), item.getItems);
		app.route('/getOneItem').get(validateRequest(), item.getOneItem);
		app.route('/updateItem').post(validateRequest(), item.update);
		app.route('/createNewItem').post(validateRequest(), item.create);
		app.route('/deleteItems').post(validateRequest(), item.deleteItems);
		app.route('/searchItems').get(validateRequest(), item.search);

		// Collection CRUD routes
		app.route('/getAllCollections').get(validateRequest(), collection.getAll);
		app.route('/updateCollection').post(validateRequest(), collection.update);
		app.route('/createCollection').post(validateRequest(), collection.create);

		// Routes for user CRUD operations
		app.route('/createUser').post(validateRequest(), user.create);
		app.route('/updateUser').post(validateRequest(), user.update);
		app.route('/deleteUsers').post(validateRequest(), user.deleteMultiple);
		app.route('/getUser').get(validateRequest(), user.getUser);
		app.route('/getAllUsers').get(validateRequest(), user.getAll);

		app.get('/logout', function(req, res){
			log.info('|logout|', widget);
			req.session.destroy();
			req.logout();
			res.redirect(cfg.auth.url);
		});

		return app;
	} catch (error) {
		log.error('|initializeApp| Unknown -> ' + error, widget);
		process.exit(0);
	}
}


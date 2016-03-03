var config = require('./config.global');

config.env = 'development';
config.hostname = 'localhost:1337';

//authentication app
config.auth = {};
config.auth.url = 'http://localhost:1337';

//session
config.session.cookie.domain = '';

module.exports = config;
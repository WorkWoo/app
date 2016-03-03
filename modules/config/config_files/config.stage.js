var config = require('./config.global');

config.env = 'stage';
config.hostname = 'appstage.workwoo.com';

//Authentication app
config.auth = {};
config.auth.url = 'http://authstage.workwoo.com';

module.exports = config;
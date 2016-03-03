var config = {};
log.info('Current URL: ' + window.location.href);


// URLs:
var baseAuthURL = 'http://auth.workwoo.com';
var currentUsersURL = window.location.href;
if (currentUsersURL.indexOf('localhost:1337') >= 0) {
	baseAuthURL = 'http://localhost:1338';
} else if (currentUsersURL.indexOf('https://appstage.workwoo.com') >= 0) {
	baseAuthURL = 'https://authstage.workwoo.com';
} else if (currentUsersURL.indexOf('http://appstage.workwoo.com') >= 0) {
	baseAuthURL = 'http://authstage.workwoo.com';
} else if (currentUsersURL.indexOf('https://app.workwoo.com') >= 0) {
	baseAuthURL = 'https://auth.workwoo.com';
} else if (currentUsersURL.indexOf('http://app.workwoo.com') >= 0) {
	baseAuthURL = 'http://auth.workwoo.com';
} else if (currentUsersURL.indexOf('https://workwoo-appstage.herokuapp.com') >= 0) {
	baseAuthURL = 'https://workwoo-authstage.herokuapp.com';
} else if (currentUsersURL.indexOf('http://workwoo-appstage.herokuapp.com') >= 0) {
	baseAuthURL = 'http://workwoo-authstage.herokuapp.com';
} else if (currentUsersURL.indexOf('https://workwoo-app.herokuapp.com') >= 0) {
	baseAuthURL = 'https://workwoo-auth.herokuapp.com';
} else if (currentUsersURL.indexOf('http://workwoo-app.herokuapp.com') >= 0) {
	baseAuthURL = 'http://workwoo-auth.herokuapp.com';
}

config.url = {};
config.url.auth = baseAuthURL;

// Collection icons:
config.collection = {};
config.collection.icons = [
	'glyphicon-cloud',
	'glyphicon-envelope',
	'glyphicon-pencil',
	'glyphicon-glass',
	'glyphicon-music',
	'glyphicon-user',
	'glyphicon-film',
	'glyphicon-cog',
	'glyphicon-list-alt',
	'glyphicon-flag',
	'glyphicon-headphones',
	'glyphicon-tag',
	'glyphicon-camera',
	'glyphicon-map-marker',
	'glyphicon-leaf',
	'glyphicon-fire',
	'glyphicon-eye-open',
	'glyphicon-plane',
	'glyphicon-comment',
	'glyphicon-magnet',
	'glyphicon-shopping-cart',
	'glyphicon-bell',
	'glyphicon-wrench',
	'glyphicon-tasks',
	'glyphicon-paperclip',
	'glyphicon-heart-empty',
	'glyphicon-phone',
	'glyphicon-pushpin',
	'glyphicon-usd',
	'glyphicon-flash',
	'glyphicon-floppy-disk',
	'glyphicon-earphone',
	'glyphicon-phone-alt',
	'glyphicon-tree-conifer',
	'glyphicon-tree-deciduous',
	'glyphicon-equalizer',
	'glyphicon-apple',
	'glyphicon-hourglass',
	'glyphicon-piggy-bank',
	'glyphicon-scissors',
	'glyphicon-education',
	'glyphicon-grain',
	'glyphicon-sunglasses',
	'glyphicon-send'
	];

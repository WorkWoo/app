var config = {};

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
'fa-archive',
'fa-anchor',
'fa-balance-scale',
'fa-bank',
'fa-barcode',
'fa-battery-3',
'fa-bed',
'fa-beer',
'fa-bell',
'fa-bicycle',
'fa-binoculars',
'fa-birthday-cake',
'fa-bomb',
'fa-book',
'fa-briefcase',
'fa-bus',
'fa-calendar',
'fa-camera',
'fa-car',
'fa-child',
'fa-clock-o',
'fa-cloud',
'fa-code',
'fa-comment',
'fa-compass',
'fa-credit-card',
'fa-cube',
'fa-cutlery',
'fa-desktop',
'fa-diamond',
'fa-envelope-o',
'fa-eye',
'fa-female',
'fa-fighter-jet',
'fa-film',
'fa-flag',
'fa-flask',
'fa-gamepad',
'fa-gavel',
'fa-gift',
'fa-glass',
'fa-globe',
'fa-graduation-cap',
'fa-headphones',
'fa-heart',
'fa-hourglass',
'fa-image',
'fa-key',
'fa-leaf',
'fa-map',
'fa-microphone',
'fa-mobile',
'fa-money',
'fa-moon-o',
'fa-motorcycle',
'fa-music',
'fa-paper-plane',
'fa-paw',
'fa-pencil',
'fa-plane',
'fa-print',
'fa-rocket',
'fa-shopping-bag',
'fa-shopping-cart',
'fa-space-shuttle',
'fa-ticket',
'fa-trash-o',
'fa-truck',
'fa-tree',
'fa-umbrella',
'fa-wheelchair',
'fa-wrench'];

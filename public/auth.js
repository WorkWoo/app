var auth = angular.module('auth', ['ngRoute', 'ngAnimate']);

// Controllers
auth.controller('mainController', mainController);
auth.controller('loginController', loginController);
auth.controller('forgotController', forgotController);
auth.controller('resetController', resetController);
auth.controller('signupController', signupController);
auth.controller('verifyController', verifyController);

// Factories
auth.factory('Request', Request);

// Constants
//auth.constant('BASE_URL', 'http://localhost:1338');
auth.constant('BASE_AUTH_URL', config.url.auth);

auth.config(function($routeProvider) {
  $routeProvider.when('/', { templateUrl : '/views/login.html', controller  : 'loginController'});
  $routeProvider.when('/login', { templateUrl : '/views/login.html', controller  : 'loginController'});  
  $routeProvider.when('/forgot', { templateUrl : '/views/forgotpwd.html', controller  : 'forgotController'}); 
  $routeProvider.when('/reset', { templateUrl : '/views/resetpwd.html', controller  : 'resetController'});
  $routeProvider.when('/signup', { templateUrl : '/views/signup.html', controller  : 'signupController'}); 
  $routeProvider.when('/verify', { templateUrl : '/views/verify.html', controller  : 'verifyController'});
});

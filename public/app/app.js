var COLLECTIONS = null;
var AUTHENTICATED = false;
var USER_PROFILE = null;
var mainApp = angular.module('mainApp', ['ngRoute', 'ngAnimate']);

// Constants
mainApp.constant('COLLECTION_ICONS', config.collection.icons);

// Controllers
mainApp.controller('mainController', mainController);
mainApp.controller('supportController', supportController);
mainApp.controller('userController', userController);
mainApp.controller('itemController', itemController);
mainApp.controller('accountController', accountController);
mainApp.controller('collectionController', collectionController);
mainApp.controller('userController', userController);

// Factories
mainApp.factory('Item', Item);
mainApp.factory('Collection', Collection);
mainApp.factory('SelectedCollection', SelectedCollection);
mainApp.factory('LoadedCollection', LoadedCollection);
mainApp.factory('TotalItems', TotalItems);
mainApp.factory('SelectedItem', SelectedItem);
mainApp.factory('User', User);
mainApp.factory('SelectedUser', SelectedUser);

// Directives
mainApp.directive('dateTimePicker', dateTimePicker);

mainApp.config(function($routeProvider) {

  // First, define the base routes
  $routeProvider.when('/', { templateUrl: 'views/itemhome.html', controller: 'itemController'});

  // Then, define the permanant, hard-coded routes.
  $routeProvider.when('/support', { templateUrl: 'views/support.html', controller: 'supportController'});
  $routeProvider.when('/support/submitted', { templateUrl: 'views/supportsubmitted.html', controller: 'supportController'});
  $routeProvider.when('/account', { templateUrl: 'views/account.html', controller: 'accountController'});
  $routeProvider.when('/account/summary', { templateUrl: 'views/accountsummary.html', controller: 'accountController'});
  $routeProvider.when('/account/upgrade', { templateUrl: 'views/upgrade.html', controller: 'upgradeController'});

  $routeProvider.when('/account/collections', { templateUrl: 'views/collections.html', controller: 'collectionController'});
  $routeProvider.when('/account/collections/new', { templateUrl: 'views/collections.html', controller: 'collectionController'});
  $routeProvider.when('/account/collections/view', { templateUrl: 'views/collection.html', controller: 'collectionController'});
  $routeProvider.when('/account/collections/view/:collectionName', { templateUrl: 'views/collection.html', controller: 'collectionController'});

  $routeProvider.when('/account/users', { templateUrl: 'views/users.html', controller: 'userController'});
  $routeProvider.when('/account/users/new', { templateUrl: 'views/user.html', controller: 'userController'});
  $routeProvider.when('/account/users/view', { templateUrl: 'views/users.html', controller: 'userController'});
  $routeProvider.when('/account/users/view/:user', { templateUrl: 'views/user.html', controller: 'userController'});

  $routeProvider.when('/mysettings', { templateUrl: 'views/mysettings.html', controller: 'supportController'});

  // Finally, add the routes for each custom collection dynamically
  for (var collection in COLLECTIONS) {
    $routeProvider.when('/' + collection, { templateUrl: 'views/itemboard.html', controller: 'itemController'});  // List view
    $routeProvider.when('/' + collection + '/search', { templateUrl: 'views/itemboard.html', controller: 'itemController'}); // Search view
    $routeProvider.when('/' + collection + '/new', { templateUrl: 'views/singleitem.html', controller: 'itemController'}); // New view
    $routeProvider.when('/' + collection + '/view', { templateUrl: 'views/itemboard.html', controller: 'itemController'}); // Single view
    $routeProvider.when('/' + collection + '/view/:item', { templateUrl: 'views/singleitem.html', controller: 'itemController'}); // Single view
  }
   
});
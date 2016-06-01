function mainController($scope, $location, $route, $sce, User, $filter) {
  log.info('App initialized');

  $scope.pageLoading = true;
  $scope.trustAsHtml = $sce.trustAsHtml;

  $scope.successAlertVisible = false;
  $scope.successAlertText = null;
  $scope.dangerAlertVisible = false;
  $scope.dangerAlertText = null;
  $scope.infoAlertVisible = false;
  $scope.infoAlertText = null;

  $scope.authenticated = AUTHENTICATED;
  $scope.currentUser = USER_PROFILE;
  $scope.collections = COLLECTIONS;
  $scope.fieldTypes = FIELDTYPES;
  $scope.collectionTypes = COLLECTIONTYPES;

  $scope.workableCollections = [];
  $scope.revisionableCollections = [];
  $scope.inventorialCollections = [];
  $scope.inventorialBundleCollections = [];
  $scope.basicCollections = [];
  $scope.inventoryCollections = [];

  $scope.accountType = $scope.currentUser.org.accountType;
  $scope.primaryCollection = $scope.currentUser.org.primaryCollection;

  $scope.startMainTour = false;
  $scope.mainTourConfig = tourConfig.getMainTourConfig($scope);
  

  /****************************** VIEW & ROUTE RELATED *******************************/


  $scope.setPageLoading = function(state) {
    $scope.pageLoading = state;
  }

  $scope.reloadRoute = function() {
     $route.reload();
  }

  $scope.changeView = function(viewName) {
    $location.path(viewName);
  };

  $scope.setActiveSection = function(sectionID) {
    // First, deactivate any other active sections
    $('#workMenuItem').removeClass('leftMenuIconActiveTop');
    $('#inventoryMenuItem').removeClass('leftMenuIconActive');
    $('#otherMenuItem').removeClass('leftMenuIconActive');
    $('#settingsMenuItem').removeClass('leftMenuIconActive');
    $('#supportMenuItem').removeClass('leftMenuIconActive');

    // Set everything to default
    $('#workMenuItem').addClass('leftMenuIcon');
    $('#inventoryMenuItem').addClass('leftMenuIcon');
    $('#otherMenuItem').addClass('leftMenuIcon');
    $('#settingsMenuItem').addClass('leftMenuIcon');
    $('#supportMenuItem').addClass('leftMenuIcon');

    // Then, set the given section as active
    $('#' + sectionID + 'MenuItem').removeClass('leftMenuIcon');
    if (sectionID == 'work') {
      $('#' + sectionID + 'MenuItem').addClass('leftMenuIconActiveTop');
      sectionID = '';
    } else {
      $('#' + sectionID + 'MenuItem').addClass('leftMenuIconActive');
    }
  };


  $scope.url = function(url) {
    window.location.replace(url);
  };


  /****************************** LEFT MENU RELATED *******************************/


  $scope.leftMenuClick = function(sectionID) {
    $scope.setActiveSection(sectionID);
    if (sectionID == 'workable') {
      $scope.changeView('');
    } else {
      $scope.changeView(sectionID);
    }
  };

    $scope.getLeftMenuIconOffset = function(sectionName) {
    if(sectionName == 'basic') {
      if($scope.inventoryCollections.length > 0) {
        return { 'top' : '175px' };
      } else {
        return { 'top' : '175px' };
      }
    }
  };


  $scope.getLeftMenuContainerOffset = function() {
    var offset = 100;
    if($scope.inventoryCollections.length > 0) {
      offset += 75;
    }
    if($scope.basicCollections.length > 0) {
      offset += 75;
    }
    return { 'top' : offset + 'px' };
  };


  /****************************** MODAL DIALOG RELATED *******************************/


  $scope.toggleModal = function(modalID, action) {
    $('#' + modalID).modal(action);
  };


  /****************************** ALERTS *******************************/


  $scope.clearAlerts = function() {
    $scope.successAlertVisible = false;
    $scope.successAlertText = '';
    $scope.dangerAlertVisible = false;
    $scope.dangerAlertText = '';
    $scope.infoAlertVisible = false;
    $scope.infoAlertText = '';
  };

  $scope.toggleAlert = function(type, visibility, html) {
    // First, clear any other alerts, since only one can be visibile at a time
    $scope.clearAlerts();
    $scope[type + 'AlertVisible'] = visibility;
    $scope[type + 'AlertText'] = html;
  };


  $scope.alertUnknownError = function() {
    $scope.toggleAlert('danger', true, 'An error has occured. <a href="/app/#/help"><strong>Contact support</strong></a>');
  };


  /****************************** VALIDATION & FORMATTING *******************************/

  $scope.formatCurrency = function(value) {
    value = value ? parseFloat(value.toString().replace(/[^0-9._-]/g, '')) || 0 : 0;
    var formattedValue = $filter('currency')(value);
    return formattedValue;
  }

  $scope.formattedDateTime = function(dateTime) {
    return moment(dateTime).format('MM/DD/YYYY hh:mm A').slice(0, 5);
  } ;

  $scope.initInvalidPopover = function(elementID, popoverText) {
    $('#' + elementID).popover({content: popoverText, placement: 'auto right', trigger: 'hover', viewport: { selector: 'body', padding: 0}, html : true, container: 'body'});
  };


  /****************************** TOUR CONTROLS *******************************/


  $scope.tiggerMainTour = function() {
    $scope.startMainTour = true;
  }

  $scope.finishMainTour = function() {
    $scope.startMainTour = false;
  }

  $scope.skipMainTour = function() {
    $scope.startMainTour = false;
  }

  $scope.setIsNewUser = function() {
    User.setIsNewUser(false,
      function(response){
      },
      function(response) {
      }
    );
  };


  /****************************** ROLES & ACCESS *******************************/

  $scope.setCurrentUser = function(userObject) {
    $scope.currentUser = userObject;
  };


  $scope.canEditCollections = function() {
    return ($scope.currentUser.role == 'Owner' || $scope.currentUser.role == 'Admin' || $scope.currentUser.role == 'Superuser');
  };

  $scope.canEditAccount = function() {
    return ($scope.currentUser.role == 'Owner' || $scope.currentUser.role == 'Admin' || $scope.currentUser.role == 'Superuser');
  };

  $scope.canEditSys = function() {
    return ($scope.currentUser.role == 'Superuser');
  };


  /****************************** INITIALIZATION *******************************/

  
  // Transforms the fields array into an object for easier access
  $scope.initializeFieldsObject = function(collectionObject) {
    var fieldsObject = {};
    for(var i=0; i<collectionObject.fields.length; i++) {
      fieldsObject[collectionObject.fields[i].name] = collectionObject.fields[i];
    }
    collectionObject.fieldsObject = fieldsObject;
  }

  $scope.initializeCollections = function() {
    for(var collection in $scope.collections) {
      var collectionType = $scope.collections[collection].collectionType;
      if(collectionType == 'workable') {
        $scope.workableCollections.push($scope.collections[collection]);
      } else if(collectionType == 'inventorial') {
        $scope.inventorialCollections.push($scope.collections[collection]);
        $scope.inventoryCollections.push($scope.collections[collection]);
      } else if(collectionType == 'inventorial_bundle') {
        $scope.inventorialBundleCollections.push($scope.collections[collection]);
        $scope.inventoryCollections.push($scope.collections[collection]);
      } else if(collectionType == 'inventory_activity') {
        $scope.inventorialBundleCollections.push($scope.collections[collection]);
        $scope.inventoryCollections.push($scope.collections[collection]);
      } else if(collectionType == 'basic') {
        $scope.basicCollections.push($scope.collections[collection]);
      }
      $scope.initializeFieldsObject($scope.collections[collection]);
    }
  };

  $scope.initializeMainController = function() {
    if ($scope.currentUser.newUser) {
      $scope.startMainTour = true;
      $scope.setIsNewUser();
    }
    $scope.initializeCollections();
  };

  $scope.initializeMainController();

}
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

  $scope.accountType = $scope.currentUser.org.accountType;
  $scope.primaryCollection = $scope.currentUser.org.primaryCollection;

  $scope.startMainTour = false;
  $scope.mainTourConfig = tourConfig.getMainTourConfig($scope);
  
  $scope.reloadRoute = function() {
     $route.reload();
  }

  $scope.changeView = function(viewName) {
    $location.path(viewName);
  };

  $scope.setActiveSection = function(sectionID) {
    // First, deactivate any other active sections
    $('#workableMenuItemD').removeClass('leftMenuIconActiveTop');
    $('#workableMenuItemM').removeClass('leftMenuIconActiveTop');
    $('#inventorialMenuItemD').removeClass('leftMenuIconActive');
    $('#inventorialMenuItemM').removeClass('leftMenuIconActive');
    //$('#revisionableMenuItemD').removeClass('leftMenuIconActive');
   // $('#revisionableMenuItemM').removeClass('leftMenuIconActive');
    $('#inventorialBundleMenuItemD').removeClass('leftMenuIconActive');
    $('#inventorialBundleMenuItemM').removeClass('leftMenuIconActive');
    $('#basicMenuItemD').removeClass('leftMenuIconActive');
    $('#basicMenuItemM').removeClass('leftMenuIconActive');
    $('#settingsMenuItemD').removeClass('leftMenuIconActive');
    $('#settingsMenuItemM').removeClass('leftMenuIconActive');
    $('#supportMenuItemD').removeClass('leftMenuIconActive');
    $('#supportMenuItemM').removeClass('leftMenuIconActive');

    // Set everything to default
    $('#workableMenuItemD').addClass('leftMenuIcon');
    $('#workableMenuItemM').addClass('leftMenuIcon');
    $('#inventorialMenuItemD').addClass('leftMenuIcon');
    $('#inventorialMenuItemM').addClass('leftMenuIcon');
    //$('#revisionableMenuItemD').addClass('leftMenuIcon');
    //$('#revisionableMenuItemM').addClass('leftMenuIcon');
    $('#inventorialBundleMenuItemD').addClass('leftMenuIcon');
    $('#inventorialBundleMenuItemM').addClass('leftMenuIcon');
    $('#basicMenuItemD').addClass('leftMenuIcon');
    $('#basicMenuItemM').addClass('leftMenuIcon');
    $('#settingsMenuItemD').addClass('leftMenuIcon');
    $('#settingsMenuItemM').addClass('leftMenuIcon');
    $('#supportMenuItemD').addClass('leftMenuIcon');
    $('#supportMenuItemM').addClass('leftMenuIcon');

    // Then, set the given section as active
    $('#' + sectionID + 'MenuItemD').removeClass('leftMenuIcon');
    $('#' + sectionID + 'MenuItemM').removeClass('leftMenuIcon');
    if (sectionID == 'workable') {
      $('#' + sectionID + 'MenuItemD').addClass('leftMenuIconActiveTop');
      $('#' + sectionID + 'MenuItemM').addClass('leftMenuIconActiveTop');
      sectionID = '';
    } else {
      $('#' + sectionID + 'MenuItemD').addClass('leftMenuIconActive');
      $('#' + sectionID + 'MenuItemM').addClass('leftMenuIconActive');
    }
  };

  $scope.leftMenuClick = function(sectionID) {
    $scope.setActiveSection(sectionID);
    if (sectionID == 'workable') {
      $scope.changeView('');
    } else {
      $scope.changeView(sectionID);
    }
  };

  $scope.url = function(url) {
    window.location.replace(url);
  };

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

  $scope.formattedDateTime = function(dateTime) {
    return moment(dateTime).format('MM/DD/YYYY hh:mm A').slice(0, 5);
  } ;

  $scope.initInvalidPopover = function(elementID, popoverText) {
    $('#' + elementID).popover({content: popoverText, placement: 'auto right', trigger: 'hover', viewport: { selector: 'body', padding: 0}, html : true, container: 'body'});
  };

  $scope.setPageLoading = function(state) {
    $scope.pageLoading = state;
  }

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


  $scope.formatCurrency = function(value) {
    value = value ? parseFloat(value.toString().replace(/[^0-9._-]/g, '')) || 0 : 0;
    var formattedValue = $filter('currency')(value);
    return formattedValue;
  }


  $scope.getLeftMenuIconOffset = function(sectionName) {
    if(sectionName == 'basic') {
      if($scope.inventorialBundleCollections.length > 0) {
        return { 'top' : '250px' };
      } else {
        return { 'top' : '175px' };
      }
    }
  };

  $scope.getLeftMenuContainerOffset = function() {
    var offset = 100;
    if($scope.inventorialCollections.length > 0) {
      offset += 75;
    }

    if($scope.inventorialBundleCollections.length > 0) {
      offset += 75;
    }

    if($scope.basicCollections.length > 0) {
      offset += 75;
    }

    return { 'top' : offset + 'px' };
  };


  /*
   * Transforms the fields array into an object for easier access
   */
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
      } else if(collectionType == 'inventorial_bundle') {
        $scope.inventorialBundleCollections.push($scope.collections[collection]);
      } else if(collectionType == 'basic') {
        $scope.basicCollections.push($scope.collections[collection]);
      }
      $scope.initializeFieldsObject($scope.collections[collection]);
    }
  };
  
  $scope.initializeMainController = function() {
    /*
    var currentView = $location.path();
    if (currentView.indexOf('/account') >= 0) {
      $scope.setActiveSection('account');
    } else if(currentView.indexOf('/support') >= 0) {
      $scope.setActiveSection('support');
    } else {
      $scope.setActiveSection('work');
    }
    */

    if ($scope.currentUser.newUser) {
      $scope.startMainTour = true;
      $scope.setIsNewUser();
    }

    $scope.initializeCollections();
    
  };

  $scope.initializeMainController();

}
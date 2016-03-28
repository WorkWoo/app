function mainController($scope, $location, $sce) {
  log.info('|mainController|');

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

  $scope.accountType = $scope.currentUser.org.accountType;
  $scope.primaryCollection = $scope.currentUser.org.primaryCollection;

  $scope.startMainTour = false;
  $scope.mainTourConfig = tourConfig.getMainTourConfig($scope);
  
  $scope.changeView = function(viewName) {
    $location.path(viewName);
  };

  $scope.setActiveSection = function(sectionID) {
    // First, deactivate any other active sections
    $('#workMenuItem').removeClass('leftMenuIconActiveTop');
    $('#accountMenuItem').removeClass('leftMenuIconActive');
    $('#supportMenuItem').removeClass('leftMenuIconActive');
    $('#workMenuItem').addClass('leftMenuIcon');
    $('#accountMenuItem').addClass('leftMenuIcon');
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

  $scope.leftMenuClick = function(sectionID) {
    $scope.setActiveSection(sectionID);
    if (sectionID == 'work') {
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
  
  $scope.initializeMainController = function() {
    var currentView = $location.path();
    if (currentView.indexOf('/account') >= 0) {
      $scope.setActiveSection('account');
    } else if(currentView.indexOf('/support') >= 0) {
      $scope.setActiveSection('support');
    } else {
      $scope.setActiveSection('work');
    }

    if ($scope.currentUser.newUser) {
      //$scope.startMainTour = true;
    }

    
  };

  $scope.initializeMainController();

}
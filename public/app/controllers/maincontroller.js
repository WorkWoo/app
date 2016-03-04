function mainController($scope, $location, $sce) {
  log.info('|mainController|');

  $scope.trustAsHtml = $sce.trustAsHtml;
  $scope.successAlertVisible = false;
  $scope.successAlertText = null;
  $scope.dangerAlertVisible = false;
  $scope.dangerAlertText = null;

  $scope.authenticated = AUTHENTICATED;
  $scope.currentUser = USER_PROFILE;
  $scope.collections = COLLECTIONS;

  $scope.accountType = $scope.currentUser.org.accountType;
  $scope.primaryCollection = $scope.currentUser.org.primaryCollection;

  $scope.changeView = function(viewName) {
    $location.path(viewName);
  };

  $scope.setActiveSection = function(sectionID) {
    // First, deactivate any other active sections
    $('#workMenuItem').removeClass('leftMenuIconActiveTop');
    $('#accountMenuItem').removeClass('leftMenuIconActive');
    $('#helpMenuItem').removeClass('leftMenuIconActive');
    $('#workMenuItem').addClass('leftMenuIcon');
    $('#accountMenuItem').addClass('leftMenuIcon');
    $('#helpMenuItem').addClass('leftMenuIcon');

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

  $scope.initializeMainController = function() {
    var currentView = $location.path();
    if (currentView.indexOf('/account') >= 0) {
      $scope.setActiveSection('account');
    } else if(currentView.indexOf('/help') >= 0) {
      $scope.setActiveSection('help');
    } else {
      $scope.setActiveSection('work');
    }
  };

  $scope.initializeMainController();

}
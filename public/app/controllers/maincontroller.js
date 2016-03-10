function mainController($scope, $location, $sce, $templateCache) {
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

  $scope.startJoyRide = true;
  $scope.joyRideConfig = [
          {
              type: "title",
              heading: "Welcome to the WorkWoo tour!",          
              titleTemplate: 'tour-welcome'
          },
          {
              type: "function",
              fn: function() {$('#accountMenuItem').addClass('bringForward')}
          },
          {
              type: "element",
              selector: "#accountMenuItem",
              text: "Click here to access your WorkWoo settings",
              placement: "auto right",
              advanceOn: {element: '#accountMenuItem', event: 'click'},
              attachToBody: "true",
              scroll: true,
          },
          {
              type: "function",
              fn: function() {$('#accountMenuItem').removeClass('bringForward')}
          },
          {
              type: "function",
              fn: function() {$('#workSettings').addClass('bringForward')}
          },
          {
              type: "element",
              selector: "#workSettings",
              text: "Click here to access your Work settings",
              placement: "auto right",
              advanceOn: {element: '#workSettings', event: 'click'},
              attachToBody: "true",
              scroll: true,
          },
          {
              type: "function",
              fn: function() {$('#workSettings').removeClass('bringForward')}
          },
          {
              type: "function",
              fn: function() {$('#collectionNameContainer').addClass('bringForward')}
          },
          {
              type: "element",
              selector: "#collectionNameContainer",
              text: "What do you call your workable items?",
              placement: "auto right",
              attachToBody: "true",
              scroll: true,
          },
          {
              type: "function",
              fn: function() {$('#collectionNameContainer').removeClass('bringForward')}
          },
          {
              type: "function",
              fn: function() {$('#stateContainer').addClass('bringForward')}
          },
           {
              type: "element",
              selector: "#stateContainer",
              text: "What are the states for your item?",
              placement: "auto right",
              attachToBody: "true",
              scroll: true,
          },


  ];

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
    } else if(currentView.indexOf('/support') >= 0) {
      $scope.setActiveSection('support');
    } else {
      $scope.setActiveSection('work');
    }
  };

  $scope.initializeMainController();

}
$(document).ready(function() {
  initializeHome();
});

function initializeHome() {
  $('#user-org-loaded').hide();
  $('#nav-content').hide();
  $('#user-name').hide();
  $('#item-navigator').hide();
  $('#pageLoadingIndicator').hide();

  // Attempt to get an active session for this user. If none exists, a 401 will be returned and we will redirect to login.
  $.ajax({
    type: 'GET',
    url: '/getUserProfile',
    withCredentials: true,
    success: getUserProfileSuccess,
    error: getUserProfileFail
  });
}

function getUserProfileSuccess(response) {
  log.info('USER PROFILE -> ' + response);
  AUTHENTICATED = true;
  USER_PROFILE = JSON.parse(response);

  if (USER_PROFILE.error == true) {
        window.location.replace('/#/login');
  } else {

    // Now that the user is authenticated, request the collection settings for their org.
    $.ajax({
      type: 'GET',
      url: '/getCollections',
      success: getCollectionSettingsSuccess,
      error: getCollectionSettingsFail
    });  
  } 
}

function getUserProfileFail(response) {
  log.info('Get user profile failed!');
  window.location.replace('/#/login');
}

function getCollectionSettingsSuccess(response) {
  //log.info('COLLECTIONS -> ' + response);
  $('#pageLoadingIndicator').show();
  $('#pageLoadingIndicatorOnLoad').hide();
  $('pageLoadingIndicator').show();
  $('#nav-content').show();
  $('#user-org-loading').hide();
  $('#user-org-loaded').show();
  $('#user-name').show();
  $('#item-navigator').show();

  COLLECTIONS = JSON.parse(response).collections;
  FIELDTYPES = JSON.parse(response).fieldTypes;
  COLLECTIONTYPES = JSON.parse(response).collectionTypes;

  angular.bootstrap(document, ['mainApp']);
}

function getCollectionSettingsFail(response) {
  window.location.replace('/#/error');
}


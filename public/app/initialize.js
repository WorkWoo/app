$(document).ready(function() {
  initializeHome();
});

function initializeHome() {
  hideAngularElements();

  // Attempt to get an active session for this user. If none exists, a 401 will be returned and we will redirect to login.
  $.ajax({
    type: 'GET',
    url: '/getUserProfile',
    withCredentials: true,
    success: getUserProfileSuccess,
    error: getUserProfileFail
  });
}


function hideAngularElements() {
  $('#user-org-loaded').hide();
  $('#nav-content').hide();
  $('#user-name').hide();
  $('#item-navigator').hide();
  $('#pageLoadingIndicator').hide();

  $('#workableMenuItemD').hide();
  $('#workableMenuItemM').hide();
  $('#inventorialMenuItemD').hide();
  $('#inventorialMenuItemM').hide();
  $('#revisionableMenuItemD').hide();
  $('#revisionableMenuItemM').hide();
  $('#basicMenuItemD').hide();
  $('#basicMenuItemM').hide();
  $('#settingsMenuItemD').hide();
  $('#settingsMenuItemM').hide();
  $('#supportMenuItemD').hide();
  $('#supportMenuItemM').hide();
}


function getUserProfileSuccess(response) {
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
  window.location.replace('/#/login');
}

function getCollectionSettingsSuccess(response) {
  $('#pageLoadingIndicator').show();
  $('#pageLoadingIndicatorOnLoad').hide();
  $('#pageLoadingIndicator').show();
  $('#nav-content').show();
  $('#user-org-loading').hide();
  $('#user-org-loaded').show();
  $('#user-name').show();
  $('#item-navigator').show();

  $('#workableMenuItemD').show();
  $('#workableMenuItemM').show();
  $('#inventorialMenuItemD').show();
  $('#inventorialMenuItemM').show();
  $('#revisionableMenuItemD').show();
  $('#revisionableMenuItemM').show();
  $('#basicMenuItemD').show();
  $('#basicMenuItemM').show();
  $('#settingsMenuItemD').show();
  $('#settingsMenuItemM').show();
  $('#supportMenuItemD').show();
  $('#supportMenuItemM').show();

  COLLECTIONS = JSON.parse(response).collections;
  FIELDTYPES = JSON.parse(response).fieldTypes;
  COLLECTIONTYPES = JSON.parse(response).collectionTypes;

  angular.bootstrap(document, ['mainApp']);
}

function getCollectionSettingsFail(response) {
  window.location.replace('/#/error');
}


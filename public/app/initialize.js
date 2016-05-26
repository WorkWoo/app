var angularRequiredItems = [
  '#pageLoadingIndicator',
  '#userInfo',
  '#workMenuItem',
  '#inventoryMenuItem',
  '#otherMenuItem',
  '#settingsMenuItem',
  '#supportMenuItem',
  '#leftMenuContainer'
];

$(document).ready(function() {
  hideAngularElements();
  initializeHome();
});

function initializeHome() {
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
  for(var i=0; i<angularRequiredItems.length; i++) {
    $(angularRequiredItems[i]).addClass('hidden');
  }
}

function showAngularElements() {
  for(var i=0; i<angularRequiredItems.length; i++) {
    $(angularRequiredItems[i]).removeClass('hidden');
  }
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
  showAngularElements();

  COLLECTIONS = JSON.parse(response).collections;
  FIELDTYPES = JSON.parse(response).fieldTypes;
  COLLECTIONTYPES = JSON.parse(response).collectionTypes;

  angular.bootstrap(document, ['mainApp']);
}

function getCollectionSettingsFail(response) {
  window.location.replace('/#/error');
}


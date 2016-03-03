// -- Request Factory -- //
function Request($http, BASE_AUTH_URL) {
  var Request = {};
  
  
  Request.session = function ( onSuccess, onFail) {
    log.info('| Request.session |');
    $http.get('getUserProfile', {})
      .then(function success(response) {
        var user = response.data;
        onSuccess(user);
      },
      function fail(response){
        onFail();
      }
    );
  };
  

  Request.login = function (credentials, onSuccess, onFail) {
    log.info('| Request.login |');
    $http.defaults.headers.common.Authorization = 'Basic ' + window.btoa(credentials.emailAddress + ':' + credentials.password);
    $http({ url: BASE_AUTH_URL + '/login', method: 'POST', withCredentials: true})
      .then(function success(response) {
        var user = response.data;
        onSuccess(user);
      },
      function fail(response){
        onFail();
      }
    );
  };

  Request.signup = function (signupInfo, onSuccess, onFail) {
    log.info('| Request.forgot |');
    $http({ url: BASE_AUTH_URL + '/signup', method: 'POST', data: signupInfo })
      .then(function success(response) {
        onSuccess(response);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  Request.forgot = function (emailAddress, onSuccess, onFail) {
    log.info('| Request.forgot |');
    $http({ url: BASE_AUTH_URL + '/forgotPwd', method: 'POST', data: { emailAddress: emailAddress } })
      .then(function success(response) {
        onSuccess(response);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  Request.reset = function (pwdResetInfo, onSuccess, onFail) {
    log.info('| Request.reset |');
    $http({ url: BASE_AUTH_URL + '/resetPwd', method: 'POST', data: pwdResetInfo })
      .then(function success(response) {
        onSuccess(response);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  return Request;
}
function loginController($scope, Request) {
	log.info('|loginController|');
	
	$scope.pageLoaded = false;
	$scope.loginFailed = false;
	$scope.loginSubmitting = false;
	$scope.signupSubmitting = false;
	$scope.signupFailed = false;
	$scope.signupSubmitted = false;
	$scope.credentials = {};
	$scope.signupInfo = {};

	$scope.login = function(credentials) {
		if(loginForm.$invalid) {
			return;
		}

		credentials.emailAddress = credentials.emailAddress.toLowerCase();
	  	$scope.loginSubmitting = true;
	  	$scope.loginFailed = false;

		Request.login(credentials,
			function(response){
	        	// On success
	        	$scope.loginSubmitting = false;
	        	$scope.loginFailed = false;
	        	window.location.replace('/app/');
	    	},
			function() {
	        	// On fail
	        	$scope.loginSubmitting = false;
	        	$scope.loginFailed = true;
	    	}
	    );
	};

	$scope.initialize = function() {
		$scope.initializing = true;
		Request.session(
			function(response){
	        	// On success
	        	if (response.error) {
	        		$scope.initializing = false;
	        		$location.url('/login');	
	        	} else {
	        		window.location.replace('/app/');	        		
	        	}
	    	},
			function() {
	        	// On fail
	        	$scope.pageLoading = false;
	        	$scope.pageLoaded = true;
	        	$scope.initializing = false;
	    	}
	    );
	};

	$scope.initialize();
}
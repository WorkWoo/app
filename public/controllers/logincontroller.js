function loginController($scope, Request) {
	log.info('| loginController |');
	
	$scope.loginFailed = false;
	$scope.loginSubmitting = false;
	$scope.signupSubmitting = false;
	$scope.signupFailed = false;
	$scope.signupSubmitted = false;
	$scope.credentials = {};
	$scope.signupInfo = {};

	$scope.login = function(credentials) {
		if(!$scope.loginForm.$valid) {
			return;
		}

		$scope.credentials.emailAddress = $scope.credentials.emailAddress.toLowerCase();

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
	        		log.error('Existing session not found, must login');
	        		$scope.initializing = false;
	        		$location.url('/login');	
	        	} else {
	        		console.log('Existing session found, redirecting to app');
	        		window.location.replace('/app/');	        		
	        	}
	    	},
			function() {
	        	// On fail
	        	log.error('Existing session not found, must login');
	        	$scope.initializing = false;
	    	}
	    );
	};

	$scope.initialize();
}
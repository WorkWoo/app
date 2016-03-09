function signupController($scope, Request) {
	log.info('|signupController|');

	$scope.signup = function(signupInfo) {
	  	$scope.signupSubmitting = true;
	  	$scope.signupFailed = false;

		Request.signup(signupInfo,
			function(response){
	        	// On success
	        	$scope.signupSubmitting = false;
	        	$scope.signupFailed = false;
	        	$scope.signupSubmitted = true;
	    	},
			function() {
	        	// On fail
	        	$scope.signupSubmitting = false;
	        	$scope.signupFailed = true;
	        	$scope.signupSubmitted = false;
	    	}
	    );
	};


}
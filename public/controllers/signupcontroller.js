function signupController($scope, Request) {
	log.info('|signupController|');
	$scope.emailsMatch = true;

	$scope.signup = function(signupInfo) {
		if (signupForm.$invalid) {
			return;
		}

		if(signupInfo.confirmEmailAddress != signupInfo.newEmailAddress) {
			$scope.emailsMatch = false;
			return;
		}

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


	$scope.verifyEmailMatch = function() {
		var match = signupForm.confirmEmailAddress.value == signupForm.newEmailAddress.value;
		if (match) {
			$scope.emailsMatch = true;
		} else {
			$scope.emailsMatch = false;
		}
		return match;
	};
}
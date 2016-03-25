function forgotController($scope, Request) {
	$scope.credentials = {};
	$scope.forgotSubmitted = false;
	$scope.forgotSubmitting = false;

	$scope.forgot = function(credentials) {
	  	$scope.forgotSubmitting = true;
	  	credentials.emailAddress = credentials.emailAddress.toLowerCase();

		Request.forgot(credentials.emailAddress,
			function(response){
	        	log.info('Forgot password submit successful');
	        	log.info('RESPONSE: ' + response);
	        	log.object(response);

	        	$scope.forgotSubmitting = false;
	        	$scope.forgotSubmitted = true;
	    	},
			function() {
	        	log.info('Forgot password submit failed');
	        	$scope.loginSubmitting = false;
	        	$scope.loginFailed = true;
	    	}
	    );
	};

}

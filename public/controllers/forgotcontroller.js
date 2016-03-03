function forgotController($scope, Request) {
	log.info('| forgotController |');
	
	$scope.credentials = {};
	$scope.forgotSubmitted = false;
	$scope.forgotSubmitting = false;

	$scope.forgot = function(credentials) {
	  	$scope.forgotSubmitting = true;

		Request.forgot(credentials.emailAddress,
			function(response){
	        	log.info('Forgot password submit successful');
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

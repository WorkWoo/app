function forgotController($scope, Request) {
	$scope.credentials = {};
	$scope.forgotSubmitted = false;
	$scope.forgotSubmitting = false;

	$scope.forgot = function(credentials) {
	  	$scope.forgotSubmitting = true;
	  	credentials.emailAddress = credentials.emailAddress.toLowerCase();

		Request.forgot(credentials.emailAddress,
			function(response){
	        	$scope.forgotSubmitting = false;
	        	$scope.forgotSubmitted = true;
	    	},
			function() {
	        	$scope.loginSubmitting = false;
	        	$scope.loginFailed = true;
	    	}
	    );
	};

}

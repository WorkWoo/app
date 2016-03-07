function verifyController($scope, Request) {
	log.info('| verifyController |');
	
	$scope.verifyFailed = false;
	$scope.verifySubmitting = true;
	$scope.verifySucceeded = false;

	$scope.verify = function() {
	  	var token = $scope.getURLParam('tid');

		Request.verify(token,
			function(response){
	        	// On success
	        	$scope.verifySubmitting = false;
	        	$scope.verifySucceeded = true;
	    	},
			function() {
	        	// On fail
	        	$scope.verifySubmitting = false;
	        	$scope.verifyFailed = true;
	    	}
	    );
	};

	$scope.getURLParam = function(paramName) {
		var results = new RegExp('[\?&]' + paramName + '=([^&#]*)').exec(window.location.href);
		if (results == null){
			return null;
		} else{
			return results[1] || 0;
		}
	};

	$scope.verify();
}
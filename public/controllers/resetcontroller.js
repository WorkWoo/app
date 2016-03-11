function resetController($scope, Request) {
	log.info('| resetController |');
	
	$scope.pwdResetInfo = {};
	$scope.resetSubmitted = false;
	$scope.resetSubmitting = false;
	$scope.passwordsMatch = true;

	$scope.reset = function(pwdResetInfo) {
		if(resetForm.$invalid) {
			return;
		}

		if(resetForm.newPassword.value != resetForm.newPasswordConfirm.value) {
			$scope.passwordsMatch = false;
			return;
		}
	  	$scope.resetSubmitting = true
	  	pwdResetInfo.token = $scope.getURLParam('tid');

		Request.reset(pwdResetInfo,
			function(response){
	        	log.info('Reset Successful');
	        	$scope.resetSubmitting = false;
	        	$scope.resetSubmitted = true;
	    	},
			function() {
	        	log.info('Reset Failed');
	        	$scope.resetSubmitting = false;
	        	$scope.resetSubmitted = true;
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
}

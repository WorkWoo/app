function mainController($scope, $location, Request) {
	log.info('| mainController |');
	
	$scope.initializing = false;
	$scope.loginFailed = false;
	$scope.loginSubmitting = false;
	$scope.credentials = {};

	$scope.url = function(url) {
		$location.url(url);
	};

}
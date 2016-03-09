function mainController($scope, $location, Request) {
	log.info('| mainController |');
	
	$scope.initializing = false;
	$scope.loginFailed = false;
	$scope.loginSubmitting = false;
	$scope.credentials = {};


	$scope.url = function(url) {
		$location.url(url);
	};


	$scope.initInvalidPopover = function(elementID, popoverText) {
		$('#' + elementID).popover({content: popoverText, placement: 'auto right', trigger: 'hover', viewport: { selector: 'body', padding: 0}, html : true, container: 'body'});
	};
}
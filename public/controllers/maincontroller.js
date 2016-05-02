function mainController($scope, $location, Request) {
	$scope.pageLoading = true;
	$scope.loginFailed = false;
	$scope.loginSubmitting = false;
	$scope.credentials = {};

	$scope.url = function(url) {
		$location.url(url);
	};


	$scope.initInvalidPopover = function(elementID, popoverText) {
		$('#' + elementID).popover({content: popoverText, placement: 'auto right', trigger: 'hover', viewport: { selector: 'body', padding: 0}, html : true, container: 'body'});
	};

	$scope.destroyInvalidPopover = function(elementID) {
		$('#' + elementID).popover('destroy');
	};
}
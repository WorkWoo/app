function supportController($scope, $timeout) {
  $scope.formSubmitting = false;
  $scope.setPageLoading(false);
  $scope.helpSubmission = {
  	urgency: 'Today'
  }

  $scope.submit = function() {
  	$scope.formSubmitting = true;
    // TODO: Actually do a POST
  	$timeout(function() {
  		$scope.formSubmitSuccess = false;
  		$scope.changeView('support/submitted');
	}, 1500);

  };
}
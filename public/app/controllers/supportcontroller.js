function supportController($scope, $timeout) {
  log.info('|supportController|');
  $scope.formSubmitting = false;

  $scope.helpSubmission = {
  	urgency: 'Today'
  }


  $scope.submit = function() {
  	$scope.formSubmitting = true;
  	log.info('|supportController.submit|');
  	log.info('Urgency: ' + $scope.helpSubmission.urgency);
  	log.info('Description: ' + $scope.helpSubmission.description);
  	

  	$timeout(function() {
  		$scope.formSubmitSuccess = false;
  		$scope.changeView('support/submitted');
	}, 2000);

  };


}
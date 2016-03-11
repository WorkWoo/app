function accountController($scope, $timeout) {
  log.info('|accountController|');
  $scope.accountLoading = false;

  $scope.submit = function() {
    $scope.accountLoading = true;
    log.info('|accountController.submit|');
    
    // TODO: Actually do a POST
    $timeout(function() {
      $scope.changeView('account/summary/submitted');
  }, 1500);

  };
}
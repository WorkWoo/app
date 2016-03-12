function accountController($scope, $timeout) {
  log.info('|accountController|');
  $scope.accountLoading = false;

  $scope.submit = function() {
    $scope.accountLoading = true;
    log.info('|accountController.submit|');
    $scope.setPageLoading(true);

    // TODO: Actually do a POST
    $timeout(function() {
      $scope.setPageLoading(false);
      $scope.changeView('account/summary/submitted');
    }, 1500);
  };
  $scope.setPageLoading(false);
}
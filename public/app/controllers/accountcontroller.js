function accountController($scope, $timeout, User) {
  log.info('|accountController|');
  $scope.accountLoading = false;

  $scope.submit = function() {
    $scope.accountLoading = true;
    $scope.setPageLoading(true);

    var updatedAccountInfo = {
      user: {
        firstName: $scope.currentUser.firstName,
        lastName: $scope.currentUser.lastName,
        emailAddress: $scope.currentUser.emailAddress,
        phone: $scope.currentUser.phone
      },
      org: {
        name: $scope.currentUser.org.name,
        emailAddress: $scope.currentUser.org.emailAddress,
        street: $scope.currentUser.org.streetAddress,
        city: $scope.currentUser.org.city,
        state: $scope.currentUser.org.state,
        zip: $scope.currentUser.org.zip,
        country: $scope.currentUser.org.country,
        phone: $scope.currentUser.org.phone,
      }
    };

    User.updateMyAccount(updatedAccountInfo, 
      function(response){
        $scope.setPageLoading(false);
        $scope.usersLoading = false;
        
        log.info(response);
        log.object(response);

      },
      function() {
        $scope.setPageLoading(false);
        $scope.usersLoading = false;
      }
    );
  };





  $scope.setPageLoading(false);
}
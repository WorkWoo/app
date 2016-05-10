function accountController($scope, $timeout, User) {
  $scope.setActiveSection('settings');
  $scope.accountLoading = false;
  $scope.passwordInfo = {};

  $scope.accountInfo = {
      user: {
        _id: $scope.currentUser.id,
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

  $scope.submit = function() {
    $scope.accountLoading = true;
    $scope.setPageLoading(true);
    User.updateMyAccount($scope.accountInfo, 
      function(response){
        $scope.setPageLoading(false);
        $scope.usersLoading = false;
        $scope.changeView('/account');
        $scope.toggleAlert('success', true, 'Your account has been updated');

      },
      function() {
        $scope.setPageLoading(false);
        $scope.usersLoading = false;
      }
    );
  };


  $scope.changePassword = function() {
    if($scope.passwordInfo.newPassword != $scope.passwordInfo.newPasswordConfirm) {
      alert('Entries do not match');
      return;
    }
    $scope.accountLoading = true;
    $scope.setPageLoading(true);
    User.changePassword($scope.passwordInfo, 
      function(response){
        $scope.setPageLoading(false);
        $scope.usersLoading = false;
        $scope.changeView('/account');
        $scope.toggleAlert('success', true, 'Your password has been changed');

      },
      function() {
        $scope.setPageLoading(false);
        $scope.usersLoading = false;
        $scope.changeView('/account');
        $scope.toggleAlert('danger', true, 'Something went wrong trying to reset your password');
      }
    );
  };

  $scope.setPageLoading(false);
}
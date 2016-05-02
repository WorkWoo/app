function userController($scope, $location, User, SelectedUser) {
  $scope.currentAction = null;
  $scope.loadedUsers = [];
  $scope.selectedUser = SelectedUser;
  $scope.selecedUserName = '';
  $scope.usersLoading = true;


  $scope.getAllUsers = function() {
    $scope.setPageLoading(true);
    $scope.usersLoading = true;
    User.getAll(
      function(users){
        $scope.usersLoading = false;
        $scope.setPageLoading(false);
      	$scope.loadedUsers = $scope.loadedUsers.concat(users);
      },
      function() {
        $scope.setPageLoading(false);
        $scope.usersLoading = false;
      }
    );
  };


  $scope.getOneUser = function(userNumber) {
    $scope.setPageLoading(true);
    $scope.usersLoading = true;
    User.getOne(userNumber, 
      function(user){
        $scope.setPageLoading(false);
        $scope.usersLoading = false;
        $scope.selectedUser = user;
        $scope.selecedUserName = user.firstName + ' ' + user.lastName;
      },
      function() {
        $scope.setPageLoading(false);
        $scope.usersLoading = false;
      }
    );
  };


  $scope.updateUser = function() {
    $scope.usersLoading = true;
    User.update($scope.selectedUser,
      function(updatedUser){
        $scope.usersLoading = false;
        $scope.currentAction = null;
        $scope.changeView('account/users');
      },
      function() {
        $scope.usersLoading = false;
      }
    );
  };


  $scope.createUser = function() {
    $scope.usersLoading = true;
    User.create($scope.selectedUser,
      function(updatedUser){
        $scope.usersLoading = false;
        $scope.selectedUser = {};
        $scope.currentAction = null;
        $scope.changeView('account/users');

      },
      function() {
        $scope.usersLoading = false;
      }
    );
  };


  $scope.openEditUser = function(user) {
    $scope.currentAction = 'update';
    for (var prop in user) {
      $scope.selectedUser[prop] = user[prop];
    }
    $location.path('account/users/edit');
  };


  $scope.initializeUserController = function() {
    $scope.selectedUser = {};
    // Grab the current URL so we can determine what the user is trying to do
    var currentURL = $location.url().replace('/account/users', '');

    // Creating New
    var creatingNew = currentURL.indexOf('/new') >= 0;

    if (creatingNew) {
      $scope.currentAction = 'create';
      $scope.usersLoading = false;
      return;
    }

    // Viewing One
    var viewingOne = currentURL.indexOf('/view') >= 0;
    if (viewingOne) {
      var userNumber = currentURL.slice(currentURL.indexOf('/view') + 6, currentURL.length); // The item number will be after "/view"
      if (userNumber) {
        $scope.currentAction = 'update';
        if (!$scope.selectedUser || $scope.selectedUser.number != userNumber) {
          $scope.getOneUser(userNumber);
        } else {
          $scope.usersLoading = false;
        }
        return;
      }
    }
    $scope.getAllUsers();
  };

  $scope.initializeUserController();
}
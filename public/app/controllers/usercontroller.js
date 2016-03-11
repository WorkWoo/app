function userController($scope, $location, User, SelectedUser) {
  log.info('|userController|');

  $scope.currentAction = null;
  $scope.loadedUsers = [];
  $scope.selectedUser = SelectedUser;
  $scope.selecedUserName = '';

  $scope.usersLoading = true;


  $scope.getAllUsers = function() {
    $scope.usersLoading = true;
    User.getAll(
      function(users){
      	log.info('Success');
        $scope.usersLoading = false;
      	$scope.loadedUsers = $scope.loadedUsers.concat(users);
      },
      function() {
        log.error('Failed');
        $scope.usersLoading = false;
      }
    );
  };


  $scope.getOneUser = function(userNumber) {
    log.info('|userController|.getOneUser');
    $scope.usersLoading = true;
    User.getOne(userNumber, 
      function(user){
        $scope.usersLoading = false;
        $scope.selectedUser = user;
        $scope.selecedUserName = user.firstName + ' ' + user.lastName;
      },
      function() {
        log.error('Failed');
        $scope.usersLoading = false;
      }
    );
  };


  $scope.updateUser = function() {
    log.info('|userController|.updateUser');
    $scope.usersLoading = true;
    User.update($scope.selectedUser,
      function(updatedUser){
        log.info('Success');
        $scope.usersLoading = false;
        
        $scope.currentAction = null;
        $scope.changeView('account/users');
      },
      function() {
        log.error('Failed');
        $scope.usersLoading = false;
      }
    );
  };


  $scope.createUser = function() {
    log.info('|userController|.createUser');
    $scope.usersLoading = true;
    User.create($scope.selectedUser,
      function(updatedUser){
        log.info('Success');
        $scope.usersLoading = false;
        $scope.selectedUser = {};
        $scope.currentAction = null;
        $scope.changeView('account/users');

      },
      function() {
        log.error('Failed');
        $scope.usersLoading = false;
      }
    );
  };


  $scope.openEditUser = function(user) {
    log.info('User to load: ' + user.firstName + ' ' + user.lastName);
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
    log.info('|initializeUserController| Current URL -> ' + currentURL);

    // Creating New
    var creatingNew = currentURL.indexOf('/new') >= 0;
    log.info(creatingNew);

    if (creatingNew) {
      log.info('|initializeUserController| Creating new');
      // Now, extract the collection name
      currentURL = currentURL.slice(0, currentURL.indexOf('/new'));
      $scope.baseCollection = currentURL.slice(1);
      $scope.currentAction = 'create';
      $scope.selectedItem = { collectionName: $scope.primaryCollection };
      $scope.itemsLoading = false;
      return;
    }

    // Viewing One
    var viewingOne = currentURL.indexOf('/view') >= 0;
    if (viewingOne) {
      var userNumber = currentURL.slice(currentURL.indexOf('/view') + 6, currentURL.length); // The item number will be after "/view"
      if (userNumber) {
        log.info('|initializeUserController| Viewing one');

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
    log.info('|initializeUserController| showing list');

  };

  $scope.initializeUserController();
}
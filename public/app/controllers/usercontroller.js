function userController($scope, $location, User, SelectedUser) {
  log.info('|userController|');

  $scope.currentAction = null;
  $scope.loadedUsers = [];
  $scope.selectedUser = SelectedUser;

  $scope.usersLoading = false;


  $scope.getAllUsers = function() {
    log.info('|userController|.getAllUsers');
    $scope.usersLoading = true;

    User.getAll(
      function(users){
      	log.info('Success');

      	log.info('Users found: ' + users.length);

        $scope.usersLoading = false;
      	$scope.loadedUsers = users;
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


  $scope.openCreateNewUser = function() {
    log.info('Opening form to create new user');
    
    // Clear out any previously selected user
    for (var prop in $scope.selectedUser) {
      $scope.selectedUser[prop] = null;
    }

    var blankUser = {
      firstName: '',
      lastName: '',
      role: 'user',
      emailAddress: '',
      phone: ''
    };

    for (var prop in blankUser) {
      $scope.selectedUser[prop] = blankUser[prop];
    }

    $scope.currentAction = 'create';
    $location.path('account/users/new');
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
  	log.info('|userController.initializeUserController|');

  	// Grab the current URL so we can determine what the user is trying to do
    var currentURL = $location.url();

    // Editing User
    var editingUser = (currentURL.indexOf('/edit') > 0);
    if (editingUser) {
      $scope.currentAction = 'update';
      return;
    }

    // Creating User
    var creatingUser = (currentURL.indexOf('/new') > 0);
    if (creatingUser) {
      $scope.currentAction = 'create';
      return;
    }

    $scope.getAllUsers();

  };

  $scope.initializeUserController();
}
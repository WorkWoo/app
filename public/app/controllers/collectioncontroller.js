function collectionController($scope, Collection, $location, COLLECTION_ICONS) {
  log.info('|collectionController|');

  $scope.currentAction = null;
  $scope.loadedCollections = [];
  $scope.selectedCollection = null;

  $scope.showIconSelection = false;
  $scope.collectionIcons = COLLECTION_ICONS;
  $scope.collectionIconClass = 'collection-icon';

  $scope.collectionsLoading = false;

  $scope.startWorkSettingsTour = false;
  $scope.workSettingsTourConfig = tourConfig.getWorkSettingsTourConfig($scope);

  $scope.getAllCollections = function(collectionName) {
    $scope.collectionsLoading = true;
    var queryParams = {
      collectionName: collectionName,
      sortField: $scope.sortField,
      sortOrder: $scope.sortOrder,
      anchorValue: null,
      searchTerm: null,
      additionalQuery: $scope.queryCriteria,
    };

    Collection.getAll(
      function(collections){
      	log.info('Success');

        log.info('Collections: ' + collections);
        log.object(collections[0]);

        $scope.collectionsLoading = false;
      	$scope.loadedCollections = collections;
        $scope.setPageLoading(false);
      },
      function() {
        log.error('Failed');
        $scope.collectionsLoading = false;
        $scope.setPageLoading(false);
      }
    );
  };


  $scope.getOneCollection = function(collectionName) {
    $scope.collectionsLoading = true;
    $scope.setPageLoading(true);
    Collection.getOne(collectionName,
      function(collection){
        log.info('Success');
        $scope.collectionsLoading = false;
        $scope.setPageLoading(false);
        $scope.selectedCollection = collection;
      },
      function() {
        log.error('Failed');
        $scope.setPageLoading(false);
        $scope.collectionsLoading = false;
      }
    );
  };

  $scope.submit = function() {
    if ($scope.currentAction == 'create') {
      $scope.createCollection();
    } else {
      $scope.updateCollection();
    }
  };


  $scope.updateCollection = function() {
    $scope.collectionsLoading = true;
    Collection.update($scope.selectedCollection,
      function(updatedCollections){
        log.info('Success');
        
        $scope.collections = updatedCollections;
        $scope.selectedCollection = {};
        $scope.currentAction = null;
        $scope.collectionsLoading = false;
        $scope.changeView('/');
        location.reload();
      },
      function() {
        $scope.collectionsLoading = false;
      }
    );
  };


  $scope.createCollection = function() {
    $scope.collectionsLoading = true;
    Collection.create($scope.selectedCollection,
      function(updatedCollections){
        log.info('Success');

        $scope.collections = updatedCollections;
        $scope.selectedCollection = {};
        $scope.currentAction = null;
        $scope.collectionsLoading = false;
        $scope.changeView('/');
        location.reload();
      },
      function() {
        $scope.collectionsLoading = false;
      }
    );
  };


  $scope.openCreateNewCollection = function() {
    // Clear out any previously selected collection
    for (var prop in $scope.selectedCollection) {
      $scope.selectedCollection[prop] = null;
    }

    var blankCollection = {
      collectionType: 'static-revisionable',
      icon: 'glyphicon-cog',
      displayField: 'number',
      fields: [
        { showOnNew: false,
          showOnView: false,
          showOnList: true,
          required: true,
          readonly: false,
          sysProvided: true,
          displayType: 'autonumber',
          label: 'Number'
        }]
    };

    for (var prop in blankCollection) {
      $scope.selectedCollection[prop] = blankCollection[prop];
    }

    $scope.currentAction = 'create';
    $location.path('account/collections/new');
  };


  $scope.collectionTypeChanged = function() {
    if ($scope.selectedCollection.collectionType == 'workable') {
      var newCollectionStateField = {
        showOnNew: false,
        showOnView: false,
        showOnList: true,
        required: true,
        readonly: false,
        sysProvided: true,
        displayType: 'state',
        label: 'State',
        choices: [],
      };
      $scope.selectedCollection.fields.push(newCollectionStateField);
    }

  };


  $scope.openEditCollection = function(collection) {
    $scope.currentAction = 'update';

    // Clear out the field names, since they are calculated
    for (var i=0; i<collection.fields.length; i++) {
      collection.fields[i].name = '';
    }
    for (var prop in collection) {
      $scope.selectedCollection[prop] = collection[prop];
    }

    $location.path('account/collections/edit');
  };


  $scope.toggleIconSelection = function() {
    $scope.showIconSelection = !$scope.showIconSelection;
    if ($scope.showIconSelection) {
      $scope.collectionIconClass = 'collection-icon-active';
    } else {
      $scope.collectionIconClass = 'collection-icon';
    }
  };


  $scope.getCollectionIconClass = function(iconClass) {
    return iconClass + ' ' + $scope.collectionIconClass;
  };


  $scope.selectIcon = function(iconClass) {
    $scope.selectedCollection.icon = iconClass;
    $scope.toggleIconSelection();
  };


  $scope.removeOption = function(fieldIndex, choiceIndex) {
    $scope.selectedCollection.fields[fieldIndex].choices.splice(choiceIndex, 1);
  };


  $scope.removeState = function(stateIndex) {
    $scope.selectedCollection.stateChoices.splice(stateIndex, 1);
  };


  $scope.removeField = function(fieldIndex) {
    $scope.selectedCollection.fields.splice(fieldIndex, 1);
  };


  $scope.addNewField = function() {
    var newField = {
      name: '',
      label: 'New Field',
      displayType: 'text',
      sysProvided: false,
      dbType: String,
      readonly: false,
      required: false,
      showOnList: false,
      showOnView: true,
      showOnNew: true,
      choices: []
    }
    $scope.selectedCollection.fields.push(newField);
  };


  $scope.toggleFieldChoices = function(fieldID) {
    if ($scope['show' + fieldID] == undefined) {
      $scope['show' + fieldID] = true;
    } else {
      $scope['show' + fieldID] = !$scope['show' + fieldID];
    }
  };


  $scope.showChoices = function(fieldID) {
    if($scope['show' + fieldID]) {
      return true;
    } else {
      return false;
    }
  };


  $scope.tiggerWorkSettingsTour = function() {
    $scope.startWorkSettingsTour = true;
  }

  $scope.finishWorkSettingsTour = function() {
    $scope.startWorkSettingsTour = false;
  }

  $scope.skipWorkSettingsTour = function() {
    $scope.startWorkSettingsTour = false;
  }

  $scope.lowerAndRemoveSpace = function(inputString) {
    var resultString = inputString.toLowerCase();
    resultString = resultString.replace(/\s/g,'');  
    return resultString;
  };


  $scope.initializeCollectionController = function() {
    // Grab the current URL so we can determine what the user is trying to do
    var currentURL = $location.url().replace('/account/collections', '');

    log.info('current URL: ' + currentURL);

    // Creating collection
    var creatingCollection = (currentURL.indexOf('/new') >= 0);
    if (creatingCollection) {
      $scope.currentAction = 'create';
      $scope.setPageLoading(false);
      $scope.selectedCollection = {
        collectionType: 'workable',
        displayField: 'title',
        icon: 'fa-wrench',
        stateChoices: ['Open', 'In Progress', 'Complete', 'Cancelled'],
        fields: [
          {
            "showOnNew": false,
            "showOnView": false,
            "showOnList": true,
            "required": true,
            "readonly": false,
            "sysProvided": true,
            "displayType": "autonumber",
            "label": "Number",
            "name": "number",
            "dbType": "String"
          },
          {
            'showOnNew': false,
            'showOnView': false,
            'showOnList': true,
            'required': true,
            'readonly': false,
            'sysProvided': true,
            'displayType': 'state',
            'label': 'State',
            'choices': [],
            'name': 'state',
            'dbType': 'String'
          },
          {
            'showOnNew': true,
            'showOnView': true,
            'showOnList': true,
            'required': true,
            'readonly': false,
            'sysProvided': true,
            'displayType': 'text',
            'label': 'Title',
            'choices': [],
            'name': 'title',
            'dbType': 'String'
          }
        ]
      }
      $scope.setPageLoading(false);

      if (!$scope.startMainTour) {
        $scope.tiggerWorkSettingsTour();
      }
      return;
    }

    // Viewing One
    var viewingOne = currentURL.indexOf('/view') >= 0;
    if (viewingOne) {
      var collectionName = currentURL.slice(currentURL.indexOf('/view') + 6, currentURL.length); // The item number will be after "/view"
      if (collectionName) {
        log.info('|initializeCollectionController| Viewing one');
        $scope.currentAction = 'update';
        $scope.getOneCollection(collectionName);
        $scope.setPageLoading(false);
        return;
      }
    }

    // Get all
    $scope.getAllCollections();
  };

  $scope.initializeCollectionController();

}
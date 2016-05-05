function collectionController($scope, Collection, $location, $routeParams, COLLECTION_ICONS) {
  $scope.currentAction = null;
  $scope.loadedCollections = [];
  $scope.selectedCollection = null;
  $scope.selectedCollectionSysFieldCount = 0;

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
        $scope.collectionsLoading = false;
      	$scope.loadedCollections = collections;

        for(var i=0; i<$scope.loadedCollections.length; i++) {
          if($scope.loadedCollections[i].collectionType == 'workable') {
            $scope.workableCollections.push($scope.loadedCollections[i]);
          } else if($scope.loadedCollections[i].collectionType == 'revisionable') {
            $scope.revisionableCollections.push($scope.loadedCollections[i]);
          } else if($scope.loadedCollections[i].collectionType == 'inventorial') {
            $scope.inventorialCollections.push($scope.loadedCollections[i]);
          } else if($scope.loadedCollections[i].collectionType == 'basic') {
            $scope.basicCollections.push($scope.loadedCollections[i]);
          }
        }

        $scope.setPageLoading(false);
      },
      function() {
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
        var referenceable = $scope.collectionTypes[collection.collectionType].defaults.referenceable;

        $scope.collectionsArray = [];

        for (prop in $scope.collections) {
          if (referenceable[$scope.collections[prop].collectionType] == true) {
             $scope.collectionsArray.push({  id: $scope.collections[prop]._id, 
                                          label: $scope.collections[prop].pluralLabel, 
                                          name: $scope.collections[prop].name,
                                          icon: $scope.collections[prop].icon, 
                                          type: $scope.collectionTypes[$scope.collections[prop].collectionType].label });
          }
        }

        $scope.collectionsArray.sort(function(a,b) {return (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0);} );

        $scope.collectionsLoading = false;
        $scope.setPageLoading(false);
        $scope.selectedCollection = collection;
        $scope.setSysFieldCount($scope.selectedCollection.fields);
      },
      function() {
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


  $scope.getCollectionIconClass = function(iconClass) {
    return iconClass + ' ' + $scope.collectionIconClass;
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
      label: '',
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

  $scope.setCollectionIcon = function(iconName) {
    $scope.selectedCollection.icon = iconName;
    $("#iconSelector").modal('hide');
  }

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

  $scope.swapFieldPosition = function(fieldIndex, moveAmount) {
    var totalFields = $scope.selectedCollection.fields.length;
    var sysCount = $scope.selectedCollectionSysFieldCount - 1; // Account fore 0th index
    
    // Don't allow swap if they are already on top or bottom
    if((fieldIndex + moveAmount) <= sysCount || (fieldIndex + moveAmount) >= totalFields) {
      return;
    }

    var swappedField = $scope.selectedCollection.fields[fieldIndex + moveAmount];
    $scope.selectedCollection.fields[fieldIndex + moveAmount] = $scope.selectedCollection.fields[fieldIndex];
    $scope.selectedCollection.fields[fieldIndex] = swappedField;
  };


  $scope.setSysFieldCount = function(fieldsList) {
    for(var i=0; i<fieldsList.length; i++) {
      if(fieldsList[i].sysProvided) {
        $scope.selectedCollectionSysFieldCount += 1;
      }
    }
  };


  $scope.bringFieldForward = function(elementID) {
    $('.customFieldRow').each(function(){
      $(this).css('z-index', 98);
    });

    $('#' + elementID).css('z-index', 99);
  };


  $scope.initializeCollectionController = function() {
    // Grab the current URL so we can determine what the user is trying to do
    var currentURL = $location.url().replace('/account/collections', '');

    // Creating collection
    var creatingCollection = (currentURL.indexOf('/new') >= 0);
    if (creatingCollection) {
      // Grab the collection type, if none was given assume "workable"
      var newCollectionType = $routeParams.type;
      if(!newCollectionType) {
        newCollectionType = 'workable';
      }

      // Set the selected collection and determine the count of sys fields (used by the UI)
      $scope.selectedCollection = $scope.collectionTypes[newCollectionType].defaults;
      $scope.setSysFieldCount($scope.selectedCollection.fields);

      $scope.currentAction = 'create';
      $scope.setPageLoading(false);
      if (!$scope.startMainTour) {
        //$scope.tiggerWorkSettingsTour();
      }
      return;
    }

    // Viewing One
    var viewingOne = currentURL.indexOf('/view') >= 0;
    if (viewingOne) {
      var collectionName = currentURL.slice(currentURL.indexOf('/view') + 6, currentURL.length); // The item number will be after "/view"
      if (collectionName) {
        $scope.currentAction = 'update';
        $scope.getOneCollection(collectionName);
        $scope.setPageLoading(false);
        return;
      }
    }

    // Get all
    //$scope.getAllCollections();
  };

  $scope.initializeCollectionController();

}
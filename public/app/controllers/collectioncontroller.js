function collectionController($scope, Collection, $location, $routeParams, GetStarted, COLLECTION_ICONS) {
  log.info('Collections initialized');
  $scope.setActiveSection('settings');
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

  $scope.GetStarted = GetStarted;

  if(!$scope.GetStarted.industry) {
    $scope.GetStarted.industry = 'Consumer Goods';
  }

  $scope.GetStartedTemplates = {
    'Manufacturing': [
      { title: 'Full Setup',
        bestFor: 'Manufacturing organizations with complex products.',
        product: 'Your product is built from complex assemblies and parts.',
        workable: [{ name: 'Build Orders', icon: 'fa-wrench' }, { name: 'spacer' }],
        revisionable: [{ name: 'Assemblies', icon: 'fa-object-group' }, { name: 'spacer' }],
        inventorial: [{ name: 'Parts', icon: 'fa-cog' }],
        basic: [] },

      { title: 'Simple Product',
        bestFor: 'Manufacturing organizations with simple products that do not require sub-assemblies',
        product: 'Your product is built straight from raw materials or inventory items.',
        workable: [{ name: 'Build Orders', icon: 'fa-wrench' }, { name: 'spacer' }],
        revisionable: [],
        inventorial: [{ name: 'Parts', icon: 'fa-cog' }],
        basic: [] }
    ],

    'Consumer Goods': [
      { title: 'Full Setup',
        bestFor: 'High volume businesses that make on-demand products for other businesses or consumers.',
        work: 'You need a clear separation from customers invoices and the work your employees do.',
        product: 'Your product is built from inventory items.',
        workable: [{ name: 'Invoices', icon: 'fa-credit-card' }, { name: 'spacer' }, { name: 'Product Orders', icon: 'fa-wrench' }, { name: 'spacer' }],
        revisionable: [{ name: 'Product Kits', icon: 'fa-object-group' }, { name: 'spacer' }],
        inventorial: [{ name: 'Inventory', icon: 'fa-cog' }],
        basic: [] },

      { title: 'No Invoices',
        bestFor: "Businesses that still make on-demand products but don't need the complexity of seperate invoices.",
        work: "You and/or your employees work directly on orders and that's enough.",
        product: 'Your product is built from inventory items.',
        workable: [{ name: 'Product Orders', icon: 'fa-wrench' }, { name: 'spacer' }],
        revisionable: [{ name: 'Product Kits', icon: 'fa-object-group' }, { name: 'spacer' }],
        inventorial: [{ name: 'Inventory', icon: 'fa-cog' }],
        basic: [] },

      { title: 'Simple Product',
        bestFor: "Businesses that make products that are simple to make.",
        work: "The work you do can be tracked through customer invoices.",
        product: 'Your product is simple and is an inventory item itself.',
        workable: [{ name: 'Invoices', icon: 'fa-credit-card' }, { name: 'spacer' }],
        revisionable: [],
        inventorial: [{ name: 'Inventory', icon: 'fa-cog' }],
        basic: [] },

    ],

    'Consumer Services': [
      { title: 'Full Setup',
        bestFor: 'Businesses that provide services to customers while using inventory items',
        workable: [{ name: 'Invoices', icon: 'fa-credit-card' }, { name: 'spacer' }, { name: 'Service Orders', icon: 'fa-wrench' }, { name: 'spacer' }],
        revisionable: [],
        inventorial: [{ name: 'Inventory', icon: 'fa-cubes' }],
        basic: [] },

      { title: 'No Inventory',
        bestFor: "Businesses that provide services but don't have inventory",
        workable: [{ name: 'Invoices', icon: 'fa-credit-card' }, { name: 'spacer' }, { name: 'Service Orders', icon: 'fa-wrench' }, { name: 'spacer' }],
        revisionable: [],
        inventorial: [],
        basic: [] }
    ],

    'Social Services': [
      {
        title: 'Full Case Management',
        bestFor: "Social Service organizations that provide ongoing services to a set of clients.",
        work: "Your work day typically involves appointments that result in reports.",
        workable: [{ name: 'Cases', icon: 'fa-archive' }, { name: 'spacer' }, { name: 'Reports', icon: 'fa-pencil' }, { name: 'spacer' }, { name: 'Appointments', icon: 'fa-calendar' }, { name: 'spacer' }],
        revisionable: [],
        inventorial: [],
        basic: [{ name: 'Clients', icon: 'fa-users' }] }
    ],

    'Freelance': [
      { title: 'Freelancer',
        bestFor: 'Freelance workers that provide services to customers',
        workable: [{ name: 'Invoices', icon: 'fa-credit-card' }, { name: 'spacer' }, { name: 'Work Requests', icon: 'fa-wrench' }, { name: 'spacer' }],
        revisionable: [],
        inventorial: [],
        basic: [{ name: 'Clients', icon: 'fa-users' }] }
    ]
  };
 
  $scope.setSelectedTemplate = function(templateIndex) {
    $scope.GetStarted.selectedTemplate = $scope.GetStartedTemplates[$scope.GetStarted.industry][templateIndex];
    log.info('Selected Template: ' + $scope.GetStarted.selectedTemplate.title);

    // Inactivate any previously selected options
    $('.workflowItemContainerActive').each(function(){
      $(this).removeClass('workflowItemContainerActive');
      $(this).addClass('workflowItemContainer');
    });


    $('#' + templateIndex + '_container').removeClass('workflowItemContainer').addClass('workflowItemContainerActive');
  }

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
          } else if($scope.loadedCollections[i].collectionType == 'inventorial_bundle') {
            $scope.inventorialBundleCollections.push($scope.loadedCollections[i]);
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

    for(var i=0; i<$scope.selectedCollection.fields.length; i++) {
      var fieldType = $scope.selectedCollection.fields[i].displayType;
      if(fieldType == 'itemReference' || fieldType == 'itemReferenceList' ) {
        $scope.selectedCollection.fields[i].referenceType = $scope.collections[$scope.selectedCollection.fields[i].referenceTo].collectionType;
      }
    }

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

    // Showing all
    $scope.setPageLoading(false);
  };

  $scope.initializeCollectionController();

}
function itemController($scope, $location, $routeParams, Item) {
  log.info('Items Initialized');
  $scope.loadedItems = [];
  $scope.selectedItem = Item.selectedItem;
  $scope.selectedItemTitle = '';

  $scope.totalItems = 0;
  $scope.baseCollection = null;

  $scope.itemsLoading = true;
  $scope.setPageLoading(true);
  $scope.selectedItemSubmitting = false;

  $scope.itemCountByState = {};

  $scope.currentAction = null;
  $scope.previousAction = null;

  $scope.selectedItems = [];
  $scope.selectAll = true; // used by the "Select all" checkbox, to toggle back and forth between T/F

  $scope.referenceResults = null;
  $scope.referenceItems = null;
  $scope.referencesLoading = false;

  $scope.anchorValue = null;
  $scope.anchorID = null;
  $scope.sortField = 'number';
  $scope.sortOrder = 'desc';
  $scope.searchTerm = null;
  $scope.queryCriteria = null;

  // This object holds a mapping of which CSS classes to apply for different column counts.
  $scope.cellClassInfo = {
    value: {
      '2': 'col-lg-5',
      '3': 'col-lg-3',
      '4': 'col-lg-2',
      '5': 'col-lg-2'
    },
    checkbox: {
      '2': 'col-lg-2',
      '3': 'col-lg-3',
      '4': 'col-lg-4',
      '5': 'col-lg-2'
    }
  }


  $scope.getOneItem = function(itemNumber) {
    $scope.itemsLoading = true;
    $scope.setPageLoading(true);
    Item.getOne($scope.baseCollection, itemNumber,
      function(item){
        // Success
        $scope.itemsLoading = false;
        Item.setSelectedItem(item);
        $scope.selectedItem = item;
        $scope.selectedItemTitle = $scope.selectedItem[$scope.collections[$scope.selectedItem.collectionName].displayField];
        $scope.setPageLoading(false);
      },
      function() {
        // Fail
        $scope.setPageLoading(false);
        $scope.alertUnknownError();
      }
    );
  }


  $scope.openOneItem = function(item) {
    Item.setSelectedItem(item);
    $scope.selectedItem = item;
  };


  $scope.load = function() {
    $scope.setPageLoading(true);
    $scope.itemsLoading = true;
    $scope.collectionCounts = {};
    $scope.setupCollectionCounts($scope.collections[$scope.baseCollection]);
    
    var queryParams = {
      collectionName: $scope.baseCollection,
      sortField: $scope.sortField,
      sortOrder: $scope.sortOrder,
      anchorValue: $scope.anchorValue,
      anchorID: $scope.anchorID,
      searchTerm: $scope.searchTerm,
      additionalQuery: $scope.queryCriteria,
    };
    Item.getAll(queryParams,
      function(result){
        // Success
        $scope.itemsLoading = false;
        $scope.setPageLoading(false);
        // First, copy the search results (minus the actual items) into the scope.
        $scope.anchorValue = result.newAnchorValue;
        $scope.anchorID = result.newAnchorID;
        $scope.setActiveSort($scope.sortField, $scope.sortOrder);
        $scope.totalItems = result.total;
        $scope.loadedItems = $scope.loadedItems.concat(result.items);
        // Count each item, so the breakdown can be shown
        for(var i=0; i<result.items.length; i++) {
          $scope.addItemToCounts(result.items[i]);
        }

      },
      function() {
        $scope.itemsLoading = false;
        $scope.setPageLoading(false);
        $scope.loadedItems = [];
        $scope.alertUnknownError();
      }
    );
  };


  $scope.getItemStateButtonClass = function(stateChoice, selectedItemState) {
    if(stateChoice == selectedItemState) {
      return 'btn-success btn-sm';
    } else {
      return 'btn-default btn-sm';
    }
  };


  /*
   * Build the collectionCounts object, including the list of "countable" fields
   */
  $scope.setupCollectionCounts = function(collectionObject) {
    $scope.collectionCounts[collectionObject.name] = {}
    $scope.collectionCounts[collectionObject.name].countableFields = [];

    // Build a property for each field
    for(var y=0; y<collectionObject.fields.length; y++) {
      var field = collectionObject.fields[y];
      
      if(field.displayType == 'choice' || field.displayType == 'state') {
        $scope.collectionCounts[collectionObject.name].countableFields.push(field);
        
        // If the field is a choice, create the proerty for the field as well as
        // a property for each possible choice, so we get get the total in each.
        $scope.collectionCounts[collectionObject.name][field.name] = {};
        for(var f=0; f<field.choices.length; f++) {
          $scope.collectionCounts[collectionObject.name][field.name][field.choices[f]] = 0;
        }
        // Also, create an "Empty" proprty for items that do not have a choice selected for the field.
        $scope.collectionCounts[collectionObject.name][field.name]['empty'] = 0;
      } else if(field.displayType == 'currency') {
        $scope.collectionCounts[collectionObject.name].countableFields.push(field);
        $scope.collectionCounts[collectionObject.name][field.name] = 0;
      }
    }
  };


  $scope.getAllCollectionCounts = function(collections) {
    $scope.setPageLoading(true);
    $scope.itemsLoading = true;
    $scope.collectionCounts = {};

    for(var i=0; i<collections.length; i++) {
      // Build the counts object
      $scope.setupCollectionCounts(collections[i]);

      // Now query and get the counts for each collection
      var queryParams = {
        collectionName: collections[i].name,
        sortField: $scope.sortField,
        sortOrder: $scope.sortOrder,
        anchorValue: $scope.anchorValue,
        anchorID: $scope.anchorID,
        searchTerm: $scope.searchTerm,
        additionalQuery: $scope.queryCriteria,
      };

      Item.getAll(queryParams,
        function(result){
          $scope.totalItems = result.total;
          var items = result.items;

          // Add each item for the counts object
          for (var x=0; x<items.length; x++) {
            $scope.addItemToCounts(items[x]);
          }

          $scope.itemsLoading = false
          $scope.setPageLoading(false);
        },
        function() {
          $scope.itemsLoading = false;
          $scope.setPageLoading(false);
          $scope.alertUnknownError();
        }
      );
    
    }
  };


  $scope.addItemToCounts = function(itemObject) {
    var countableFields = $scope.collectionCounts[itemObject.collectionName].countableFields;
    for (var f = 0; f<countableFields.length; f++) {
      var countableFieldName = countableFields[f].name;
      if (itemObject[countableFieldName] && (countableFields[f].displayType == 'choice' || countableFields[f].displayType == 'state')) {
        if ($scope.collectionCounts[itemObject.collectionName][countableFieldName][itemObject[countableFieldName]]) {
          $scope.collectionCounts[itemObject.collectionName][countableFieldName][itemObject[countableFieldName]] = $scope.collectionCounts[itemObject.collectionName][countableFieldName][itemObject[countableFieldName]] + 1;
        } else if($scope.collectionCounts[itemObject.collectionName][countableFieldName][itemObject[countableFieldName]] == undefined) {
          $scope.collectionCounts[itemObject.collectionName][countableFieldName][itemObject[countableFieldName]] = 0;
        } else if($scope.collectionCounts[itemObject.collectionName][countableFieldName][itemObject[countableFieldName]] == 0) {
          $scope.collectionCounts[itemObject.collectionName][countableFieldName][itemObject[countableFieldName]] = 1;
        }
      } else if (!itemObject[countableFieldName] && (countableFields[f].displayType == 'choice' || countableFields[f].displayType == 'state')) {
        $scope.collectionCounts[itemObject.collectionName][countableFieldName]['empty'] = $scope.collectionCounts[itemObject.collectionName][countableFieldName]['empty'] + 1;
      } else if (itemObject[countableFieldName] && countableFields[f].displayType == 'currency') {
        $scope.collectionCounts[itemObject.collectionName][countableFieldName] = $scope.collectionCounts[itemObject.collectionName][countableFieldName] + itemObject[countableFieldName];
      }
    }
  };


  $scope.logTest = function() {
    log.info('RESULT: ');
    log.object($scope.collections.purchaseorders.fieldsObject);
  };


  $scope.search = function(searchTerm) {
    $scope.searchTerm = searchTerm;
    $scope.loadedItems = [];
    $scope.anchorValue = null;
    $scope.anchorID = null;
    $scope.sortField = 'number';
    $scope.sortOrder = 'desc';
    $scope.load();
  };


  $scope.preSubmit = function(item) {
    if ($scope.currentAction == 'create') {
       $scope.submit(item, false);
    } else {
      if ($scope.collections[item.collectionName].collectionType != 'static-revisionable') {
        $scope.submit($scope.selectedItem, false);
      } else {
       //$('#modalRevisionDialog').modal();
       $scope.submit($scope.selectedItem, false);
      }
    }
  };


  $scope.submit = function(item, createRevision) {
    //$('#modalRevisionDialog').modal('hide');
    $scope.setPageLoading(true);
    $scope.selectedItemSubmitting = true;
    // First, handle submiting a new item
    if ($scope.currentAction == 'create') {
      Item.new(item.collectionName, item,
        function(newItem){
          $scope.totalItems.total = $scope.totalItems.total + 1; 
          $scope.selectedItemSubmitting = false;
          $scope.toggleAlert('success', true, newItem.number + ' created');
          $scope.changeView(item.collectionName + '/view/' + newItem.number);

        },
        function() {
          $scope.selectedItemSubmitting = false;
          $scope.setPageLoading(false);
          $scope.alertUnknownError();
        }
      );
    } else if ($scope.currentAction == 'update') {
      Item.update(item.collectionName, item._id, item, createRevision,
        function(updatedItem){
          // Success
          $scope.selectedItemSubmitting = false;
          $scope.toggleAlert('success', true, $scope.selectedItem.number + ' updated');
          $scope.setPageLoading(false);
        },
        function() {
          // Fail
          $scope.selectedItem = null;
          $scope.selectedItemSubmitting = false;
          $scope.setPageLoading(false);
          $scope.alertUnknownError();
        }
      );
    }
  };

  $scope.deleteOne = function() {
    $scope.selectedItemSubmitting = true;
    Item.delete($scope.selectedItem.collectionName, [$scope.selectedItem._id],
      function(){
        // Success

        // Update the total count, so we dont have to get it again
        $scope.totalItems.total = $scope.totalItems.total - $scope.selectedItems.length; 
        $scope.toggleAlert('success', true, $scope.selectedItem.number + ' deleted');
        $scope.selectedItemSubmitting = false;
        $scope.url('#/' + $scope.selectedItem.collectionName + '/');
        $scope.selectedItem = null;
      },
      function() {
        // Fail
        $scope.selectedItemSubmitting = false;
        $scope.selectedItem = null;
        $scope.alertUnknownError();
      }
    );
  };


  $scope.deleteMultiple = function() {
    $scope.itemsLoading = true;
    Item.delete($scope.baseCollection, $scope.selectedItems,
      function(){
        // Success
        $scope.itemsLoading = false;

        var deletedItemCount = $scope.selectedItems.length;
        var deleteSuccessText = deletedItemCount + ' ' + $scope.collections[$scope.baseCollection].pluralLabel + ' deleted';
        if (deletedItemCount == 1) {
          deleteSuccessText = $scope.collections[$scope.baseCollection].singleLabel + ' deleted';
        }
        $scope.toggleAlert('success', true, deleteSuccessText);

        // Update the total count, so we dont have to get it again
        $scope.totalItems.total = $scope.totalItems.total - $scope.selectedItems.length; 
        $scope.selectedItems = [];
        $scope.itemsLoading = false;
      },
      function() {
        // Fail
        $scope.selectedItems = [];
        $scope.itemsLoading = false;
        $scope.alertUnknownError();
      }
    );
  };


  $scope.loadReferenceItems = function(referenceCollectionName, referenceField, refType) {
    // First, grab the collection and show the modal dialog
    $scope.referenceCollection = referenceCollectionName;
    $('#' + refType + 'ReferenceSelectPopup').modal();

    $scope.referencesLoading = true;
    $scope.referenceFieldSelected = referenceField;
    $scope.referenceItems = [];

    var queryParams = {
      collectionName: $scope.referenceCollection,
      sortField: 'number',
      sortOrder: 'desc',
      anchorValue: null,
      searchTerm: null,
      query: null
    };

    
    Item.getAll(queryParams,
      function(result){
        $scope.referenceItems = result.items;

        $scope.referenceResults = {};
        $scope.referenceResults.total = result.total
        $scope.referenceResults.firstDocID = result.firstDocID;
        $scope.referenceResults.lastDocID = result.lastDocID;

        $scope.referencesLoading = false;
      },
      function() {
        log.error('References failed to load');
        $('#modalSingleReferenceDialog').modal('hide');
        $scope.alertUnknownError();
      }
    );
  };


 $scope.selectSingleReference = function(referenceItem) {
    $scope.selectedItem[$scope.referenceFieldSelected] = referenceItem;
    $scope.closeReferenceSelector('single');
  };


  $scope.closeReferenceSelector = function(refType) {
    $scope.referenceCollection = '';
    $scope.referenceItems = [];
    $('#' + refType + 'ReferenceSelectPopup').modal('hide');
  };


  $scope.reSort = function(fieldName, sortOrder) {
    $scope.sortField = fieldName;
    $scope.sortOrder = sortOrder;
    $scope.anchorValue = null;
    $scope.anchorID = null;
    $scope.loadedItems = [];
    $scope.load();
    $scope.setActiveSort(fieldName, sortOrder);
  };


  $scope.setActiveSort = function(fieldName, sortOrder) {
    // Make any other sort button inactive and set this one to active
    $('.sort-asc-button-active').each(function() {
      $(this).removeClass('sort-asc-button-active'); 
      $(this).addClass('sort-asc-button'); 
    });
    $('.sort-desc-button-active').each(function() {
      $(this).removeClass('sort-desc-button-active'); 
      $(this).addClass('sort-desc-button'); 
    });
    $('#' + fieldName + '_' + sortOrder).removeClass('sort-' + sortOrder + '-button');
    $('#' + fieldName + '_' + sortOrder).addClass('sort-' + sortOrder + '-button-active');
  };


  $scope.getItemFieldClass = function(item, field) {
    if (field.displayType == 'textarea') {
      return 'col-md-12';
    } else if (field.name == $scope.collections[item.collectionName].displayField) {
      return 'col-md-9';
    } else if (field.displayType == 'datetime') {
      return 'col-md-4';
    } else {
      return 'col-md-3';
    }
  }


  $scope.toggleAll = function() {
    if ($scope.selectAll) {
      for (var i=0; i<$scope.loadedItems.length; i++) {
        var itemID = $scope.loadedItems[i]._id;
        $scope.selectedItems.push(itemID);
      }
    } else {
      $scope.selectedItems = [];
    }
    $scope.selectAll = !$scope.selectAll; // The opposite action will happen on next click
  };


  $scope.toggleSelectedItem = function (event, itemID) {
    // Check to see if they are selecting all by doing a ctrl or cmd click
    if(event.ctrlKey || event.metaKey){
        $('#selectAllCheckbox').prop('checked', $scope.selectAll);
        $scope.toggleAll();
        return;
    }
    // Determine if the selected item is already selected or not.
    var itemIndex = $scope.selectedItems.indexOf(itemID);
    if (itemIndex > -1) { // If it as previously selected, remove it from the list.
      $scope.selectedItems.splice(itemIndex, 1);
    } else { // Is newly selected, add it
      $scope.selectedItems.push(itemID);
    }
  };


  $scope.initializeScroll = function() {
    $('#nav-content').bind('scroll', function() {
      if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight) {
        
        // Check to see if we need to request more items when the bottom is hit
        if (!$scope.itemsLoading && $scope.loadedItems.length < $scope.totalItems) {
          $scope.load();
        }
      }
    });
  };

  $scope.setActiveCollection = function(url) {
    if(url.indexOf('/workable') >= 0) {
      $scope.setActiveSection('workable');
    } else if(url.indexOf('/revisionable') >= 0) {
      $scope.setActiveSection('revisionable');
    } else if(url.indexOf('/inventorial') >= 0) {
      $scope.setActiveSection('inventorial');
    } else if(url.indexOf('/basic') >= 0) {
      $scope.setActiveSection('basic');
    } else {
      $scope.setActiveSection('workable');
    }
  };

  $scope.initializeItemController = function() {
    // Grab the current URL so we can determine what the user is trying to do
    var currentURL = $location.url();
    $scope.setActiveCollection(currentURL);



    // Looking at the base collection home
    log.info(currentURL);
    if(currentURL.indexOf('/workable') >= 0) {
      $scope.selectedItem = {};
      $scope.getAllCollectionCounts($scope.workableCollections);
      return;
    } else if(currentURL.indexOf('/inventorial') >= 0) {
      $scope.selectedItem = {};
      $scope.getAllCollectionCounts($scope.inventorialCollections);
      return;
    } else if(currentURL.indexOf('/revisionable') >= 0) {
      $scope.selectedItem = {};
      $scope.getAllCollectionCounts($scope.revisionableCollections);
      return;
    } else if(currentURL.indexOf('/basic') >= 0) {
      $scope.selectedItem = {};
      $scope.getAllCollectionCounts($scope.basicCollections);
      return;
    }



    // Searching
    var searching = currentURL.indexOf('/search?') > 0;
    if (searching) {
      // Now, extract the collection name
      currentURL = currentURL.slice(0, currentURL.indexOf('/search?'));
      currentURL = currentURL.slice(1); // Remove the slash
      $scope.loadedItems = [];
      $scope.baseCollection = currentURL;
      $scope.queryCriteria = $routeParams;
      $routeParams = {};

      $scope.initializeScroll();
      $scope.load($scope.baseCollection);
      return;
    }

    // Creating New
    var creatingNew = currentURL.indexOf('/new') > 0;
    if (creatingNew) {
      // Now, extract the collection name
      currentURL = currentURL.slice(0, currentURL.indexOf('/new'));
      $scope.baseCollection = currentURL.slice(1);
      $scope.currentAction = 'create';
      $scope.selectedItem = {
        collectionName: $scope.baseCollection,
        state: $scope.collections[$scope.baseCollection].stateChoices[0]
      };
      $scope.itemsLoading = false;
      $scope.setPageLoading(false);
      return;
    }

    // Viewing One
    var viewingOne = currentURL.indexOf('/view') > 0;
    if (viewingOne) {
      var itemNumber = currentURL.slice(currentURL.indexOf('/view') + 6, currentURL.length); // The item number will be after "/view"
      currentURL = currentURL.slice(0, currentURL.indexOf('/view'));
      $scope.baseCollection = currentURL.slice(1);
      if (itemNumber) {
        $scope.currentAction = 'update';
        if (!$scope.selectedItem || $scope.selectedItem.number != itemNumber) {
          $scope.selectedItem = {};
          $scope.getOneItem(itemNumber);
        } else {
          $scope.selectedItemTitle = $scope.selectedItem[$scope.collections[$scope.selectedItem.collectionName].displayField];
          $scope.setPageLoading(false);
          $scope.itemsLoading = false;
        }
        return;
      }
    }
    
    // Check to see if the given collection is a valid item collection
    $scope.baseCollection = currentURL.slice(1);;

    var validCollection = $scope.collections[$scope.baseCollection];

    // If the collection was passed, go to it's list. Otherwise, go to the work home.
    if (validCollection) {
      $scope.initializeScroll();
      $scope.load($scope.baseCollection);
      $scope.setPageLoading(false);
      return;
    }

    // If this point is reached, simply show the home
    if($scope.currentUser.org.primaryCollection) {
      $scope.initializeScroll();
      $scope.baseCollection = $scope.currentUser.org.primaryCollection;
      $scope.selectedItem = {};
      $scope.getAllCollectionCounts($scope.workableCollections);
      return;
    }

    // If this point is reached, they are a new unconfigured user.
    $scope.initializeScroll();
    $scope.setPageLoading(false);
  };

  $scope.initializeItemController();

}

function itemController($scope, $location, $routeParams, $timeout, Item, User) {
  log.info('Items initialized');
  $scope.loadedItems = [];
  $scope.selectedItem = Item.selectedItem;
  $scope.selectedItemTitle = '';

  $scope.totalItems = 0;
  $scope.baseCollection = null;

  $scope.itemsLoading = true;
  $scope.setPageLoading(true);
  $scope.selectedItemSubmitting = false;

  $scope.currentAction = null;
  $scope.previousAction = null;

  $scope.selectedItems = [];
  $scope.selectedRefItems = [];
  $scope.selectAll = true; // used by the "Select all" checkbox, to toggle back and forth between T/F

  $scope.referenceResults = null;
  $scope.referenceItems = null;
  $scope.referencesLoading = false;
  $scope.refListCollection = null;
  $scope.refListFieldName = null;
  $scope.selectedReferences = {};
  $scope.requiredInventory = {};
  $scope.refUsers = {};
  $scope.refUsersLoading = false;
  $scope.inventoryInitialized = false;

  $scope.collectionCounts = {};
  $scope.countsCompleted = false;

  $scope.anchorValue = null;
  $scope.anchorID = null;
  $scope.sortField = 'number';
  $scope.sortOrder = 'desc';
  $scope.searchTerm = null;
  $scope.queryCriteria = null;

  $scope.refItemsLoading = false;
  $scope.refItemsSortField = 'number';
  $scope.refItemsSortOrder = 'asc';
  $scope.refItemsAnchorValue = null;
  $scope.refItemsAnchorID = null;
  $scope.refItemsQueryCriteria = null;
  $scope.refItems = {};

  $scope.relatedItemsLoading = false;
  $scope.relatedItemsSortField = 'number';
  $scope.relatedItemsSortOrder = 'asc';
  $scope.relatedItemsAnchorValue = null;
  $scope.relatedItemsAnchorID = null;
  $scope.relatedItemsQueryCriteria = null;
  $scope.relatedItems = {};

  /****************************** UI UTILITIES *******************************/

  $scope.toggleField = function(fieldID) {
    if ($scope['show' + fieldID] == undefined) {
      $scope['show' + fieldID] = true;
    } else {
      $scope['show' + fieldID] = !$scope['show' + fieldID];
    }
  };

  $scope.showField = function(fieldID) {
    if($scope['show' + fieldID]) {
      return true;
    } else {
      return false;
    }
  };

  $scope.getItemStateButtonClass = function(stateChoice, selectedItemState) {
    if(stateChoice == selectedItemState) {
      return 'btn-success btn-sm';
    } else {
      return 'btn-default btn-sm';
    }
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
    if (field.displayType == 'textarea' || (field.displayType == 'itemReferenceList' && (field.referenceType == 'inventorial' || field.referenceType == 'inventorial_bundle'))) {
      return 'col-md-12';
    } else if (field.displayType == 'userReferenceList' || field.displayType == 'itemReferenceList') {
      return 'col-md-6';
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

  $scope.getRefListRowClass = function(index, arrayLength) {
    if(index == arrayLength) {
      return 'refListRowLast';
    } else {
      return 'refListRow';
    }
  };

  $scope.getBundleRefListRowClass = function(index, arrayLength) {
    if(index == arrayLength) {
      return 'bundleRefListRowLast';
    } else {
      return 'bundleRefListRow';
    }
  };

  /****************************** UI UTILITIES *******************************/


  /****************************** CRUD OPERATIONS *******************************/

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

  $scope.preSubmit = function(item) {
    if ($scope.currentAction == 'create') {
      $scope.submit(item, false);
    } else {
      $scope.submit($scope.selectedItem, false);
    }
  };

  $scope.submit = function(item, createRevision) {
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
          $scope.reloadRoute();
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

  $scope.search = function(searchTerm) {
    $scope.searchTerm = searchTerm;
    $scope.loadedItems = [];
    $scope.anchorValue = null;
    $scope.anchorID = null;
    $scope.sortField = 'number';
    $scope.sortOrder = 'desc';
    $scope.load();
  };

  /****************************** CRUD OPERATIONS *******************************/


  /****************************** REFERENCE OPERATIONS ******************************/

  $scope.initSelectedReferences = function(refCollectionName, referenceList) {
    $scope.refItemsLoading = true;
    if($scope.currentAction == 'create') {
      referenceList = [];
    }
    // First, save all of the currently selected reference items, so that they can be populated by the request.
    for(var i=0; i<referenceList.length; i++) {
      $scope.selectedReferences[referenceList[i]._id] = true;
    }
    // Then, request all possible reference items.
    $scope.getRefItems(refCollectionName);
  };

  $scope.initRequiredInventory = function(refCollection, refItemID, refItemQty) {
    var refCollectionObject = $scope.refItems[refCollection];
    var refItemObject = $scope.refItems[refCollection].itemObjects[refItemID];
    $scope.inventoryInitialized = false;

    // Because the page is loaded async, we need to wait until the bundles are populated
    if(!refCollectionObject || !refItemObject) {
      $timeout(function () {
          $scope.initRequiredInventory(refCollection, refItemID, refItemQty);
      }, 1000);
    } else {
      var inventoryList = $scope.refItems[refCollection].itemObjects[refItemID].inventoryitems;
      for(var i=0; i<inventoryList.length; i++) {
        var singleItem = inventoryList[i];
        if(!$scope.requiredInventory[singleItem._id]) {
          $scope.requiredInventory[singleItem._id] = { qty: (singleItem.qty * refItemQty) };
        } else {
          $scope.requiredInventory[singleItem._id].qty = $scope.requiredInventory[singleItem._id].qty + (singleItem.qty * refItemQty);
        }
      }
      $scope.inventoryInitialized = true;
    }
  };

  // Remove the reference list item from the currently selected item.
  $scope.removeReference = function(fieldName, referenceIndex, refItemID) {
    var referenceArray = $scope.selectedItem[fieldName];
    referenceArray.splice(referenceIndex, 1);
    $scope.selectedItem[fieldName] = referenceArray;
    $scope.selectedReferences[refItemID] = false;
  };

  $scope.showRefListSelector = function(refItemCollection, refFieldName) {
    $scope.refListCollection = refItemCollection;
    $scope.refListFieldName = refFieldName;
    $("#refListSelector").modal('show');
  };

  $scope.addSelectedReferences = function() {
    // Iterate through each checkbox to grab the ones that are selected
    $('.refListCheckbox').each(function(){
      var refItemID = $(this).attr('id');
      var refItemObject = $scope.refItems[$scope.refListCollection].itemObjects[refItemID];

      if(!$scope.selectedItem[$scope.refListFieldName]) {
        $scope.selectedItem[$scope.refListFieldName] = [];
      }

      // If the item is checked and was not before, save it.
      if($(this).prop('checked') && !$scope.selectedReferences[refItemID]) {
        refItemObject.qty = 0;
        $scope.selectedItem[$scope.refListFieldName].push(refItemObject);
        $scope.selectedReferences[refItemID] = true;
      }

      // If the item is not checked but was checked before, remove it from the selected item
      if(!$(this).prop('checked') && $scope.selectedReferences[refItemID]) {
        for(var i=0; i<$scope.selectedItem[$scope.refListFieldName].length; i++) {
          var singleItem = $scope.selectedItem[$scope.refListFieldName][i];
          if(singleItem._id == refItemID) {
            $scope.removeReference($scope.refListFieldName, i, refItemID)
          }
        }
      }
    });
    // Finish and close the popup
    $scope.refListCollection = null;
    $scope.refListFieldName = null;
    $("#refListSelector").modal('hide');
  };

  $scope.getRefItems = function(refItemCollection, loadBundledItems) {
    // First initialize the reference field in the refItems object
    if (!$scope.refItems[refItemCollection]) {
      $scope.refItems[refItemCollection] = {};
      $scope.refItems[refItemCollection].items = [];
      $scope.refItems[refItemCollection].totalCount = -1;
      $scope.refItems[refItemCollection].itemObjects = {};
    } else {
      return;
    }
    $scope.refItemsLoading = true;
    var queryParams = {
      collectionName: refItemCollection,
      sortField: $scope.refItemsSortField,
      sortOrder: $scope.refItemsSortOrder,
      anchorValue: null,
      anchorID: null,
      searchTerm: null,
      additionalQuery: $scope.refItemsQueryCriteria,
      itemCount: 0
    };

    Item.getAll(queryParams,
      function(result){
        // Success
        $scope.refItemsLoading = false;
        $scope.refItems[refItemCollection].totalCount = result.total;
        $scope.refItems[refItemCollection].items = result.items;

        // Convert each item to an object (so we can get it by ID instead of iterating through an array)
        for(var i=0; i<$scope.refItems[refItemCollection].items.length; i++) {
          var singleItem = $scope.refItems[refItemCollection].items[i];
          $scope.refItems[refItemCollection].itemObjects[singleItem._id] = singleItem;
        }
      },
      function() {
        $scope.refItemsLoading = false;
        $scope.refItems[refItemCollection] = [];
        $scope.alertUnknownError();
      }
    );
  };

  $scope.getRefUsers = function() {
    // First initialize the refUsers object
    if (!$scope.refUsers.users) {
      $scope.refUsers = {};
      $scope.refUsers.users = []; 
    } else {
      return;
    }
    $scope.refUsersLoading = true;
    User.getAll(
      function(users){
        $scope.refUsersLoading = false;
        $scope.refUsers.users = users;
      },
      function() {
        $scope.refUsersLoading = false;
        $scope.refUsers.users = [];
        $scope.alertUnknownError();
      }
    );
  };

  /*
   * inventory: A single object that contains keys which are IDs of items. Each has a property "qty" with the quantity to pull
   * Example:
   * inventory = {
   *     '90823d7491873a4da6': { qty: 3 },
   *     '0a93d2f8749e871234': { qty:4 }
   * }
   */
  $scope.pullInventoryItems = function(collectionName, inventory) {
    $scope.selectedItemSubmitting = true;
    // Before sending the request, convert to arry & invert the quantities, since the server works by adding
    var inventoryList = [];
    for(var item in inventory) {
      var singleItem = {
        id: item,
        qty: -inventory[item].qty
      }
      inventoryList.push(singleItem);
    }

    Item.pullInventoryItems(collectionName, inventoryList,
      function(result){
        // Success
        $scope.selectedItemSubmitting = false;
        $scope.toggleAlert('success', true,' Inventory pulled');
        $scope.setPageLoading(false);
      },
      function() {
        // Fail
        $scope.selectedItemSubmitting = false;
        $scope.setPageLoading(false);
        $scope.alertUnknownError();
      }
    );
  };

  /* IF WE EVER DO INFINITE SCROLLING WITH REFERENCES
  $scope.refreshRefItems = function(refItemField, refItemCollection, searchTerm, withAnchors) {
    // First initialize the reference field in the refItems object
    if (!$scope.refItems[refItemField]) {
      $scope.refItems[refItemField] = {};
      $scope.refItems[refItemField].items = [];
      $scope.refItems[refItemField].initialCount = -1;
      $scope.refItems[refItemField].totalCount = -1;  
    }

    // If the initial count was 0, don't re-issue a call when the user types
    if ($scope.refItems[refItemField].initialCount == 0) {
      return;
    }

    $scope.refItemsLoading = true;
    var queryParams = {
      collectionName: refItemCollection,
      sortField: $scope.refItemsSortField,
      sortOrder: $scope.refItemsSortOrder,
      anchorValue: null,
      anchorID: null,
      searchTerm: searchTerm,
      additionalQuery: $scope.refItemsQueryCriteria,
    };

    // If we are using anchors, populate them
    if (withAnchors) {
      queryParams.anchorValue = $scope.refItemsAnchorValue;
      queryParams.anchorID = $scope.refItemsAnchorID;
    }

    Item.getAll(queryParams,
      function(result){
        // Success
        $scope.refItemsLoading = false;
        // First, copy the search results (minus the actual items) into the scope.
        $scope.refItemsAnchorValue = result.newAnchorValue;
        $scope.refItemsAnchorID = result.newAnchorID;
        //$scope.setActiveSort($scope.sortField, $scope.sortOrder);

        // If this is the first time we are querying for this field reference, track the initial count
        if ($scope.refItems[refItemField].initialCount == -1) {
          $scope.refItems[refItemField].initialCount = result.total;
        }

        $scope.refItems[refItemField].totalCount = result.total;
        console.log('Total ' + refItemField + ' = ' + $scope.refItems[refItemField].totalCount);
        
        // If we are not using anchors, we can just refresh the item list
        if (!withAnchors) {
          $scope.refItems[refItemField].items = result.items;
        } else { // otherwise, add the additional items to the end of the array
          $scope.refItems[refItemField].items = $scope.refItems[refItemField].items.concat(result.items);
        }
      },
      function() {
        $scope.refItemsLoading = false;
        $scope.refItems[refItemField] = [];
        $scope.alertUnknownError();
      }
    );
  };
  */

  /****************************** REFERENCE OPERATIONS ******************************/


  /********************************** RELATED ITEMS **********************************/


  $scope.getRelatedItems = function(relatedItemCollection, queryCriteria) {
    $scope.relatedItemsLoading = true;
    var queryParams = {
      collectionName: relatedItemCollection,
      sortField: $scope.relatedItemsSortField,
      sortOrder: $scope.relatedItemsSortOrder,
      anchorValue: null,
      anchorID: null,
      searchTerm: null,
      additionalQuery: queryCriteria,
      itemCount: 0
    };

    Item.getAll(queryParams,
      function(result){
        // Success
        $scope.relatedItemsLoading = false;
        $scope.relatedItems[relatedItemCollection].totalCount = result.total;
        $scope.relatedItems[relatedItemCollection].items = result.items;
      },
      function() {
        $scope.refItemsLoading = false;
        $scope.relatedItems[relatedItemCollection] = [];
        $scope.alertUnknownError();
      }
    );
  };

  $scope.initRelatedItems = function() {
    for(var collection in $scope.collections) {
      var fields = $scope.collections[collection].fields;
      for(var i=0; i<fields.length; i++) {
        if(fields[i].referenceTo == $scope.selectedItem.collectionName) {
          // Initialize the object for the collection
          $scope.relatedItems[$scope.collections[collection].name] = { totalCount: 0, items: [] };
          

          // Initialize the find criteria, which could be a qty list of objects or a normal list
          var singleCritera = {};
          singleCritera[fields[i].name] = $scope.selectedItem._id;

          var listCritera = {};
          listCritera[fields[i].name] = { $elemMatch: { _id: $scope.selectedItem._id } };

          var queryCriteria = { $or: [singleCritera, listCritera] };
          $scope.getRelatedItems($scope.collections[collection].name, queryCriteria);
        }
      }
    }
  };


  /********************************** RELATED ITEMS **********************************/


  /****************************** COUNTING & REPORTING ******************************/

  // Build the collectionCounts object, including the list of "countable" fields
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
          $scope.countsCompleted = true;
        },
        function() {
          $scope.itemsLoading = false;
          $scope.setPageLoading(false);
          $scope.alertUnknownError();
        }
      );
    }
    $scope.itemsLoading = false
    $scope.setPageLoading(false);
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


  /****************************** COUNTING & REPORTING ******************************/


  /************************************* CHARTS *************************************/


  $scope.initDropdownChart = function(collectionName, fieldObject) {
    log.info('Loading chart for: ' + collectionName);

    // Because the page is loaded async, we need to wait until counts are completed
    if(!$scope.countsCompleted) {
      $timeout(function () {
          $scope.initDropdownChart(collectionName, fieldObject);
      }, 500);
    } else {

      var choices = fieldObject.choices;

      var labels = [];
      var series = [];
      for(var i=0; i<choices.length; i++) {
        labels.push(choices[i]);
        series.push($scope.collectionCounts[collectionName][fieldObject.name][choices[i]]);
      }

      // Lastly, push the 'empty' value
      labels.push('Empty');
      series.push($scope.collectionCounts[collectionName][fieldObject.name]['empty']);
      var data = {
        labels: labels,
        series: series
      };

      var options = {
        high: 10,
        low: 0,
      };

      var responsiveOptions = [
        ['screen and (min-width: 640px)', {
          chartPadding: 30,
          labelOffset: 50,
          labelDirection: 'explode',
          labelInterpolationFnc: function(value) {
            return value;
          }
        }],
        ['screen and (min-width: 1024px)', {
          labelOffset: 80,
          chartPadding: 20
        }]
      ];

      new Chartist.Bar('#' + fieldObject.name + '_piechart', data, options, responsiveOptions);

    }
  };


  /************************************* CHARTS *************************************/


  /****************************** INITIALIZATION ******************************/

  $scope.setActiveCollection = function(collectionName) {
    var collectionType = $scope.collections[collectionName].collectionType;

    if(collectionType == 'inventorial' || collectionType == 'inventorialBundle') {
      $scope.setActiveSection('inventory');
    } else {
      $scope.setActiveSection(collectionType);
    }
  };

  $scope.initializeItemController = function() {
    // Grab the current URL so we can determine what the user is trying to do
    var currentURL = $location.url();

    // Looking at the base collection home
    if(currentURL.indexOf('/workable') >= 0) {
      $scope.setActiveSection('workable');
      $scope.selectedItem = {};
      $scope.getAllCollectionCounts($scope.workableCollections);
      return;
    } else if(currentURL.indexOf('/inventory') >= 0) {
      $scope.setActiveSection('inventory');
      $scope.selectedItem = {};
      $scope.getAllCollectionCounts($scope.inventoryCollections);
      return;
    } else if(currentURL.indexOf('/basic') >= 0) {
      $scope.setActiveSection('basic');
      $scope.selectedItem = {};
      $scope.getAllCollectionCounts($scope.basicCollections);
      return;
    }

    // Now, check to see if the given collection is valid

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
      $scope.selectedItem = { collectionName: $scope.baseCollection };
      $scope.itemsLoading = false;
      $scope.setPageLoading(false);
      $scope.clearAlerts();
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

    // If the collection was passed, go to it's list.
    if (validCollection) {

      $scope.setActiveCollection($scope.baseCollection);

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

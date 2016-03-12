function itemController($scope, $location, $routeParams, Item) {
  log.info('|itemController| Starting');

  $scope.showHome = false;
  $scope.showItems = false;

  $scope.loadedItems = Item.loadedItems;
  $scope.selectedItem = Item.selectedItem;
  $scope.selectedItemTitle = '';

  $scope.totalItems = 0;;

  $scope.baseCollection = null;

  $scope.itemsLoading = true;
  $scope.selectedItemSubmitting = false;

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
        Item.loadItems($scope.loadedItems);
      },
      function() {
        $scope.itemsLoading = false;
        $scope.setPageLoading(false);
        $scope.loadedItems = [];
        $scope.alertUnknownError();
      }
    );
  };


  $scope.search = function(searchTerm) {
    $scope.searchTerm = searchTerm;
    log.info('Search term -> ' + $scope.searchTerm);
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
          if ($scope.loadedItems.length == 0) {
            $scope.load();
          } else {
            $scope.loadedItems.push(newItem);
          }

          $scope.totalItems.total = $scope.totalItems.total + 1; 
          $scope.selectedItemSubmitting = false;
          $scope.url('#/' + $scope.primaryCollection + '/');
          $scope.toggleAlert('success', true, newItem.number + ' created');
          $scope.setPageLoading(false);
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
          for (var x=0; x<$scope.loadedItems.length; x++) {
            if ($scope.loadedItems[x]._id == updatedItem._id) {
              $scope.loadedItems[x] = updatedItem;
            }
          }

          $scope.selectedItemSubmitting = false;
          $scope.url('#/' + $scope.primaryCollection + '/');
          $scope.toggleAlert('success', true, $scope.selectedItem.number + ' updated');
          $scope.selectedItem = null;
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
        // Now remove each deleted item from the front end,
        // Saving the last one (in case it was the only deleted one)
        var itemID = $scope.selectedItem._id;
        for (var i=0; i<$scope.loadedItems.length; i++) {
          if ($scope.loadedItems[i]._id == itemID) {
            $scope.loadedItems.splice(i, 1);
          }
        }

        // Update the total count, so we dont have to get it again
        $scope.totalItems.total = $scope.totalItems.total - $scope.selectedItems.length; 
        $scope.toggleAlert('success', true, $scope.selectedItem.number + ' deleted');
        $scope.selectedItem = null;
        $scope.selectedItemSubmitting = false;
        $scope.url('#/' + $scope.primaryCollection + '/');
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

        // Now remove each deleted item from the front end,
        // Saving the last one (in case it was the only deleted one)
        for (var i=0; i<$scope.selectedItems.length; i++) {
          var orderID = $scope.selectedItems[i];
          for (var x=0; x<$scope.loadedItems.length; x++) {
            if ($scope.loadedItems[x]._id == orderID) {
              $scope.loadedItems.splice(x, 1);
            }
          }
        }

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


  $scope.initializeItemController = function() {
    // Grab the current URL so we can determine what the user is trying to do
    var currentURL = $location.url();
    log.info('|itemController| Current URL -> ' + currentURL);
    $scope.setActiveSection('work');

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
      $scope.showHome = false;
      $scope.showItems = true;
      return;
    }

    // Creating New
    var creatingNew = currentURL.indexOf('/new') > 0;
    if (creatingNew) {
      log.info('|itemController| Creating new');
      // Now, extract the collection name
      currentURL = currentURL.slice(0, currentURL.indexOf('/new'));
      $scope.baseCollection = currentURL.slice(1);
      $scope.currentAction = 'create';
      $scope.selectedItem = { collectionName: $scope.primaryCollection };
      $scope.itemsLoading = false;
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
      log.info('|itemController| Loading all');
      $scope.initializeScroll();
      $scope.showHome = false;
      $scope.showItems = true;

      // Only load the items if they are not loaded already
      if ($scope.loadedItems.length == 0) {
        log.info('Loading...');
        $scope.load($scope.baseCollection);
      } else {
        $scope.totalItems = $scope.loadedItems.length;
        $scope.itemsLoading = false;
        log.info('Already loaded');
      }
      return;
    }

    // If this point is reached, simply show the home
    $scope.showItems = false;
    $scope.showHome = true;
    $scope.baseCollection = $scope.currentUser.org.primaryCollection;
    $scope.selectedItem = {}
    $scope.setPageLoading(false);
  };

  $scope.initializeItemController();

}

function LoadedCollection() {return {collectionName: 'none'};}
function TotalItems() { return {};}
function SelectedItem() { return {};}
function SelectedUser() { return {};}
function SelectedCollection() { return {};}


// ############################## ITEM ############################## //


function Item($http) {
  var Item = {};

  Item.new = function (collectionName, newItem, onSuccess, onFail) {
    $http({ url: '/createNewItem', method: 'POST', data: { collectionName: collectionName, newItem: newItem } })
      .then(function success(response) {
        onSuccess(response.data.item);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  /*
   *  var params = {
   *    collectionName: String,
   *    sortField: String (field name)
   *    sortOrder: String (asc or desc)
   *    anchorValue: String (field value)
   *    searchTerm: String
   *  }
   */
  Item.getAll = function(params, onSuccess, onFail) {
    $http({ url: '/getItems', method: 'GET', params: params } )
      .then(function success(response) {
        onSuccess(response.data.result);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  Item.getOne = function(collectionName, itemNumber, onSuccess, onFail) {
    $http({ url: '/getOneItem', method: 'GET', params: {collectionName: collectionName, itemNumber: itemNumber} })
      .then(function success(response) {
        onSuccess(response.data.item);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  Item.update = function (collectionName, itemID, updatedItem, createRevision, onSuccess, onFail) {
    $http({ url: '/updateItem', method: 'POST', data: {collectionName: collectionName, itemID: itemID, updatedItem: updatedItem, createRevision: createRevision } })
      .then(function success(response) {
        onSuccess(response.data.item);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  Item.delete = function (collectionName, itemIDs, onSuccess, onFail) {
    $http({ url: '/deleteItems', method: 'POST', data: { collectionName: collectionName, itemIDs: itemIDs } })
      .then(function success(response) {
        onSuccess(response.data);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  /*
   *  var params = {
   *    collectionName: String,
   *    searchTerm: String
   *    sortField: String (field name)
   *    sortOrder: String (asc or desc)
   *    anchorValue: String (field value)
   *  }
   */
  Item.find = function(params, onSuccess, onFail) {
    $http({ url: '/searchItems', method: 'GET', params: params })
      .then(function success(response) {
        onSuccess(response.data.items);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  Item.loadItems = function(items) {
    Item.loadedItems = items;
  }

  Item.setSelectedItem = function(item) {
    Item.selectedItem = item;
  } 

  Item.loadedItems = [];
  Item.selectedItem = {};

  return Item;
}


// ############################## COLLECTION ############################## //


function Collection($http) {
  var Collection = {};

  Collection.getAll = function(onSuccess, onFail) {
    $http({ url: '/getAllCollections', method: 'GET'} )
      .then(function success(response) {
        onSuccess(response.data.collections);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  Collection.getOne = function(collectionName, onSuccess, onFail) {
    $http({ url: '/getOneCollection', method: 'GET', params: { collectionName: collectionName } })
      .then(function success(response) {
        onSuccess(response.data.collection);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  Collection.update = function (collection, onSuccess, onFail) {
    $http({ url: '/updateCollection', method: 'POST', data: {collection: collection } })
      .then(function success(response) {
        onSuccess(response.data.collections);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  Collection.create = function (collection, onSuccess, onFail) {
    $http({ url: '/createCollection', method: 'POST', data: {collection: collection } })
      .then(function success(response) {
        onSuccess(response.data.collections);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  return Collection;
}


// ############################## USER ############################## //


function User($http) {
  var User = {};

  User.create = function (newUser, onSuccess, onFail) {
    $http({ url: '/createUser', method: 'POST', data: {user: newUser} })
      .then(function success(response) {
        onSuccess(response.data);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  User.getAll = function(onSuccess, onFail) {
    $http({ url: '/getAllUsers', method: 'GET'})
      .then(function success(response) {
        onSuccess(response.data.users);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  User.getOne = function(userNumber, onSuccess, onFail) {
    $http({ url: '/getUser', method: 'GET', params: { userNumber: userNumber } })
      .then(function success(response) {
        onSuccess(response.data.user);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  User.update = function (updatedUser, onSuccess, onFail) {
    $http({ url: '/updateUser', method: 'POST', data: {user: updatedUser } })
      .then(function success(response) {
        onSuccess(response.data);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  User.delete = function (userIDs, onSuccess, onFail) {
    $http({ url: '/deleteUsers', method: 'POST', data: { users: userIDs } })
      .then(function success(response) {
        onSuccess(response.data);
      },
      function fail(response) {
        onFail();
      }
    );
  };

  User.setIsNewUser = function(trueFalse, onSuccess, onFail) {
    $http({ url: '/setIsNewUser', method: 'POST', data: { setIsNewUser: trueFalse } })
      .then(function success(response) {
        onSuccess(response);
      },
      function fail(response) {
        onFail(response);
      }
    );
  };

  User.updateMyAccount = function(updatedAccountInfo, onSuccess, onFail) {
    $http({ url: '/updateMyAccount', method: 'POST', data: { user: updatedAccountInfo.user, org: updatedAccountInfo.org }})
      .then(function success(response) {
        onSuccess(response);
      },
      function fail(response) {
        onFail(response);
      }
    );
  };

  return User;
}


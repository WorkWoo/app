exports.WORKABLE = getWorkableCollection();
exports.INVENTORIAL = getInventorialCollection();
exports.INVENTORIAL_BUNDLE = getInventorialBundleCollection();
exports.BASIC = getBasicCollection();

exports.getCollectionTypesObject = function () {
	var collectionTypesArray = this.getCollectionTypesArray();

	var collectionTypesObject = {};
	for (var i = 0 ; i < collectionTypesArray.length; ++i) {
		collectionTypesObject[collectionTypesArray[i].collectionType] = collectionTypesArray[i];
	}

	return collectionTypesObject;
};

exports.getCollectionTypesArray = function () {
	var collectionTypes = [];
	collectionTypes.push(this.WORKABLE);
	collectionTypes.push(this.INVENTORIAL);
	collectionTypes.push(this.INVENTORIAL_BUNDLE);
	collectionTypes.push(this.BASIC);
	
	return collectionTypes;
};

function getWorkableCollection() {
	var workableCollection = {};
	workableCollection.label = 'Your Work';
	workableCollection.collectionType = 'workable';
	workableCollection.name = '';
	workableCollection.displayField = 'name';
	workableCollection.pluralLabel = '';
	workableCollection.singleLabel = '';
	workableCollection.icon = 'fa-wrench';
	workableCollection.stateChoices = ['Open', 'In Progress', 'Complete', 'Cancelled'];
	workableCollection.referenceable = { 'workable' : true, 'revisionable' : true, 'inventorial' : true, 'basic' : true, 'inventorial_bundle' : true };

	var defaultFields = [];

	defaultFields.push({ 'displayType': 'autonumber', 'label': 'Number', 'name': 'number', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'state', 'label': 'State', 'choices': [], 'name': 'state', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'text', 'label': 'Title', 'name': 'title', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'itemReferenceList', 'label': 'Inventory Items', 'name': 'inventoryitems', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'textarea', 'label': 'Description', 'name': 'description', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': false });

	workableCollection.fields = defaultFields;

	return workableCollection;
};

function getInventorialCollection() {
	var inventorialCollection = {};
	inventorialCollection.label = 'Inventory';
	inventorialCollection.collectionType = 'inventorial';
	inventorialCollection.name = '';
	inventorialCollection.displayField = 'name';
	inventorialCollection.pluralLabel = '';
	inventorialCollection.singleLabel = '';
	inventorialCollection.icon = 'fa-cubes';
	inventorialCollection.referenceable = { 'workable' : false, 'revisionable' : false, 'inventorial' : false, 'basic' : true, 'inventorial_bundle' : false };

	var defaultFields = [];

	defaultFields.push({ 'displayType': 'autonumber', 'label': 'Number', 'name': 'number', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'number', 'label': 'Quantity', 'name': 'quantity', 'dbType': 'Number', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'text', 'label': 'Title', 'name': 'title', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'textarea', 'label': 'Description', 'name': 'description', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': false });

	inventorialCollection.fields = defaultFields;

	return inventorialCollection;
};

function getInventorialBundleCollection() {
	var inventorialBundleCollection = {};
	inventorialBundleCollection.label = 'Inventory Bundle';
	inventorialBundleCollection.collectionType = 'inventorial_bundle';
	inventorialBundleCollection.name = '';
	inventorialBundleCollection.displayField = 'name';
	inventorialBundleCollection.pluralLabel = '';
	inventorialBundleCollection.singleLabel = '';
	inventorialBundleCollection.icon = 'fa-object-group';
	inventorialBundleCollection.referenceable = { 'workable' : false, 'revisionable' : false, 'inventorial' : true, 'basic' : false, 'inventorial_bundle' : false };

	var defaultFields = [];

	defaultFields.push({ 'displayType': 'autonumber', 'label': 'Number', 'name': 'number', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'text', 'label': 'Title', 'name': 'title', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'textarea', 'label': 'Description', 'name': 'description', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': false });

	inventorialBundleCollection.fields = defaultFields;

	return inventorialBundleCollection;
};

function getBasicCollection() {
	var basicCollection = {};
	basicCollection.label = 'Basic Items';
	basicCollection.collectionType = 'basic';
	basicCollection.name = '';
	basicCollection.displayField = 'name';
	basicCollection.pluralLabel = '';
	basicCollection.singleLabel = '';
	basicCollection.icon = 'fa-pencil-square-o';
	basicCollection.referenceable = { 'workable' : true, 'revisionable' : false, 'inventorial' : true, 'basic' : false, 'inventorial_bundle' : false };

	var defaultFields = [];

	defaultFields.push({ 'displayType': 'autonumber', 'label': 'Number', 'name': 'number', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'text', 'label': 'Title', 'name': 'title', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'textarea', 'label': 'Description', 'name': 'description', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': false });

	basicCollection.fields = defaultFields;

	return basicCollection;
};
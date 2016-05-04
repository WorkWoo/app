exports.getCollectionTypesObject = function () {

	var collectionTypesArray = this.getCollectionTypesArray();

	var collectionTypesObject = {};

	for (var i = 0 ; i < collectionTypesArray.length; ++i) {
		collectionTypesObject[collectionTypesArray[i].defaults.collectionType] = collectionTypesArray[i];
	}

	return collectionTypesObject;
};

exports.getCollectionTypesArray = function () {
	var collectionTypes = [];
	collectionTypes.push(getWorkableCollection());
	collectionTypes.push(getRevisionableCollection());
	collectionTypes.push(getInventorialCollection());
	collectionTypes.push(getBasicCollection());

	return collectionTypes;
};

function getWorkableCollection() {
	var workableCollection = {};
	workableCollection.label = 'Workable';

	var defaults = {};
	defaults.collectionType = 'workable';
	defaults.name = '';
	defaults.displayField = 'name';
	defaults.pluralLabel = '';
	defaults.singleLabel = '';
	defaults.icon = 'fa-ellipsis-h';
	defaults.stateChoices = ['Open', 'In Progress', 'Complete', 'Cancelled'];

	var defaultFields = [];

	defaultFields.push({ 'displayType': 'autonumber', 'label': 'Number', 'name': 'number', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'state', 'label': 'State', 'choices': [], 'name': 'state', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'text', 'label': 'Name', 'name': 'name', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'textarea', 'label': 'Description', 'name': 'description', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': false });

	defaults.fields = defaultFields;
	workableCollection.defaults = defaults;

	return workableCollection;
}

function getRevisionableCollection() {
	var revisionableCollection = {};
	revisionableCollection.label = 'Revisionable';

	var defaults = {};
	defaults.collectionType = 'revisionable';
	defaults.name = '';
	defaults.displayField = 'name';
	defaults.pluralLabel = '';
	defaults.singleLabel = '';
	defaults.icon = 'fa-ellipsis-h';

	var defaultFields = [];

	defaultFields.push({ 'displayType': 'autonumber', 'label': 'Number', 'name': 'number', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'decimal', 'label': 'Revision', 'name': 'revision', 'dbType': 'Number', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'text', 'label': 'Name', 'name': 'name', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'textarea', 'label': 'Description', 'name': 'description', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': false });

	defaults.fields = defaultFields;
	revisionableCollection.defaults = defaults;

	return revisionableCollection;
}

function getInventorialCollection() {
	var inventorialCollection = {};
	inventorialCollection.label = 'Inventorial';

	var defaults = {};
	defaults.collectionType = 'inventorial';
	defaults.name = '';
	defaults.displayField = 'name';
	defaults.pluralLabel = '';
	defaults.singleLabel = '';
	defaults.icon = 'fa-ellipsis-h';

	var defaultFields = [];

	defaultFields.push({ 'displayType': 'autonumber', 'label': 'Number', 'name': 'number', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'number', 'label': 'Quantity', 'name': 'quantity', 'dbType': 'Number', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'text', 'label': 'Name', 'name': 'name', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'textarea', 'label': 'Description', 'name': 'description', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': false });

	defaults.fields = defaultFields;
	inventorialCollection.defaults = defaults;

	return inventorialCollection;

}

function getBasicCollection() {
	var basicCollection = {};
	basicCollection.label = 'Basic';

	var defaults = {};
	defaults.collectionType = 'basic';
	defaults.name = '';
	defaults.displayField = 'name';
	defaults.pluralLabel = '';
	defaults.singleLabel = '';
	defaults.icon = 'fa-ellipsis-h';

	var defaultFields = [];

	defaultFields.push({ 'displayType': 'autonumber', 'label': 'Number', 'name': 'number', 'dbType': 'String', 'showOnNew': false, 'showOnView': false, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'text', 'label': 'Name', 'name': 'name', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': true });
	defaultFields.push({ 'displayType': 'textarea', 'label': 'Description', 'name': 'description', 'dbType': 'String', 'showOnNew': true, 'showOnView': true, 'showOnList': true, 'required': true, 'readonly': false, 'sysProvided': false });

	defaults.fields = defaultFields;
	basicCollection.defaults = defaults;

	return basicCollection;

}
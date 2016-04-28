exports.getFieldTypesObject = function () {

	var fieldTypesArray = this.getFieldTypesArray();

	var fieldTypesObject = {};

	for (var i = 0 ; i < fieldTypesArray.length; ++i) {
		fieldTypesObject[fieldTypesArray[i].displayType] = fieldTypesArray[i];
	}

	return fieldTypesObject;
};

exports.getFieldTypesArray = function () {
	var fieldTypes = [
		{ displayType: 'text', label: 'Single Line Text', dbType: 'String' },
		{ displayType: 'textarea', label: 'Multi-Line Text', dbType: 'String' },
		{ displayType: 'number', label: 'Number', dbType: 'Number' },
		{ displayType: 'decimal', label: 'Decimal', dbType: 'Number' },		
		{ displayType: 'checkbox', label: 'Checkbox', dbType: 'Boolean' },
		{ displayType: 'datetime', label: 'Date/Time', dbType: 'Date' },
		{ displayType: 'phone', label: 'Phone Number', dbType: 'String' },
		{ displayType: 'currency', label: 'Currency', dbType: 'Number' },
		{ displayType: 'choice', label: 'Dropdown', dbType: 'String' },
		{ displayType: 'SingleUserReference', label: 'User (Pro only)', dbType: 'ObjectId', ref: 'users', isPro: true },
		{ displayType: 'ListUserReference', label: 'User List (Pro only)', dbType: 'ObjectId', ref: 'users', isPro: true },
		{ displayType: 'SingleItemReference', label: 'Item (Pro only)', dbType: 'ObjectId', isPro: true },
		{ displayType: 'ListItemReference', label: 'Item List (Pro only)', dbType: 'ObjectId', isPro: true }
	];

	return fieldTypes;

};
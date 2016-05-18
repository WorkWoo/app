var collectionType = require('../types/collectionType');
var workableType = collectionType.WORKABLE.collectionType;
var inventorialType = collectionType.INVENTORIAL.collectionType;
var inventorialBundleType = collectionType.INVENTORIAL_BUNDLE.collectionType;
var basicType = collectionType.BASIC.collectionType;

var industryChoices = [	{ name: 'Aerospace', value: 'manufacturing' },
						{ name: 'Automotive', value: 'consumerServices' },
						{ name: 'Consumer Goods', value: 'consumerGoods' },
						{ name: 'Consumer Services', value: 'consumerServices' },
						{ name: 'Education', value: 'consumerServices' },
						{ name: 'Entertainment', value: 'consumerServices' },
						{ name: 'Food & Beverage', value: 'consumerServices' },
						{ name: 'Graphic design', value: 'freelancer' },
						{ name: 'Health & Wellness', value: 'consumerServices' },
						{ name: 'Legal', value: 'consumerServices' },
						{ name: 'Manufacturing', value: 'manufacturing' },
						{ name: 'Photography', value: 'freelancer' },
						{ name: 'Real Estate', value: 'freelancer' },
						{ name: 'Retail', value: 'consumerGoods' },
						{ name: 'Social & Personal Services', value: '' },
						{ name: 'Technology', value: 'freelancer' },
						{ name: 'Transportation', value: 'consumerServices' },
						{ name: '-- Other --', value: 'consumerGoods' } ];

exports.getCollectionTemplates = function() {
	var collectionTemplates = {};
	collectionTemplates.manufacturing = getManufacturingTemplates();
	collectionTemplates.consumerGoods = getConsumerGoodsTemplates();
	collectionTemplates.consumerServices = getConsumerServicesTemplates();
	collectionTemplates.socialServices = getSocialServicesTemplates();
	collectionTemplates.freelancer = getFreelancerTemplates();

	return collectionTemplates;
};

exports.getIndustryChoices = function() {
	return industryChoices;
};

function getManufacturingTemplates() {
	var templates = [];

	templates.push({
		title: 'Full Setup',
        bestFor: 'Manufacturing organizations with complex products.',
        product: 'Your product is built from complex assemblies and parts.',
        collections: [	{ name: 'Build Orders', icon: 'fa-wrench', type: workableType, references: ['Assemblies'] },
						{ name: 'Assemblies', icon: 'fa-object-group', type: inventorialBundleType, references: ['Parts'] },
        				{ name: 'Parts', icon: 'fa-cog', type: inventorialType } ]
	});

	templates.push({
		title: 'Simple Product',
        bestFor: 'Manufacturing organizations with simple products that do not require sub-assemblies',
        product: 'Your product is built straight from raw materials or inventory items.',
        collections: [	{ name: 'Build Orders', icon: 'fa-wrench', type: workableType, references: ['Parts'] },
        				{ name: 'Parts', icon: 'fa-cog', type: inventorialType } ]
	});

	return templates;
};

function getConsumerGoodsTemplates() {
	var templates = [];

	templates.push({
		title: 'Full Setup',
        bestFor: 'High volume businesses that make on-demand products for other businesses or consumers.',
        work: 'You need a clear separation from customers invoices and the work your employees do.',
        product: 'Your product is built from inventory items.',
        collections: [	{ name: 'Product Orders', icon: 'fa-wrench', type: workableType, references: ['Invoices', 'Product Kits'] },
        				{ name: 'Invoices', icon: 'fa-credit-card', type: workableType },
        				{ name: 'Product Kits', icon: 'fa-object-group', type: inventorialBundleType, references: ['Inventory'] },
        				{ name: 'Inventory', icon: 'fa-cog', type: inventorialType } ]
	});

	templates.push({
		title: 'No Invoices',
        bestFor: "Businesses that still make on-demand products but don't need the complexity of seperate invoices.",
        work: "You and/or your employees work directly on orders and that's enough.",
        product: 'Your product is built from inventory items.',
        collections: [	{ name: 'Product Orders', icon: 'fa-wrench', type: workableType, references: ['Product Kits'] },
        				{ name: 'Product Kits', icon: 'fa-object-group', type: inventorialBundleType, references: ['Inventory'] },
        				{ name: 'Inventory', icon: 'fa-cog', type: inventorialType } ]
	});

	templates.push({
		title: 'Simple Product',
        bestFor: "Businesses that make products that are simple to make.",
        work: "The work you do can be tracked through customer invoices.",
        product: 'Your product is simple and is an inventory item itself.',
        collections: [	{ name: 'Invoices', icon: 'fa-credit-card', type: workableType, references: ['Inventory'] },
        				{ name: 'Inventory', icon: 'fa-cog', type: inventorialType } ]
	});

	return templates;
};

function getConsumerServicesTemplates() {
	var templates = [];

	templates.push({
		title: 'Full Setup',
        bestFor: 'Businesses that provide services to customers while using inventory items',
        collections: [	{ name: 'Service Orders', icon: 'fa-wrench', type: workableType, references: ['Invoices', 'Inventory'] },
        				{ name: 'Invoices', icon: 'fa-credit-card', type: workableType },
        				{ name: 'Inventory', icon: 'fa-cubes', type: inventorialType } ]
	});

	templates.push({
		title: 'No Inventory',
        bestFor: "Businesses that provide services but don't have inventory",
        collections: [	{ name: 'Service Orders', icon: 'fa-wrench', type: workableType, references: ['Invoices'] },
        				{ name: 'Invoices', icon: 'fa-credit-card', type: workableType } ]
	});

	return templates;
};

function getSocialServicesTemplates() {
	var templates = [];

	templates.push({
		title: 'Full Case Management',
        bestFor: "Social Service organizations that provide ongoing services to a set of clients.",
        work: "Your work day typically involves appointments that result in reports.",
        collections: [	{ name: 'Appointments', icon: 'fa-calendar', type: workableType },
        				{ name: 'Reports', icon: 'fa-pencil', type: workableType },
        				{ name: 'Cases', icon: 'fa-archive', type: workableType },
        				{ name: 'Clients', icon: 'fa-users', type: basicType } ]
	});

	return templates;
};

function getFreelancerTemplates() {
	var templates = [];

	templates.push({
		title: 'Freelancer',
        bestFor: 'Freelance workers that provide services to customers',
        collections: [	{ name: 'Work Requests', icon: 'fa-wrench', type: workableType, references: ['Invoices', 'Clients'] },
        				{ name: 'Invoices', icon: 'fa-credit-card', type: workableType },
        				{ name: 'Clients', icon: 'fa-users', type: basicType } ]
	});

	return templates;
};

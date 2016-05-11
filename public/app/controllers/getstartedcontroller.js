function getStartedController($scope, $location, $routeParams, GetStarted) {
  log.info('Get Started initialized');
  $scope.setActiveSection('settings');
 
  $scope.GetStarted = GetStarted;

  if(!$scope.GetStarted.industry) {
    $scope.GetStarted.industry = 'Consumer Goods';
  }

  $scope.GetStartedTemplates = {
    'Manufacturing': [
      { title: 'Full Setup',
        bestFor: 'Manufacturing organizations with complex products.',
        product: 'Your product is built from complex assemblies and parts.',
        workable: [{ name: 'Build Orders', icon: 'fa-wrench', references: ['Assemblies'] }, { name: 'spacer' }],
        inventorial_bundle: [{ name: 'Assemblies', icon: 'fa-object-group', references: ['Parts'] }, { name: 'spacer' }],
        inventorial: [{ name: 'Parts', icon: 'fa-cog' }],
        basic: [] },

      { title: 'Simple Product',
        bestFor: 'Manufacturing organizations with simple products that do not require sub-assemblies',
        product: 'Your product is built straight from raw materials or inventory items.',
        workable: [{ name: 'Build Orders', icon: 'fa-wrench', references: ['Parts'] }, { name: 'spacer' }],
        inventorial_bundle: [],
        inventorial: [{ name: 'Parts', icon: 'fa-cog' }],
        basic: [] }
    ],

    'Consumer Goods': [
      { title: 'Full Setup',
        bestFor: 'High volume businesses that make on-demand products for other businesses or consumers.',
        work: 'You need a clear separation from customers invoices and the work your employees do.',
        product: 'Your product is built from inventory items.',
        workable: [{ name: 'Invoices', icon: 'fa-credit-card' }, { name: 'spacer' }, { name: 'Product Orders', icon: 'fa-wrench', references: ['Invoices', 'Product Kits'] }, { name: 'spacer' }],
        inventorial_bundle: [{ name: 'Product Kits', icon: 'fa-object-group', references: ['Inventory'] }, { name: 'spacer' }],
        inventorial: [{ name: 'Inventory', icon: 'fa-cog' }],
        basic: [] },

      { title: 'No Invoices',
        bestFor: "Businesses that still make on-demand products but don't need the complexity of seperate invoices.",
        work: "You and/or your employees work directly on orders and that's enough.",
        product: 'Your product is built from inventory items.',
        workable: [{ name: 'Product Orders', icon: 'fa-wrench', references: ['Product Kits'] }, { name: 'spacer' }],
        inventorial_bundle: [{ name: 'Product Kits', icon: 'fa-object-group', references: ['Inventory'] }, { name: 'spacer' }],
        inventorial: [{ name: 'Inventory', icon: 'fa-cog' }],
        basic: [] },

      { title: 'Simple Product',
        bestFor: "Businesses that make products that are simple to make.",
        work: "The work you do can be tracked through customer invoices.",
        product: 'Your product is simple and is an inventory item itself.',
        workable: [{ name: 'Invoices', icon: 'fa-credit-card', references: ['Inventory'] }, { name: 'spacer' }],
        inventorial_bundle: [],
        inventorial: [{ name: 'Inventory', icon: 'fa-cog' }],
        basic: [] },

    ],

    'Consumer Services': [
      { title: 'Full Setup',
        bestFor: 'Businesses that provide services to customers while using inventory items',
        workable: [{ name: 'Invoices', icon: 'fa-credit-card' }, { name: 'spacer' }, { name: 'Service Orders', icon: 'fa-wrench', references: ['Invoices'] }, { name: 'spacer' }],
        inventorial_bundle: [],
        inventorial: [{ name: 'Inventory', icon: 'fa-cubes' }],
        basic: [] },

      { title: 'No Inventory',
        bestFor: "Businesses that provide services but don't have inventory",
        workable: [{ name: 'Invoices', icon: 'fa-credit-card' }, { name: 'spacer' }, { name: 'Service Orders', icon: 'fa-wrench', references: ['Invoices'] }, { name: 'spacer' }],
        inventorial_bundle: [],
        inventorial: [],
        basic: [] }
    ],

    'Social Services': [
      {
        title: 'Full Case Management',
        bestFor: "Social Service organizations that provide ongoing services to a set of clients.",
        work: "Your work day typically involves appointments that result in reports.",
        workable: [{ name: 'Cases', icon: 'fa-archive' }, { name: 'spacer' }, { name: 'Reports', icon: 'fa-pencil' }, { name: 'spacer' }, { name: 'Appointments', icon: 'fa-calendar' }, { name: 'spacer' }],
        inventorial_bundle: [],
        inventorial: [],
        basic: [{ name: 'Clients', icon: 'fa-users' }] }
    ],

    'Freelance': [
      { title: 'Freelancer',
        bestFor: 'Freelance workers that provide services to customers',
        workable: [{ name: 'Invoices', icon: 'fa-credit-card' }, { name: 'spacer' }, { name: 'Work Requests', icon: 'fa-wrench' }, { name: 'spacer' }],
        inventorial_bundle: [],
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

  $scope.submitTemplate = function() {
    $scope.changeView('account/collections/getstarted/finalize');
    
    var selectedTemplate = $scope.GetStarted.selectedTemplate;

    var workableItems = selectedTemplate.workable;


/*
var templateSetup = [
    { name: "Parts", icon: "fa-cog" },
    { name: "Assemblies", icon: "fa-object-group", references: ['Parts']},
    { name: "Build Orders", icon: "fa-wrench", references: ['Assemblies'] },
]
*/


  }

}
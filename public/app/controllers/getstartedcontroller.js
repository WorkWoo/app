function getStartedController($scope, $location, $routeParams, GetStarted) {
  log.info('Get Started initialized');
  $scope.setActiveSection('settings');
 
  $scope.GetStarted = GetStarted;

  $scope.industryChoices = [  { name: 'Aerospace', value: 'manufacturing' },
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

 
  $scope.setSelectedTemplate = function(templateIndex) {
    $scope.GetStarted.selectedTemplate = $scope.GetStarted.collectionTemplates[$scope.GetStarted.selectedIndustry.value][templateIndex];
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
    $scope.setPageLoading(true);

    GetStarted.submitTemplate(
      function(updatedCollections){
        //$scope.collections = updatedCollections;
        //$scope.selectedCollection = {};
        //$scope.currentAction = null;
        $scope.setPageLoading(false);
        //$scope.changeView('/');
        //location.reload();
      }, 
      function() {
        $scope.setPageLoading(false);
      }
    );
  }


  $scope.initializeCollectionTemplateController = function() {
    $scope.setPageLoading(true);
    GetStarted.getCollectionTemplates(
      function(url){
        $scope.setPageLoading(false);
        if (url) {
          $scope.changeView('account/collections/getstarted/step1');
        }
      }, 
      function() {
        $scope.setPageLoading(false);
      }
    );
  }

  $scope.initializeCollectionTemplateController();
}
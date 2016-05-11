function getStartedController($scope, $location, $routeParams, GetStarted) {
  log.info('Get Started initialized');
  $scope.setActiveSection('settings');
 
  $scope.GetStarted = GetStarted;
 
  $scope.setSelectedTemplate = function(templateIndex) {
    $scope.GetStarted.selectedTemplate = $scope.collectionTemplates[$scope.GetStarted.selectedIndustry][templateIndex];
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
    
    log.info("Industry: " +  $scope.GetStarted.selectedIndustry);
    log.info("Template: " + $scope.GetStarted.selectedTemplate.title);
  }


  $scope.initializeCollectionTemplateController = function() {
    $scope.setPageLoading(true);
    if (!$scope.collectionTemplates) {
      GetStarted.getCollectionTemplates(
        function(templates){
          $scope.collectionTemplates = templates;
          $scope.setPageLoading(false);
        }, 
        function() {
          $scope.setPageLoading(false);
        }
      );
    };
  }

  $scope.initializeCollectionTemplateController();
}
var tourConfig = {};
tourConfig.templates = {};
tourConfig.templates.title = 
'<div id="ng-joyride-title-tplv1">' +
  '<div class="ng-joyride sharp-borders intro-banner" style="">' +
    '<div class="popover-inner">' +
      '<h2 class="popover-title sharp-borders">{{heading}}</h2>' +
      '<div class="popover-content container-fluid">' +
        '<div ng-bind-html="content"></div>' +
        '<hr>' +
        '<div class="row">' +
          '<div class="col-md-4 skip-class">' +
            '<a class="skipBtn pull-left" type="button"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp; Skip Tour</a>' +
          '</div>' +
          '<div class="col-md-8">' +
            '<div class="pull-right">' +
              '<button id="nextTitleBtn" class="nextBtn btn btn-primary" type="button">Next&nbsp;<i class="glyphicon glyphicon-chevron-right"></i></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
'</div>';

tourConfig.getMainTourConfig = function($scope) {
  var config = [];
  config.push({ type: "title",
                heading: "Welcome to the WorkWoo tour!",
                text: '<div id="title-text" class="col-md-12">This tour will walk you through the features of WorkWoo:</div><br/>' +
                        '<span class="small">' +
                          '<em><ul>' +
                                '<li>Managing your work settings</li>' +
                                '<li>Creating your first work item</li>' +
                                '<li>Managing your users</li>' +
                          '</ul></em>' +
                        '</span>' +
                      '</div>',       
                titleTemplate: 'tour-title'
              });

  config.push({ type: "function", fn: function() { $scope.leftMenuClick('work'); } });
  config.push({ type: "element",
                selector: "#workMenuItem",
                text: "This is where you can see all your work sorted by state; but, more on this later.",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });
  config.push({ type: "function", fn: function() { $scope.leftMenuClick('work'); } });

  config.push({ type: "function", fn: function() { $scope.leftMenuClick('support'); } });
  config.push({ type: "element",
                selector: "#supportMenuItem",
                text: "This is where you can ask us any questions. We provide 24/7 support!",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });
  config.push({ type: "function", fn: function() { $scope.leftMenuClick('support'); } });

  config.push({ type: "element",
                selector: "#accountMenuItem",
                text: "Now let's start setting up WorkWoo the way you want. <br><br><span class='small'><em>Click the settings icon to access your WorkWoo settings</em></span>",
                placement: "auto right",
                advanceOn: {element: '#accountMenuItem', event: 'click'},
                attachToBody: "true",
                scroll: true,
                elementTemplate: advanceOnTemplate
              });

  config.push({ type: "element",
                selector: "#workSettings",
                text: "This is where you access your Work Settings.<br><br><span class='small'><em>Click on the wrench icon to view your current Work Settings.</em></span>",
                placement: "auto right",
                advanceOn: {element: '#workSettings', event: 'click'},
                attachToBody: "true",
                scroll: true,
                elementTemplate: advanceOnTemplate
              });

  config = config.concat(this.getWorkSettingsTourConfig($scope));

  return config;
}

tourConfig.getWorkSettingsTourConfig = function($scope) {
  var config = [];
  config.push({ type: "title",
                heading: "Work Settings",
                text: '<div id="title-text" class="col-md-12">Managing your Workable Items:</div><br/>' +
                        '<span class="small">' +
                          '<em><ul>' +
                                '<li>What is your workable item?</li>' +
                                '<li>What is the lifecycle (state model) of your work?</li>' +
                                '<li>And finally, what information makes up your Workable Item?</li>' +
                              '</ul></em>' +
                        '</span>' +
                      '</div>',         
                titleTemplate: 'tour-title'
              });
  
  config.push({ type: "element",
                selector: "#collectionNameContainer",
                text: "What do you call your Workable Item?<br><span class='small'><em>Provide a name and click Next when done.</em></span>",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });

  config.push({ type: "element",
                selector: "#numberPrefixContainer",
                text: "All Workable Items within WorkWoo are numbered with a prefix (ex: WO134563). What prefix would you like to use for this Workable Item?<br><span class='small'><em>Provide a prefix and click Next when done.</em></span>",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });

  config.push({ type: "element",
                selector: "#stateContainer",
                text: "Workable Items in WorkWoo have a state model. We've provided some standard states; however, you can customize it to your business. <br><span class='small'><em>Click on the <span class='fa fa-plus'></span> Add State button to add a new state<br>Click on the <i class='fa fa-remove'></i> button to remove a state<br><br>Click next when done.</em></span>",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });

  config.push({ type: "element",
                selector: "#customFieldsContainer",
                text: "What information makes up your Workable Item? There are many different types of fields you can choose from. <br><br><span class='small'><em>Click on the <span class='fa fa-plus'></span> Add New Field button to add a new field<br><br>Choose your field type in the dropdown<br><br>You can even have a dropdown field with options you define. Try it out by choosing \"Dropdown with option\" as the field type and clicking on the <i class='fa fa-bars'></i> Show Options button.<br><br>Click on the <i class='fa fa-remove'></i> button to remove a field<br><br>Click next when done.</em></span>",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });

  config.push({ type: "element",
                selector: "#saveChangesButton",
                text: "Click the Save Changes button",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                advanceOn: {element: '#saveChangesButton', event: 'click'},
                elementTemplate: advanceOnTemplate
              });

  return config;
}

function advanceOnTemplate(content, isEnd) {
      return '<div class=\"row\">' +
            '<div id=\"pop-over-text\" class=\"col-md-12\">' +
            content +
            '</div>' +
            '</div>' +
            '<hr>' +
            '<div class=\"row\">' +
            '<div class=\"col-md-8 center\">' +
            '<a class=\"skipBtn pull-left\" type=\"button\">Skip Tour</a>' +
            '</div>' +
            '<div class=\"col-md-4\">' +
            '<div class=\"pull-right\">' +
            '<button id=\"prevBtn\" class=\"prevBtn btn btn-xs \" type=\"button\">Previous</button>' +
            '<button id=\"nextBtn\" class=\"nextBtn btn btn-xs btn-primary\" type=\"button\" style=\"display: none;\"></button>' +
            '</div>' +
            '</div>' +
            '</div>';
}

function customElementTemplate(content, isEnd) {
  return '<div class=\"row\">' +
            '<div id=\"pop-over-text\" class=\"col-md-12\">' +
            content +
            '</div>' +
            '</div>' +
            '<hr>' +
            '<div class=\"row\">' +
            '<div class=\"col-md-5 center\">' +
            '<a class=\"skipBtn pull-left\" type=\"button\">Skip Tour</a>' +
            '</div>' +
            '<div class=\"col-md-7\">' +
            '<div class=\"pull-right\">' +
            '<button id=\"prevBtn\" class=\"prevBtn btn btn-xs \" type=\"button\">Previous</button>' +
            '<button id=\"nextBtn\" class=\"nextBtn btn btn-xs btn-primary\" type=\"button\">' + _generateTextForNext(isEnd) + '</button>' +
            '</div>' +
            '</div>' +
            '</div>';
}

function _generateTextForNext(isEnd) {
  if (isEnd) { return 'Finish'; } 
  else { return 'Next'; }
}


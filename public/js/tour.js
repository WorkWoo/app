var tourConfig = {};
tourConfig.templates = {};
tourConfig.templates.title = 
'<div id="ng-joyride-title-tplv1">' +
  '<div class="ng-joyride sharp-borders intro-banner" style="">' +
    '<div class="popover-inner">' +
      '<h2 class="popover-title sharp-borders">{{heading}}</h2>' +
      '<div class="popover-content container-fluid">' +
        '<div ng-bind-html="content"></div>' +
        '<span class="col-md-12"><hr></span>' +
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
                text: '<div id="title-text" class="col-md-12">Configure WorkWoo for your business (It\'s fast and easy, we promise!)</div>' +
                        '<div class="small col-md-12">' +
                          '<em><ul>' +
                                '<li>Defining and customizing your Workable Items</li>' +
                                '<li>Creating your very first Workable Item</li>' +
                          '</ul>' +
                          '<div class="alert alert-info alert-info-tour">Tip: You may skip this tour by clicking the link below. You can always access this tour later by clicking the <i class="fa fa-bars" /> icon at the top right corner</div>' +
                        '</div></em>',       
                titleTemplate: 'tour-title'
              });

  config.push({ type: "function", fn: function() { $scope.leftMenuClick('work'); } });
  config.push({ type: "element",
                selector: "#workMenuItemD",
                heading: "Navigation: The <i class='fa fa-home' /> Icon",
                text: "Clicking the <i class='fa fa-home' /> Icon will bring you to all your Workable Items sorted by state. We will explore this section later once we create your first Workable Item; " + 
                      "so, for now let's continue on our tour.",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });
  config.push({ type: "function", fn: function() { $scope.leftMenuClick('work'); } });

  config.push({ type: "function", fn: function() { $scope.leftMenuClick('support'); } });
  config.push({ type: "element",
                selector: "#supportMenuItemD",
                heading: "Navigation: The <i class='fa fa-question-circle' /> Icon",
                text: "Need help? Want to provide feedback? Have an idea for a new feature? Clicking the <i class='fa fa-question-circle' /> Icon will bring you to our help section. " + 
                      "We welcome any questions or feedback from our customers plus we provide 24/7 support!",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });
  config.push({ type: "function", fn: function() { $scope.leftMenuClick('support'); } });

  config.push({ type: "element",
                selector: "#accountMenuItemD",
                heading: "Navigation: The <i class='fa fa-cog' /> Icon",
                text: "Now let's start setting up WorkWoo the way you want. <div class='alert alert-success alert-success-tour'><em>Click the <i class='fa fa-cog' /> icon to access your WorkWoo Settings</em></div>",
                placement: "auto right",
                advanceOn: {element: '#accountMenuItemD', event: 'click'},
                attachToBody: "true",
                scroll: true,
                elementTemplate: advanceOnTemplate
              });

  config.push({ type: "function", fn: function() { $scope.leftMenuClick('account'); } });

  config.push({ type: "element",
                selector: "#workSettings",
                heading: "Your <i class='fa fa-cog' /> WorkWoo Settings",
                text: "This section contains your WorkWoo Settings (Account, Users, etc.); however, right now we are on a mission to create your first Workable Item; so, let's move on." + 
                      "<div class='alert alert-success alert-success-tour'><em>Click the <i class='fa fa-wrench' /> icon to configure your Workable Items.</em></div>",
                placement: "auto top",
                advanceOn: {element: '#workSettings', event: 'click'},
                attachToBody: "true",
                scroll: true,
                elementTemplate: advanceOnTemplate
              });

  if (!$scope.currentUser.org.primaryCollection) {
    config.push({ type: "function", fn: function() { return; } });
    config.push({ type: "element",
                selector: "#setUpNow",
                heading: "Your <i class='fa fa-wrench' /> Workable Items",
                text: "Oh no, looks like you have no Workable Items yet. Let's fix that now!" + 
                      "<div class='alert alert-success alert-success-tour'><em>Click </em><span class='btn-success-tour'>Set Up Now</span><em> to create your first Workable Item.</em></div>",
                placement: "auto top",
                advanceOn: {element: '#setUpNow', event: 'click'},
                attachToBody: "true",
                scroll: true,
                elementTemplate: advanceOnTemplate
              });
  } else {
    config.push({ type: "function", fn: function() { return; } });
    config.push({ type: "element",
                selector: "#0_workSettings",
                heading: "Your <i class='fa fa-wrench' /> Workable Items",
                text: "Looks like there are Workable Items already defined. Let's dive into one to learn how you can update your items." + 
                      "<div class='alert alert-success alert-success-tour'><em>Click on the highlighted Workable Item.</em></div>",
                placement: "auto top",
                advanceOn: {element: '#0_workSettings', event: 'click'},
                attachToBody: "true",
                scroll: true,
                elementTemplate: advanceOnTemplate
              });
  }

  config = config.concat(this.getWorkSettingsTourConfig($scope));

  return config;
}

tourConfig.getWorkSettingsTourConfig = function($scope) {
  var config = [];
  config.push({ type: "title",
                heading: "Workable Items",
                text: '<div id="title-text" class="col-md-12">Defining and Customizing Workable Items:</div>' +
                        '<div class="small col-md-12">' +
                          '<em><ul>' +
                                '<li>What is your Workable Item?</li>' +
                                '<li>What is the state model of your work?</li>' +
                                '<li>And finally, what information makes up your Workable Item?</li>' +
                          '</ul>' +
                          '<div class="alert alert-info alert-info-tour">Tip: We will be creating a brand new Workable Item. Don\'t worry if you forget to add a state or a field; you can always come back and modify your items!</div>' +
                        '</div></em>',   
                titleTemplate: 'tour-title'
              });
  
  config.push({ type: "element",
                selector: "#collectionNameContainer",
                heading: "Workable Item Name",
                text: "What do you call your Workable Item? This is the main identifier for items of this type.<div class='alert alert-success alert-success-tour'><em>Enter a name and click Next when done.</em></div>",
                placement: "auto top",
                attachToBody: "true",
                scroll: false,
                elementTemplate: customElementTemplate
              });

  config.push({ type: "element",
                selector: "#numberPrefixContainer",
                heading: "Workable Item Prefix",
                text: "All Workable Items within WorkWoo are numbered with a prefix (ex: <font color='#67A88C'><b><u>WO</u></b></font>134563). What prefix would you like to use for this Workable Item?" + 
                      "<div class='alert alert-success alert-success-tour'><em>Enter a prefix and click Next when done.</em></div>",
                placement: "auto top",
                attachToBody: "true",
                scroll: false,
                elementTemplate: customElementTemplate
              });

  config.push({ type: "element",
                selector: "#stateContainer",
                heading: "Workable Item State Model",
                text: "Workable Items in WorkWoo have a state model. We've provided some standard states; however, you can customize it to your business." + 
                      "<div class='alert alert-info alert-info-tour'><em>Click </em><span class='btn-success-tour'><span class='fa fa-plus'></span> Add State </span><em> to add a new state.<br><br>" + 
                      "Click <i class='fa fa-remove removeChoiceIconTour'></i> to remove a state.</em></div>" +
                      "<div class='alert alert-success alert-success-tour'><em>Try adding or changing the state model and click Next when done.</em></div>",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });

  config.push({ type: "element",
                selector: "#customFieldsContainer",
                heading: "Workable Item Fields",
                text: "What information makes up your Workable Item? There are many types of fields to choose from." + 
                      "<div class='alert alert-info alert-info-tour'><em>Click </em><span class='btn-success-tour'><span class='fa fa-plus'></span> Add New Field </span><em> to add a new field.<br><br>" + 
                      "Enter a name and choose a type in the dropdown.<br><br>" + 
                      "Click <i class='fa fa-remove removeChoiceIconTour'></i> to remove a field.</em></div>" + 
                      "<div class='alert alert-info alert-info-tour'><em>You can even create a dropdown field with choices you define. Try it out by choosing \"Dropdown\" as the field type and clicking </em>" + 
                      "<span class='btn-success-tour'><i class='fa fa-bars'></i> Edit Choices</span></div>" + 
                      "<div class='alert alert-success alert-success-tour'><em>Try adding or changing fields and click Next when done.</em></div>",
                placement: "auto right",
                attachToBody: "true",
                scroll: true,
                elementTemplate: customElementTemplate
              });

  config.push({ type: "element",
                selector: "#saveChangesButton",
                heading: "Saving your Changes",
                text: "Thanks for sticking around with us and making it this far!" + 
                "<div class='alert alert-info alert-info-tour'><em>Click </em><span class='btn-primary-tour'>Save Changes</span><em> to save your Workable Item.</em></div>",
                placement: "auto bottom",
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


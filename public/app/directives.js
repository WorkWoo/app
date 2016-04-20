/*
 * Date/Time Picker
 */
var dateTimePicker = function () {
	var format = 'MM/DD/YYYY hh:mm A';

	return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function (scope, element, attributes, ctrl) {
            if (scope.selectedItem[attributes.dateTimePicker]) {
                ctrl.$setViewValue(moment(scope.selectedItem[attributes.dateTimePicker]).format(format));
                ctrl.$render();
            }

            var parent = $(element).parent();
	    	var dtp2 = $(element).datetimepicker({
                format: format,
                showTodayButton: true
            });

            var dtp = parent.datetimepicker({
                format: format,
                showTodayButton: true
            });

            dtp.on("dp.change", function (e) {
                ctrl.$setViewValue(moment(e.date).format(format));
                scope.$apply();
            });

            dtp2.on("dp.change", function (e) {
                ctrl.$setViewValue(moment(e.date).format(format));
                scope.$apply();
            });             
	    }
	};
};


var currencyField = function ($filter) {
    return {
        require: '^ngModel',
        scope: true,
        link: function (scope, element, attributes, ctrl) {

            function formatter(value) {
                value = value ? parseFloat(value.toString().replace(/[^0-9._-]/g, '')) || 0 : 0;
                var formattedValue = $filter('currency')(value);
                element.val(formattedValue);
                
                ctrl.$setViewValue(value);
                scope.$apply();

                return formattedValue;
            }

            ctrl.$formatters.push(formatter);

            element.bind('blur', function () {
                formatter(element.val());
            });
        }  
    };
};

currencyField.$inject = ['$filter'];
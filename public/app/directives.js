// No directives yet

var dateTimePicker = function () {
	var format = 'MM/DD/YYYY hh:mm A';

	return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function (scope, element, attributes, ctrl) {
            if (scope.item[attributes.dateTimePicker]) {
                ctrl.$setViewValue(moment(scope.item[attributes.dateTimePicker]).format(format));
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
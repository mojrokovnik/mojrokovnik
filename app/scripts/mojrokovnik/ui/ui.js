'use strict';

datetimePicker.$inject = [];
function datetimePicker() {
    return {
        scope: {
            model: '='
        },
        link: function (scope, elem, attr, ctrl) {
            elem.datetimepicker({
                format: 'MMMM Do YYYY, HH:mm',
                inline: true,
                sideBySide: true,
                defaultDate: scope.model
            });

            elem.on('dp.change', function (e) {
                scope.model = e.date._d;
                scope.$apply();
            });
        }
    };
}

angular.module('mojrokovnik.ui', [])
        .directive('mrDatetimePicker', datetimePicker);
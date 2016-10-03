    'use strict';

datetimePicker.$inject = [];
function datetimePicker() {
    return {
        scope: {
            ngModel: '='
        },
        link: function (scope, elem, attr, ctrl) {
            elem.datetimepicker({
                format: 'DD-MM-YYYY HH:mm',
                sideBySide: true,
                defaultDate: scope.ngModel,
                icons: {
                    time: 'fa fa-clock-o',
                    date: 'fa fa-calendar',
                    up: 'fa fa-chevron-up',
                    down: 'fa fa-chevron-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-screenshot',
                    clear: 'fa fa-trash',
                    close: 'fa fa-remove'
                }
            });
        }
    };
}

angular.module('mojrokovnik.ui', [])
        .directive('mrDatetimePicker', datetimePicker);

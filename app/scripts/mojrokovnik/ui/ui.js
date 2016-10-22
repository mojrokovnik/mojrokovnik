/* global moment */

'use strict';

datetimePicker.$inject = [];
function datetimePicker() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            elem.datetimepicker({
                format: 'DD-MM-YYYY HH:mm',
                sideBySide: true,
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

            elem.on('dp.change', function (e) {
                ngModel.$setViewValue(moment(e.date).format('DD-MM-YYYY HH:mm'));
            });
        }
    };
}

filterDatetime.$inject = [];
function filterDatetime() {
    return function (input, format) {
        return moment(input).format(format);
    };
}

angular.module('mojrokovnik.ui', [])
        .directive('mrDatetimePicker', datetimePicker)
        .filter('datetime', filterDatetime);

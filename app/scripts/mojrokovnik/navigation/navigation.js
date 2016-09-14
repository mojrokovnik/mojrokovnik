'use strict';

mrMainNavitagion.$inject = ['$location'];
function mrMainNavitagion($location) {
    return {
        templateUrl: 'assets/templates/navigation.html',
        link: function (scope, elem) {
            scope.isCurrentPath = function (value) {
                return $location.$$path === value;
            };
        }
    };
}


angular.module('mojrokovnik.navigation', [])
        .directive('mrMainNavigation', mrMainNavitagion);
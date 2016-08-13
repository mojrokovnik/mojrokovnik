'use strict';

mrMainNavitagion.$inject = ['$location', 'authentification'];
function mrMainNavitagion($location, authentification) {
    return {
        templateUrl: 'assets/templates/navigation.html',
        link: function (scope, elem) {
            if (!authentification.isLoggedIn()) {
                elem.hide();
            };

            scope.isCurrentPath = function (value) {
                return $location.$$path === value;
            };
        }
    };
}


angular.module('mojrokovnik.navigation', [])
        .directive('mrMainNavigation', mrMainNavitagion);
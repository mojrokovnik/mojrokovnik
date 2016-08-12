'use strict';

mrMainNavitagion.$inject = ['$location', 'authentification'];
function mrMainNavitagion($location, authentification) {
    return {
        templateUrl: 'assets/templates/navigation.html',
        link: function (scope) {
            scope.visible = authentification.isLoggedIn();
            scope.isCurrentPath = function (value) {
                return $location.$$path === value;
            };
        }
    };
}


angular.module('mojrokovnik.navigation', [])
        .directive('mrMainNavigation', mrMainNavitagion);
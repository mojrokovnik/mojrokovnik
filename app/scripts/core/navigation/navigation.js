'use strict';

mrMainNavitagion.$inject = ['$location', '$cookies', '$rootScope'];
function mrMainNavitagion($location, $cookies, $rootScope) {
    return {
        templateUrl: 'assets/templates/navigation.html',
        link: function (scope) {
            scope.isCurrentPath = function (value) {
                return $location.$$path === value;
            };

            scope.logout = function () {
                $cookies.remove('token');
                $cookies.remove('user');
                $location.url('/login');
            };
        }
    };
}


angular.module('mojrokovnik.navigation', [])
        .directive('mrMainNavigation', mrMainNavitagion);
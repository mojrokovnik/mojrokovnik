'use strict';

mrMainNavitagion.$inject = ['$location', '$cookies', '$window'];
function mrMainNavitagion($location, $cookies, $window) {
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
                $window.location.reload();
            };
        }
    };
}


angular.module('mojrokovnik.navigation', [])
        .directive('mrMainNavigation', mrMainNavitagion);
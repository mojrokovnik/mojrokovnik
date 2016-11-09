'use strict';

angular.module('mojrokovnik', [
    'ngRoute', 'ngCookies', 'ngAnimate',
    'pascalprecht.translate',

    'mojrokovnik.authentification',
    'mojrokovnik.api',
    'mojrokovnik.api.token',
    'mojrokovnik.login',
    'mojrokovnik.navigation',
    'mojrokovnik.notify',
    'mojrokovnik.translate',
    'mojrokovnik.ui',
    'mojrokovnik.ui.calendar',
    'mojrokovnik.ui.modalDialog',
    'mojrokovnik.ui.typeahead',
    'mojrokovnik.ui.editor',
    'mojrokovnik.livechat',

    'mojrokovnik.clients',
    'mojrokovnik.calendar',
    'mojrokovnik.cases',
    'mojrokovnik.documents'
])

.config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.otherwise({redirectTo: '/clients'});

        $routeProvider.when('/login', {
            templateUrl: 'assets/templates/login.html'
        });
        $routeProvider.when('/clients', {
            templateUrl: 'assets/templates/clients.html'
        });
        $routeProvider.when('/cases', {
            templateUrl: 'assets/templates/cases.html'
        });
        $routeProvider.when('/calendar', {
            templateUrl: 'assets/templates/calendar.html'
        });
    }

])

.config(function ($animateProvider) {
    $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);

})

.run(function ($rootScope, $location, authentification) {
    $rootScope.loading = true;

    $rootScope.$on('$routeChangeStart', function () {
        if (!authentification.isLoggedIn()) {
            $rootScope.loginPage = true;
            $location.url('/login');
        }
    });
});
'use strict';

mojrokovnikAuth.$inject = ['api', '$cookies'];
function mojrokovnikAuth(api, $cookies) {
    var self = this;

    api('users').fetch().then(function (user) {
        if (user) {
            self.user = user;
        }
    });

    this.getUser = function () {
        return self.user;
    };

    this.isLoggedIn = function () {
        return !!$cookies.getObject('user');
    };
}

angular.module('mojrokovnik', [
    'ngRoute',
    'ngCookies',
    'pascalprecht.translate',
    'mojrokovnik.api',
    'mojrokovnik.login',
    'mojrokovnik.navigation',
    'mojrokovnik.notify',
//    'mojrokovnik.translate',
    'mojrokovnik.ui',
    'mojrokovnik.clients',
    'mojrokovnik.calendar',
    'mojrokovnik.cases'
])

.service('authentification', mojrokovnikAuth)

.config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');

        $routeProvider.otherwise({redirectTo: '/client'});

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
]);
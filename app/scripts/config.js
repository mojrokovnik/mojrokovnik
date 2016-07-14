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

mojrokovnikConf.$inject = ['$routeProvider'];
function mojrokovnikConf($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/clients'});
    $routeProvider.when('/login', {
        templateUrl: 'scripts/mojrokovnik/login/login.html'
    });
    $routeProvider.when('/clients', {
        templateUrl: 'scripts/mojrokovnik-clients/clients.html'
    });
    $routeProvider.when('/cases', {
        templateUrl: 'scripts/mojrokovnik-cases/cases.html'
    });
    $routeProvider.when('/calendar', {
        templateUrl: 'scripts/mojrokovnik-calendar/calendar.html'
    });
}

angular.module('mojrokovnik', [
    'ngRoute', 'ngCookies', 'pascalprecht.translate',
    'mojrokovnik.api',
    'mojrokovnik.login',
    'mojrokovnik.navigation',
    'mojrokovnik.notify',
    'mojrokovnik.translate',
    'mojrokovnik.ui',

    'mojrokovnik.clients',
    'mojrokovnik.calendar',
    'mojrokovnik.cases'
])
.service('authentification', mojrokovnikAuth)
.config(['$routeProvider', mojrokovnikConf])
.run(function ($rootScope, $location, authentification) {

    $rootScope.$on('$routeChangeStart', function (event, next) {
        if (!authentification.isLoggedIn()) {
            $location.url('/login');
        }
    });

});
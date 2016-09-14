'use strict';

mrLogin.$inject = [];
function mrLogin() {
    return {
        controller: mrLoginCtrl,
        link: function (scope, elem, attr, ctrl) {
            elem.find('.toggle').on('click', function () {
                elem.find('.container').stop().addClass('active');
            });

            elem.find('.close').on('click', function () {
                elem.find('.container').stop().removeClass('active');
            });
        }
    };
}

mrLoginCtrl.$inject = ['$location', '$scope', '$cookies', 'api', 'authentification'];
function mrLoginCtrl($location, $scope, $cookies, api, authentification) {
    $scope.login = function (login) {
        api().login(login.username, login.password).then(function () {
            authentification.getActiveUser().then(function (user) {
                $cookies.putObject('user', user);
                $location.url('/clients');
            });
        });
    };
}

angular.module('mojrokovnik.login', [])
        .directive('mrLogin', mrLogin)
        .controller('mrLoginCtrl', mrLoginCtrl);
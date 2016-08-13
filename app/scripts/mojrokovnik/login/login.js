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

mrLoginCtrl.$inject = ['$location', '$http', '$cookies', '$scope', 'notify', 'api'];
function mrLoginCtrl($location, $http, $cookies, $scope, notify, api) {
    $scope.login = function (login) {
        $http({
            url: '../server/mr-login.php',
            method: 'POST',
            params: login
        }).then(function (response) {
            if (response.data.login) {
                api('users').fetch().then(function (user) {
                    if (user) {
                        $cookies.putObject('user', user);
                        $location.url('/clients');
                    }
                });
            } else {
                notify.error(response.data['msg']);
            }
        });
    };
}

angular.module('mojrokovnik.login', [])
        .directive('mrLogin', mrLogin)
        .controller('mrLoginCtrl', mrLoginCtrl);
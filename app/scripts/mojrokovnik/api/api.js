'use strict';

apiService.$inject = ['$q', '$http', '$cookies', '$location', 'notify', 'token'];
function apiService($q, $http, $cookies, $location, notify, token) {

    /**
     * Call $http once url is resolved
     * @param {Object} config
     */
    function http(config) {
        return $q.when(config.url).then(function (url) {
            config.url = url;
            return $http(config);
        }).then(function (response) {
            return isOK(response) ? response.data : $q.reject(response);
        });
    }

    function isOK(response) {
        function isErrData(data) {
            return data && data._status && data._status === 'ERR';
        }

        return response.status >= 200 && response.status < 300 && !isErrData(response.data);
    }

    function errorCallback(response) {
        switch (response.status) {
            case 401:
                $cookies.remove('token');
                $cookies.remove('user');
                $location.url('/login');
                return false;
                break;
        }
    }

    var api = function (route) {
        return {
            fetch: function () {
                return http({
                    url: token.resolveUrl(route),
                    method: 'GET',
                    headers: token.getToken()
                }).then(function (response) {
                    return response;
                }, function (response) {
                    errorCallback(response);
                });
            },
            add: function (params) {
                return http({
                    url: token.resolveUrl(route),
                    method: 'POST',
                    headers: token.getToken(),
                    data: params
                }).then(function (response) {
                    notify.success(response.message);
                    return response;
                }, errorCallback);
            },
            update: function (params) {
                return http({
                    url: token.resolveUrl(route, params),
                    method: 'PUT',
                    headers: token.getToken(),
                    data: params
                }).then(function (response) {
                    notify.success(response.message);
                    return response;
                }, errorCallback);
            },
            delete: function (item) {
                return http({
                    url: token.resolveUrl(route, item),
                    method: 'DELETE',
                    headers: token.getToken()
                }).then(function (response) {
                    notify.success(response.message);
                    return response;
                }, errorCallback);
            },
            login: function (username, password) {
                return http({
                    url: token.resolveAuthUrl(),
                    method: 'POST',
                    data: token.getAuthCred({
                        username: username,
                        password: password
                    })
                }).then(function (response) {
                    notify.success('Succesfully logged in');
                    $cookies.putObject('token', response);
                }, errorCallback);
            }
        };
    };

    return api;
}

angular.module('mojrokovnik.api', [])
        .service('api', apiService);
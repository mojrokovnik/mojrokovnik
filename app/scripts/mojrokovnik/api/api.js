'use strict';

apiService.$inject = ['$q', '$http', '$cookies', 'notify'];
function apiService($q, $http, $cookies, notify) {
    function isOK(response) {
        function isErrData(data) {
            return data && data._status && data._status === 'ERR';
        }

        return response.status >= 200 && response.status < 300 && !isErrData(response.data);
    }
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

    function getToken(data) {
        var token = $cookies.getObject('token');

        if (!data) {
            var data = {};
        }

        var tokenAuth = {
            Authorization: 'Bearer ' + token.access_token
        };

        return _.extend(data, tokenAuth);
    }

    function errorCallback(response) {
        console.warn(response);
    }

    var api = function (table) {
        return {
            fetch: function (params) {
                return http({
                    url: 'http://localhost:8000/' + table,
                    method: 'GET',
                    headers: getToken()
                }).then(function (response) {
                    return response;
                }, function (response) {
                    errorCallback(response);
                });
            },
            add: function (params) {
                return http({
                    url: 'http://localhost:8000/' + table,
                    method: 'POST',
                    params: params
                }).then(function (response) {
                    notify.success(response.msg);
                    return response;
                }, errorCallback);
            },
            update: function (params) {
                return http({
                    url: 'http://localhost:8000/' + table,
                    method: 'PUT',
                    params: params
                }).then(function (response) {
                    notify.success(response.msg);
                    return response;
                }, errorCallback);
            },
            delete: function (params) {
                return http({
                    url: 'http://localhost:8000/' + table,
                    method: 'DELETE',
                    params: params
                }).then(function (response) {
                    notify.success(response.msg);
                    return response;
                }, errorCallback);
            },
            login: function (username, password) {
                return http({
                    url: 'http://localhost:8000/oauth/v2/token',
                    method: 'POST',
                    data: {
                        grant_type: 'password',
                        client_id: '1_3221mw10q4qosgws0ggkgg8k48oc80scos4ck8g00ksgo8gkcs',
                        client_secret: '5xjbohlmajk088s0800c8ocggkckw0cws4sccc4oowsk8kco8o',
                        username: username,
                        password: password
                    }
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
'use strict';

apiService.$inject = ['$q', '$http', 'notify'];
function apiService($q, $http, notify) {
    function isOK(response) {
        function isErrData(data) {
            return data && data._status && data._status === 'ERR';
        }

        return response.status >= 200 && response.status < 300 && !isErrData(response.data);
    }
    /**
     * Call $http once url is resolved
     */
    function http(config) {
        return $q.when(config.url).then(function (url) {
            config.url = url;
            return $http(config);
        }).then(function (response) {
            return isOK(response) ? response.data : $q.reject(response);
        });
    }

    var api = function (table) {
        return {
            fetch: function (params) {
                return http({
                    url: '../server/api.php?table=' + table,
                    method: 'GET',
                    params: params
                }).then(function (response) {
                    return response;
                });
            },
            add: function (params) {
                return http({
                    url: '../server/api.php?table=' + table,
                    method: 'POST',
                    params: params
                }).then(function (response) {
                    notify.success(response.msg);
                    return response;
                });
            },
            update: function (params) {
                return http({
                    url: '../server/api.php?table=' + table,
                    method: 'PUT',
                    params: params
                }).then(function (response) {
                    notify.success(response.msg);
                    return response;
                });
            },
            delete: function (params) {
                return http({
                    url: '../server/api.php?table=' + table,
                    method: 'DELETE',
                    params: params
                }).then(function (response) {
                    notify.success(response.msg);
                    return response;
                });
            }
        };
    };

    return api;
}

angular.module('mojrokovnik.api', [])
        .service('api', apiService);
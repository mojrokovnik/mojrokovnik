'use strict';

tokenService.$inject = ['$cookies'];
function tokenService($cookies) {
    var params = {
        server_url: 'http://api.mojrokovnik.com/',
        auth_url: 'oauth/v2/token',
        type: 'Bearer',
        grant_type: 'password',
        client_id: '1_49amhjr484ow48gkwkscckk4ccw4c0ck0sc44g00ckwck088gk',
        client_secret: '5zqn5z1w0ekocso8wgwgcss0kwkksg4gosckgwso0o8owk44wk'
    };

    this.getAuthCred = function (data) {
        var header = {
            grant_type: params.grant_type,
            client_id: params.client_id,
            client_secret: params.client_secret
        };

        if (!data) {
            var data = {};
        }

        return _.extend(header, data);
    };

    this.getServerUrl = function () {
        return params.server_url;
    };

    this.resolveUrl = function (route, item) {
        var url = this.getServerUrl() + route;

        if (item) {
            url = url + '/' + item['id'];
        }

        return url;
    };

    this.resolveAuthUrl = function () {
        return params.server_url + params.auth_url;
    };

    this.getToken = function (data) {
        var token = $cookies.getObject('token');

        if (!data) {
            var data = {};
        }

        var tokenAuth = {
            Authorization: params.type + ' ' + token.access_token
        };

        return _.extend(data, tokenAuth);
    };
}

angular.module('mojrokovnik.api.token', [])
        .service('token', tokenService);
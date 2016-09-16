'use strict';

tokenService.$inject = ['$cookies'];
function tokenService($cookies) {
    var params = {
        server_url: 'http://localhost:8000/',
        auth_url: 'oauth/v2/token',
        type: 'Bearer',
        grant_type: 'password',
        client_id: '1_3221mw10q4qosgws0ggkgg8k48oc80scos4ck8g00ksgo8gkcs',
        client_secret: '5xjbohlmajk088s0800c8ocggkckw0cws4sccc4oowsk8kco8o'
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
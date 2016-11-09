/* global _ */

'use strict';

clientsService.$inject = ['$rootScope', 'api'];
function clientsService($rootScope, api) {
    var self = this;

    this.clients = {
        individuals: [], legals: []
    };

    this.getClients = function (type) {
        var filteredList = _.where(self.clients[type], {active: 1});

        return _.sortBy(filteredList, 'id');
    };

    this.getClientById = function (type, id) {
        var list = self.getClients(type);

        var filteredList = _.filter(list, function (obj) {
            return obj.id === id;
        });

        return _.sortBy(filteredList, 'id');
    };

    this.fetch = function (type) {
        return api('clients/' + type).fetch().then(function (clients) {
            if (!clients) {
                return $rootScope.loading = false;
            }

            self.clients[type] = clients;

            $rootScope.loading = false;
            $rootScope.$broadcast('client:' + type + ':updated');
        });
    };

    this.add = function (client, type) {
        return api('clients/' + type).add(client).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.clients[type].push(res.client);
            $rootScope.$broadcast('client:' + type + ':updated');
        });
    };

    this.update = function (client, type) {
        return api('clients/' + type).update(client).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.clients[type] = _.reject(self.clients[type], {id: client.id});
            self.clients[type].push(client);

            $rootScope.$broadcast('client:' + type + ':updated');
        });
    };

    this.remove = function (client, type) {
        return api('clients/' + type).delete(client).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.clients[type] = _.reject(self.clients[type], {id: client.id});

            $rootScope.$broadcast('client:' + type + ':updated');
        });
    };

    // Fetch clients on service initialization
    this.fetch('individuals');
    this.fetch('legals');
}

angular.module('mojrokovnik.clients', ['ngMaterial'])
        .service('clients', clientsService);

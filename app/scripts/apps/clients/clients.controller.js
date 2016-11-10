/* global _ */

'use strict';

clientsCtrl.$inject = ['$scope', '$location', 'clients', 'cases', 'calendar', 'modalDialog'];
function clientsCtrl($scope, $location, clients, cases, calendar, modalDialog) {
    $scope.clients = {};
    $scope.clientType = 'legals';

    function updateClients() {
        if (!_.isEmpty($location.search())) {
            $scope.clientType = $location.search().type;
            $scope.selected = clients.getClientById($scope.clientType, parseInt($location.search().item));
        }

        $scope.clients[$scope.clientType] = clients.getClients($scope.clientType);

        if (!$scope.selected) {
            $scope.selected = _.first($scope.clients[$scope.clientType]);
        }

        updateAssets();
    }

    function updateAssets() {
        $scope.agenda = $scope.selected ? $scope.getAgenda($scope.selected.id) : [];
        $scope._cases = $scope.selected ? $scope.getCases($scope.selected.id) : [];
    }

    $scope.switchType = function (type) {
        delete $scope.selected;
        $scope.clientType = type;

        updateClients();
    };

    $scope.pickClient = function (client) {
        if (!client)
            return false;

        $scope.selected = client;
        updateAssets();
    };

    $scope.getCases = function (client) {
        return client ? cases.getCasesByClient($scope.clientType, client) : false;
    };

    $scope.getAgenda = function (client) {
        return client ? calendar.getCalendarsByClient($scope.clientType, client) : false;
    };

    $scope.addClient = function () {
        var params = {
            scope: $scope,
            templateUrl: 'assets/templates/clients-dialog.html'
        };

        $scope.editMode = false;
        delete $scope.client;

        var modal = modalDialog.showModal(params);

        $scope.save = function (client) {
            clients.add(client, $scope.clientType).then(function () {
                modal.close();
            });
        };

        $scope.cancel = function () {
            delete $scope.client;
            modal.close();
        };
    };

    $scope.editClient = function (client) {
        var params = {
            scope: $scope,
            templateUrl: 'assets/templates/clients-dialog.html'
        };

        $scope.editMode = true;
        $scope.client = client;

        var modal = modalDialog.showModal(params);

        $scope.save = function (client) {
            clients.update(client, $scope.clientType).then(function () {
                modal.close();
            });
        };

        $scope.close = function () {
            delete $scope.client;
            modal.close();
        };
    };

    $scope.removeClient = function (client) {
        modalDialog.showConfirmation('Da li ste sigurni da želite da obrišete klijenta?').then(function () {
            return clients.remove(client, $scope.clientType).then(function () {
                $scope.selected = _.first($scope.clients[$scope.clientType]);
            });
        });
    };

    // Initialize clients
    updateClients();

    $scope.$on('client:legals:updated', updateClients);
    $scope.$on('client:individuals:updated', updateClients);
    $scope.$on('calendars:updated', updateAssets);
    $scope.$on('cases:updated', updateAssets);
}

angular.module('mojrokovnik.clients')
        .controller('clientsCtrl', clientsCtrl);
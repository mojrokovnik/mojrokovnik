/* global _ */

'use strict';

casesCtrl.$inject = ['$scope', '$location', 'cases', 'clients', 'calendar', 'documents', 'modalDialog'];
function casesCtrl($scope, $location, cases, clients, calendar, documents, modalDialog) {
    $scope.caseType = 'legals';

    function updateCases() {
        if (!_.isEmpty($location.search())) {
            $scope.caseType = $location.search().type;
            $scope.selected = cases.getCaseById($scope.caseType, parseInt($location.search().item));
        }

        $scope.cases = cases.getCases($scope.caseType);

        if (!$scope.selected)
            $scope.pickCase(_.first($scope.cases));

        updateAssets();
    }

    function updateClients() {
        return $scope.clients = clients.getClients($scope.caseType);
    }

    function updateAssets() {
        $scope.agenda = $scope.selected ? $scope.getAgenda($scope.selected.id) : [];
        $scope.documents = $scope.filters = $scope.selected ? $scope.getDocuments($scope.selected.id) : [];
    }

    $scope.switchType = function (type) {
        delete $scope.selected;
        $scope.caseType = type;

        updateCases();
    };

    $scope.pickCase = function (_case) {
        if (!_case)
            return false;

        $scope.selected = _case;

        updateAssets();
    };

    $scope.getAgenda = function (_case) {
        return _case ? calendar.getCalendarsByCase(_case) : false;
    };

    $scope.getDocuments = function (_case) {
        return _case ? documents.getDocuments(_case) : false;
    };

    $scope.generateCaseName = function (_case) {
        var _client = '';
        if (_case.client_legal) {
            _client = _case.client_legal.company_name;
        } else if (_case.client_individual) {
            _client = _case.client_individual.name + ' ' + _case.client_individual.surname;
        }

        return $scope._ncase.name = _client + ' / ' + (_case.rival_name || '') + ' ' + (_case.rival_surname || '') + ' / ' + (_case.type || '');
    };

    $scope.previewCase = function (_case) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/cases-dialog.html'
        };

        updateClients();

        $scope._ncase = _case;
        $scope._preview = true;

        var modal = modalDialog.showModal(params);

        $scope.cancel = function () {
            delete $scope._ncase;
            modal.close();
        };
    };

    $scope.addCase = function (_client) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/cases-dialog.html'
        };

        $scope._edit = false;
        $scope._preview = false;
        $scope._ncase = {};

        if (_client && _client.company_name) {
            $scope._ncase.client_legal = _client;
            $scope.caseType = 'legals';

        } else if (_client && _client.name) {
            $scope._ncase.client_individual = _client;
            $scope.caseType = 'individuals';
        }

        updateClients();

        var modal = modalDialog.showModal(params);

        $scope.save = function (_ncase) {
            cases.add(angular.copy(_ncase)).then(function () {
                modal.close();
            });
        };

        $scope.cancel = function () {
            delete $scope._ncase;
            modal.close();
        };
    };

    $scope.editCase = function (_case) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/cases-dialog.html'
        };

        $scope._edit = true;
        $scope._preview = false;
        $scope._ncase = _case;

        updateClients();

        var modal = modalDialog.showModal(params);

        $scope.save = function (_ncase) {
            cases.update(angular.copy(_ncase)).then(function () {
                modal.close();
            });
        };

        $scope.cancel = function () {
            modal.close();
            delete $scope._ncase;
        };
    };

    $scope.removeCase = function (_case) {
        modalDialog.showConfirmation('Da li ste sigurni da želite da obrišete predmet?').then(function () {
            return cases.remove(_case).then(function () {
                $scope.selected = _.first($scope.cases);
            });
        });
    };

    /*
     * Search for item
     * @param {Object} query
     * @return {Object} list of items
     */
    $scope.querySearch = function (query) {
        return $scope.filters = query ? _.pick($scope.documents, function (value) {
            return angular.lowercase(value.name)
                    .indexOf(angular.lowercase(query)) === 0;
        }) : $scope.documents;
    };

    // Initialize default data
    $scope.defaultData = cases.defaultData;

    // Initialize cases
    updateCases();

    $scope.$on('cases:updated', updateCases);
    $scope.$on('calendars:updated', updateAssets);
    $scope.$on('documents:updated', updateAssets);
}

angular.module('mojrokovnik.cases')
        .controller('casesCtrl', casesCtrl);
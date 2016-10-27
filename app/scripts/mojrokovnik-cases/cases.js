/* global _ */

'use strict';

casesCtrl.$inject = ['$scope', 'cases', 'clients', 'calendar', 'documents', 'modalDialog'];
function casesCtrl($scope, cases, clients, calendar, documents, modalDialog) {
    $scope.cases = {};
    $scope.caseType = 'legals';

    function updateCases() {
        $scope.cases = cases.getCases($scope.caseType);

        if (!$scope.selected) {
            $scope.pickCase(_.first($scope.cases));
        }

        updateAssets();
    }

    function updateClients() {
        $scope.clients = clients.getClients($scope.caseType);
    }

    function updateAssets() {
        $scope.agenda = $scope.selected ? $scope.getAgenda($scope.selected.id) : [];
        $scope.documents = $scope.selected ? $scope.getDocuments($scope.selected.id) : [];
    }

    $scope.switchType = function (type) {
        delete $scope.selected;
        $scope.caseType = type;

        updateCases();
    };

    $scope.pickCase = function (_case) {
        if (_case) {
            $scope.selected = _case;

            updateAssets();
        }
    };

    $scope.getAgenda = function (_case) {
        return _case ? calendar.getCalendarsByCase(_case) : false;
    };

    $scope.getDocuments = function (_case) {
        return _case ? documents.getDocuments(_case) : false;
    };

    $scope.generateCaseName = function (_case) {
        var client = _.findWhere($scope.clients, {id: _case.client_legal || _case.client_individual});
        var _client = client.company_name ? client.company_name : client.name + ' ' + client.surname;

        $scope.newcase.name = _client + ' / ' + (_case.rival_name || '') + ' ' + (_case.rival_surname || '') + ' / ' + (_case.type || '');
    };

    $scope.previewCase = function (_case) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/cases-dialog.html'
        };

        updateClients();

        if (_case.client_individual) {
            _case.client_individual = _case.client_individual.id;

        } else if (_case.client_legal) {
            _case.client_legal = _case.client_legal.id;
        }

        $scope.newcase = _case;
        $scope._preview = true;

        var modal = modalDialog.showModal(params);

        $scope.cancel = function () {
            delete $scope.newcase;
            modal.close();
        };
    };

    $scope.addCase = function (_client) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/cases-dialog.html'
        };

        updateClients();

        $scope._edit = false;
        $scope._preview = false;
        $scope.newcase = {};

        if (_client && _client.company_name) {
            $scope.newcase.client_legal = _client.id;
            $scope.caseType = 'legals';
            updateClients();

        } else if (_client && _client.name) {
            $scope.newcase.client_individual = _client.id;
            $scope.caseType = 'individuals';
            updateClients();
        }

        var modal = modalDialog.showModal(params);

        $scope.save = function (newcase) {
            cases.add(newcase).then(function () {
                modal.close();
            });
        };

        $scope.cancel = function () {
            delete $scope.newcase;
            modal.close();
        };
    };

    $scope.editCase = function (_case) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/cases-dialog.html'
        };

        if (_case.client_individual) {
            _case.client_individual = _case.client_individual.id;

        } else if (_case.client_legal) {
            _case.client_legal = _case.client_legal.id;
        }

        updateClients();

        $scope._edit = true;
        $scope._preview = false;
        $scope.newcase = _case;

        var modal = modalDialog.showModal(params);

        $scope.save = function (newcase) {
            cases.update(newcase).then(function () {
                modal.close();
            });
        };

        $scope.cancel = function () {
            delete $scope.newcase;
            modal.close();
        };
    };

    $scope.removeCase = function (_case) {
        cases.remove(_case).then(function () {
            $scope.selected = _.first($scope.cases);
        });
    };

    // Initialize default data
    $scope.defaultData = cases.defaultData;

    // Initialize cases
    updateCases();

    $scope.$on('cases:updated', updateCases);
    $scope.$on('calendars:updated', updateAssets);
    $scope.$on('documents:updated', updateAssets);
}

casesService.$inject = ['$rootScope', 'api'];
function casesService($rootScope, api) {
    console.warn('Cases Service initialized');

    var self = this;

    this.cases = [];

    this.defaultData = {
        rivalType: [
            'Tužilac', 'Tuženi', 'Poverilac', 'Dužnik', 'Usvojilac', 'Usvojenik', 'Izvršni poverilac', 'Izvršni dužnik',
            'Predlagač', 'Protivnik predlagača', 'Privatni tužilac', 'Okrivljeni', 'Treće lice', 'Oštećeni'
        ],
        caseType: [
            'Izvršni postupak', 'Krivični postupak', 'Parnični postupak', 'Prekršajni postupak',
            'Privredno pravo', 'Upravni postupak i sporovi', 'Vanparnični postupak', 'Ostalo'
        ],
        caseElement: [
            'Bračni spor', 'Izdržavanje', 'Kolektivni ugovori  spor', 'Materinstvo i očinstvo', 'Naknada štete', 'Nasledni spor',
            'Obligacioni spor', 'Platni nalog', 'Poništaj usvojenja', 'Privredni spor', 'Radni spor', 'Roditeljsko pravo', 'Smetanje državine',
            'Spor  povreda žiga ili firme', 'Spor authorskih prava', 'Spor male vrednosti', 'Stambeni spor', 'Svojinski spor',
            'Zaštita od nasilja u porodici', 'Zaštita prava deteta', 'Ostalo'
        ]
    };

    this.getCases = function (type) {
        var filteredList = _.where(self.cases, {active: 1});

        if (type === 'individuals') {
            filteredList = _.filter(filteredList, function (obj) {
                return !!obj.client_individual;
            });
        } else if (type === 'legals') {
            filteredList = _.filter(filteredList, function (obj) {
                return !!obj.client_legal;
            });
        }

        return _.sortBy(filteredList, 'id');
    };

    this.getCasesByClient = function (type, id) {
        var list = self.getCases(type);
        type = type.slice(0, -1);

        var filteredList = _.filter(list, function (obj) {
            return obj['client_' + type].id === id;
        });

        return _.sortBy(filteredList, 'id');
    };

    this.fetch = function () {
        return api('cases').fetch().then(function (cases) {
            if (!cases) {
                return $rootScope.loading = false;
            }

            self.cases = cases;

            $rootScope.loading = false;
            $rootScope.$broadcast('cases:updated');
        });
    };

    this.add = function (cases) {
        return api('cases').add(cases).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.cases.push(res.cases);

            $rootScope.$broadcast('cases:updated');
        });
    };

    this.update = function (cases) {
        return api('cases').update(cases).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.cases = _.reject(self.cases, {id: cases.id});
            self.cases.push(cases);

            $rootScope.$broadcast('cases:updated');
        });
    };

    this.remove = function (cases) {
        return api('cases').delete(cases).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.cases = _.reject(self.cases, {id: cases.id});

            $rootScope.$broadcast('cases:updated');
        });
    };

    // Fetch cases on service initialization
    this.fetch();
}

casesSidenav.$inject = [];
function casesSidenav() {
    return {
        controller: casesCtrl,
        link: function (scope, elem, attr, ctrl) {
        }
    };
}

casesTemplate.$inject = [];
function casesTemplate() {
    return {
        link: function (scope, elem, attr, ctrl) {
        }
    };
}

angular.module('mojrokovnik.cases', ['ngMaterial'])
        .service('cases', casesService)
        .controller('casesCtrl', casesCtrl)
        .directive('casesSidenav', casesSidenav)
        .directive('casesTemplate', casesTemplate);
/* global _ */
'use strict';

casesService.$inject = ['$rootScope', 'api'];
function casesService($rootScope, api) {
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

    this.getCaseById = function (type, id) {
        var list = self.getCases(type);

        return _.find(list, function (obj) {
            return obj.id === id;
        });
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

    this.add = function (_case) {
        _case.client_legal ?
                _case.client_legal = _case.client_legal.id :
                _case.client_individual = _case.client_individual.id;

        return api('cases').add(_case).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.cases.push(res.cases);

            $rootScope.$broadcast('cases:updated');
        });
    };

    this.update = function (_case) {
        _case.client_legal ?
                _case.client_legal = _case.client_legal.id :
                _case.client_individual = _case.client_individual.id;

        return api('cases').update(_case).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.cases = _.reject(self.cases, {id: _case.id});
            self.cases.push(_case);

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

angular.module('mojrokovnik.cases', ['ngMaterial'])
        .service('cases', casesService);
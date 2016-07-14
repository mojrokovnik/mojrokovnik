'use strict';

casesCtrl.$inject = ['$scope', 'api', '$uibModal'];
function casesCtrl($scope, api, $uibModal) {

    api('clients').fetch({client_delete: 0}).then(function (clients) {
        $scope.clients = clients;
    });

    api('cases').fetch({case_delete: 0}).then(function (cases) {
        $scope.cases = cases;
        $scope.sCase = cases[0];
        $scope.client = $scope.getClient(cases[0].client_id);
    });

    $scope.selectCase = function (ucase) {
        $scope.sCase = ucase;
        $scope.client = $scope.getClient(ucase.client_id);
    };

    $scope.removeCase = function (cases) {
        api('cases').delete(cases).then(function () {
            $scope.cases = _.without($scope.cases, cases);
            $scope.selCase = $scope.cases[0];
        });
    };

    $scope.getClient = function (client_id) {
        return _.find($scope.clients, function (client) {
            return client.client_id == client_id;
        });
    };

    $scope.initCaseName = function (newCase) {
        newCase.case_name =
                $scope.getClient(newCase.client_id).client_surname + ' / ' +
                newCase.case_rivalSurname + ' / ' + newCase.case_type;
    };

    $scope.showDialog = function (cases) {
        if (cases) {
            $scope.newCase = cases;
            $scope.editMode = true;
        } else {
            delete $scope.newCase;
            $scope.editMode = false;
        }

        $uibModal.open({
            animation: true,
            scope: $scope,
            size: 'lg',
            templateUrl: 'scripts/mojrokovnik-cases/cases-dialog.html',
            controller: casesDialogCtrl
        });

        // CASES CUSTOM DATA
        $scope.data = {
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
    };

    function casesDialogCtrl($uibModalInstance) {
        $scope.save = function (cases) {
            if ($scope.editMode) {
                api('cases').update(cases).then(function () {
                    $scope.editMode = false;
                    $uibModalInstance.close();
                });
            } else {
                api('cases').add(cases).then(function () {
                    $scope.cases.push(cases);
                    $uibModalInstance.close();
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
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
        .controller('casesCtrl', casesCtrl)
        .directive('casesSidenav', casesSidenav)
        .directive('casesTemplate', casesTemplate);
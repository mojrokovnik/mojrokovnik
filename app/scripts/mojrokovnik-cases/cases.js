'use strict';

casesCtrl.$inject = ['$scope', 'clients'];
function casesCtrl($scope, clients) {

    $scope.clients = clients.getClients('individuals');

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
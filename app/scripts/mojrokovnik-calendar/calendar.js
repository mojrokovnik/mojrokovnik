'use strict';

calendarCtrl.$inject = ['$scope', '$uibModal', 'api'];
function calendarCtrl($scope, $uibModal, api) {
    $scope.eventSources = [];

    $scope.calendarOptions = {
        height: angular.element('body').height() - 20,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        firstDay: 1,
        lang: 'sr'
    };
}


angular.module('mojrokovnik.calendar', ['ngMaterial', 'ui.bootstrap', 'ui.calendar'])
        .controller('calendarCtrl', calendarCtrl);
'use strict';

modalDialogService.$inject = ['$uibModal'];
function modalDialogService($uibModal) {
    this.showModal = function (params) {
        return $uibModal.open({
            animation: true,
            scope: params.scope,
            templateUrl: params.template
        });
    };
}

angular.module('mojrokovnik.ui.modalDialog', [])
        .service('modalDialog', modalDialogService);
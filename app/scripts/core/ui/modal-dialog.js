'use strict';

modalDialogService.$inject = ['$uibModal'];
function modalDialogService($uibModal) {
    this.showModal = function (params) {
        return $uibModal.open(params);
    };
}

angular.module('mojrokovnik.ui.modalDialog', [])
        .service('modalDialog', modalDialogService);
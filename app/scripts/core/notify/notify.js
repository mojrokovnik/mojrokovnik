'use strict';

notifyService.$inject = ['$mdToast'];
function notifyService($mdToast) {
    this.success = function (text) {
        showToast('success', text);
    };

    this.warn = function (text) {
        showToast('warn', text);
    };

    this.error = function (text) {
        showToast('error', text);
    };

    function showToast(type, text) {
        var toast = $mdToast.simple()
                .textContent(text)
                .position('top right')
                .toastClass(type)
                .hideDelay(3000);

        $mdToast.show(toast);

    }
}

angular.module('mojrokovnik.notify', ['ngMaterial'])
        .service('notify', notifyService);
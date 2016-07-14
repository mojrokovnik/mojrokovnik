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
        $mdToast.show({
            template: '<md-toast class="md-toast ' + type + '">' + text + '</md-toast>',
            position: 'top right'
        });
    }
}

angular.module('mojrokovnik.notify', ['ngMaterial'])
        .service('notify', notifyService);
/* global clientsCtrl */

'use strict';

clientsSidenav.$inject = [];
function clientsSidenav() {
    return {
        controller: clientsCtrl
    };
}

clientsTemplate.$inject = [];
function clientsTemplate() {
    return {};
}

angular.module('mojrokovnik.clients')
        .directive('clientsSidenav', clientsSidenav)
        .directive('clientsTemplate', clientsTemplate);
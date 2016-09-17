'use strict';

typeaheadDirective.$inject = [];
function typeaheadDirective() {
    return {
        link: function (scope, elem) {

        }
    };
}

angular.module('mojrokovnik.ui.typeahead', [])
        .directive('mrTypeahead', typeaheadDirective);
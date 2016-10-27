'use strict';

editorDirective.$inject = [];
function editorDirective() {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            if (!ngModel)
                return;

            var editor = new MediumEditor(element, {
                buttonLabels: 'fontawesome',
                toolbar: {
                    relativeContainer: element.parent()[0],
                    buttons: ['h1', 'h2', 'h3', 'bold', 'italic', 'underline', 'orderedlist', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                    static: true
                },
                placeholder: false
            });

            ngModel.$render = function () {
                editor.setContent(ngModel.$viewValue || "");
            };

            editor.subscribe('editableInput', function (e, elem) {
                ngModel.$setViewValue(elem.innerHTML.trim());
            });

            scope.$on('$destroy', function () {
                editor.destroy();
            });
        }
    };
}

angular.module('mojrokovnik.ui.editor', [])
        .directive('mrEditor', editorDirective);
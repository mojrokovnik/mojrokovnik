'use strict';

documentsCtrl.$inject = ['$scope', 'documents', 'modalDialog'];
function documentsCtrl($scope, documents, modalDialog) {
    var modal;

    $scope.previewDocument = function (_case, _document) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/documents-dialog.html'
        };

        $scope._preview = true;
        $scope._case = _case;
        $scope.document = _document;

        modal = modalDialog.showModal(params);

        $scope.cancel = function () {
            delete $scope.document;
            modal.close();
        };
    };

    $scope.addDocument = function (_case) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/documents-dialog.html'
        };

        $scope._edit = false;
        $scope._preview = false;
        $scope.document = {};

        modal = modalDialog.showModal(params);

        $scope.save = function (document) {
            documents.add(_case.id, document).then(function () {
                modal.close();
            });
        };

        $scope.cancel = function () {
            delete $scope.document;
            modal.close();
        };
    };

    $scope.editDocument = function (_case, _document) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/documents-dialog.html'
        };

        $scope._edit = true;
        $scope.document = _document;

        $scope._preview ?
                $scope._preview = false :
                modal = modalDialog.showModal(params);

        $scope.save = function (document) {
            documents.update(_case.id, document).then(function () {
                modal.close();
            });
        };

        $scope.cancel = function () {
            delete $scope.newcase;
            $scope._edit = false;
            modal.close();
        };
    };

    $scope.removeDocument = function (_case, document) {
        modalDialog.showConfirmation('Da li ste sigurni da želite da obrišete dokument?').then(function () {
            return documents.remove(_case.id, document);
        });
    };
}


angular.module('mojrokovnik.documents')
        .controller('documentsCtrl', documentsCtrl);
'use strict';

documentsCtrl.$inject = ['$scope', 'documents', 'modalDialog', 'api', 'FileSaver', 'Blob', '$timeout'];
function documentsCtrl($scope, documents, modalDialog, api, FileSaver, Blob, $timeout) {
    var modal;

    $scope.previewDocument = function (_case, _document) {
        if (_document.url) {
            return api('cases/' + _case.id + '/documents/' + _document.id + '/file').download().then(function (response) {
                var data = new Blob([response]);
                FileSaver.saveAs(data, _document.name);
            });
        }

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
        $scope._case = _case;
        $scope.document = {};

        modal = modalDialog.showModal(params);

        $scope.save = function (document) {
            documents.add(_case.id, document).then(function () {
                modal.close();
            });
        };

        $scope.uploadAndSave = function (uploader) {
            documents.upload(_case.id, uploader).then(function () {
                $timeout(modal.close, 1500);
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
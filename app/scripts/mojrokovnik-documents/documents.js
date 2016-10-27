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
        return documents.remove(_case.id, document);
    };
}

documentsService.$inject = ['$rootScope', 'api'];
function documentsService($rootScope, api) {
    console.warn('Documents Service initialized');

    var self = this;

    this.documents = [];

    this.getDocuments = function (_case) {
        var filteredList;

        if (!self.documents[_case]) {
            self.fetch(_case).then(function (documents) {
                filteredList = _.where(documents, {active: 1});
                return _.sortBy(filteredList, 'id');
            });
        } else {
            filteredList = _.where(self.documents[_case], {active: 1});
            return _.sortBy(filteredList, 'id');
        }

    };

    this.fetch = function (_case) {
        return api('cases/' + _case + '/documents').fetch().then(function (documents) {
            if (!documents) {
                return false;
            }

            self.documents[_case] = documents;
            $rootScope.$broadcast('documents:updated');

            return documents;
        });
    };

    this.add = function (_case, document) {
        return api('cases/' + _case + '/documents').add(document).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            !self.documents[_case] ?
                    self.documents[_case] = [res.document] :
                    self.documents[_case].push(res.document);

            $rootScope.$broadcast('documents:updated');
        });
    };

    this.update = function (_case, document) {
        return api('cases/' + _case + '/documents').update(document).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.documents[_case] = _.reject(self.documents[_case], {id: document.id});
            self.documents[_case].push(res.document);

            $rootScope.$broadcast('documents:updated', self.documents);
        });
    };

    this.remove = function (_case, document) {
        return api('cases/' + _case + '/documents').delete(document).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.documents[_case] = _.reject(self.documents[_case], {id: document.id});

            $rootScope.$broadcast('documents:updated');
        });
    };
}

angular.module('mojrokovnik.documents', ['ngSanitize'])
        .service('documents', documentsService)
        .controller('documentsCtrl', documentsCtrl);
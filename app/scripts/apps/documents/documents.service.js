/* global _ */

'use strict';

documentsService.$inject = ['$rootScope', 'api'];
function documentsService($rootScope, api) {
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
            if (res.status !== 201) {
                return false;
            }

            !self.documents[_case] ?
                    self.documents[_case] = [res.document] :
                    self.documents[_case].push(res.document);

            $rootScope.$broadcast('documents:updated');
        });
    };

    this.upload = function (_case, uploader) {
        return new Promise(function (resolve, reject) {
            uploader.uploadAll();

            uploader.onCompleteItem = function (item, response) {
                !self.documents[_case] ?
                        self.documents[_case] = [response.document] :
                        self.documents[_case].push(response.document);
            };

            uploader.onErrorItem = function () {
                return reject();
            };

            uploader.onCompleteAll = function () {
                $rootScope.$broadcast('documents:updated');
                return resolve();
            };
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

angular.module('mojrokovnik.documents', ['ngSanitize', 'ngFileSaver', 'angularFileUpload'])
        .service('documents', documentsService);
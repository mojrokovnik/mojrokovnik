/* global uploader */

'use strict';

documentsUploadCtrl.$inject = ['$scope', 'FileUploader', 'token'];
function documentsUploadCtrl($scope, FileUploader, token) {
    $scope.uploader = new FileUploader({
        method: 'POST',
        headers: token.getToken(),
        url: token.resolveUrl('cases/' + $scope.$parent.$parent._case.id + '/documents')
    });
}

angular.module('mojrokovnik.documents')
        .controller('mrDocumentsUpload', documentsUploadCtrl);
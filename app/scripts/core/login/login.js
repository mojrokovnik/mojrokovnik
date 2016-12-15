'use strict';

mrLogin.$inject = [];
function mrLogin() {
    return {
        controller: mrLoginRegisterCtrl,
        templateUrl: 'assets/templates/login.html'
    };
}

mrLoginRegisterCtrl.$inject = ['$location', '$scope', '$rootScope', '$cookies', 'api', 'authentification'];
function mrLoginRegisterCtrl($location, $scope, $rootScope, $cookies, api, authentification) {
    $scope.login = function () {
        toggleLoading();

        api().login($scope.username, $scope.password).then(function (response) {
            $scope.isLoading = false;

            if (response && response.error)
                return $scope.msg['error'] = 'Korisničko ime ili lozinka su neispravni!';

            if (response && response.status && response.status === 408)
                return $scope.msg['error'] = 'Nešto je pošlo naopako :( Probajte opet!';

            return authentification.getActiveUser().then(function (user) {
                if (!user)
                    return $scope.msg['error'] = 'Korisnički nalog nije aktiviran. Molim Vas proverite vaše poštansko sanduče!';

                $cookies.putObject('user', user);

                delete $rootScope.loginPage;
                return $location.url('/clients');
            });
        });
    };

    $scope.register = function () {
        toggleLoading();

        var params = {
            username: $scope.register.username,
            email: $scope.register.email,
            password: $scope.register.password
        };

        api().register(params).then(function (response) {
            $scope.isLoading = false;

            if (response.error) {
                return response.error === 'Username already exist' ?
                        $scope.msg['error'] = {'username': 'Korisničko ime je zauzeto'} :
                        $scope.msg['error'] = {'email': 'Email adresa je već registrovana'};
            }

            $scope.msg['success'] = "Registracija uspešna! Molimo Vas proverite vaše poštansko sanduče";
            delete $scope.msg['error'];
            return $scope.registerView = false;
        });
    };

    // Toggle register view
    $scope.toggleRegister = function () {
        $scope.registerView = !$scope.registerView;
    };

    // Toggle loading
    function toggleLoading() {
        $scope.isLoading = true;
        $scope.msg = {};
    }
}

angular.module('mojrokovnik.login', [])
        .directive('mrLogin', mrLogin)
        .controller('mrLoginRegisterCtrl', mrLoginRegisterCtrl);
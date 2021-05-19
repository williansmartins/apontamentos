angular
.module('controlei')
.factory('LoginService', LoginService);

function LoginService ($q, $window, $http) {
    return {

        getToken : function () {
            return $window.sessionStorage.getItem("token");
        },

        setToken: function (token) {
            $window.sessionStorage.setItem("token", token);
        },

        login : function (form) {
            return $http({
                method : "POST",
                url : barramento + "/signin",
                params: {
                    'email': form.email,
                    'password': form.password
                }
            })
        },

        signup : function (form) {
            return $http({
                method : "POST",
                url : barramento + "/signup",
                params: {
                    'name': form.name,
                    'email': form.email,
                    'password': form.password,
                    'tipo': 'c'
                }
            })
        },

        validarDisponibilidade : function (form) {
            return $http({
                method : "POST",
                url : barramento + "/validarDisponibilidade",
                params: {
                    'email': form.email
                }
            })
        },

        logout : function (data) {
            $window.sessionStorage.setItem("token", "");
            $q.when();
        }
    };
}
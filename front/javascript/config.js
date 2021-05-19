angular.module('controlei')
.config(function($httpProvider, $base64, $provide) {
	
	$provide.factory('MyHttpInterceptor', function($q, $location, $localStorage, $injector, ComponentModal) {
	return {
	    request : function(config) {
	        var apiPattern = /\/api\//;

	        config.params = config.params || {};

	        if ($localStorage.token && apiPattern.test(config.url)) {
	            config.params.token = $localStorage.token;
	        }
	        return config || $q.when(config);
	    },

	    response: function(response){
            if(response.data.message=="Token has expired"){
                apresentarErroDeToken($injector, ComponentModal);
            }
	    	return response;
	    },

	    responseError: function (response) {
	    	return response;
        }

	  };
	});
	// Add the interceptor to the $httpProvider.

	$httpProvider.interceptors.push('MyHttpInterceptor');
    // var auth = $base64.encode("usuario:senha");
    // $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
})


function apresentarErroDeToken($injector, ComponentModal){
    var modal = $injector.get('$uibModal');
    var config = new Object();
    config.title = "Aviso";
    config.data = "Seu tempo de permanência expirou. Entre com seu usuário e senha para poder navegar novamente";
    config.windowClass = "modal-mensagem";
    config.templateUrl = 'modal-mensagem.html';

    var modalInstance = ComponentModal.getModalWindow(modal, config);
    modalInstance.result.then(
    function (response) {
        window.location = "#";
    }, 
    function (response) {
        window.location = "#";
    });
}
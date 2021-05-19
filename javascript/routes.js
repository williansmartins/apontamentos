angular.module('controlei') 
.config(function($routeProvider) {
	
	$routeProvider.when('/', {
		templateUrl : "views/login.html",
		controller: 'LoginController'
	})
	$routeProvider.when('/login', {
		templateUrl : "views/login.html",
		controller: 'LoginController'
	})
	.when('/home', {
		templateUrl : "views/home.html",
		controller: 'HomeController'
	})
	.when('/teste', {
		templateUrl : "views/teste.html",
		controller: 'HomeController'
	})
	.when('/404', {
		templateUrl : "views/404.html",
		controller: 'GraficoController'
	})
	.otherwise( {
		redirectTo: 'views/404.html'
	});

});
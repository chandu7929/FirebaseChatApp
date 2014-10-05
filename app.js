var hsktalk = angular.module("hsktalk",['firebase','ngRoute']);

var URL = "https://hskrestaurant.firebaseio.com/";

hsktalk.config(function($routeProvider){
	$routeProvider.
	when('/login',{
		templateUrl:"views/login.html",
		controller:"loginCtrl"
	}).
	when('/createAccount',{
		templateUrl:"views/createAccount.html",
		controller:"createAccountCtrl"
	}).
	when('/home',{
		templateUrl:"views/home.html",
		controller:"homeCtrl"
	}).
	otherwise({redirectTo:"/login"});
});
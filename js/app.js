var hsktalk = angular.module("hsktalk",['firebase','ngRoute','ngDialog','ngDropdowns','angularMoment','ngCookies']);

var URL = "https://hskrestaurant.firebaseio.com/";

hsktalk.config(function($routeProvider){
	$routeProvider.
	when('/',{
		templateUrl:"views/welcome.html",
		controller:"homeCtrl"
	}).
	when('/login',{
		templateUrl:"views/login.html",
		controller:"loginCtrl"
	}).
	when('/createAccount',{
		templateUrl:"views/createAccount.html",
		controller:"createAccountCtrl"
	}).
	when('/profile',{
		templateUrl:"views/profile.html",
		controller:"profileCtrl"
	}).
	when('/logout',{
		templateUrl:"views/logout.html",
		controller:"logoutCtrl"
	}).
	otherwise({redirectTo:"/login"});
});
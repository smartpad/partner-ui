'use strict';

/* App Module */

var smartpadApp = angular.module('smartpadApp', [
  'ngRoute',
  'smartpadControllers',
  'userServices',
  'catalogServices'
]);

smartpadApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/registry', {
        templateUrl: 'partials/registry.html',
        controller: 'RegistryCtrl'
      }).
	  when('/defaults', {
        templateUrl: 'partials/welcome.html',
        controller: 'MainAppCtrl'
      }).
	  when('/catalog', {
        //templateUrl: 'partials/catalog.html',
		templateUrl: 'partials/catalogTree.html',
        controller: 'CatalogCtrl'
      }).
      when('/branch', {
		templateUrl: 'partials/branch.html',
        controller: 'BranchCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

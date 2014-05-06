'use strict';

/* App Module */

var smartpadApp = angular.module('smartpadApp', [
  'ngRoute',
  'smartpadControllers',
  'userServices'
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
        templateUrl: 'partials/catalog.html',
        controller: 'CatalogCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

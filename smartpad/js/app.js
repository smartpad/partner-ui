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
      otherwise({
        redirectTo: '/login'
      });
  }]);

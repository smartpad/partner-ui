'use strict';

/* App Module */

var smartpadApp = angular.module('smartpadApp', [
  'ngRoute',
  'smartpadControllers', 'loginController', 'catalogItemController', 'sysCatalogItemController',
  'userServices', 'catalogServices', 'branchServices', 'catalogItemServices',
  'ui.router'
]);

smartpadApp.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
  
    $urlRouterProvider.otherwise("/login");
    
    $stateProvider.
    	state("defaults.catalogItem", {
      	url: "/catalogItem",
        templateUrl: 'partials/sysCatalogItem.html',
  		//controller: 'SysCatalogItemCtrl'
		controller: 'CatalogCtrl'
        }).
        
       state("defaults", {
       url: "/defaults",
        templateUrl: 'partials/welcome.html',
        controller: 'MainAppCtrl'
        }).
        
        state("registry", {
        url: "/registry",
        templateUrl: 'partials/registry.html',
        controller: 'RegistryCtrl'
        }).
        
        state("defaults.branch", {
        url: "/branch",
        templateUrl: 'partials/branch.html',
        controller: 'BranchCtrl'
        }).
        
        state("login", {
        url: "/login",
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
        }).
        
        state("defaults.catalog", {
        url: "/catalog",
        templateUrl: "partials/catalogTree.html",
        controller: 'CatalogCtrl'
        });
  }]);

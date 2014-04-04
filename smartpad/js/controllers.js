'use strict';

/* Controllers */

var smartpadControllers = angular.module('smartpadControllers', []);

smartpadControllers.controller('LoginCtrl', ['$scope', '$routeParams', 'User',
  function($scope, $routeParams, User) {
    
    $scope.login = function() {
	  console.log($routeParams)
	  $scope.user = User.get({userId: $scope.userNameText, passwordId: $scope.passwordText}, function(user) {
		alert("user " + user);
	  });
    }
  }]);

smartpadControllers.controller('RegistryCtrl', ['$scope', '$routeParams', 'User',
  function($scope, $routeParams, Phone) {
    // TODO
  }]);
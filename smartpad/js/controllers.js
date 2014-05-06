'use strict';

/* Controllers */

var smartpadControllers = angular.module('smartpadControllers', []);
/*smartpadControllers.config(function($httpProvider) {
	console.log($httpProvider.defaults);
	delete $httpProvider.defaults.headers.common['X-Requested-With'];	
});*/

smartpadControllers.controller('LoginCtrl', ['$scope', '$rootScope','$routeParams', 'User', '$location',
  function($scope, $rootScope, $routeParams, User, $location) {
    
    $scope.login = function() {
		var user = new User();
		user.userNameText = $scope.user.userNameText;
		user.passwordText = $scope.user.passwordText;
		user.data = $scope.user;

		user.$acc({}, function(data, headers)
                {
					if (data.success) {
						$rootScope.user = data.data[0];
						$location.path('/defaults')
						return;
					}
                   alert('Account invalid: ' + data.data[0]);
                },
                function(err, headers)
                {
                    alert('Login failed: \'' + err + '\'!');
                });
    }
  }]);
smartpadControllers.controller('MainAppCtrl', ['$scope', '$rootScope', '$routeParams',
  function($scope, $rootScope, $routeParams) {    
	$scope.user = $rootScope.user;	
	// TODO
  }]);
smartpadControllers.controller('RegistryCtrl', ['$scope', '$routeParams', 'User',
  function($scope, $routeParams, User) {
    // TODO
  }]);
smartpadControllers.controller('CatalogCtrl', ['$scope', '$routeParams', 'Catalog',
  function($scope, $routeParams, Catalog) {
    // TODO
  }]);
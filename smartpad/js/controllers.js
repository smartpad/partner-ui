'use strict';

/* Controllers */

var smartpadControllers = angular.module('smartpadControllers', []);
/*smartpadControllers.config(function($httpProvider) {
	console.log($httpProvider.defaults);
	delete $httpProvider.defaults.headers.common['X-Requested-With'];	
});*/

smartpadControllers.controller('LoginCtrl', ['$scope', '$rootScope','$routeParams', 'User', '$location',
  function($scope, $rootScope, $routeParams, User, $location) {
    $scope.user = {};
	$rootScope.user = {};
    $scope.login = function() {		
		var user = new User();
		user.userNameText = $scope.user.userNameText;
		user.passwordText = $scope.user.passwordText;
		user.data = $scope.user;

		user.$acc({}, function(data, headers)
                {
					if (data.success) {
						$rootScope.user = data.data[0];
						$location.path('/defaults');
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
smartpadControllers.controller('MainAppCtrl', ['$scope', '$rootScope', '$routeParams', '$location',
  function($scope, $rootScope, $routeParams, $location) {    
	// TODO	
  }]);
smartpadControllers.controller('RegistryCtrl', ['$scope', '$routeParams', 'User',
  function($scope, $routeParams, User) {
    // TODO
  }]);
smartpadControllers.controller('CatalogCtrl', ['$scope', '$rootScope', 'Catalog',
  function($scope, $rootScope, Catalog) {
    
	Catalog.get({userName: $rootScope.user.userNameText}, function(catalog) {		
		$scope.rootCatalog = catalog.data[0].catalog;
		$scope.rootCatalog.name = "Catalog";
		$scope.rootCatalog.root = true;
		angular.forEach($scope.rootCatalog.allSubCatalogs, function(currCatalog, keyAsIndex) {
		   //this.push(key + ': ' + value);
		   currCatalog.index = keyAsIndex;
		 });
		//$scope.catalog = $scope.rootCatalog.allSubCatalogs[0];
		$scope.catalog = $scope.rootCatalog;
	});
	
	$scope.loadSubCatalog = function(catalog) {				
		$scope.catalog = catalog;
	}
  }]);
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
		user.userNameText = $("#username").val();//$scope.user.userNameText;
		user.passwordText = $("#password").val();//$scope.user.passwordText;
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
		$scope.rootCatalog = catalog.data[0];
		$scope.rootCatalog.name = "Catalog";
		$scope.rootCatalog.root = true;
		angular.forEach($scope.rootCatalog.allSubCatalogs, function(currCatalog, keyAsIndex) {
		   currCatalog.index = keyAsIndex;
		 });
		$scope.catalog = $scope.rootCatalog;
		$scope.selectedCatalogToAddSubCat = null;//$scope.rootCatalog;//{id: null, name: "", des: "", checkedToAddSubCat: false};
		$scope.catToEdit = null;
		$scope.catName = null;
		$scope.catDes = null;
		$scope.readonly = true;
		//$scope.$clearForm();
	});
	
	$scope.loadSubCatalog = function(catalog) {
		$scope.catalog = catalog;
		this.clearForm();
	};
	
	$scope.changedSelectCatalogToAddSubCat = function(parentCatalogOfNewSubCat, catToEdit) {
		if (catToEdit) {
			if (catToEdit.id == $scope.rootCatalog.id) {
				// TODO handle select rootCatalog to edit
				alert("Cannot edit root catalog!");
				return;
			}			
			$scope.catName = catToEdit.name;
			$scope.catDes = catToEdit.des;
		}
		if (parentCatalogOfNewSubCat) {
			$scope.catName = null;
			$scope.catDes = null;
		}
		$scope.catToEdit = catToEdit;
		$scope.selectedCatalogToAddSubCat = parentCatalogOfNewSubCat;
		$scope.readonly = false;
	};
	
	$scope.updateCatalog = function() {
		// TODO with selectedCatalogToAddSubCat
	};
	$scope.addSubCatalog = function() {
		// TODO with selectedCatalogToAddSubCat
	};
	$scope.clearForm = function() {
		$scope.catToEdit = null;
		$scope.selectedCatalogToAddSubCat = null;
		$scope.catName = null;
		$scope.catDes = null;
		$scope.readonly = true;
	};

  }]);
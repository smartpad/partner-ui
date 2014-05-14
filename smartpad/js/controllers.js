'use strict';

/* Controllers */

var smartpadControllers = angular.module('smartpadControllers', ['LocalStorageModule']);
smartpadControllers.config(['localStorageServiceProvider', function(localStorageServiceProvider){
	/*localStorageServiceProvider.setPrefix('demoPrefix');*/
}]);

smartpadControllers.controller('LoginCtrl', ['$scope', '$rootScope','$routeParams', 'User', '$location', 'localStorageService',
  function($scope, $rootScope, $routeParams, User, $location, localStorageService) {
    $scope.user = {};
	$rootScope.user = {};

    $scope.login = function() {		
		var user = new User();
		user.userNameText = $("#username").val();//$scope.user.userNameText;
		user.passwordText = $("#password").val();//$scope.user.passwordText;
		user.data = $scope.user;

		user.$acc({}, function(data, headers)
                {alert(JSON.stringify(data));
					if (data.success) {
						$rootScope.user = data.data[0];
						localStorageService.set('userNameText', data.data[0].userNameText);
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
smartpadControllers.controller('CatalogCtrl', ['$scope', '$rootScope', 'Catalog', 'localStorageService',
  function($scope, $rootScope, Catalog, localStorageService) {
    
	Catalog.get({userName: localStorageService.get('userNameText')/*$rootScope.user.userNameText*/}, function(catalog) {
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
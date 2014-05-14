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
		$scope.clearForm = function() {
			$scope.catalog = $scope.rootCatalog;
			$scope.action = null;//null, "addsubcat"
			$scope.catName = null;
			$scope.catDes = null;
			//$scope.readonly = true;
		};

		$scope.getCatalogCallBack = function(catalog) {
			$scope.rootCatalog = catalog.data[0];
			$scope.catalogIndex = $scope.rootCatalog;
			//$scope.rootCatalog.name = "Root Catalog";
			$scope.rootCatalog.root = true;
			angular.forEach($scope.rootCatalog.allSubCatalogs, function(currCatalog, keyAsIndex) {
			   currCatalog.index = keyAsIndex;
			 });
			this.clearForm();
		};
		Catalog.get({user: $rootScope.user.userNameText}, function(catalogResult) {
			$scope.getCatalogCallBack(catalogResult);
		});
		$scope.loadSubCatalog = function(catalog) {
			this.clearForm();
			$scope.catalog = catalog;
			$scope.catName = catalog.name;
			$scope.catDes = catalog.des;
			//$scope.readonly = $scope.catalog == $scope.rootCatalog;
		};
		$scope.selectToAddSubCat = function(parentCatalogOfNewSubCat) {
			this.clearForm();
			$scope.catalog = parentCatalogOfNewSubCat;
			//$scope.readonly = $scope.catalog == $scope.rootCatalog;
			$scope.action = "addsubcat";
		};
		$scope.updateCatalog = function() {
			//var editCat = null;
			if ($scope.action == null) {
				$scope.catalog.name = $scope.catName;
				$scope.catalog.des = $scope.catDes;
				$scope.catalog.token.userName = $rootScope.user.userNameText;
				//var me = this;
				Catalog.save($scope.catalog,
					function(dataSuccess) {
						$scope.getCatalogCallBack(dataSuccess);
					},
					function(dataFail) {
					}
				);
				return;
			}
			if ($scope.action == "addsubcat") {
				var newCatalog = {};
				newCatalog.name = $scope.catName;
				newCatalog.des = $scope.catDes;
				newCatalog.token = $scope.catalog.token;
				newCatalog.parentId = $scope.catalog.id;
				newCatalog.allSubCatalogs = null;
				newCatalog.allItems = null;
				newCatalog.allFields = null;
				Catalog.save(newCatalog,
					function(dataSuccess) {
						$scope.getCatalogCallBack(dataSuccess);
					},
					function(dataFail) {
					}
				);
			}
		};
		$scope.addSubCatalog = function() {
			//this.selectToAddSubCat($scope.catalog);
			$scope.action = "addsubcat";
			this.updateCatalog();
		};
		$scope.deleteCat = function(catDelete) {
			Catalog.delete({user: $rootScope.user.userNameText, catalogId: catDelete.id},
				function(dataSuccess) {
					$scope.getCatalogCallBack(dataSuccess);
				},
				function(dataFail) {
				}
			);
		};
		
}]);

smartpadControllers.controller('CatalogCtrl2', ['$scope', '$rootScope', 'Catalog',
  function($scope, $rootScope, Catalog) {
    
    $scope.getCatalogCallBack = function(catalog) {
		$scope.rootCatalog = catalog.data[0];
		$scope.rootCatalog.name = "Catalog";
		$scope.rootCatalog.root = true;
		angular.forEach($scope.rootCatalog.allSubCatalogs, function(currCatalog, keyAsIndex) {
		   currCatalog.index = keyAsIndex;
		 });
		$scope.catalog = $scope.rootCatalog;
		$scope.catalogIndex = $scope.rootCatalog;
		$scope.selectedCatalogToAddSubCat = null;//$scope.rootCatalog;//{id: null, name: "", des: "", checkedToAddSubCat: false};
		$scope.catToEdit = null;
		$scope.catName = null;
		$scope.catDes = null;
		$scope.readonly = true;
	};
	
	Catalog.get({user: $rootScope.user.userNameText}, function(catalog) {
		$scope.getCatalogCallBack(catalog);
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
		//var editCat = null;
		if ($scope.catToEdit != null) {
			$scope.catToEdit.name = $scope.catName;
			$scope.catToEdit.des = $scope.catDes;
			$scope.catToEdit.token.userName = $rootScope.user.userNameText;
			//var me = this;
			Catalog.save($scope.catToEdit,
				function(dataSuccess) {
					$scope.getCatalogCallBack(dataSuccess);
				},
				function(dataFail) {
				}
			);
			return;
		}
		if ($scope.selectedCatalogToAddSubCat != null) {
			var newCatalog = {};
			newCatalog.name = $scope.catName;
			newCatalog.des = $scope.catDes;
			newCatalog.token = $scope.selectedCatalogToAddSubCat.token;
			newCatalog.parentId = $scope.selectedCatalogToAddSubCat.id;
			newCatalog.allSubCatalogs = null;
			newCatalog.allItems = null;
			newCatalog.allFields = null;
			Catalog.save(newCatalog,
				function(dataSuccess) {
					$scope.getCatalogCallBack(dataSuccess);
				},
				function(dataFail) {
				}
			);
		}
	};
	$scope.deleteCat = function(catDelete) {
		Catalog.delete({user: $rootScope.user.userNameText, catalogId: catDelete.id},
			function(dataSuccess) {
				$scope.getCatalogCallBack(dataSuccess);
			},
			function(dataFail) {
			}
		);
	};
	$scope.clearForm = function() {
		$scope.catToEdit = null;
		$scope.selectedCatalogToAddSubCat = null;
		$scope.catName = null;
		$scope.catDes = null;
		$scope.readonly = true;
	};

  }]);
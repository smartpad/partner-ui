var catalogItemController = angular.module('catalogItemController', []);

// use $rootScope.catalog
catalogItemController.controller('CatalogItemCtrl', ['$scope', '$rootScope', 'CatalogItem',
  function($scope, $rootScope, CatalogItem) {
	//$scope.catalog = $rootScope.catalog;

	$scope.init = function() {
		$scope.catalogItem = {};
		$scope.catalogItem.valuesSingle = {};
		$scope.catalogItem.valuesMulti = {};
	};
	$scope.clear = function() {
		this.init();
	};
	$scope.addCatItem = function() {
		this.clear();
	};
	$scope.selectedItem = function(catalogItem) {
		this.init();
		$scope.catalogItem.id = catalogItem.id;
		$scope.catalogItem.gps = catalogItem.gps;
		$scope.catalogItem.branchName = catalogItem.branchName;
		angular.forEach($rootScope.catalog.allFields, function(field, keyAsIndex) {
			$scope.catalogItem.valuesSingle[field.id] = catalogItem.valuesSingle[field.id];
			$scope.catalogItem.valuesMulti[field.id] = catalogItem.valuesMulti[field.id];
		});
	};
	$scope.saveCatItem = function() {
		CatalogItem.save($scope.catalogItem,
				function(dataSuccess) {
					// Update at parent cata $scope.getCatCallBack(dataSuccess);
				},
				function(dataFail) {
				}
			);
	};
	$scope.delStore = function(store) {
		CatalogItem.delete({user: $rootScope.user.userNameText, catalogItemId: catalogItem.id},
			function(dataSuccess) {
				// Update at parent cata $scope.getCatCallBack(dataSuccess);
			},
			function(dataFail) {
			}
		);
	}
  }]);
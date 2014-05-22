var catalogItemController = angular.module('catalogItemController', []);

// inherit getCatalogCallBack, catalog
catalogItemController.controller('CatalogItemCtrl', ['$scope', '$rootScope', 'CatalogItem',
  function($scope, $rootScope, CatalogItem) {
	$scope.isSysCat = false;
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
		angular.forEach($scope.$parent.catalog.allFields, function(field, keyAsIndex) {
			$scope.catalogItem.valuesSingle[field.id] = catalogItem.valuesSingle[field.id];
			$scope.catalogItem.valuesMulti[field.id] = catalogItem.valuesMulti[field.id];
		});
	};
	$scope.saveCatItem = function() {
		CatalogItem.save({user: $rootScope.user.userNameText, catalogId: $scope.$parent.catalog.id, sysCatalogItemId: $scope.$parent.isSysCat}, 
				$scope.catalogItem,
				function(dataSuccess) {
					// Update at parent cata $scope.getCatCallBack(dataSuccess);
					$scope.$parent.getCatalogCallBack(dataSuccess);
					$scope.clear();
				},
				function(dataFail) {
				}
			);
	};
	$scope.delItem = function(catalogItem) {
		CatalogItem.delete({user: $rootScope.user.userNameText, catalogItemId: catalogItem.id, catalogId: $scope.$parent.catalog.id, sysCatalogItemId: $scope.$parent.isSysCat},
			function(dataSuccess) {
				// Update at parent cata $scope.getCatCallBack(dataSuccess);
				$scope.$parent.getCatalogCallBack(dataSuccess);
			},
			function(dataFail) {
			}
		);
	}
  }]);
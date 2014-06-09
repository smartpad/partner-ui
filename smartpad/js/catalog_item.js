var catalogItemController = angular.module('catalogItemController', []);

// inherit getCatalogCallBack, catalog
catalogItemController.controller('CatalogItemCtrl', ['$scope', '$rootScope', 'CatalogItem',
  function($scope, $rootScope, CatalogItem) {
	$scope.isSysCat = false;
	$scope.init = function() {
		$scope.catalogItem = {};
		$scope.catalogItem.valuesSingle = {};
		$scope.catalogItem.valuesMulti = {};
		$scope.catalogItem.branchName = $scope.$parent.branchNameDefault;
	};
	$scope.$on('clear-event', function(event) {
		$scope.clear();
	});
	$scope.clear = function() {
		this.init();
	};
	/*$scope.addCatItem = function() {
		this.clear();
	};*/
	$scope.selectedItem = function(catalogItem) {
		this.clear();
		$scope.catalogItem.id = catalogItem.id;
		$scope.catalogItem.gps = catalogItem.gps;
		$scope.catalogItem.branchName = catalogItem.branchName;
		angular.forEach($scope.$parent.allFields, function(field, keyAsIndex) {
			$scope.catalogItem.valuesSingle[field.id] = catalogItem.valuesSingle[field.id];
			$scope.catalogItem.valuesMulti[field.id] = catalogItem.valuesMulti[field.id];
		});
	};
	$scope.saveCatItem = function() {
		// add param selectedSubSys.id
		var subSysCatId = null;
		if ($scope.$parent.selectedSubSys) {
			subSysCatId = $scope.$parent.selectedSubSys.id;
		}
		var catalogId = $scope.$parent.catalog.id;
		if ($scope.$parent.isSysCat) {
			catalogId = $scope.$parent.selectedSysCatId;
			subSysCatId = null;
		}
		CatalogItem.save({user: $rootScope.user.userNameText, catalogId: catalogId, 
						sysCatId: subSysCatId/*$scope.$parent.selectedSysCatId*//*, isSysCat: $scope.$parent.isSysCat*/}, 
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
		CatalogItem.delete({user: $rootScope.user.userNameText, catalogItemId: catalogItem.id, catalogId: $scope.$parent.catalog.id,
							isSysCat: $scope.$parent.isSysCat},
			function(dataSuccess) {
				// Update at parent cata $scope.getCatCallBack(dataSuccess);
				$scope.$parent.getCatalogCallBack(dataSuccess);
			},
			function(dataFail) {
			}
		);
	}
  }]);
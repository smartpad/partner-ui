var sysCatalogItemController = angular.module('sysCatalogItemController', []);

sysCatalogItemController.controller('SysCatalogItemCtrl', ['$scope', '$rootScope', 'Catalog',
	function($scope, $rootScope, Catalog) {
		$scope.isSysCat = true;
		$scope.clearForm = function() {
			$scope.catalog = $scope.rootCatalog;
			//$scope.readonly = true;
			$scope.$broadcast('clear-event');
		};
		$scope.getCatalogCallBack = function(sysCat) {
			$scope.rootCatalog = sysCat;
			$scope.catalogIndex = $scope.rootCatalog;
			this.clearForm();
			this.changeSelectSysCat($scope.rootCatalog);
		};
		Catalog.get({sys: 'sys', user: $rootScope.user.userNameText}, function(catalogResult) {
			$scope.getCatalogCallBack(catalogResult.data[0]);
		});
		$scope.changeSelectSysCat = function(sysCat) {
			if (!sysCat) {
				return;
			}
			$scope.catalog = sysCat;
			$scope.selectedSysCatId = sysCat.id;
			this.pagingItems(1);
			/*if (!$scope.paging) {
				$scope.paging = {};
				$scope.paging.pageSize = 2;
				$scope.paging.pageNumber = 1;
			}
			Catalog.getItems({user: $rootScope.user.userNameText, catalogId: $scope.catalog.id, sys: true, pageSize: $scope.paging.pageSize, pageNumber: $scope.paging.pageNumber}, function(catalogItemsResult) {
				$scope.catalog.allItems = catalogItemsResult.allItems;
				$scope.paging = catalogItemsResult.paging;
			});*/
		};
		$scope.pagingItems = function(pageNumber) {
			if (!$scope.paging) {
				$scope.paging = {};
				$scope.paging.pageSize = 2;
			}
			$scope.paging.pageNumber = pageNumber;

			Catalog.getItems({user: $rootScope.user.userNameText, catalogId: $scope.catalog.id, pageSize: $scope.paging.pageSize, pageNumber: $scope.paging.pageNumber}, function(catalogItemsResult) {
				$scope.catalog.allItems = catalogItemsResult.allItems;
				$scope.paging = catalogItemsResult.paging;
				$scope.branchNameDefault = catalogItemsResult.branchName;
				$scope.pageNumbers = [];
				for (var i = $scope.paging.firstPageNumber; i < $scope.paging.lastPageNumber + 1; i++) {
					$scope.pageNumbers.push(i);
				}
			});
		}
}]);
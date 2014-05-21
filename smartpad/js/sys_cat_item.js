var sysCatalogItemController = angular.module('sysCatalogItemController', []);

sysCatalogItemController.controller('SysCatalogItemCtrl', ['$scope', '$rootScope', 'Catalog',
	function($scope, $rootScope, Catalog) {
		$scope.isSysCat = true;
		$scope.getCatalogCallBack = function(sysCat) {
			$scope.catalog = sysCat;
			$scope.catalogIndex = sysCat;
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
		};
}]);
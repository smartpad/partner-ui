'use strict';

/* Controllers */

var smartpadControllers = angular.module('smartpadControllers', ['LocalStorageModule']);
smartpadControllers.config(['localStorageServiceProvider', function(localStorageServiceProvider){
}]);
smartpadControllers.controller('MainAppCtrl', ['$scope', '$rootScope', '$routeParams', '$location',
  function($scope, $rootScope, $routeParams, $location) {    
	// TODO	
  }]);
smartpadControllers.controller('RegistryCtrl', ['$scope', '$routeParams', 'User',
  function($scope, $routeParams, User) {
    // TODO
  }]);

smartpadControllers.controller('CatalogCtrl', ['$scope', '$rootScope', 'Catalog', 'CatalogItem', 'localStorageService',
	function($scope, $rootScope, Catalog, CatalogItem, localStorageService) {
		$rootScope.user = localStorageService.get('user');

		$scope.init = function(isSysCat) {
			$scope.isSysCat = isSysCat;
			// Load catalog info at initial
			Catalog.get({user: $rootScope.user.userNameText, sys: $scope.isSysCat}, function(catalogResult) {
				$scope.getCatalogCallBack(catalogResult);
			});
		};
		$scope.clearForm = function() {
			$scope.catalog = $scope.rootCatalog;
			$scope.action = null;//null, "addsubcat"
			$scope.catName = null;
			$scope.catDes = null;
			//$scope.readonly = true;
			$scope.allFields = null;
			$scope.selectedSubSys = null;
			$scope.$broadcast('clear-event');
	  		/*$scope.$on('clear-event-response', function () {
			});*/
		};

		$scope.getCatalogCallBack = function(catalog) {
			$scope.rootCatalog = catalog.data[0];
			$scope.catalogIndex = $scope.rootCatalog;

			$scope.subSysCat = catalog.subSysCat;
			//$scope.branchNameDefault = catalog.branchName;
			//$scope.rootCatalog.name = "Root Catalog";
			$scope.rootCatalog.root = true;
			angular.forEach($scope.rootCatalog.allSubCatalogs, function(currCatalog, keyAsIndex) {
			   currCatalog.index = keyAsIndex;
			 });
			this.clearForm();
			this.loadSubCatalog($scope.rootCatalog);
		};

		$scope.loadSubCatalog = function(catalog) {
			/*var paging = {};
			paging.pageSize = -1;
			paging.pageNumber = 1;*/

			$scope.clearForm();

			$scope.catalog = catalog;

			if ($scope.isSysCat) {
				$scope.selectedSysCatId = catalog.id;
			}
			$scope.branchNameDefault = catalog.branchName;
			$scope.allFields = catalog.allFields;
			$scope.$broadcast('clear-event');

			$scope.catName = catalog.name;
			$scope.catDes = catalog.des;

			this.pagingItems(1);
		};
		$scope.loadSubSysCat = function(subSysCat) {
			if ($scope.isSysCat) {
				return;
			}
			
			$scope.selectedSubSys = subSysCat;
			$scope.branchNameDefault = $scope.selectedSubSys.branchName;
			$scope.allFields = $scope.selectedSubSys.allFields;
			$scope.$broadcast('clear-event');
		};
		$scope.addCatItem = function() {
			$scope.$broadcast('clear-event');
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
				$scope.pageNumbers = [];
				for (var i = $scope.paging.firstPageNumber; i < $scope.paging.lastPageNumber + 1; i++) {
					$scope.pageNumbers.push(i);
				}
				$scope.$broadcast('clear-event');
			});
		}
		$scope.selectToAddSubCat = function(parentCatalogOfNewSubCat) {
			if ($scope.isSysCat) {
				return;
			}
			this.clearForm();
			$scope.catalog = parentCatalogOfNewSubCat;
			//$scope.readonly = $scope.catalog == $scope.rootCatalog;
			$scope.action = "addsubcat";
		};
		$scope.updateCatalog = function() {
			if ($scope.isSysCat) {
				return;
			}
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
			if ($scope.isSysCat) {
				return;
			}
			//this.selectToAddSubCat($scope.catalog);
			$scope.action = "addsubcat";
			this.updateCatalog();
		};
		$scope.deleteCat = function(catDelete) {
			if ($scope.isSysCat) {
				return;
			}
			Catalog.delete({user: $rootScope.user.userNameText, catalogId: catDelete.id},
				function(dataSuccess) {
					$scope.getCatalogCallBack(dataSuccess);
				},
				function(dataFail) {
				}
			);
		};
		
}]);

smartpadControllers.controller('BranchCtrl', ['$scope', '$rootScope', 'Branch',  'localStorageService',
  function($scope, $rootScope, Branch, localStorageService) {
	$rootScope.user = localStorageService.get('user');
		$scope.init = function() {
			$scope.hours = [25];
			$scope.minutes = [61];
			$scope.hours[0] = {id:0, name:'--'};
			for (var h = 1; h < 25; h++) {
				$scope.hours[h] = {};
				$scope.hours[h].id = h;
				$scope.hours[h].name = h;
				if (h < 10) {
					$scope.hours[h].name = '0' + h;
				}
			}
			$scope.minutes[0] = {id:0, name:'--'};
			for (var m = 1; m < 61; m++) {
				$scope.minutes[m] = {};
				$scope.minutes[m].id = m;
				$scope.minutes[m].name = m;
				if (m < 10) {
					$scope.minutes[m].name = '0' + m;
				}
			}
			this.initOpenHours();
		};
		$scope.initOpenHours = function () {
			// Init data for open hours
			$scope.openHoursDes = null;
			$scope.dayHourFrom = $scope.hours[0];
			$scope.dayHourTo = $scope.hours[0];
			$scope.dayMinFrom = $scope.minutes[0];
			$scope.dayMinTo = $scope.minutes[0];
			
			$scope.sarHourFrom = $scope.hours[0];
			$scope.sarHourTo = $scope.hours[0];
			$scope.sarMinFrom = $scope.minutes[0];
			$scope.sarMinTo = $scope.minutes[0];
			
			$scope.sunHourFrom = $scope.hours[0];
			$scope.sunHourTo = $scope.hours[0];
			$scope.sunMinFrom = $scope.minutes[0];
			$scope.sunMinTo = $scope.minutes[0];
			
			$scope.holidayHourFrom = $scope.hours[0];
			$scope.holidayHourTo = $scope.hours[0];
			$scope.holidayMinFrom = $scope.minutes[0];
			$scope.holidayMinTo = $scope.minutes[0];
		};
		
		$scope.debug = function() {
			console.log($scope.dayHourFrom);
		};
		
		$scope.clearForm = function() {
			$scope.selectedStore = $scope.rootBranch;
			$scope.name = null;
			$scope.desc = null;
			$scope.email = null;
			$scope.phone = null;
			$scope.addressLines = null;
			this.initOpenHours();
		};
		$scope.selectStore = function(store) {
			// TODO check editing store to notify user save it
			$scope.selectedStore = store;
			$scope.name = store.name;
			$scope.desc = store.desc;
			$scope.email = store.email;
			$scope.phone = store.phone;
			$scope.addressLines = store.addressLines;
			$scope.selectedSysCatId = store.rootCatalog.rootCatId;
			
			$scope.openHoursDes = store.openHours.desc;
			$scope.dayHourFrom = $scope.hours[store.openHours.dailyHour.fromValue];
			$scope.dayHourTo = $scope.hours[store.openHours.dailyHour.toValue];
			$scope.dayMinFrom = $scope.minutes[store.openHours.dailyMin.fromValue];
			$scope.dayMinTo = $scope.minutes[store.openHours.dailyMin.toValue];
			
			$scope.sarHourFrom = $scope.hours[store.openHours.sarHour.fromValue];
			$scope.sarHourTo = $scope.hours[store.openHours.sarHour.toValue];
			$scope.sarMinFrom = $scope.minutes[store.openHours.sarMin.fromValue];
			$scope.sarMinTo = $scope.minutes[store.openHours.sarMin.toValue];
			
			$scope.sunHourFrom = $scope.hours[store.openHours.sunHour.fromValue];
			$scope.sunHourTo = $scope.hours[store.openHours.sunHour.toValue];
			$scope.sunMinFrom = $scope.minutes[store.openHours.sunMin.fromValue];
			$scope.sunMinTo = $scope.minutes[store.openHours.sunMin.toValue];
			
			$scope.holidayHourFrom = $scope.hours[store.openHours.holidayHour.fromValue];
			$scope.holidayHourTo = $scope.hours[store.openHours.holidayHour.toValue];
			$scope.holidayMinFrom = $scope.minutes[store.openHours.holidayMin.fromValue];
			$scope.holidayMinTo = $scope.minutes[store.openHours.holidayMin.toValue];
		}
		$scope.getBranchCallBack = function(branchList) {
			$scope.rootBranch = branchList.rootBranch;
			$scope.rootBranch.root = true;
			//$scope.newBranch = $scope.rootBranch;
			//$scope.newBranch.new = true;
			$scope.allStores = branchList.allStores;
			if (branchList.sysCat) {
				$scope.sysCat = branchList.sysCat;
				$scope.catalogIndex = $scope.sysCat;
			}
			this.selectStore($scope.rootBranch);
		};
		$scope.addStore = function() {
			this.clearForm();
			// selectedStore is setting to rootBranch so need reset id to mark this is a new
			$scope.selectedStore.id = null;
			console.log('rootStore');
			console.log($scope.rootBranch);
		}
		$scope.changeSelectSysCat = function(sysCat) {
			if (!sysCat) {
				return;
			}
			$scope.selectedSysCatId = sysCat.id;
		};
		Branch.get({user: $rootScope.user.userNameText}, function(branchResult) {
			$scope.getBranchCallBack(branchResult);
		});
		
		$scope.save = function() {
			$scope.selectedStore.name = $scope.name;
			$scope.selectedStore.desc = $scope.desc;
			$scope.selectedStore.email = $scope.email;
			$scope.selectedStore.phone = $scope.phone;
			$scope.selectedStore.addressLines = $scope.addressLines;
			$scope.selectedStore.rootCatalog.rootCatId = $scope.selectedSysCatId;
			
			$scope.selectedStore.openHours.desc = $scope.openHoursDes;
			$scope.selectedStore.openHours.dailyHour.fromValue = $scope.dayHourFrom.id;
			$scope.selectedStore.openHours.dailyHour.toValue = $scope.dayHourTo.id;
			$scope.selectedStore.openHours.dailyMin.fromValue = $scope.dayMinFrom.id;
			$scope.selectedStore.openHours.dailyMin.toValue = $scope.dayMinTo.id;
			
			$scope.selectedStore.openHours.sarHour.fromValue = $scope.sarHourFrom.id;
			$scope.selectedStore.openHours.sarHour.toValue = $scope.sarHourTo.id;
			$scope.selectedStore.openHours.sarMin.fromValue = $scope.sarMinFrom.id;
			$scope.selectedStore.openHours.sarMin.toValue = $scope.sarMinTo.id;
			
			$scope.selectedStore.openHours.sunHour.fromValue = $scope.sunHourFrom.id;
			$scope.selectedStore.openHours.sunHour.toValue = $scope.sunHourTo.id;
			$scope.selectedStore.openHours.sunMin.fromValue = $scope.sunMinFrom.id;
			$scope.selectedStore.openHours.sunMin.toValue = $scope.sunMinTo.id;
			
			$scope.selectedStore.openHours.holidayHour.fromValue = $scope.holidayHourFrom.id;
			$scope.selectedStore.openHours.holidayHour.toValue = $scope.holidayHourTo.id;
			$scope.selectedStore.openHours.holidayMin.fromValue = $scope.holidayMinFrom.id;
			$scope.selectedStore.openHours.holidayMin.toValue = $scope.holidayMinTo.id;

			$scope.selectedStore.userName = $rootScope.user.userNameText;
			// TODO cat, gps
			Branch.save($scope.selectedStore,
				function(dataSuccess) {
					$scope.getBranchCallBack(dataSuccess);
				},
				function(dataFail) {
				}
			);
		}
		$scope.delStore = function(store) {
			Branch.delete({user: $rootScope.user.userNameText, branchId: store.id},
				function(dataSuccess) {
					$scope.getBranchCallBack(dataSuccess);
				},
				function(dataFail) {
				}
			);
		}
  }]);
'use strict';

/* Controllers */

var smartpadControllers = angular.module('smartpadControllers', []);

smartpadControllers.controller('MainAppCtrl', ['$scope', '$rootScope', '$routeParams', '$location',
  function($scope, $rootScope, $routeParams, $location) {    
	// TODO	
  }]);
smartpadControllers.controller('RegistryCtrl', ['$scope', '$routeParams', 'User',
  function($scope, $routeParams, User) {
    // TODO
  }]);

smartpadControllers.controller('CatalogCtrl', ['$scope', '$rootScope', 'Catalog', 'CatalogItem',
	function($scope, $rootScope, Catalog, CatalogItem) {
		$scope.isSysCat = false;

		$scope.clearForm = function() {
			$scope.catalog = $scope.rootCatalog;
			$scope.action = null;//null, "addsubcat"
			$scope.catName = null;
			$scope.catDes = null;
			//$scope.readonly = true;

			$scope.$broadcast('clear-event');
	  		/*$scope.$on('clear-event-response', function () {
			});*/
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
			this.loadSubCatalog($scope.rootCatalog);
		};
		Catalog.get({user: $rootScope.user.userNameText}, function(catalogResult) {
			$scope.getCatalogCallBack(catalogResult);
		});
		$scope.loadSubCatalog = function(catalog) {
			/*var paging = {};
			paging.pageSize = -1;
			paging.pageNumber = 1;*/
			$scope.clearForm();
			$scope.catalog = catalog;
			$scope.catName = catalog.name;
			$scope.catDes = catalog.des;
			this.pagingItems(1);
			//$scope.readonly = $scope.catalog == $scope.rootCatalog;
		};
		$scope.pagingItems = function(pageNumber) {
			if (!$scope.paging) {
				$scope.paging = {};
				$scope.paging.pageSize = 2;
			}
			$scope.paging.pageNumber = pageNumber;
			Catalog.getItems({user: $rootScope.user.userNameText, catalogId: $scope.catalog.id, sys: false, pageSize: $scope.paging.pageSize, pageNumber: $scope.paging.pageNumber}, function(catalogItemsResult) {
				$scope.catalog.allItems = catalogItemsResult.allItems;
				$scope.paging = catalogItemsResult.paging;
				$scope.branchNameDefault = catalogItemsResult.branchName;
				$scope.pageNumbers = [];
				for (var i = $scope.paging.firstPageNumber; i < $scope.paging.lastPageNumber + 1; i++) {
					$scope.pageNumbers.push(i);
				}
			});
		}
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
  
smartpadControllers.controller('BranchCtrl', ['$scope', '$rootScope', 'Branch',
  	function($scope, $rootScope, Branch) {
		
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
			// TODO gps
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
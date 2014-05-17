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
                	console.log(err)
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
  
smartpadControllers.controller('BranchCtrl', ['$scope', '$rootScope', 'Branch',
  function($scope, $rootScope, Branch) {
		$scope.hours = [24];
		$scope.minutes = [60];
		for (var h = 0; h < 24; h++) {
			$scope.hours[h] = {};
			$scope.hours[h].id = h;
			var id = h + 1;
			$scope.hours[h].name = id;
			if (id < 10) {
				$scope.hours[h].name = '0' + id;
			}
		}
		for (var m = 0; m < 60; m++) {
			$scope.minutes[m] = {};
			$scope.minutes[m].id = m;
			var id = m + 1;
			$scope.minutes[m].name = id;
			if (id < 10) {
				$scope.minutes[m].name = '0' + id;
			}
		}
		// Init data for open hours
		$scope.init = function () {
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
			init();
		};
		$scope.selectStore = function(store) {
			// TODO check editing store to notify user save it
			$scope.selectedStore = store;
			$scope.name = store.name;
			$scope.desc = store.desc;
			$scope.email = store.email;
			$scope.phone = store.phone;
			$scope.addressLines = store.address;
			
			$scope.dayHourFrom = $scope.hours[store.dayHourFrom];
			$scope.dayHourTo = $scope.hours[store.dayHourTo];
			$scope.dayMinFrom = $scope.minutes[store.dayMinFrom];
			$scope.dayMinTo = $scope.minutes[store.dayMinTo];
			
			$scope.sarHourFrom = $scope.hours[store.sarHourFrom];
			$scope.sarHourTo = $scope.hours[store.sarHourTo];
			$scope.sarMinFrom = $scope.minutes[store.sarMinFrom];
			$scope.sarMinTo = $scope.minutes[store.sarMinTo];
			
			$scope.sunHourFrom = $scope.hours[store.sunHourFrom];
			$scope.sunHourTo = $scope.hours[store.sunHourTo];
			$scope.sunMinFrom = $scope.minutes[store.sunMinFrom];
			$scope.sunMinTo = $scope.minutes[store.sunMinTo];
			
			$scope.holidayHourFrom = $scope.hours[store.holidayHourFrom];
			$scope.holidayHourTo = $scope.hours[store.holidayHourTo];
			$scope.holidayMinFrom = $scope.minutes[store.holidayMinFrom];
			$scope.holidayMinTo = $scope.minutes[store.holidayMinTo];
		}
		$scope.getBranchCallBack = function(branchList) {
			$scope.rootBranch = branchList.rootBranch;
			$scope.rootBranch.root = true;
			//$scope.newBranch = $scope.rootBranch;
			//$scope.newBranch.new = true;
			$scope.allStores = branchList.allStores;
			this.selectStore($scope.rootBranch);
		};
		$scope.addStore = function() {
			clearForm();
			// selectedStore is setting to rootBranch so need reset id to mark this is a new
			$scope.selectedStore.id = null;
		}

		Branch.get({user: $rootScope.user.userNameText}, function(branchResult) {
			$scope.getBranchCallBack(branchResult);
		});
		
		$scope.save = function() {
			$scope.selectedStore.name = name;
			$scope.selectedStore.desc = desc;
			$scope.selectedStore.email = email;
			$scope.selectedStore.phone = phone;
			$scope.selectedStore.addressLines = addressLines;
			
			$scope.selectedStore.dayHourFrom = $scope.dayHourFrom;
			$scope.selectedStore.dayHourTo = $scope.dayHourTo;
			$scope.selectedStore.dayMinFrom = $scope.dayMinFrom;
			$scope.selectedStore.dayMinTo = $scope.dayMinTo;
			
			$scope.selectedStore.sarHourFrom = $scope.sarHourFrom;
			$scope.selectedStore.sarHourTo = $scope.sarHourTo;
			$scope.selectedStore.sarMinFrom = $scope.sarMinFrom;
			$scope.selectedStore.sarMinTo = $scope.sarMinTo;
			
			$scope.selectedStore.sunHourFrom = $scope.sunHourFrom;
			$scope.selectedStore.sunHourTo = $scope.sunHourTo;
			$scope.selectedStore.sunMinFrom = $scope.sunMinFrom;
			$scope.selectedStore.sunMinTo = $scope.sunMinTo;
			
			$scope.selectedStore.holidayHourFrom = $scope.holidayHourFrom;
			$scope.selectedStore.holidayHourTo = $scope.holidayHourTo;
			$scope.selectedStore.holidayMinFrom = $scope.holidayMinFrom;
			$scope.selectedStore.holidayMinTo = $scope.holidayMinTo;
			
			$scope.selectedStore.token.userName = $rootScope.user.userNameText;
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
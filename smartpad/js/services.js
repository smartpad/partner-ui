'use strict';

/* Services */

var userServices = angular.module('userServices', ['ngResource']); 
userServices.factory('User', ['$resource',
  function($resource) {
    return $resource('http://localhost:8090/acc', null,
					{acc: {
						method: 'POST',
						headers: {
						'Content-Type': 'application/json'
					}}}
	);
}]);

/*var catalogServices = angular.module('catalogServices', ['ngResource']);
catalogServices.factory('Catalog', ['$resource',
  function($resource){
    return $resource('http://localhost:8090/catalog/get-all-catalog?userName=:userName', null);
}]);*/

var catalogServices = angular.module('catalogServices', ['ngResource']);
catalogServices.factory('Catalog', ['$resource',
  function($resource) {
    return $resource('http://localhost:8090/catalog/:sys/:user/:catalogId', null,
		    		{getItems: {
						method: 'GET',
						params: { pageSize: '@pageSize', pageNumber: '@pageNumber' },
						isArray: false
					}}
    );
}]);

var catalogItemServices = angular.module('catalogItemServices', ['ngResource']);
catalogItemServices.factory('CatalogItem', ['$resource',
  function($resource) {
    return $resource('http://localhost:8090/catalogItem/:user/:catalogItemId/:catalogId/:sysCatalogItemId', null);
}]);

var branchServices = angular.module('branchServices', ['ngResource']);
branchServices.factory('Branch', ['$resource',
  function($resource) {
    return $resource('http://localhost:8090/branch/:user/:branchId', null);
}]);
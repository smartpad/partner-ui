'use strict';

/* Services */

var userServices = angular.module('userServices', ['ngResource']); 
userServices.factory('User', ['$resource',
  function($resource){
    return $resource('http://localhost:8090/acc', null,
					{acc: {
						method: 'POST',
						headers: {
						'Content-Type': 'application/json'
					}}}
	)
}]);

var catalogServices = angular.module('catalogServices', ['ngResource']);
catalogServices.factory('Catalog', ['$resource',
  function($resource){
    return $resource('http://localhost:8090/catalog/get-all-catalog?userName=:userName', null)
}]);
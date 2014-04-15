'use strict';

/* Services */

var userServices = angular.module('userServices', ['ngResource']);
userServices.config(function($httpProvider) {
	/*console.log("$httpProvider.defaults");
	console.log($httpProvider.defaults);
	console.log("$httpProvider.defaults.headers");
	console.log($httpProvider.defaults.headers);
	delete $httpProvider.defaults.headers.common['X-Requested-With'];	
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.headers.common = {};
	$httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};*/
});
    
/*userServices.factory('User', ['$resource',
  function($resource){
    return $resource('http://localhost:8090/acc', 
	null, {send: {method:'POST', headers: {
            'Content-Type': 'application/json'
        }}}
	)}]);*/
  
userServices.factory('User', ['$resource',
  function($resource){
	//$resource.defaults.useXDomain = true;
    return $resource('http://localhost:8090/acc', null,
					{acc: {
						method: 'POST',
						headers: {
						'Content-Type': 'application/json'
					}}}
	)
}]);
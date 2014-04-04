'use strict';

/* Services */

var userServices = angular.module('userServices', ['ngResource']);

userServices.factory('User', ['$resource',
  function($resource){
    return $resource('http://localhost:9090/userId=:userId&passwordId=:passwordId', {}, {});
  }]);

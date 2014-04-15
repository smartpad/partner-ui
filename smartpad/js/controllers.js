'use strict';

/* Controllers */

var smartpadControllers = angular.module('smartpadControllers', []);
smartpadControllers.config(function($httpProvider) {
	console.log($httpProvider.defaults);
	delete $httpProvider.defaults.headers.common['X-Requested-With'];	
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

smartpadControllers.controller('LoginCtrl', ['$scope', '$routeParams', 'User', '$http',
  function($scope, $routeParams, User, $http) {
    
    $scope.login = function() {
	  /*$scope.user = User.get({userId: $scope.userNameText, passwordId: $scope.passwordText}, function(user) {
		alert("user " + user);
	  });*/
	  //alert("user " + angular.toJson($scope.user));
	  /*User.send({"data": angular.toJson($scope.user)}, {"userNameText": "lotte", "passwordText": "123abc"}, 
				function(data,headers)
                {
                   alert('SAVED');
                },
                function(err,headers)
                {
					console.log(err)
                    alert('FAILED ' + err + ' ' + headers);
                });*/
		
		var user = new User();
		user.userNameText = $scope.user.userNameText;
		user.passwordText = $scope.user.passwordText;
		//user.data = angular.toJson($scope.user);
		user.data = $scope.user;
		//console.log(user)
		
		delete $http.defaults.headers.common['X-Requested-With'];	
		$http.post('http://localhost:8090/acc', $scope.user).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log(data)
			console.log(status)
			console.log(headers)
			console.log(config)
			//alert('FAILED ' + headers);
		});
		/*user.$acc({}, function(data, headers)
                {
				   console.log(data)
                   alert('SAVED');
                },
                function(err, headers)
                {
					console.log(err)
                    alert('FAILED ' + err + ' ' + headers);
                });*/
		/*User.$acc({}, angular.toJson($scope.user), function(data, headers)
                {
				   console.log(data)
                   alert('SAVED');
                },
                function(err, headers)
                {
					console.log(err)
                    alert('FAILED ' + err + ' ' + headers);
                });*/
    }
  }]);

smartpadControllers.controller('RegistryCtrl', ['$scope', '$routeParams', 'User',
  function($scope, $routeParams, Phone) {
    // TODO
  }]);
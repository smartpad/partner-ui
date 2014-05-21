var loginController = angular.module('loginController', []);
/*loginController.config(function($httpProvider) {
	console.log($httpProvider.defaults);
	delete $httpProvider.defaults.headers.common['X-Requested-With'];	
});*/

loginController.controller('LoginCtrl', ['$scope', '$rootScope','$routeParams', 'User', '$location',
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
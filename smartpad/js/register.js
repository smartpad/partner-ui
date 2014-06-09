var registerController = angular.module('registerController', []);

registerController.controller('RegisterCtrl', ['$scope', '$rootScope','$routeParams', 'Register', '$location',
    function($scope, $rootScope, $routeParams, Register, $location) {
    $scope.user = {};
	$rootScope.user = {};
    $scope.register = function() {	
		var user = {};
		user.data = {};
		user.userNameText = $("#username-register").val();
		user.passwordText = $("#password-register").val();
		user = $scope.user;
		Register.registerUser(user).success(function (result, headers) {
			if (result.success) {
				//localStorageService.set('userNameText', data.data[0].userNameText);
				$location.path('/login');
				alert("Thanh cong!");
				return;
			}
            alert('Account invalid: ' + result.data[0]);
        }).
        error(function(error) {
        	alert(JSON.stringify(error));
            $scope.status = 'Unable to insert customer: ' + error.message;
        });
    }
  }]);
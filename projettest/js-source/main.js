var module = angular.module('myApp', []);
module.controller('angularctrl',['$scope','$http','$log',function($scope,$http,$log) {
	$scope.liste = [];
	$scope.init = function(){
		 var httpRequest = $http({
            method: 'GET',
            url: 'file:///C:/GitHub/hanyzhou.github.com/projettest/data-source/datamenager.json',
        }).success(function(data, status) {
            $scope.liste = data;
        });
	}
}]);
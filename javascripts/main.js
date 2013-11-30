var module = angular.module('app', []);
module.controller('mycounter',['$scope',function($scope) {
		$scope.dev = false;
		$scope.beers = [0, 1, 2, 3, 4, 5, 6];
	}
]);
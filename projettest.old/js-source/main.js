var module = angular.module('myApp', []);
module.controller('angularctrl',['$scope','$log',function($scope,$http,$log) {
	$scope.liste = [];
	$scope.etape = 0;
	$scope.openImgAction = false;
	$scope.soustitlestatus = "";
	$scope.init = function(){
		$scope.liste = dataMenager();
	}
	$scope.changeEtape = function(key){
		$scope.etape = key;
	}
	$scope.openImage=function(){
		if(!$scope.openImgAction) $scope.openImgAction = true;
	};
	$scope.hideImage=function(){
		if($scope.openImgAction) $scope.openImgAction = false;
	};
	$scope.openSoustitle = function(t){
		if($scope.soustitlestatus !== t){	
			$scope.soustitlestatus = t;
		}
		else{ $scope.soustitlestatus = ""; }
	};
}]);

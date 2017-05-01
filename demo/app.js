angular
	.module('myApp', ['WindowStorageModule'])
	.config(['windowStorageServiceProvider', function(windowStorageServiceProvider){
		windowStorageServiceProvider.setPrefix('wS_Demo');
	}])
	.controller('myCtrl', ['$scope', '$window', '$timeout', 'windowStorageService',
		function($scope, $window, $timeout, storageService){			
			$scope.$watch(function () {
					return $window['localStorage'] 
				}, function(nValue, o){
					$scope.localStorageDisplay = nValue;
				}
			);
			
			$scope.$watch(function () {
					return $window['sessionStorage'] 
				}, function(nValue, o){
					$scope.sessionStorageDisplay = nValue;
				}
			);
			
			$scope.set = storageService.set;
			$scope.get = storageService.get;
			$scope.getKeys = storageService.getKeys;
			$scope.remove = storageService.remove;
			$scope.clear = storageService.clear;
			$scope.sessionStorage = storageService.sessionStorage;
			$scope.localStorage = storageService.localStorage;
			$scope.setDefaultStorageType = storageService.setDefaultStorageType;
			$scope.clearAll = storageService.clearAll;
			
			$scope.defaultStorageType = storageService.getDefaultStorageType();
		}
	]);
	
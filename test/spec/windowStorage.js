describe('window storage provider', function () {
	  	
	beforeEach(module('WindowStorageModule', function($provide){
				
		$provide.value('$window', {
            localStorage: localStorageMock(),
			sessionStorage: sessionStorageMock()
        });		
	}));
	
	it('should have angular defined', inject(function () {
		expect(angular).toBeDefined();
	}));
	
	it('should have $window service defined', inject(function ($window) {
		expect($window).toBeDefined();
	}));
	
	it('should have window storage service defined', inject(function (windowStorageService) {
		expect(windowStorageService).toBeDefined();
	}));
	
	it('should set item to service local storage and get item from $window local storage', inject(function($window, windowStorageService){
		var key = 'keyforitem'
		var value = 'valueforitem'
		windowStorageService.setToLocalStorage(key, value);
		
		var valueExpeted = angular.toJson(value);
		var valueObtained = $window.localStorage.getItem(windowStorageService.getPrefix() + key);
		
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should set item to $window local storage and get item from window local storage', inject(function($window, windowStorageService){
		var key = 'keyforitem'
		var value = 'valueforitem'
		$window.localStorage.setItem(windowStorageService.getPrefix() + key, value);
				
		var valueExpeted = value;
		var valueObtained = windowStorageService.getFromLocalStorage(key);
				
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should set item to window session storage and get item from $window session storage', inject(function($window, windowStorageService){
		var key = 'keyforitem'
		var value = 'valueforitem'
		windowStorageService.setToSessionStorage(key, value);
		
		var valueExpeted = angular.toJson(value);
		var valueObtained = $window.sessionStorage.getItem(windowStorageService.getPrefix() + key);
		
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should set item to $window session storage and get item from window session storage', inject(function($window, windowStorageService){
		var key = 'keyforitem'
		var value = 'valueforitem'
		$window.sessionStorage.setItem(windowStorageService.getPrefix() + key, value);
				
		var valueExpeted = value;
		var valueObtained = windowStorageService.getFromSessionStorage(key);
				
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should get default window storage type', inject(function($window, windowStorageService){
				
		var valueExpeted = 'sessionStorage';
		var valueObtained = windowStorageService.getDefaultStorageType();
				
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should set default window storage type', inject(function($window, windowStorageService){				
		windowStorageService.setDefaultStorageType('localStorage');
		
		var valueExpeted = 'localStorage';
		var valueObtained = windowStorageService.getDefaultStorageType();
				
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should not set default window storage type when value is not \'localStorage\' or \'sessionStorage\'', inject(function($window, windowStorageService){				
		windowStorageService.setDefaultStorageType('FAIL_localStorage');
		
		var valueExpeted = 'sessionStorage';
		var valueObtained = windowStorageService.getDefaultStorageType();
				
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should set default window storage type on provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setDefaultStorageType('localStorage');
		});
		inject(function($window, windowStorageService){				
		
			var valueExpeted = 'localStorage';
			var valueObtained = windowStorageService.getDefaultStorageType();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
	
	it('should not set default window storage type when value is not \'localStorage\' or \'sessionStorage\' on provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setDefaultStorageType('FAIL_localStorage');
		});
		inject(function($window, windowStorageService){				
		
			var valueExpeted = 'sessionStorage';
			var valueObtained = windowStorageService.getDefaultStorageType();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
	
	it('should set prefix on window storage provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('prefixTest');
		});
		inject(function($window, windowStorageService){				
		
			var valueExpeted = 'prefixTest.';
			var valueObtained = windowStorageService.getPrefix();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
	
	it('should set prefix with only one dot at end on window storage provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('prefixTest.');
		});
		inject(function($window, windowStorageService){				
		
			var valueExpeted = 'prefixTest.';
			var valueObtained = windowStorageService.getPrefix();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
	
	it('should set an empty prefix on window storage provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('');
		});
		inject(function($window, windowStorageService){				
		
			var valueExpeted = '';
			var valueObtained = windowStorageService.getPrefix();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
	
	it('should set an empty prefix on window storage provider configuration and the item should be well setted and getted', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('');
		});
		inject(function($window, windowStorageService){				
			var key = 'keyforitem'
			var value = 'valueforitem'
			windowStorageService.setToLocalStorage(key, value);
			
			var valueExpeted_1 = '';
			var valueObtained_1 = windowStorageService.getPrefix();
			
			var valueExpeted_2 = angular.toJson(value);
			var valueObtained_2 = $window.localStorage.getItem(windowStorageService.getPrefix() + key);
		
			$window.localStorage.setItem(windowStorageService.getPrefix() + key, value);
				
			var valueExpeted_3 = value;
			var valueObtained_3 = windowStorageService.getFromLocalStorage(key);
							
			expect(valueObtained_1).toEqual(valueExpeted_1);
			expect(valueObtained_2).toEqual(valueExpeted_2);
			expect(valueObtained_3).toEqual(valueExpeted_3);
		});
	});
	
	it('should set prefix on window storage provider configuration and the item should be well setted and getted', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('testPrefix.');
		});
		inject(function($window, windowStorageService){				
			var key = 'keyforitem';
			var value = 'valueforitem';
			windowStorageService.setToLocalStorage(key, value);
			
			var valueExpeted_1 = 'testPrefix.';
			var valueObtained_1 = windowStorageService.getPrefix();
			
			var valueExpeted_2 = angular.toJson(value);
			var valueObtained_2 = $window.localStorage.getItem(windowStorageService.getPrefix() + key);
		
			$window.localStorage.setItem(windowStorageService.getPrefix() + key, value);
				
			var valueExpeted_3 = value;
			var valueObtained_3 = windowStorageService.getFromLocalStorage(key);
							
			expect(valueObtained_1).toEqual(valueExpeted_1);
			expect(valueObtained_2).toEqual(valueExpeted_2);
			expect(valueObtained_3).toEqual(valueExpeted_3);
		});
	});
	
	it('should be able to chain on window storage provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider
				.setPrefix('prefixTest')
				.setDefaultStorageType('localStorage');
		});
		inject(function($window, windowStorageService){				
		
			var valueExpeted_1 = 'localStorage';
			var valueObtained_1 = windowStorageService.getDefaultStorageType();
			
			var valueExpeted_2 = 'prefixTest.';
			var valueObtained_2 = windowStorageService.getPrefix();
			
			expect(valueObtained_1).toEqual(valueExpeted_1);
			expect(valueObtained_2).toEqual(valueExpeted_2);
		});
	});
	
	it('should return the keys of the items setted in local storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '3_valueforitem';
		windowStorageService.setToLocalStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
		windowStorageService.setToLocalStorage(key_3, value_3);
		
		var valueExpeted = [key_1, key_2, key_3];
		var valueObtained = windowStorageService.getKeysFromLocalStorage();
		
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should return the keys of the items setted in local storage that starts with a given input', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '3_valueforitem';
		windowStorageService.setToLocalStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
		windowStorageService.setToLocalStorage(key_3, value_3);
		
		var valueExpeted = [key_2];
		var valueObtained = windowStorageService.getKeysFromLocalStorage('2_');
		
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should return the keys of the items setted in session storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '3_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
		windowStorageService.setToSessionStorage(key_3, value_3);
		
		var valueExpeted = [key_1, key_2, key_3];
		var valueObtained = windowStorageService.getKeysFromSessionStorage();
		
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should return the keys of the items setted in session storage that starts with a given input', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '3_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
		windowStorageService.setToSessionStorage(key_3, value_3);
		
		var valueExpeted = [key_2];
		var valueObtained = windowStorageService.getKeysFromSessionStorage('2_');
		
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should return the keys of the items setted in local storage when perfix is set to empty on provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('');
		});
		inject(function($window, windowStorageService){				
			var key_1 = '1_keyforitem';
			var value_1 = '1_valueforitem';
			var key_2 = '2_keyforitem';
			var value_2 = '2_valueforitem';
			var key_3 = '3_keyforitem';
			var value_3 = '3_valueforitem';
			windowStorageService.setToLocalStorage(key_1, value_1);
			windowStorageService.setToLocalStorage(key_2, value_2);
			windowStorageService.setToLocalStorage(key_3, value_3);
			
			var valueExpeted = [key_1, key_2, key_3];
			var valueObtained = windowStorageService.getKeysFromLocalStorage();
			
			expect(valueObtained).toEqual(valueExpeted);
		})
	});
	
	it('should return the keys of the items setted in local storage that starts with a given input when perfix is set to empty on provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('');
		});
		inject(function($window, windowStorageService){				
			var key_1 = '1_keyforitem';
			var value_1 = '1_valueforitem';
			var key_2 = '2_keyforitem';
			var value_2 = '2_valueforitem';
			var key_3 = '3_keyforitem';
			var value_3 = '3_valueforitem';
			windowStorageService.setToLocalStorage(key_1, value_1);
			windowStorageService.setToLocalStorage(key_2, value_2);
			windowStorageService.setToLocalStorage(key_3, value_3);
			
			var valueExpeted = [key_2];
			var valueObtained = windowStorageService.getKeysFromLocalStorage('2_');
			
			expect(valueObtained).toEqual(valueExpeted);
		})
	});
	
	it('should return the keys of the items setted in session storage when perfix is set to empty on provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('');
		});
		inject(function($window, windowStorageService){				
			var key_1 = '1_keyforitem';
			var value_1 = '1_valueforitem';
			var key_2 = '2_keyforitem';
			var value_2 = '2_valueforitem';
			var key_3 = '3_keyforitem';
			var value_3 = '3_valueforitem';
			windowStorageService.setToSessionStorage(key_1, value_1);
			windowStorageService.setToSessionStorage(key_2, value_2);
			windowStorageService.setToSessionStorage(key_3, value_3);
			
			var valueExpeted = [key_1, key_2, key_3];
			var valueObtained = windowStorageService.getKeysFromSessionStorage();
			
			expect(valueObtained).toEqual(valueExpeted);
		})
	});
	
	it('should return the keys of the items setted in session storage that starts with a given input when perfix is set to empty on provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('');
		});
		inject(function($window, windowStorageService){				
			var key_1 = '1_keyforitem';
			var value_1 = '1_valueforitem';
			var key_2 = '2_keyforitem';
			var value_2 = '2_valueforitem';
			var key_3 = '3_keyforitem';
			var value_3 = '3_valueforitem';
			windowStorageService.setToSessionStorage(key_1, value_1);
			windowStorageService.setToSessionStorage(key_2, value_2);
			windowStorageService.setToSessionStorage(key_3, value_3);
			
			var valueExpeted = [key_2];
			var valueObtained = windowStorageService.getKeysFromSessionStorage('2_');
			
			expect(valueObtained).toEqual(valueExpeted);
		})
	});
	
	it('should remove item from localstorage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.setToLocalStorage(key, value);
		
		var valueExpeted_1 = value;
		var valueObtained_1 = windowStorageService.getFromLocalStorage(key);
		
		var valueObtained_2 = windowStorageService.removeFromLocalStorage(key);
		
		var valueObtained_3 = windowStorageService.getFromLocalStorage(key);
		
		expect(valueObtained_1).toEqual(valueExpeted_1);
		expect(valueObtained_2).toEqual(true);
		expect(valueObtained_3).toEqual(null);
	}));
	
	it('should remove multiple items from localstorage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '3_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '4_valueforitem';
		var key_4 = '4_keyforitem';
		var value_4 = '4_valueforitem';
		windowStorageService.setToLocalStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
		windowStorageService.setToLocalStorage(key_3, value_3);
		windowStorageService.setToLocalStorage(key_4, value_4);
				
		var valueObtained_1 = windowStorageService.removeFromLocalStorage(key_1, key_2, key_4);		
		var valueObtained_2 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_3 = windowStorageService.getFromLocalStorage(key_1);
		var valueObtained_4 = windowStorageService.getFromLocalStorage(key_2);
		var valueObtained_5 = windowStorageService.getFromLocalStorage(key_3);
		var valueObtained_6 = windowStorageService.getFromLocalStorage(key_4);
		
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([key_3]);
		expect(valueObtained_3).toEqual(null);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(value_4);
		expect(valueObtained_6).toEqual(null);
	}));
	
	it('should remove item from local storage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.setToLocalStorage(key, value);
		
		var valueExpeted_1 = value;
		var valueObtained_1 = windowStorageService.getFromLocalStorage(key);
		
		var valueObtained_2 = windowStorageService.removeFromLocalStorage(key);
		
		var valueObtained_3 = windowStorageService.getFromLocalStorage(key);
		
		expect(valueObtained_1).toEqual(valueExpeted_1);
		expect(valueObtained_2).toEqual(true);
		expect(valueObtained_3).toEqual(null);
	}));
	
	it('should remove multiple items from session storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '3_valueforitem';
		var key_4 = '4_keyforitem';
		var value_4 = '4_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
		windowStorageService.setToSessionStorage(key_3, value_3);
		windowStorageService.setToSessionStorage(key_4, value_4);
				
		var valueObtained_1 = windowStorageService.removeFromSessionStorage(key_1, key_2, key_4);		
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_2);
		var valueObtained_5 = windowStorageService.getFromSessionStorage(key_3);
		var valueObtained_6 = windowStorageService.getFromSessionStorage(key_4);
		
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([key_3]);
		expect(valueObtained_3).toEqual(null);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(value_3);
		expect(valueObtained_6).toEqual(null);
	}));
	
	it('should clear items from local storage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.setToLocalStorage(key, value);
		
		var valueExpeted_1 = value;
		var valueObtained_1 = windowStorageService.getFromLocalStorage(key);
		
		var valueObtained_2 = windowStorageService.clearLocalStorage();
		
		var valueObtained_3 = windowStorageService.getFromLocalStorage(key);
		
		var valueObtained_4 = windowStorageService.getKeysFromLocalStorage();
		
		expect(valueObtained_1).toEqual(valueExpeted_1);
		expect(valueObtained_2).toEqual(true);
		expect(valueObtained_3).toEqual(null);
		expect(valueObtained_4).toEqual([]);
	}));
	
	it('should clear all items from session storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '3_valueforitem';
		var key_4 = '4_keyforitem';
		var value_4 = '4_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
		windowStorageService.setToSessionStorage(key_3, value_3);
		windowStorageService.setToSessionStorage(key_4, value_4);
				
		var valueObtained_1 = windowStorageService.clearSessionStorage();		
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_2);
		var valueObtained_5 = windowStorageService.getFromSessionStorage(key_3);
		var valueObtained_6 = windowStorageService.getFromSessionStorage(key_4);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual(null);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(null);
		expect(valueObtained_6).toEqual(null);
	}));
	
	it('should clear all items from local and session storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '3_valueforitem';
		var key_4 = '4_keyforitem';
		var value_4 = '4_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
		windowStorageService.setToLocalStorage(key_3, value_3);
		windowStorageService.setToLocalStorage(key_4, value_4);
				
		var valueObtained_1 = windowStorageService.clearAll();	
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_5 = windowStorageService.getFromSessionStorage(key_2);
		var valueObtained_6 = windowStorageService.getFromLocalStorage(key_3);
		var valueObtained_7 = windowStorageService.getFromLocalStorage(key_4);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual([]);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(null);
		expect(valueObtained_6).toEqual(null);
		expect(valueObtained_7).toEqual(null);
	}));	
	
	it('should clear all items from local and not from session storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.setToLocalStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
				
		var valueObtained_1 = windowStorageService.clearLocalStorage();	
		var valueObtained_2 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_3 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_4 = windowStorageService.getFromLocalStorage(key_1);
		var valueObtained_5 = windowStorageService.getFromSessionStorage(key_2);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual([key_2]);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(value_2);
	}));
	
	it('should clear all items from session and not from local storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
				
		var valueObtained_1 = windowStorageService.clearSessionStorage();	
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_5 = windowStorageService.getFromLocalStorage(key_2);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual([key_2]);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(value_2);
	}));
	
	it('should clear items from local storage as object property key', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.setToLocalStorage(key, value);
		
		var valueExpeted_1 = value;
		var valueObtained_1 = windowStorageService.getFromLocalStorage(key);
		
		var valueObtained_2 = windowStorageService['localStorage'].clear();
		
		var valueObtained_3 = windowStorageService.getFromLocalStorage(key);
		
		var valueObtained_4 = windowStorageService.getKeysFromLocalStorage();
		
		expect(valueObtained_1).toEqual(valueExpeted_1);
		expect(valueObtained_2).toEqual(true);
		expect(valueObtained_3).toEqual(null);
		expect(valueObtained_4).toEqual([]);
	}));
	
	it('should clear all items from session storage object property key', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '3_valueforitem';
		var key_4 = '4_keyforitem';
		var value_4 = '4_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
		windowStorageService.setToSessionStorage(key_3, value_3);
		windowStorageService.setToSessionStorage(key_4, value_4);
				
		var valueObtained_1 = windowStorageService['sessionStorage'].clear();		
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_2);
		var valueObtained_5 = windowStorageService.getFromSessionStorage(key_3);
		var valueObtained_6 = windowStorageService.getFromSessionStorage(key_4);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual(null);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(null);
		expect(valueObtained_6).toEqual(null);
	}));
			
	it('should clear all items from local and not from session storage object property key', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.setToLocalStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
				
		var valueObtained_1 = windowStorageService['localStorage'].clear();	
		var valueObtained_2 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_3 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_4 = windowStorageService.getFromLocalStorage(key_1);
		var valueObtained_5 = windowStorageService.getFromSessionStorage(key_2);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual([key_2]);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(value_2);
	}));
	
	it('should clear all items from session and not from local storage object property key', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
				
		var valueObtained_1 = windowStorageService['sessionStorage'].clear();	
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_5 = windowStorageService.getFromLocalStorage(key_2);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual([key_2]);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(value_2);
	}));
	
	it('should clear items from local storage as object property', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.setToLocalStorage(key, value);
		
		var valueExpeted_1 = value;
		var valueObtained_1 = windowStorageService.getFromLocalStorage(key);
		
		var valueObtained_2 = windowStorageService.localStorage.clear();
		
		var valueObtained_3 = windowStorageService.getFromLocalStorage(key);
		
		var valueObtained_4 = windowStorageService.getKeysFromLocalStorage();
		
		expect(valueObtained_1).toEqual(valueExpeted_1);
		expect(valueObtained_2).toEqual(true);
		expect(valueObtained_3).toEqual(null);
		expect(valueObtained_4).toEqual([]);
	}));
	
	it('should clear all items from session storage object property', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		var key_3 = '3_keyforitem';
		var value_3 = '3_valueforitem';
		var key_4 = '4_keyforitem';
		var value_4 = '4_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
		windowStorageService.setToSessionStorage(key_3, value_3);
		windowStorageService.setToSessionStorage(key_4, value_4);
				
		var valueObtained_1 = windowStorageService.sessionStorage.clear();		
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_2);
		var valueObtained_5 = windowStorageService.getFromSessionStorage(key_3);
		var valueObtained_6 = windowStorageService.getFromSessionStorage(key_4);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual(null);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(null);
		expect(valueObtained_6).toEqual(null);
	}));
		
	
	it('should clear all items from local and not from session storage object property', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.setToLocalStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
				
		var valueObtained_1 = windowStorageService.localStorage.clear();	
		var valueObtained_2 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_3 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_4 = windowStorageService.getFromLocalStorage(key_1);
		var valueObtained_5 = windowStorageService.getFromSessionStorage(key_2);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual([key_2]);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(value_2);
	}));
	
	it('should clear all items from session and not from local storage object property', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
				
		var valueObtained_1 = windowStorageService.sessionStorage.clear();	
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_5 = windowStorageService.getFromLocalStorage(key_2);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual([key_2]);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(value_2);
	}));
	
	it('should clear all of the default storage type', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
				
		var valueObtained_1 = windowStorageService.clear();	
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_5 = windowStorageService.getFromLocalStorage(key_2);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([]);
		expect(valueObtained_3).toEqual([key_2]);
		expect(valueObtained_4).toEqual(null);
		expect(valueObtained_5).toEqual(value_2);
	}));
	
	it('should change the default storage type and clear all for the new default storage type', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.setDefaultStorageType('localStorage');
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
				
		var valueObtained_1 = windowStorageService.clear();	
		var valueObtained_2 = windowStorageService.getKeysFromSessionStorage();		
		var valueObtained_3 = windowStorageService.getKeysFromLocalStorage();		
		var valueObtained_4 = windowStorageService.getFromSessionStorage(key_1);
		var valueObtained_5 = windowStorageService.getFromLocalStorage(key_2);
				
		expect(valueObtained_1).toEqual(true);
		expect(valueObtained_2).toEqual([key_1]);
		expect(valueObtained_3).toEqual([]);
		expect(valueObtained_4).toEqual(value_1);
		expect(valueObtained_5).toEqual(null);
	}));
	
	it('should set items and get the keys by object property', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.sessionStorage.set(key_1, value_1);
		windowStorageService.localStorage.set(key_2, value_2);
				
		var valueObtained_1 = windowStorageService.sessionStorage.getKeys();		
		var valueObtained_2 = windowStorageService.localStorage.getKeys();
				
		expect(valueObtained_1).toEqual([key_1]);
		expect(valueObtained_2).toEqual([key_2]);
	}));
	
	it('should set items and get the keys by object property index', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService['sessionStorage'].set(key_1, value_1);
		windowStorageService['localStorage'].set(key_2, value_2);
				
		var valueObtained_1 = windowStorageService['sessionStorage'].getKeys();		
		var valueObtained_2 = windowStorageService['localStorage'].getKeys();
				
		expect(valueObtained_1).toEqual([key_1]);
		expect(valueObtained_2).toEqual([key_2]);
	}));
	
	it('should set items and get the keys by object property changing the default storage type', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		windowStorageService.setDefaultStorageType('localStorage');
		windowStorageService.set(key_1, value_1);
		windowStorageService['sessionStorage'].set(key_2, value_2);
				
		var valueObtained_1 = windowStorageService.getKeys();		
		var valueObtained_2 = windowStorageService['sessionStorage'].getKeys();
				
		expect(valueObtained_1).toEqual([key_1]);
		expect(valueObtained_2).toEqual([key_2]);
	}));

	it('should set items and get items by object property index in session storage type', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService['sessionStorage'].set(key, value);
		
		var valueObtained = windowStorageService['sessionStorage'].get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set items and get items by object property in session storage type', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.sessionStorage.set(key, value);
		
		var valueObtained = windowStorageService.sessionStorage.get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set items and get items by object property index in local storage type', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService['localStorage'].set(key, value);
		
		var valueObtained = windowStorageService['localStorage'].get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set items and get items by object property index in local storage type', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.localStorage.set(key, value);
		
		var valueObtained = windowStorageService.localStorage.get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set items and get items by object property changing the default storage type', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.setDefaultStorageType('localStorage');
		windowStorageService.set(key, value);
		
		var valueObtained = windowStorageService.get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set item and remove item by object property in local storage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.localStorage.set(key, value);
		
		windowStorageService.localStorage.remove(key);	
		var valueObtained = windowStorageService.localStorage.get(key);				
				
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item by object property in session storage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.sessionStorage.set(key, value);
		
		windowStorageService.sessionStorage.remove(key);	
		var valueObtained = windowStorageService.sessionStorage.get(key);				
				
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item by object property index in local storage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService['localStorage'].set(key, value);
		
		windowStorageService['localStorage'].remove(key);	
		var valueObtained = windowStorageService['localStorage'].get(key);				
				
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item by object property index in session storage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService['sessionStorage'].set(key, value);
		
		windowStorageService['sessionStorage'].remove(key);	
		var valueObtained = windowStorageService['sessionStorage'].get(key);				
				
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item in default storage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.set(key, value);
		
		windowStorageService.remove(key);	
		var valueObtained = windowStorageService.get(key);
		
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item changing default storage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.setDefaultStorageType('localStorage');
		windowStorageService.set(key, value);
		
		windowStorageService.remove(key);	
		var valueObtained_1 = windowStorageService.get(key);				
		var valueObtained_2 = windowStorageService.localStorage.get(key);
		var valueObtained_3 = windowStorageService.sessionStorage.get(key);
				
		expect(valueObtained_1).toEqual(null);
		expect(valueObtained_2).toEqual(null);
		expect(valueObtained_3).toEqual(null);
	}));
	
	it('should correclty execute a Promise.then', inject(function($q, $rootScope) {

		var deferred = $q.defer();
		
		var response;
		
		deferred.promise.then(function() {
			response = true;
		});
		
		deferred.resolve();

		$rootScope.$apply();
		
		expect(response).toBe(true);
	}));

	
	it('should set a ttl to a item in storage', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.set(key, value);
			
		windowStorageService.setTTL(key, 60000);						
			
		var valueObtained_1 = windowStorageService.getKeys();
		expect(valueObtained_1).toEqual([key]);	
		
		var valueObtained_2 = windowStorageService.get('__window_storage_TTL.' + key);				
	}));
	
	it('should set a ttl to a item in storage and flush it', inject(function($timeout, $window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.set(key, value);
			
		windowStorageService.setTTL(key, 60000);						
			
		var valueObtained_1 = windowStorageService.getKeys();
		expect(valueObtained_1).toEqual([key]);	
		
		var valueObtained_2 = windowStorageService.get('__window_storage_TTL.' + key);
		
		$timeout.flush();
		var valueObtained_3 = windowStorageService.getKeys();
		expect(valueObtained_3).toEqual([]);
	}));
	
	it('should set and reset a ttl to a item in storage and flush it', inject(function($window, windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		
		var firstTTL = 6000;
		var secondTTL = 60000 + 1; // +1 for times to be less than
		windowStorageService.set(key, value, firstTTL);
		
		windowStorageService.setTTL(key, secondTTL - 1);// -1 for times to be less than
		
		var currTime = +new Date();
		var expireDateF = +(new Date(currTime + firstTTL));
		var expireDateS = +(new Date(currTime + secondTTL));
			
		var valueObtained_1 = windowStorageService.getKeys();
		expect(valueObtained_1).toEqual([key]);	
		
		var valueObtained_2 = windowStorageService.get('__window_storage_TTL.' + key);
		
		expect(valueObtained_2).toBeGreaterThan(expireDateF);
		expect(valueObtained_2).toBeLessThan(expireDateS);
	}));
	
	it('should get the length of the default storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService.set(key_1, value_1);
		windowStorageService.set(key_2, value_2);
			
		var valueObtained = windowStorageService.length();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the session storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
			
		var valueObtained = windowStorageService.lengthOfSessionStorage();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the session storage by proprety', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService.sessionStorage.set(key_1, value_1);
		windowStorageService.sessionStorage.set(key_2, value_2);
			
		var valueObtained = windowStorageService.sessionStorage.length();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the session storage by proprety', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService['sessionStorage'].set(key_1, value_1);
		windowStorageService['sessionStorage'].set(key_2, value_2);
			
		var valueObtained = windowStorageService['sessionStorage'].length();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the local storage', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService.setToLocalStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
			
		var valueObtained = windowStorageService.lengthOfLocalStorage();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the local storage by proprety', inject(function($window, windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService['localStorage'].set(key_1, value_1);
		windowStorageService['localStorage'].set(key_2, value_2);
			
		var valueObtained = windowStorageService['localStorage'].length();		
		
		expect(valueObtained).toEqual(2);
	}));
});
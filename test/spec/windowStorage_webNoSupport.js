describe('window storage provider when web storage not supported default to cookie as if it was web storage', function () {
	  		
	// http://stackoverflow.com/questions/6456429/is-it-possible-to-mock-document-cookie-in-javascript
	//beforeEach(module('WindowStorageModule', function($provide){
	//		
	//	$provide.value('$window', {});	
	//		
	//	$provide.value('$document',  [{
	//		value_ : '',
	//		get cookie() {
	//			return this.value_;
	//		},
    //
	//		set cookie(value) {
	//			this.value_ += value + ';';
	//		}
	//	}]);			
	//}));
		
	//http://stackoverflow.com/questions/20313575/angular-js-unit-test-mock-document
	beforeEach(function() {
		module('WindowStorageModule');
	
		$document = angular.element(document); // This is exactly what Angular does
		$document.find('body').append('<content></content>');
	
		var originalFind = $document.find;
		$document.find = function(selector) {
			if (selector === 'body') {
				return originalFind.call($document, 'body').find('content');
			} else {
				return originalFind.call($document, selector);
			}
		}
	
		module(function($provide) {
			$provide.value('$document', $document);
		});   
		module(function($provide) {
			$provide.value('$window', { });
		}); 	
	});
	
	afterEach(function() {
		$document.find('body').html('');
		
		var cookieString = $document[0].cookie;
		cookieString = cookieString.replace(/\s/g,'');
		var result = {};
		var cookieArray = cookieString.split(';');
		for(var index in cookieArray){
			var cookieKeyValue = cookieArray[index].split('=');
			var cookieKey = decodeURIComponent(cookieKeyValue[0]);
			//var cookieValue = cookieKeyValue[1];
			//if (cookieKey) result[cookieKey] = decodeURIComponent(cookieValue);
			$document[0].cookie = cookieKey + "=;expires=" + new Date(0);
		}
	});		
	
	
	it('should have angular defined', inject(function () {
		expect(angular).toBeDefined();
	}));
		
	it('should set item to service cookie storage as if it was session storage', inject(function($document, windowStorageService){
		$document = $document[0];
		
		var key = 'keyforitem'
		var value = 'valueforitem'
		windowStorageService.set(key, value);
		
		var valueExpeted = angular.toJson(value);
		var valueObtained_1 = $document.cookie;
		
		var valueObtained_2 = windowStorageService.get(key);
		
		expect(valueObtained_1).toEqual('ws_.__sessionStorage.keyforitem=%22valueforitem%22');
		expect(valueObtained_2).toEqual(value);
	}));
	
	it('should set item to service cookie storage as if it was local storage', inject(function($document, windowStorageService){
		$document = $document[0];
		
		var key = 'keyforitem'
		var value = 'valueforitem'
		windowStorageService.setDefaultStorageType('localStorage');
		windowStorageService.set(key, value);
		
		var valueExpeted = angular.toJson(value);
		var valueObtained_1 = $document.cookie;
		
		var valueObtained_2 = windowStorageService.get(key);
		
		expect(valueObtained_1).toEqual('ws_.__localStorage.keyforitem=%22valueforitem%22');
		expect(valueObtained_2).toEqual(value);
	}));
	
	it('should set item to service cookie storage as if it was session storage and get keys', inject(function($document, windowStorageService){
		$document = $document[0];
		
		var key = 'keyforitem'
		var value = 'valueforitem'
		windowStorageService.set(key, value);
		
		var valueObtained = windowStorageService.getKeys();
		
		expect(valueObtained).toEqual([key]);
	}));
	
	//* same tests for windows storage must work if web storage not supported and default to cookie does*//
		
	it('should get default window storage type', inject(function(windowStorageService){
				
		var valueExpeted = 'sessionStorage';
		var valueObtained = windowStorageService.getDefaultStorageType();
				
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should set default window storage type', inject(function(windowStorageService){				
		windowStorageService.setDefaultStorageType('localStorage');
		
		var valueExpeted = 'localStorage';
		var valueObtained = windowStorageService.getDefaultStorageType();
				
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should not set default window storage type when value is not \'localStorage\' or \'sessionStorage\'', inject(function(windowStorageService){				
		windowStorageService.setDefaultStorageType('FAIL_localStorage');
		
		var valueExpeted = 'sessionStorage';
		var valueObtained = windowStorageService.getDefaultStorageType();
				
		expect(valueObtained).toEqual(valueExpeted);
	}));
	
	it('should set default window storage type on provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setDefaultStorageType('localStorage');
		});
		inject(function(windowStorageService){				
		
			var valueExpeted = 'localStorage';
			var valueObtained = windowStorageService.getDefaultStorageType();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
	
	it('should not set default window storage type when value is not \'localStorage\' or \'sessionStorage\' on provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setDefaultStorageType('FAIL_localStorage');
		});
		inject(function(windowStorageService){				
		
			var valueExpeted = 'sessionStorage';
			var valueObtained = windowStorageService.getDefaultStorageType();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
	
	it('should set prefix on window storage provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('prefixTest');
		});
		inject(function(windowStorageService){				
		
			var valueExpeted = 'prefixTest.';
			var valueObtained = windowStorageService.getPrefix();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
	
	it('should set prefix with only one dot at end on window storage provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('prefixTest.');
		});
		inject(function(windowStorageService){				
		
			var valueExpeted = 'prefixTest.';
			var valueObtained = windowStorageService.getPrefix();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
	
	it('should set an empty prefix on window storage provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider.setPrefix('');
		});
		inject(function(windowStorageService){				
		
			var valueExpeted = '';
			var valueObtained = windowStorageService.getPrefix();
				
			expect(valueObtained).toEqual(valueExpeted);
		});
	});
			
	it('should be able to chain on window storage provider configuration', function() {
		module(function(windowStorageServiceProvider){
			windowStorageServiceProvider
				.setPrefix('prefixTest')
				.setDefaultStorageType('localStorage');
		});
		inject(function(windowStorageService){				
		
			var valueExpeted_1 = 'localStorage';
			var valueObtained_1 = windowStorageService.getDefaultStorageType();
			
			var valueExpeted_2 = 'prefixTest.';
			var valueObtained_2 = windowStorageService.getPrefix();
			
			expect(valueObtained_1).toEqual(valueExpeted_1);
			expect(valueObtained_2).toEqual(valueExpeted_2);
		});
	});
	
	it('should return the keys of the items setted in local storage', inject(function(windowStorageService){				
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
	
	it('should return the keys of the items setted in local storage that starts with a given input', inject(function(windowStorageService){				
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
	
	it('should return the keys of the items setted in session storage', inject(function(windowStorageService){				
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
	
	it('should return the keys of the items setted in session storage that starts with a given input', inject(function(windowStorageService){				
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
		inject(function(windowStorageService){				
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
		inject(function(windowStorageService){				
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
		inject(function(windowStorageService){				
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
		inject(function(windowStorageService){				
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
	
	it('should remove item from localstorage', inject(function($document, windowStorageService){				
	$document = $document[0];
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
	
	it('should remove multiple items from localstorage', inject(function(windowStorageService){				
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
	
	it('should remove item from local storage', inject(function(windowStorageService){				
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
	
	it('should remove multiple items from session storage', inject(function(windowStorageService){				
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
	
	it('should clear items from local storage', inject(function(windowStorageService){				
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
	
	it('should clear all items from session storage', inject(function(windowStorageService){				
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
	
	it('should clear all items from local and session storage', inject(function(windowStorageService){				
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
	
	it('should clear all items from local and not from session storage', inject(function(windowStorageService){				
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
	
	it('should clear all items from session and not from local storage', inject(function(windowStorageService){				
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
		
	it('should clear items from local storage as object property key', inject(function(windowStorageService){				
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
	
	it('should clear all items from session storage object property key', inject(function(windowStorageService){				
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
			
	it('should clear all items from local and not from session storage object property key', inject(function(windowStorageService){				
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
	
	it('should clear all items from session and not from local storage object property key', inject(function(windowStorageService){				
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
	
	it('should clear items from local storage as object property', inject(function(windowStorageService){				
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
	
	it('should clear all items from session storage object property', inject(function(windowStorageService){				
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
		
	
	it('should clear all items from local and not from session storage object property', inject(function(windowStorageService){				
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
	
	it('should clear all items from session and not from local storage object property', inject(function(windowStorageService){				
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
	
	it('should clear all of the default storage type', inject(function(windowStorageService){				
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
	
	it('should change the default storage type and clear all for the new default storage type', inject(function(windowStorageService){				
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
	
	it('should set items and get the keys by object property', inject(function(windowStorageService){				
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
	
	it('should set items and get the keys by object property index', inject(function(windowStorageService){				
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
	
	it('should set items and get the keys by object property changing the default storage type', inject(function(windowStorageService){				
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

	it('should set items and get items by object property index in session storage type', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService['sessionStorage'].set(key, value);
		
		var valueObtained = windowStorageService['sessionStorage'].get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set items and get items by object property in session storage type', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.sessionStorage.set(key, value);
		
		var valueObtained = windowStorageService.sessionStorage.get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set items and get items by object property index in local storage type', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService['localStorage'].set(key, value);
		
		var valueObtained = windowStorageService['localStorage'].get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set items and get items by object property index in local storage type', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.localStorage.set(key, value);
		
		var valueObtained = windowStorageService.localStorage.get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set items and get items by object property changing the default storage type', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.setDefaultStorageType('localStorage');
		windowStorageService.set(key, value);
		
		var valueObtained = windowStorageService.get(key);		
				
		expect(valueObtained).toEqual(value);
	}));
	
	it('should set item and remove item by object property in local storage', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.localStorage.set(key, value);
		
		windowStorageService.localStorage.remove(key);	
		var valueObtained = windowStorageService.localStorage.get(key);				
				
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item by object property in session storage', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.sessionStorage.set(key, value);
		
		windowStorageService.sessionStorage.remove(key);	
		var valueObtained = windowStorageService.sessionStorage.get(key);				
				
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item by object property index in local storage', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService['localStorage'].set(key, value);
		
		windowStorageService['localStorage'].remove(key);	
		var valueObtained = windowStorageService['localStorage'].get(key);				
				
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item by object property index in session storage', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService['sessionStorage'].set(key, value);
		
		windowStorageService['sessionStorage'].remove(key);	
		var valueObtained = windowStorageService['sessionStorage'].get(key);				
				
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item in default storage', inject(function(windowStorageService){				
		var key = 'keyforitem';
		var value = 'valueforitem';
		windowStorageService.set(key, value);
		
		windowStorageService.remove(key);	
		var valueObtained = windowStorageService.get(key);
		
		expect(valueObtained).toEqual(null);
	}));
	
	it('should set item and remove item changing default storage', inject(function(windowStorageService){				
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
	
	it('should get the length of the default storage', inject(function(windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService.set(key_1, value_1);
		windowStorageService.set(key_2, value_2);
			
		var valueObtained = windowStorageService.length();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the session storage', inject(function(windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService.setToSessionStorage(key_1, value_1);
		windowStorageService.setToSessionStorage(key_2, value_2);
			
		var valueObtained = windowStorageService.lengthOfSessionStorage();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the session storage by proprety', inject(function(windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService.sessionStorage.set(key_1, value_1);
		windowStorageService.sessionStorage.set(key_2, value_2);
			
		var valueObtained = windowStorageService.sessionStorage.length();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the session storage by proprety', inject(function(windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService['sessionStorage'].set(key_1, value_1);
		windowStorageService['sessionStorage'].set(key_2, value_2);
			
		var valueObtained = windowStorageService['sessionStorage'].length();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the local storage', inject(function(windowStorageService){				
		var key_1 = '1_keyforitem';
		var value_1 = '1_valueforitem';
		var key_2 = '2_keyforitem';
		var value_2 = '2_valueforitem';
		
		windowStorageService.setToLocalStorage(key_1, value_1);
		windowStorageService.setToLocalStorage(key_2, value_2);
			
		var valueObtained = windowStorageService.lengthOfLocalStorage();		
		
		expect(valueObtained).toEqual(2);
	}));
	
	it('should get the length of the local storage by proprety', inject(function(windowStorageService){				
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
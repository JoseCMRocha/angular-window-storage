/**
* angular-window-storage 
* Angular module to ease the access of local and session storage 
* Author Jose Rocha 
* Version 0.1.0 
* Date 2017-05-01 
* Project github https://github.com/JoseCMRocha/angular-window-storage
* License  
*/
(function (window, angular) {
angular.module('WindowStorageModule',[])
	.provider('windowStorageService', function(){
		
		// Provider readonly global's
		var LOCAL_STORAGE = 'localStorage';
		var SESSION_STORAGE = 'sessionStorage';
		var STORAGE_TTL_KEY = '__window_storage_TTL';
		
		// settings
		this.prefix = 'ws_';
		this.defaultStorageType = SESSION_STORAGE;
				
		// setters		
		this.setPrefix = function(prefix){
			this.prefix = prefix;
			return this;
		};
		
		this.setDefaultStorageType = function(storageType){
			if (storageType === SESSION_STORAGE || storageType === LOCAL_STORAGE) this.defaultStorageType = storageType;			
			return this;
		};
				
		this.$get = ['$window', '$rootScope', '$timeout', function($window, $rootScope, $timeout) {
			var self = this;
			var prefix = self.prefix;
			var defaultStorageType = self.defaultStorageType;
			
			var ttlPromises = [];
			
			var storage = { 
				localStorage : null,
				sessionStorage : null
			};
			
			var support = {
				settings: null,
				storage: null,
				storageTTl: null
			};
			
			var init = function(){
				support.settings = initSettings();
				support.storage = initStorage();
				support.storageTTl= initStorageTTL();
				
				$rootScope.$on('$destroy', function() {
					// clear ttlPromises
					for( var i = ttlPromises.length-1; i >= 0; i--) {						
						$timeout.cancel(ttlPromises[i].promise);
						ttlPromises.splice(i,1);								
					}	
					ttlPromises = null;	
					
					// clear the representation of the window storage.
					storage = null;
					
					// clear the support information
					support = null;
                });
			};
			
			/* Init */ 
			var initSettings = function(){
				try {
					// Append a dot for readability if there is none present already.
					if (prefix.substr(-1) !== '.') prefix = !!prefix ? prefix + '.' : '';				
					return true;
				} catch(e) {
					$rootScope.$broadcast('WindowStorageModule.error', 'WINDOW_STORAGE_FAILED_TO_INIT_SETTINGS');
					return false;
				}				
			};
			
			var initStorage = function(){
				try {
					storage.localStorage = $window[LOCAL_STORAGE];
					storage.sessionStorage = $window[SESSION_STORAGE];
					return checkSupport();					
				} catch(e) {
					$rootScope.$broadcast('WindowStorageModule.error', 'WINDOW_STORAGE_FAILED_TO_INIT_STORAGE');
					return false;
				}		
			};
			
			var initStorageTTL = function(){
				try {					
					var localStorageKeys = getKeys(LOCAL_STORAGE);
					var sessionStorageKeys = getKeys(SESSION_STORAGE);
					
					for(var indexLSK in localStorageKeys)
					{
						var localStorageKey = localStorageKeys[indexLSK];
						var storageTtlKey = [STORAGE_TTL_KEY, localStorageKey].join('.');	
						var expireTime = get(LOCAL_STORAGE, storageTtlKey)
						if (expireTime) setTTL(LOCAL_STORAGE, localStorageKey, expireTime - (+new Date()));						
					}
					for(var indexSSK in sessionStorageKeys)
					{
						var sessionStorageKey = sessionStorageKeys[indexSSK];
						var storageTtlKey = [STORAGE_TTL_KEY, sessionStorageKey].join('.');	
						var expireTime = get(SESSION_STORAGE, storageTtlKey)
						if (expireTime) setTTL(SESSION_STORAGE, sessionStorageKey, expireTime - (+new Date()));						
					}					
				} catch(e) {
					$rootScope.$broadcast('WindowStorageModule.error', 'WINDOW_STORAGE_FAILED_TO_INIT_STORAGE_TTL');
					return false;
				}
			};
			
			/* Validation */ 
			var checkSupport = function(){
				try {
					var supported = storage.localStorage !== null && storage.sessionStorage !== null;
					
					// if supported test local and sessionStorage
					if (supported) {
						var key = deriveQualifiedKey(Math.round(Math.random() * 1e4));
						storage.localStorage.setItem(key, '');
						storage.sessionStorage.setItem(key, '');
						storage.localStorage.removeItem(key);
						storage.sessionStorage.removeItem(key);
					}					
					return supported;
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', e.message);
					return false;
				}
			};
			
			var validateSupport = function(){
				if (!support.storage){
					$rootScope.$broadcast('WindowStorageModule.error', 'WINDOW_STORAGE_NOT_SUPPORTED');
					return false;
				}
				return true;
			};
			
			var validateStorageType = function(type){
				if (type !== SESSION_STORAGE && type !== LOCAL_STORAGE){
					$rootScope.$broadcast('WindowStorageModule.error', 'WINDOW_STORAGE_NOT_SUPPORTED');
					return false;
				}
				return true;
			};
			
			/* Helpers */ 
			// Constructs prefix with key
			var deriveQualifiedKey = function(key) {
				return prefix + key;
			};

			// Removes prefix from the key.
			var underiveQualifiedKey = function (key) {
				return key.replace(new RegExp('^' + prefix, 'g'), '');
			};
			
			/* */
			var set = function(storageType, key, value, ttl){
				if (!validateSupport()) return false;
				
				storageType = validateStorageType(storageType) ? storageType : defaultStorageType;				
				
				// Let's convert undefined values to null to get the value consistent
				if (angular.isUndefined(value)) value = null;
				else value = angular.toJson(value);
								
				try{
					storage[storageType].setItem(deriveQualifiedKey(key), value);
					if (ttl) return setTTL(storageType, key, ttl);
					return true;
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', {message: e.message, method: 'set', key: key, storageType: storageType});
					return false;
				}				
			};
			
			var setTTL = function (storageType, key, ttl){
				if (!validateSupport()) return false;
				
				storageType = validateStorageType(storageType) ? storageType : defaultStorageType;	
				
				ttl = angular.isNumber(ttl) ? ttl : 0;
				
				if(ttl == 0) return false;
				if(ttl < 0) remove(storageType, key);
				
				if(deriveQualifiedKey(key) in storage[storageType])
				{
					var storageTtlKey = [STORAGE_TTL_KEY, key].join('.');						
					if(deriveQualifiedKey(storageTtlKey) in storage[storageType]){
						storage[storageType].removeItem(deriveQualifiedKey(storageTtlKey));		
						for( var i = ttlPromises.length-1; i >= 0; i--) {
							if( ttlPromises[i].key != key) continue;							
							$timeout.cancel(ttlPromises[i].promise);
							ttlPromises.splice(i,1);								
						}	
					}
					
					var currentTime = +new Date();
					var expireTime = +(new Date(currentTime + ttl));
					
					var promise = $timeout(function(){remove(storageType, key);}, ttl);
					
					ttlPromises.push({key: key, promise: promise});
							
					set(storageType, storageTtlKey, expireTime);
				}
				return true;
			};
			
			var get = function(storageType, key){
				if (!validateSupport()) return null;
				
				storageType = validateStorageType(storageType) ? storageType : defaultStorageType;
				
				try {					
					var item = storage[storageType].getItem(deriveQualifiedKey(key));
					try{
						return angular.fromJson(item);
					} catch (e){
						return item;
					}
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', {message: e.message, method: 'get', key: key, storageType: storageType});
					return null;
				}	
			};
			
			var remove = function() {				
				if (!validateSupport()) return false;
				
				if(arguments.length < 2) {
					$rootScope.$broadcast('WindowStorageModule.error', 'WINDOW_STORAGE_WRONG_NUMBER_OF_ARGUMENTS');
					return false;
				}
								
				var storageType = validateStorageType(arguments[0]) ? arguments[0] : defaultStorageType;
				
				var allSucceded = true;
				for (var i = 1 ; i < arguments.length ; i++){
					var key = arguments[i];
					try{						
						var storageTtlKey = [STORAGE_TTL_KEY, key].join('.');						
						if(deriveQualifiedKey(storageTtlKey) in storage[storageType]){
							storage[storageType].removeItem(deriveQualifiedKey(storageTtlKey));		
							for( var i = ttlPromises.length-1; i >= 0; i--) {
								if( ttlPromises[i].key != key) continue;							
								$timeout.cancel(ttlPromises[i].promise);
								ttlPromises.splice(i,1);								
							}	
						}
						
						storage[storageType].removeItem(deriveQualifiedKey(key));
					}catch(e){
						$rootScope.$broadcast('WindowStorageModule.error', {message: e.message, method: 'remove', key: key, storageType: storageType});
						allSucceded = false;
					}
				}
				return allSucceded;				
			};
			
			var getKeys = function(storageType, keyStartsWith){
				if (!validateSupport()) return null;
				
				storageType = validateStorageType(storageType) ? storageType : defaultStorageType;
				
				// Let's convert undefined keyStartsWith to empty string to get the value consistent
				if (angular.isUndefined(keyStartsWith)) keyStartsWith = '';
				
				var storageTtlKeyStartsWith = deriveQualifiedKey([STORAGE_TTL_KEY,keyStartsWith].join('.'));
				keyStartsWith = deriveQualifiedKey(keyStartsWith);				
				
				var keys = [];
								
				for(var key in storage[storageType]){
					if(key.substr(0, storageTtlKeyStartsWith.length) === storageTtlKeyStartsWith) continue;
					if(key.substr(0, keyStartsWith.length) === keyStartsWith){
						try{
							keys.push(key.substr(prefix.length));
						} catch (e){
							$rootScope.$broadcast('WindowStorageModule.error', {message: e.message, method: 'getKeys', key: key, storageType: storageType});
						}
					}
				}
				return keys;
			};
			
			var clear = function(storageType){
				if (!validateSupport()) return false;
				
				storageType = validateStorageType(storageType) ? storageType : defaultStorageType;
					
				var keys = getKeys(storageType);				
				keys.splice(0, 0, storageType);				
				return remove.apply(this, keys);
			};
			
			/* */
			var getDefaultStorageType = function() {
				return defaultStorageType;
			};

			var setDefaultStorageType = function(type) {
				if (!validateStorageType(type)) return false;
				defaultStorageType = type;
				return true;
			};
			
			var getPrefix = function(){
				return prefix;
			}	
			
			var clearAll = function(){
				return clear(LOCAL_STORAGE) &&	clear(SESSION_STORAGE);
			};
			
			var sessionStorage = {
				set : function(key, value, ttl){
					return set(SESSION_STORAGE, key, value, ttl);
				},
				get : function(key){
					return get(SESSION_STORAGE, key);
				},
				remove : function(){
					// TODO: maybe use ...args if ES6
					// function(...args){
					// 	return(SESSION_STORAGE, args)	
					//}
					var args = Array.prototype.slice.call(arguments);
					args.splice(0, 0, SESSION_STORAGE);
					return remove.apply(this, args);
				},
				getKeys : function(keyStartsWith){
					return getKeys(SESSION_STORAGE, keyStartsWith);
				},
				clear : function(){
					return clear(SESSION_STORAGE);
				},
				setTTL : function(key, ttl){
					return setTTL(SESSION_STORAGE, key, ttl);
				}
			};
			
			var localStorage = {
				set : function(key, value, ttl){
					return set(LOCAL_STORAGE, key, value, ttl);
				},
				get : function(key){
					return get(LOCAL_STORAGE, key);
				},
				remove : function(){
					// TODO: maybe use ...args if ES6
					// function(...args){
					// 	return(LOCAL_STORAGE, args)	
					//}
					var args = Array.prototype.slice.call(arguments);
					args.splice(0, 0, LOCAL_STORAGE);
					return remove.apply(this, args);
				},
				getKeys : function(keyStartsWith){
					return getKeys(LOCAL_STORAGE, keyStartsWith);
				},
				clear : function(){
					return clear(LOCAL_STORAGE);
				},
				setTTL : function(key, ttl){
					return setTTL(LOCAL_STORAGE, key, ttl);
				}
			};
			
			// Not sure anymore if I'm going to use this 
			//// this one deserves to be memorized
			//// http://stackoverflow.com/questions/124326/how-to-convert-an-object-into-a-function-in-javascript
			//var functionize = function( obj , func ){ 
			//   out = func; 
			//   for( i in obj ){ out[i] = obj[i]; } ; 
			//   return out; 
			//}
			//var _clear = functionize({
			//	sessionStorage: function() { return clear(SESSION_STORAGE); }
			//	localStorage: function() { return clear(LOCAL_STORAGE); }
			//}, return clear.bind(this, null));
			
			/* */
			init();	
			
			/* */
			return {				
				sessionStorage: sessionStorage, // tested
				localStorage: localStorage, // tested
				clearAll: clearAll, // tested
				clear: clear.bind(this, null), // tested
				clearSessionStorage: sessionStorage.clear, //tested
				clearLocalStorage: localStorage.clear, // tested				
				getKeys: getKeys.bind(this, null), //tested
				getKeysFromSessionStorage: sessionStorage.getKeys, // tested
				getKeysFromLocalStorage: localStorage.getKeys, // tested	
				remove: remove.bind(this, null), //tested
				removeFromSessionStorage: sessionStorage.remove, // tested
				removeFromLocalStorage: localStorage.remove, // tested				
				get: get.bind(this, null), //tested
				getFromSessionStorage: sessionStorage.get, // tested
				getFromLocalStorage: localStorage.get, // tested				
				set: set.bind(this, null), //tested
				setToSessionStorage: sessionStorage.set, // tested
				setToLocalStorage: localStorage.set, // tested		
				setTTL: setTTL.bind(this, null),				
				setTTLToSessionStorage: sessionStorage.setTTL,
				setTTLToLocalStorage: localStorage.setTTL,
				getDefaultStorageType: getDefaultStorageType, // tested
				setDefaultStorageType: setDefaultStorageType, // tested
				getPrefix: getPrefix // tested
			};
		}];
	});
})(window, window.angular);
/**
* angular-window-storage 
* Angular module to ease the access of local and session storage 
* Author Jose Rocha 
* Version 0.1.0 
* Date 2017-05-06 
* Project github https://github.com/JoseCMRocha/angular-window-storage
* License  
*/
(function (window, angular) {
angular.module('WindowStorageModule',[])
	.provider('windowStorageService', function($provide){
		
		/* readonly global's */
		var LOCAL_STORAGE = 'localStorage';
		var SESSION_STORAGE = 'sessionStorage';
		var COOKIE_STORAGE = 'cookie';
		var RESERVED_KEY = '__';
		var STORAGE_TTL_KEY = [RESERVED_KEY, 'window_storage_TTL'].join('');
		
		/* defaults */
		this._defaults = {
			// prefix default to derive key 
			prefix: 'ws_',
			// storage type default 
			storageType: SESSION_STORAGE,
			// cookies defaults 
			cookies: {
				path : null, 
				domain : null,
				ttl : 365*24*60*60*1000, //a year in milliseconds 
				secure: false
			},
			allowWebStorage: true,
			allowCookies: true,
			defaultToCookies: true
		};
				
		/* defaults setters */
		this.setPrefix = function(prefix){
			if(angular.isString(prefix)) this._defaults.prefix = prefix;
			return this;
		};
		
		this.setDefaultStorageType = function(storageType){
			if (storageType === SESSION_STORAGE || storageType === LOCAL_STORAGE || storageType === COOKIE_STORAGE) this._defaults.storageType = storageType;			
			return this;
		};
		
		this.setCookiesPath = function(path){
			if(angular.isString(path)) this._defaults.cookies.path = path;
			return this;
		};
		
		this.setCookiesDomain = function(domain){
			if(angular.isString(domain)) this._defaults.cookies.domain = domain;
			return this;
		};
		
		this.setCookiesExpires = function(expires){
			if(angular.isNumber(expires) && expires > 0) this._defaults.cookies.expires = expires;
			if(angular.isDate(expires)) this._defaults.cookies.expires = +new Date(expires);
			return this;
		};
		
		this.setCookiesSecure = function(secure){
			// angular.isBoolean where are you?
			if(typeof secure === "boolean") this._defaults.cookies.secure = secure;
			return this;
		};
		
		this.setCookiesDefaults = function(options){
			if(angular.isObject(options)){
				if(options.path) setCookiesPath(options.path);
				if(options.domain) setCookiesDomain(options.domain);
				if(options.expires) setCookiesExpires(options.expires);
				if(options.secure) setCookiesSecure(options.secure);
			}
			return this;
		};
		
		this.setAllowWebStorage = function(allowWebStorage){
			// angular.isBoolean where are you?
			if(typeof allowWebStorage === "boolean") this._defaults.allowWebStorage = allowWebStorage;
			return this;
		};
		
		this.setAllowCookies = function(allowCookies){
			// angular.isBoolean where are you?
			if(typeof allowCookies === "boolean") this._defaults.allowCookies = allowCookies;
			return this;
		};
		
		this.setDefaultToCookies = function(defaultToCookies){
			// angular.isBoolean where are you?
			if(typeof defaultToCookies === "boolean") this._defaults.defaultToCookies = defaultToCookies;
			return this;
		};
		// not using $$cookieReader because i will create cookie as parts to store more than 4096 bytes
		this.$get = ['$window', '$rootScope', '$timeout', '$document', '$browser', function($window, $rootScope, $timeout, $document, $browser) {
			var self = this;
			var defaults = self._defaults;
			
			var ttlPromises = [];
						
			var support = {
				settings: null,
				webStorage: null,
				cookies: null,
				storageTTl: null
			};
			
			var init = function(){
				// When Angular's $document is not available
				if (!$document)	$document = document;
				else if ($document[0]) $document = $document[0];
	  
				support.settings = initSettings();
				support.webStorage = initWebStorage();
				support.cookies = initCookies();
				support.storageTTl= initStorageTTL();
				
				$rootScope.$on('$destroy', function() {
					// clear ttlPromises
					for( var i = ttlPromises.length-1; i >= 0; i--) {						
						$timeout.cancel(ttlPromises[i].promise);
						ttlPromises.splice(i,1);								
					}	
					ttlPromises = [];	
					support = {};
                });
			};
			
			/* Init */ 
			var initSettings = function(){
				try {
					// Append a dot for readability if there is none present already.
					if (defaults.prefix.substr(-1) !== '.') defaults.prefix = !!defaults.prefix ? defaults.prefix + '.' : '';				
					return true;
				} catch(e) {
					$rootScope.$broadcast('WindowStorageModule.error', {type:'WINDOW_STORAGE_FAILED_TO_INIT_SETTINGS', message: e.message});
					return false;
				}				
			};
			
			var initWebStorage = function(){
				if(!defaults.allowWebStorage) return false;
				try {					
					var innerInitStorage = function(storageType){
						var supported = storageType in $window && $window[storageType] !== null;					
						// if supported test storage
						if (supported) {
							var key = deriveQualifiedKey(Math.round(Math.random() * 1e4));
							$window[storageType].setItem(storageType, key, '');
							$window[storageType].removeItem(storageType, key);
						}					
						return supported;
					};
					var localStorageSupport = innerInitStorage(LOCAL_STORAGE);
					var sessionStorageSupport = innerInitStorage(SESSION_STORAGE);
					
					return localStorageSupport && sessionStorageSupport;					
				} catch(e) {
					$rootScope.$broadcast('WindowStorageModule.error', {type:'WINDOW_STORAGE_FAILED_TO_INIT_WEB_STORAGE', message: e.message});
					return false;
				}		
			};		
			
			var initCookies = function(){
				if(!defaults.allowCookies) return false;
				try {		
					var supported = (angular.isDefined($window.navigator) && $window.navigator.cookieEnabled) || angular.isDefined($document[COOKIE_STORAGE]);
					// if supported test storage
					if(supported){
						var key = Math.round(Math.random() * 1e4);
						var value = Math.round(Math.random() * 1e4);
						$document.cookie = buildCookie(key, value);
						supported = $document[COOKIE_STORAGE].indexOf(key) > -1;
						$document.cookie = buildCookie(key, null);
					}
					return supported;
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_FAILED_TO_INIT_COOKIE_STORAGE' , message: e.message});
					return false;
				}
			};
			
			var initStorageTTL = function(){
				if (!support.webStorage) return false;
				
				var innerInitStorageTTL = function(storageType){					
					var storageKeys = _getKeys(storageType);
					try{
						for(var i in storageKeys)
						{
							var storageKey = storageKeys[i];
							var expireTime = _get(storageType, [STORAGE_TTL_KEY, storageKey].join('.'));
							if (expireTime) _setTTL(storageType, storageKey, expireTime - (+new Date()));						
						}						
						return true;
					} catch(e){
						$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_FAILED_TO_INIT_STORAGE_TTL', message: e.message, storageType: storageType});
						return false;
					}
				};
				var localStorageTTLInitResult = innerInitStorageTTL(LOCAL_STORAGE);
				var sessionStorageTTLInitResult = innerInitStorageTTL(SESSION_STORAGE);
				return localStorageTTLInitResult && sessionStorageTTLInitResult;
			};
						
			/* Helpers */ 
			// Constructs prefix with key
			var deriveQualifiedKey = function(key) {
				return defaults.prefix + key;
			};

			// Removes prefix from the key.
			var underiveQualifiedKey = function (key) {
				return key.replace(new RegExp('^' + defaults.prefix, 'g'), '');
			};
			
			var buildCookie = function(key, value, ttl, path, domain, secure) {
				var expires;
				
				path = angular.isUndefined(path) ? defaults.cookies.path === null ? $browser.baseHref():
					   defaults.cookies.path :
					   path;
				
				expires = angular.isUndefined(ttl) ? new Date(+new Date() + defaults.cookies.ttl):
						angular.isDate(ttl) ? ttl : 
						angular.isString(ttl) ? new Date(ttl) :
						angular.isNumber(ttl) ? new Date(+new Date() + ttl) :
						new Date(0);
						
				domain = angular.isUndefined(domain) ? defaults.cookies.domain === null ? '':
						defaults.cookies.domain:
						domain;
				
				secure = angular.isUndefined(secure) ? defaults.cookies.secure : secure;
				
				// No undefined values or null values assume that if a undefined or null value is sent it is a remove command
				if (angular.isUndefined(value) || value === null) {
					expires = new Date(0);
					value = '';
				}
				
				var str = encodeURIComponent(key) + '=' + encodeURIComponent(value);
					str += path ? ';path=' + path : '';
					str += domain ? ';domain=' + domain : '';
					str += expires ? ';expires=' + expires.toUTCString() : '';
					str += secure ? ';secure' : '';

				// per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
				// - 300 cookies
				// - 20 cookies per unique domain
				// - 4096 bytes per cookie
				var cookieLength = str.length + 1;
				if (cookieLength > 4096) 
					$rootScope.$broadcast('WindowStorageModule.warning', {type:'WINDOW_STORAGE_COOKIE_STORAGE', 
										message: 'Cookie \'' + key + '\' possibly not set or overflowed because it was too large (' + cookieLength + ' > 4096 bytes)!'});				
				return str;
			};
			
			var cookieWriter = function(key, value, options){
				if(!support.cookies) return false;
				options = optionsTransform(options);
				$document.cookie = buildCookie(key, value, options.ttl, options.path, options.domain, options.secure);
			};
			
			var cookieReader = function(){
				if(!support.cookies) return null;
				var cookieString = $document.cookie;
				cookieString = cookieString.replace(/\s/g,'');
				var result = {};
				var cookieArray = cookieString.split(';');
				for(var index in cookieArray){
					var cookieKeyValue = cookieArray[index].split('=');
					var cookieKey = decodeURIComponent(cookieKeyValue[0]);
					var cookieValue = cookieKeyValue[1];
					if (cookieKey) result[cookieKey] = decodeURIComponent(cookieValue);
				}
				return result;
			};
			
			var optionsTransform = function(options){
				return (angular.isNumber(options) || angular.isDate(options) || angular.isString(options)) ? {ttl : options} : options || {};
			};
			
			// Todo: think in a better name for this
			var doThaPrefixSwap = function(storageType, callback){
				var oldPrefix = defaults.prefix;
				defaults.prefix = [oldPrefix, RESERVED_KEY, storageType, '.'].join('');
				var result = callback();
				defaults.prefix = oldPrefix;
				return result;
			};
			
			var isStorage = function(storageType){
				return storageType === SESSION_STORAGE || storageType === LOCAL_STORAGE || storageType === COOKIE_STORAGE;
			};
			
			var isWebStorage = function(storageType){
				return storageType === SESSION_STORAGE || storageType === LOCAL_STORAGE;
			};
			
			var isCookieStorage = function(storageType){
				return storageType === COOKIE_STORAGE;
			};
			/* */
			var _set = function(storageType, key, value, options){
				// if storage type given is not available use default storage type
				if(!isStorage(storageType)) storageType = defaults.storageType;
				// if storage type is web storage and web storage is not supported try to set a cookie with the information for the web storage
				if(isWebStorage(storageType) && !support.webStorage) {					
					if(!defaults.defaultToCookies) return false;
					// set a cookie and reserve the key to the web storage type
					return doThaPrefixSwap(storageType, _setCookie.bind(this, key, value, options));
				}
				if(isCookieStorage(storageType)) return _setCookie(key, value, options);
				
				options = optionsTransform(options);
				
				// No undefined values or null values assume that if a undefined or null value is sent it is a remove command
				if (angular.isUndefined(value) || value === null) return _remove(storageType, key);
								
				try{
					$window[storageType].setItem(deriveQualifiedKey(key), angular.toJson(value));
					if (options.ttl) return _setTTL(storageType, key, options.ttl);
					return true;
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_SET_METHOD', message: e.message, key: key, storageType: storageType});
					return false;
				}				
			};
			
			var _setCookie = function(key, value, options){
				if (!support.cookies) return false;	
				
				// No undefined values or null values assume that if a undefined or null value is sent it is a remove command
				if (angular.isUndefined(value) || value === null) _removeCookies(key);
								
				options = optionsTransform(options);	
				
				try{			
					cookieWriter(deriveQualifiedKey(key), angular.toJson(value), options.ttl, options.path, options.domain, options.secure);					
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_SET_COOKIE_METHOD', message: e.message, key: key, storageType: COOKIE_STORAGE});
					return false;
				}
			};
			
			var _setTTL = function (storageType, key, ttl){
				if(!isStorage(storageType)) storageType = defaults.storageType;
				if(!support.webStorage || isCookieStorage(storageType)) return false;
								
				ttl = angular.isNumber(ttl) ? ttl : 0;
				
				if(ttl === 0) return true;
				if(ttl < 0) _remove(storageType, key);
				
				if(deriveQualifiedKey(key) in $window[storageType])
				{
					var storageTtlKey = [STORAGE_TTL_KEY, key].join('.');						
					if(deriveQualifiedKey(storageTtlKey) in $window[storageType]){
						$window[storageType].removeItem(deriveQualifiedKey(storageTtlKey));		
						for( var i = ttlPromises.length-1; i >= 0; i--) {
							if( ttlPromises[i].key !== key) continue;							
							$timeout.cancel(ttlPromises[i].promise);
							ttlPromises.splice(i,1);								
						}	
					}					
						
					var currentTime = +new Date();
					var expireTime = angular.isDate(ttl) || angular.isString(ttl) ? +(new Date(ttl)) :
						angular.isNumber(ttl) ? +(new Date(currentTime + ttl)) :
						0;
					
					if (!expireTime) return false;
					if ((expireTime - currentTime) === 0) return true;
					if ((expireTime - currentTime) < 0) _remove(storageType, key);
					
					//var currentTime = +new Date();
					//var expireTime = +(new Date(currentTime + ttl));
					
					var promise = $timeout(function(){_remove(storageType, key);}, ttl);
					
					ttlPromises.push({key: key, promise: promise});
							
					_set(storageType, storageTtlKey, expireTime);
				}
				return true;
			};
			
			var _get = function(storageType, key){
				
				if(!isStorage(storageType)) storageType = defaults.storageType;
				if(isWebStorage(storageType) && !support.webStorage) {					
					if(!defaults.defaultToCookies) return null;
					return doThaPrefixSwap(storageType, _getCookie.bind(this, key));
				}
				if(isCookieStorage(storageType)) return _getCookie(key);
				
				try {					
					var item = $window[storageType].getItem(deriveQualifiedKey(key));
					try{
						return angular.fromJson(item);
					} catch (e){
						return item;
					}
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_GET_METHOD', message: e.message, method: 'get', key: key, storageType: storageType});
					return null;
				}	
			};
			
			var _getCookie = function(key){
				if (!support.cookies) return null;				
				try{		
					var item = cookieReader()[deriveQualifiedKey(key)];	
					// because webstorage getItem returns null maintain consistency
					if (angular.isUndefined(item)) item = null;
					try{
						return angular.fromJson(item);
					} catch (e){
						return item;
					}
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_GET_COOKIE_METHOD', message: e.message, key: key, storageType: COOKIE_STORAGE});
					return null;
				}
			};
			
			var _remove = function() {	
				if(arguments.length < 2) {
					$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_WRONG_NUMBER_OF_ARGUMENTS'});
					return false;
				}
				var args = Array.prototype.slice.call(arguments);
				var storageType = args.splice(0, 1)[0];				
				
				if(!isStorage(storageType)) storageType = defaults.storageType;
				if(isWebStorage(storageType) && !support.webStorage) {					
					if(!defaults.defaultToCookies) return false;
					var callback = function(args) { return _removeCookies.apply(this, args);};
					return doThaPrefixSwap(storageType, callback.bind(this, args));
				}
				if(isCookieStorage(storageType)) return _removeCookies.apply(this, args);
								
				var allSucceded = true;
				for (var i in args){
					var key = args[i];
					try{						
						var storageTtlKey = [STORAGE_TTL_KEY, key].join('.');						
						if(deriveQualifiedKey(storageTtlKey) in $window[storageType]){
							$window[storageType].removeItem(deriveQualifiedKey(storageTtlKey));		
							for( var j = ttlPromises.length-1; j >= 0; j--) {
								if( ttlPromises[j].key !== key) continue;							
								$timeout.cancel(ttlPromises[j].promise);
								ttlPromises.splice(j,1);								
							}	
						}						
						$window[storageType].removeItem(deriveQualifiedKey(key));
					}catch(e){
						$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_REMOVE_METHOD', message: e.message, key: key, storageType: storageType});
						allSucceded = false;
					}
				}
				return allSucceded;				
			};
			
			var _removeCookies = function(){
				if (!support.cookies) return false;	
				var allSucceded = true;				
				for (var i = 0 ; i < arguments.length ; i++){
					var key = arguments[i];
					try{							
						cookieWriter(deriveQualifiedKey(key), null);
					}catch(e){
						$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_REMOVE_COOKIE_METHOD', message: e.message, key: key, storageType: COOKIE_STORAGE});
						allSucceded = false;
					}
				}
				return allSucceded;	
			};			
			
			var _getKeys = function(storageType, keyStartsWith){							
				if(!isStorage(storageType)) storageType = defaults.storageType;
				if(isWebStorage(storageType) && !support.webStorage) {					
					if(!defaults.defaultToCookies) return null;
					return doThaPrefixSwap(storageType, _getCookieKeys.bind(this, keyStartsWith)); 
				}
				if(isCookieStorage(storageType)) return _getCookieKeys(keyStartsWith);
												
				// Let's convert undefined keyStartsWith to empty string to get the value consistent
				if (angular.isUndefined(keyStartsWith)) keyStartsWith = '';
				
				var storageTtlKeyStartsWith = deriveQualifiedKey([STORAGE_TTL_KEY,keyStartsWith].join('.'));
				keyStartsWith = deriveQualifiedKey(keyStartsWith);				
				
				var keys = [];
								
				for(var key in $window[storageType]){
					if(key.substr(0, storageTtlKeyStartsWith.length) === storageTtlKeyStartsWith) continue;
					if(key.substr(0, keyStartsWith.length) !== keyStartsWith) continue;
					try{
						keys.push(key.substr(defaults.prefix.length));
					} catch (e){
						$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_GETKEYS_METHOD',  message: e.message, key: key, storageType: storageType});
					}					
				}
				return keys;
			};
			
			var _getCookieKeys = function(keyStartsWith){				
				if (!support.cookies) return null;	
				
				// Let's convert undefined keyStartsWith to empty string to get the value consistent
				if (angular.isUndefined(keyStartsWith)) keyStartsWith = '';
				
				keyStartsWith = deriveQualifiedKey(keyStartsWith);
				var result = [];
				
				var keys = Object.keys(cookieReader());
				for(var index in keys){
					var key = keys[index];
					if(key.substr(0, keyStartsWith.length) !== keyStartsWith) continue;
					try{
						result.push(key.substr(defaults.prefix.length));
					} catch (e){
						$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_GETKEYS_COOKIES_METHOD',  message: e.message, key: key, storageType: COOKIE_STORAGE});
					}	
				}
				return result;
			};
			
			var _clear = function(storageType, keyStartsWith){				
				var keys = _getKeys(storageType, keyStartsWith) || [];
				if (keys.length === 0) return true;
				keys.splice(0, 0, storageType);				
				return _remove.apply(this, keys);
			};
			
			var _clearCookies = function(keyStartsWith){				
				var keys = _getCookieKeys(keyStartsWith) || [];
				if (keys.length === 0) return true;						
				return _removeCookies.apply(this, keys);
			};
			
			var _length = function(storageType){
				var keys = _getKeys(storageType) || [];
				return keys.length;
			};
			
			var _cookiesLength = function(){
				var keys =_getCookieKeys() || [];
				return keys.length;
			};
			
			var _key = function(storageType, key){
				var keys = _getKeys(storageType) || [];
				return keys.indexOf(key);
			};
			
			var _cookieKey = function(key){
				var keys = _getCookieKeys() || [];
				return keys.indexOf(key);
			};
			
			/* */
			var getDefaultStorageType = function() {
				return defaults.storageType;
			};

			var setDefaultStorageType = function(storageType) {
				if(!isStorage(storageType)) return false;
				defaults.storageType = storageType;
				return true;
			};
			
			var getPrefix = function(){
				return defaults.prefix;
			};	
			
			var clearAll = function(){
				var clearLocalStorageResult = _clear(LOCAL_STORAGE);
				var clearSessionStorageResult = _clear(SESSION_STORAGE);
				var clearCookieResult = _clearCookies();
				return clearLocalStorageResult && clearSessionStorageResult && clearCookieResult;
			};
			
			var sessionStorage = {
				set : function(key, value, options){
					return _set(SESSION_STORAGE, key, value, options);
				},
				get : function(key){
					return _get(SESSION_STORAGE, key);
				},
				remove : function(){
					// TODO: maybe use ...args if ES6
					// function(...args){
					// 	return(SESSION_STORAGE, args)	
					//}
					var args = Array.prototype.slice.call(arguments);
					args.splice(0, 0, SESSION_STORAGE);
					return _remove.apply(this, args);
				},
				getKeys : function(keyStartsWith){
					return _getKeys(SESSION_STORAGE, keyStartsWith);
				},
				clear : function(){
					return _clear(SESSION_STORAGE);
				},
				setTTL : function(key, ttl){
					return _setTTL(SESSION_STORAGE, key, ttl);
				},
				length : function(){
					return _length(SESSION_STORAGE);
				},
				key : function(key){
					return _key(SESSION_STORAGE, key);
				}
			};
			
			var localStorage = {
				set : function(key, value, options){
					return _set(LOCAL_STORAGE, key, value, options);
				},
				get : function(key){
					return _get(LOCAL_STORAGE, key);
				},
				remove : function(){
					// TODO: maybe use ...args if ES6
					var args = Array.prototype.slice.call(arguments);
					args.splice(0, 0, LOCAL_STORAGE);
					return _remove.apply(this, args);
				},
				getKeys : function(keyStartsWith){
					return _getKeys(LOCAL_STORAGE, keyStartsWith);
				},
				clear : function(){
					return _clear(LOCAL_STORAGE);
				},
				setTTL : function(key, ttl){
					return _setTTL(LOCAL_STORAGE, key, ttl);
				},
				length : function(){
					return _length(LOCAL_STORAGE);
				},
				_cookieKey : function(key){
					return _key(LOCAL_STORAGE, key);
				}
			};
			
			var cookies = {
				set : function(key, value, options){
					return _setCookie(key, value, options);
				},
				get : function(key){
					return _getCookie(key);
				},
				remove : function(){
					// TODO: maybe use ...args if ES6
					var args = Array.prototype.slice.call(arguments);
					return _removeCookies.apply(this, args);
				},
				getKeys : function(keyStartsWith){
					return _getCookieKeys(keyStartsWith);
				},
				clear : function(){
					return _clearCookies();
				},
				setTTL : function(key, ttl){
					console.log('set ttl not available for cookies');
					return false;
				},
				length : function(){
					return _cookiesLength();
				},
				key : function(key){
					return _key(key);
				}
			};
						
			/* */
			init();	
			
			/* */
			return {				
				sessionStorage: sessionStorage,
				localStorage: localStorage,
				cookies: cookies,
				
				clearAll: clearAll,
				clear: _clear.bind(this, null),
				clearSessionStorage: sessionStorage.clear,
				clearLocalStorage: localStorage.clear,	
				clearCookies: cookies.clear,
				
				getKeys: _getKeys.bind(this, null),
				getKeysFromSessionStorage: sessionStorage.getKeys,
				getKeysFromLocalStorage: localStorage.getKeys, 	
				getKeysFromCookies: cookies.getKeys,
				
				remove: _remove.bind(this, null),
				removeFromSessionStorage: sessionStorage.remove,
				removeFromLocalStorage: localStorage.remove,				
				removeFromCookies: cookies.remove,
				
				get: _get.bind(this, null),
				getFromSessionStorage: sessionStorage.get,
				getFromLocalStorage: localStorage.get,				
				getFromCookies: cookies.get,
				
				set: _set.bind(this, null),
				setToSessionStorage: sessionStorage.set, 
				setToLocalStorage: localStorage.set,
				setToCookies: cookies.set,
				
				setTTL: _setTTL.bind(this, null),				
				setTTLToSessionStorage: sessionStorage.setTTL,
				setTTLToLocalStorage: localStorage.setTTL,
				setTTlToCookies: cookies.setTTL,
				
				length: _length.bind(this, null),
				lengthOfSessionStorage: sessionStorage.length,
				lengthOfLocalStorage: localStorage.length,
				lengthOfCookies: cookies.length,
				
				key: _key.bind(this, null),
				keySessionStorage: sessionStorage.length,
				keyLocalStorage: localStorage.length,
				keyCookies: cookies.length,
				
				getDefaultStorageType: getDefaultStorageType,
				setDefaultStorageType: setDefaultStorageType,
				getPrefix: getPrefix 
			};
		}];
	});
})(window, window.angular);
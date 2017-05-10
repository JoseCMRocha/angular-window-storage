/**
* angular-window-storage 
* Angular module to ease the access of localStorage, sessionStorage and cookie. 
* Author: Jose Rocha 
* Version: 0.1.3 
* Date: 2017-05-10 
* Project github: https://github.com/JoseCMRocha/angular-window-storage
* License: MIT 
*/
(function (window, angular) {
angular.module('WindowStorageModule',[])
	.provider('windowStorageService', function($provide){
		
		/* readonly global's */
		var LOCAL_STORAGE = 'localStorage';
		var SESSION_STORAGE = 'sessionStorage';
		var COOKIE_STORAGE = 'cookie';
		var RESERVED_KEY = '__';
		var STORAGE_TTL_KEY = [RESERVED_KEY, 'WINDOW_STORAGE_TTL'].join('');
		var CHUNK_NUMBER_KEY = ['.', RESERVED_KEY, 'CHUNK'].join('');
		var NUMBER_OF_CHUNKS_KEY = 'OF';
		
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
				ttl : 30*24*60*60*1000, //30 days in milliseconds 
				secure: false
			},
			allowWebStorage: true,
			allowCookies: true,
			defaultToCookies: true,
			cookiesEncoderComponentFn: encodeURIComponent,
			cookiesDecoderComponentFn: decodeURIComponent,
			webStorageEncoderComponentFn: null,
			webStorageDecoderComponentFn: null,
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
		
		this.setCookiesEncoderComponentFn = function(cookiesEncoderComponentFn){
			if(angular.isFunction(cookiesEncoderComponentFn)) this._defaults.cookiesEncoderComponentFn = cookiesEncoderComponentFn;
			return this;
		};
		
		this.setCookiesDecoderComponentFn = function(cookiesDecoderComponentFn){
			if(angular.isFunction(cookiesDecoderComponentFn)) this._defaults.cookiesDecoderComponentFn = cookiesDecoderComponentFn;
			return this;
		};
		
		this.setWebStorageEncoderComponentFn = function(webStorageEncoderComponentFn){
			if(angular.isFunction(webStorageEncoderComponentFn)) this._defaults.webStorageEncoderComponentFn = webStorageEncoderComponentFn;
			return this;
		};
		
		this.setWebStorageDecoderComponentFn = function(webStorageDecoderComponentFn){
			if(angular.isFunction(webStorageDecoderComponentFn)) this._defaults.webStorageDecoderComponentFn = webStorageDecoderComponentFn;
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
								
				// TODO: is webStorage supported and cookies supported 
				// check for cookis that might bellong to some web storage that for some reason were fallbacked to cookies
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
						cookieWriter(key, value);
						supported = $document[COOKIE_STORAGE].indexOf(defaults.cookiesEncoderComponentFn(key)) > -1;
						cookieWriter(key, null);
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
			
			var buildCookie = function(key, value, expires, path, domain, secure) {				
				var strHead =  defaults.cookiesEncoderComponentFn(key);
				var strValue = defaults.cookiesEncoderComponentFn(value);
				var strTail = path ? ';path=' + path : '';
					strTail += domain ? ';domain=' + domain : '';
					strTail += expires ? ';expires=' + expires.toUTCString() : '';
					strTail += secure ? ';secure' : '';
				
				// per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
				// - 300 cookies
				// - 20 cookies per unique domain
				// - 4096 bytes per cookie				
				var strValueLength = strValue.length;
				var headAndTailLength = strHead.length + strTail.length;
				var cookieLength = strValueLength + headAndTailLength + 1;
				
				// 4093 minimum maximun allowed in wrost case cenario browser 
				// source http://browsercookielimits.squawky.net/
				var minMaxAllowed = 4093;
				var maskOfMinMaxAllowed = "0000";
				var reservedLength = CHUNK_NUMBER_KEY.length + maskOfMinMaxAllowed.length + NUMBER_OF_CHUNKS_KEY.length + maskOfMinMaxAllowed.length;
				
				if(cookieLength > minMaxAllowed && (headAndTailLength + reservedLength) < minMaxAllowed)
				{			
					// I only divide the value by cookies if the head and tail length plus reserved length is less than 4093					
					var numberOfChunks = Math.ceil(strValueLength / (minMaxAllowed - headAndTailLength - reservedLength)); 
					var maskOfNumberOfChunks = (maskOfMinMaxAllowed + numberOfChunks).slice(-maskOfMinMaxAllowed.length);
					
					if(numberOfChunks > 30)	$rootScope.$broadcast('WindowStorageModule.warning', {
						type:'WINDOW_STORAGE_COOKIE_STORAGE_VALUE_TO_BIG', 
						message: 'Cookie \'' + key + '\' possibly not set or overflowed because it was too large even to divide in chunks ('+numberOfChunks+' > 30 chunks)!'});
					
					var result = [];
					var chunkSize = Math.ceil(strValueLength / numberOfChunks);
					for(var i = 0; i < numberOfChunks; i++){				
						var chunkNumber = i + 1;
						var maskOfChunkNumber = (maskOfMinMaxAllowed + chunkNumber).slice(-maskOfMinMaxAllowed.length);
						var cookie = [strHead, CHUNK_NUMBER_KEY, maskOfChunkNumber, NUMBER_OF_CHUNKS_KEY, maskOfNumberOfChunks].join('');
							cookie += '=' + strValue.substr(i*chunkSize, chunkSize);
							cookie += strTail;
						
						result.push(cookie);
					}		
					return result;
					
				}
				if (cookieLength > minMaxAllowed) $rootScope.$broadcast('WindowStorageModule.warning', {
					type:'WINDOW_STORAGE_COOKIE_STORAGE', 
					message: 'Cookie \'' + key + '\' possibly not set or overflowed because it was too large (' + cookieLength + ' > '+minMaxAllowed+' bytes)!'});				
								
				return [strHead + '=' + strValue + strTail];
			};
			
			var cookieEraser = function(key, path, domain, secure){
				var expires = new Date(0);
				var value = '';
				
				var strHead = defaults.cookiesEncoderComponentFn(key);
				var strHeadChunks = [strHead, CHUNK_NUMBER_KEY].join('');
				var strValue = defaults.cookiesEncoderComponentFn(value);
				var strTail = path ? ';path=' + path : '';
					strTail += domain ? ';domain=' + domain : '';
					strTail += expires ? ';expires=' + expires.toUTCString() : '';
					strTail += secure ? ';secure' : '';
			
				// get all cookies that start with and delete them
				var cookieString = $document.cookie;
				cookieString = cookieString.replace(/\s/g,'');
				var cookies = [];
				var cookieArray = cookieString.split(';');
				for(var index in cookieArray){
					var cookieKeyValue = cookieArray[index].split('=');
					var cookieKey = cookieKeyValue[0];
					if (!(angular.isDefined(cookieKey) && (cookieKey === strHead || cookieKey.indexOf(strHeadChunks) > -1))) continue;					
					var str = cookieKey + '=';
						str += strValue;
						str += strTail;
						
					cookies.push(str);						
				}
				return cookies;	
			};
			
			var cookieWriter = function(key, value, options){
				options = optionsTransform(options);
				
				var expires;
				var path = options.path;
				var ttl = options.ttl;
				var domain = options.domain;
				var secure = options.secure;
				
				path = angular.isUndefined(path) ? defaults.cookies.path === null ? $browser.baseHref():
						defaults.cookies.path :
						path;
				
				var currentTime = +new Date();
				
				expires = angular.isUndefined(ttl) ? new Date(currentTime + defaults.cookies.ttl):
						angular.isDate(ttl) ? ttl : 
						angular.isNumber(ttl) ? new Date(currentTime + ttl) :
						new Date(0);
						
				domain = angular.isUndefined(domain) ? defaults.cookies.domain === null ? '':
						defaults.cookies.domain:
						domain;
				
				secure = angular.isUndefined(secure) ? defaults.cookies.secure : secure;
				
				// erase first because of chunked cookies
				var cookies = cookieEraser(key, path, domain, secure);	
				for (var iEraser in cookies) $document.cookie = cookies[iEraser];
				
				// add cookies last
				// No undefined values or null values assume that if a undefined or null value is sent it is a remove command
				if (angular.isUndefined(value) || value === null || expires < new Date(currentTime)) return;
					
				cookies = buildCookie(key, value, expires, path, domain, secure);
				for (var iWriter in cookies) $document.cookie = cookies[iWriter];
			};
			
			var cookieReader = function(){
				var cookieString = $document.cookie;
				cookieString = cookieString.replace(/\s/g,'');
				var result = {};
				var cookieArray = cookieString.split(';');
				for(var index in cookieArray){
					var cookieKeyValue = cookieArray[index].split('=');
					
					var cookieKeySplit = cookieKeyValue[0].split(CHUNK_NUMBER_KEY);
					var cookieKey = defaults.cookiesDecoderComponentFn(cookieKeySplit[0]);
					if (!cookieKey) continue;
					
					// can't decode here URIError: malformed URI sequence
					//var cookieValue = decoderURIComponent(cookieKeyValue[1]);
					var cookieValue = cookieKeyValue[1];
										
					if (angular.isDefined(cookieKeySplit[1])){
						var chunkData = cookieKeySplit[1].split(NUMBER_OF_CHUNKS_KEY);
						var chunkNumber = parseInt(chunkData[0]);
						var numberOfChunks = parseInt(chunkData[1]);
						
						var currentValue = result[cookieKey] || '';
						// last chunk
						if (chunkNumber == numberOfChunks){
							result[cookieKey] += cookieValue;
						} else {
							//http://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index
							
							result[cookieKey] = currentValue.slice(0, (chunkNumber - 1) * cookieValue.length) + cookieValue + currentValue.slice((chunkNumber - 1) * cookieValue.length);
						}				
					} else {
						result[cookieKey] = cookieValue;
					}
				}
				
				for (var property in result) {
					if (result.hasOwnProperty(property)) {
						result[property] = defaults.cookiesDecoderComponentFn(result[property]);
					}
				}
				
				return result;
			};
			
			var optionsTransform = function(options){
				return (angular.isNumber(options) || angular.isDate(options)) ? {ttl : options} : options || {};
			};
			
			var prefixSwapForCall = function(storageType, callback){
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
					return prefixSwapForCall(storageType, _setCookie.bind(this, key, value, options));
				}
				if(isCookieStorage(storageType)) return _setCookie(key, value, options);
				
				options = optionsTransform(options);
				
				// No undefined values or null values assume that if a undefined or null value is sent it is a remove command
				if (angular.isUndefined(value) || value === null) return _remove(storageType, key);
								
				try{
					var jsonValue = angular.toJson(value);
					
					if (defaults.webStorageEncoderComponentFn && defaults.webStorageDecoderComponentFn) 
						jsonValue = defaults.webStorageEncoderComponentFn(jsonValue);
					
					$window[storageType].setItem(deriveQualifiedKey(key), jsonValue);
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
				if (angular.isUndefined(value) || value === null) return _removeCookies(key);
				
				options = optionsTransform(options);	
				
				try{			
					cookieWriter(deriveQualifiedKey(key), angular.toJson(value), options.ttl, options.path, options.domain, options.secure);	
					return true;					
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_SET_COOKIE_METHOD', message: e.message, key: key, storageType: COOKIE_STORAGE});
					return false;
				}
			};
			
			var _setTTL = function (storageType, key, options){
				
				if(!isStorage(storageType)) storageType = defaults.storageType;
				if(isWebStorage(storageType) && !support.webStorage) {					
					if(!defaults.defaultToCookies) return false;
					return prefixSwapForCall(storageType, _setTTLCookie.bind(this, key, options));
				}
				if(isCookieStorage(storageType)) return _setTTLCookie(key, options);
				
				options = optionsTransform(options);
				
				var ttl = options.ttl;
				
				var currentTime = +new Date();					
				ttl = angular.isDate(ttl) ? +new Date(new Date(ttl) - currentTime) :
					angular.isNumber(ttl) ? ttl : 0;
				
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
					
					//var currentTime = +new Date();
					var expireTime = +(new Date(currentTime + ttl));
					
					var promise = $timeout(function(){_remove(storageType, key);}, ttl);
					
					ttlPromises.push({key: key, promise: promise});
							
					_set(storageType, storageTtlKey, expireTime);
				}
				return true;
			};
			
			var _setTTLCookie = function(key, options){		
				if (!support.cookies) return false;				
				
				options = optionsTransform(options);	
				
				var value = cookieReader()[deriveQualifiedKey(key)];
				try{
					cookieWriter(deriveQualifiedKey(key), value, options.ttl, options.path, options.domain, options.secure);
					return true;
				} catch (e) {
					$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_SET_TTL_COOKIE_METHOD', message: e.message, key: key, storageType: COOKIE_STORAGE});
					return false;
				}
			};
			
			var _get = function(storageType, key){
				
				if(!isStorage(storageType)) storageType = defaults.storageType;
				if(isWebStorage(storageType) && !support.webStorage) {					
					if(!defaults.defaultToCookies) return null;
					return prefixSwapForCall(storageType, _getCookie.bind(this, key));
				}
				if(isCookieStorage(storageType)) return _getCookie(key);
				
				try {					
					var item = $window[storageType].getItem(deriveQualifiedKey(key));
					
					if (defaults.webStorageEncoderComponentFn && defaults.webStorageDecoderComponentFn)
						item = defaults.webStorageDecoderComponentFn(item);
					
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
					return prefixSwapForCall(storageType, callback.bind(this, args));
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
					return prefixSwapForCall(storageType, _getCookieKeys.bind(this, keyStartsWith)); 
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
					if (key.substr(defaults.prefix.length, RESERVED_KEY.length) === RESERVED_KEY) continue;
					if (key.substr(0, keyStartsWith.length) !== keyStartsWith) continue;
					try{
						result.push(key.substr(defaults.prefix.length));
					} catch (e){
						$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_GETKEYS_COOKIES_METHOD',  message: e.message, key: key, storageType: COOKIE_STORAGE});
					}	
				}
				return result;
			};
			
			var _clear = function(storageType, keyStartsWith){	
				if(isCookieStorage(storageType)) return _clearCookies(keyStartsWith);			
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
				if(isCookieStorage(storageType)) return _cookiesLength();
				var keys = _getKeys(storageType) || [];
				return keys.length;
			};
			
			var _cookiesLength = function(){
				var keys =_getCookieKeys() || [];
				return keys.length;
			};
			
			var _key = function(storageType, key){
				if(isCookieStorage(storageType)) return _cookieKey(key);
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
			
			var _publicSet = function(storageType, key, value, options){
				if(key.indexOf(RESERVED_KEY) > -1 ){
					$rootScope.$broadcast('WindowStorageModule.error', {type: 'WINDOW_STORAGE_SET_METHOD', message: 'Reserved key \''+RESERVED_KEY+'\'', key: key, storageType: storageType});
					return false;
				}
				return _set(storageType, key, value, options);
			};
			
			var methodsForStorageType = function(storageType){
				return {
					set : _publicSet.bind(this, storageType),
					get : _get.bind(this, storageType),
					remove: _remove.bind(this, storageType),
					getKeys : _getKeys.bind(this, storageType),
					clear : _clear.bind(this, storageType),
					setTTL : _setTTL.bind(this, storageType),
					length : _length.bind(this, storageType),
					key : _key.bind(this, storageType)
				};
			};
			
			var sessionStorage = methodsForStorageType(SESSION_STORAGE);			
			var localStorage = methodsForStorageType(LOCAL_STORAGE);			
			var cookies = methodsForStorageType(COOKIE_STORAGE);
						
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
				
				set: _publicSet.bind(this, null),
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
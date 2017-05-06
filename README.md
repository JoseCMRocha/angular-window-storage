# angular-window-storage
Angular module to ease the access of local and session storage<br/>
[Table of contents](#table-of-contents)
## Usage
### Require WindowStorageModule and Inject the windowStorageService
```javascript
angular.module('yourLegendaryApp', ['WindowStorageModule'])
  .controller('youAwesomeCtrl', ['windowStorageService', function(windowStorageService){
    // Code here...
  }]);
```
That's it you are ready to go, but if in the need of configuration ...
### Configure the provider
```javascript
angular.module('yourLegendaryApp', ['WindowStorageModule'])
  .config(['windowStorageServiceProvider', function(windowStorageServiceProvider){
    windowStorageServiceProvider
      .setPrefix('wS_Demo') // default prefix - 'ws_'
      .setDefaultStorageType('localStorage'); // default storage - 'sessionStorage'
  }]);
```
### Setters
`@key*` The key of the key value pair to set. <br/>
`@value*` The value of the key value pair to set. <br/>
`@ttl` The time to live in milliseconds of the key value pair to set. <br/>
`@options` The object to pass instead of the ttl to configure: <br/>
`options.ttl = @ttl` The time to live in milliseconds of the key value pair to set. <br/>
`options.path = @path**` The cookie will be available only for this path and its sub-paths. <br/>
`options.domain = @domain**` The cookie will be available only for this domain and its sub-domains. <br/>
`options.secure = @secure**`  If true, then the cookie will only be available through a secured connection <br/>
**Required arguments* <br/>
*\**Only used when storage in use is cookie or storage is defaulting to cookie*
#### Set a key value pair to the default storage in use
```javascript
// example 1:
windowStorageService.set(key, value);
// example 2:
windowStorageService.set(key, value, ttl);
// example 3:
windowStorageService.set(key, value, options);
```
#### Set a key value pair to the session storage
```javascript
// example 1:
windowStorageService.setToSessionStorage(key, value);
// example 2:
windowStorageService.sessionStorage.set(key, value);
// example 3:
windowStorageService['sessionStorage'].set(key, value);
// example 4:
windowStorageService.setToSessionStorage(key, value, ttl);
// example 5:
windowStorageService.sessionStorage.set(key, value, ttl);
// example 6:
windowStorageService['sessionStorage'].set(key, value, ttl);
// example 7:
windowStorageService.setToSessionStorage(key, value, options);
// example 8:
windowStorageService.sessionStorage.set(key, value, options);
// example 9:
windowStorageService['sessionStorage'].set(key, value, options);
```
#### Set a key value pair to the local storage
```javascript
// example 1:
windowStorageService.setToLocalStorage(key, value); 
// example 2:
windowStorageService.localStorage.set(key, value); 
// example 3:
windowStorageService['localStorage'].set(key, value);
// example 4:
windowStorageService.setToLocalStorage(key, value, ttl); 
// example 5:
windowStorageService.localStorage.set(key, value, ttl); 
// example 6:
windowStorageService['localStorage'].set(key, value, ttl);
// example 7:
windowStorageService.setToLocalStorage(key, value, options); 
// example 8:
windowStorageService.localStorage.set(key, value, options); 
// example 9:
windowStorageService['localStorage'].set(key, value, options);
```
#### Set a key value pair to the cookie
```javascript
// example 1:
windowStorageService.setToCookie(key, value); 
// example 2:
windowStorageService.cookie.set(key, value); 
// example 3:
windowStorageService['cookie'].set(key, value);
// example 4:
windowStorageService.setToCookie(key, value, ttl); 
// example 5:
windowStorageService.cookie.set(key, value, ttl); 
// example 6:
windowStorageService['cookie'].set(key, value, ttl);
// example 7:
windowStorageService.setToCookie(key, value, options); 
// example 8:
windowStorageService.cookie.set(key, value, options); 
// example 9:
windowStorageService['cookie'].set(key, value, options);
```
### Getters
`@key*` The key of the key value pair to fetch. <br/>
**Required arguments*
#### Get a key value pair from the default storage in use
```javascript
// example 1:
var item = windowStorageService.get(key);
```
#### Get a key value pair from the session storage
```javascript
// example 1:
var item = windowStorageService.getFromSessionStorage(key); 
// example 2:
var item = windowStorageService.sessionStorage.get(key);
// example 3:
var item = windowStorageService['sessionStorage'].get(key);
```
#### Get a key value pair from the local storage
```javascript
// example 1:
var item = windowStorageService.getFromLocalStorage(key); 
// example 2:
var item = windowStorageService.localStorage.get(key);
// example 3:
var item = windowStorageService['localStorage'].get(key);
```
#### Get a key value pair from the cookie
```javascript
// example 1:
var item = windowStorageService.getFromCookie(key); 
// example 2:
var item = windowStorageService.cookie.get(key);
// example 3:
var item = windowStorageService['cookie'].get(key);
```
### Removers
`@key* **` The key of the key value pair to remove. <br/>
**Required arguments* <br/>
*\**A number of keys comprehended between 1 and n* 
#### Removes the key value pair by key in the default storage in use
```javascript
// example 1:
windowStorageService.remove(key); 
// example 2:
windowStorageService.remove(key1, key2,..., keyN);
```
#### Removes the key value pair by key in the session storage
```javascript
// example 1:
windowStorageService.removeFromSessionStorage(key);
// example 2:
windowStorageService.sessionStorage.remove(key);
// example 3:
windowStorageService['sessionStorage'].remove(key); 
// example 4:
windowStorageService.removeFromSessionStorage(key1, key2,..., keyN); 
// example 5:
windowStorageService.sessionStorage.remove(key1, key2,..., keyN); 
// example 6:
windowStorageService['sessionStorage'].remove(key1, key2,..., keyN);
```
#### Removes the key value pair by key in the local storage
```javascript
// example 1:
windowStorageService.removeFromLocalStorage(key); 
// example 2:
windowStorageService.localStorage.remove(key);
// example 3:
windowStorageService['localStorage'].remove(key);
// example 4:
windowStorageService.removeFromLocalStorage(key1, key2,..., keyN); 
// example 5:
windowStorageService.localStorage.remove(key1, key2,..., keyN);
// example 6:
windowStorageService['localStorage'].remove(key1, key2,..., keyN);
```
#### Removes the key value pair by key in the cookie
```javascript
// example 1:
windowStorageService.removeFromCookie(key); 
// example 2:
windowStorageService.cookie.remove(key);
// example 3:
windowStorageService['cookie'].remove(key);
// example 4:
windowStorageService.removeFromCookie(key1, key2,..., keyN); 
// example 5:
windowStorageService.cookie.remove(key1, key2,..., keyN);
// example 6:
windowStorageService['cookie'].remove(key1, key2,..., keyN);
```
### Clears
#### Clear the default storage in use
```javascript
// example 1:
windowStorageService.clear(); 
```
#### Clear the session storage
```javascript
// example 1:
windowStorageService.clearSessionStorage();   
// example 2:
windowStorageService.sessionStorage.clear(); 
// example 3:
windowStorageService['sessionStorage'].clear();
```
#### Clear the local storage
```javascript
// example 1:
windowStorageService.clearLocalStorage(); 
// example 2:
windowStorageService.localStorage.clear(); 
// example 3:
windowStorageService['sessionStorage'].clear();
```
#### Clear the cookie
```javascript
// example 1:
windowStorageService.clearCookie(); 
// example 2:
windowStorageService.cookie.clear(); 
// example 3:
windowStorageService['cookie'].clear();
```
#### Clear all storages
```javascript
// example 1:
windowStorageService.clearAll(); 
```
### Length
#### Gets the length of the default storage in use
```javascript
// example 1:
var length = windowStorageService.length(); 
```
#### Gets the length of the session storage
```javascript
// example 1:
var length = windowStorageService.lengthOfSessionStorage();
// example 2:
var length = windowStorageService.sessionStorage.length();
// example 3:
var length = windowStorageService['sessionStorage'].length(); 
```
#### Gets the length the local storage
```javascript
// example 1:
var length = windowStorageService.lengthOfLocalStorage(); 
// example 2:
var length = windowStorageService.localStorage.length();
// example 3:
var length =windowStorageService['localStorage'].length();
```
#### Gets the length the cookie
```javascript
// example 1:
var length = windowStorageService.lengthOfCookie(); 
// example 2:
var length = windowStorageService.cookie.length();
// example 3:
var length =windowStorageService['cookie'].length();
```
### Key
`@key*` The key to find the index of the key value pair. <br/>
**Required arguments* <br/>
#### Gets the index of the given key in the default storage in use
```javascript
// example 1:
var index = windowStorageService.key(key); 
```
#### Gets the index of the given key in the session storage
```javascript
// example 1:
var index = windowStorageService.keySessionStorage(key);
// example 2:
var index = windowStorageService.sessionStorage.key(key);
// example 3:
var index = windowStorageService['sessionStorage'].key(key); 
```
#### Gets the index of the given key in the local storage
```javascript
// example 1:
var index = windowStorageService.keyLocalStorage(key); 
// example 2:
var index = windowStorageService.localStorage.key(key);
// example 3:
var index =windowStorageService['localStorage'].key(key);
```
#### Gets the index of the given key in the cookie
```javascript
// example 1:
var index = windowStorageService.keyCookie(key); 
// example 2:
var index = windowStorageService.cookie.key(key);
// example 3:
var index =windowStorageService['cookie'].key(key);
```
### Get keys
#### Gets the keys from the default storage in use
```javascript
// example 1:
var keyArray = windowStorageService.getKeys();
```
#### Gets the keys from the session storage
```javascript
// example 1:
var keyArray = windowStorageService.getKeysFromSessionStorage();
// example 2:
var keyArray = windowStorageService.sessionStorage.getKeys();
// example 3:
var keyArray = windowStorageService['sessionStorage'].getKeys();
```
#### Gets the keys from the local storage
```javascript
// example 1:
var keyArray = windowStorageService.getKeysFromLocalStorage();
// example 2:
var keyArray = windowStorageService.localStorage.getKeys();
// example 3:
var keyArray = windowStorageService['localStorage'].getKeys();
```
#### Gets the keys from the cookie
```javascript
// example 1:
var keyArray = windowStorageService.getKeysFromCookie();
// example 2:
var keyArray = windowStorageService.cookie.getKeys();
// example 3:
var keyArray = windowStorageService['cookie'].getKeys();
```
### TTL setters
`@key*` The key of the key value pair to set the ttl. <br/>
`@ttl` The time to live in milliseconds of the key value pair to set. <br/>
**Required arguments*
#### Set a time to live of a key value pair in the default storage in use
```javascript
// example 1:
windowStorageService.setTTL(key, ttl);
```
#### Set a time to live of a key value pair in the session storage
```javascript
// example 1:
windowStorageService.setTTLToSessionStorage(key, ttl);
// example 2:
windowStorageService.sessionStorage.setTTL(key, ttl);
// example 3:
windowStorageService['sessionStorage'].setTTL(key, ttl);
```
#### Set a time to live of a key value pair in the local storage
```javascript
// example 1:
windowStorageService.setTTLToLocalStorage(key, ttl); 
// example 2:
windowStorageService.localStorage.setTTL(key, ttl);
// example 3:
windowStorageService['sessionStorage'].setTTL(key, ttl);
```
#### Set a time to live of a key value pair in the cookie
```javascript
NOT AVAILABLE ATM.
```
### Default storage type
`@storageType*` The storage type to be set as default. <br/>
**Required argument in set method*
#### Sets the default storage type to use from now on
```javascript
// example 1:
windowStorageService.setDefaultStorageType(storageType);   
```
#### Gets the default storage type in use
```javascript
// example 1:
var defaultStorageType = windowStorageService.getDefaultStorageType();   
```
### Prefix
#### Gets the prefix used in the construction of derive key
```javascript
// example 1:
var perfixUsedToDeriveKey = windowStorageService.getPrefix(); 
```
## Table of contents
- [Usage](#usage)
  - [Require and Inject](#require-windowstoragemodule-and-inject-the-windowstorageservice)
  - [Configure](#configure-the-provider)
  - [Set](#setters)
  - [Get](#getters)
  - [Remove](#removers)
  - [Clear](#clears)
  - [Length](#length)
  - [Key](#key)
  - [Get keys](#keys)
  - [Set TTL](#ttl-setters)
  - [Default storage type](#default-storage-type)
  - [Prefix](#prefix)
- [Authors](#authors)
- [License](#license)
- [Acknowledgments](#acknowledgments)
## Authors
* **José Rocha** - *Initial work* - [josecmrocha](https://github.com/josecmrocha) <br/>
See also the list of [contributors](https://github.com/josecmrocha/angular-window-storage/contributors) who participated in this project.
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
## Acknowledgments
* [grevory - angular-local-storage](https://github.com/grevory/angular-local-storage)
* [PurpleBooth - A template to make good README.md](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [angular-cookies - bower-angular-cookies](https://github.com/angular/bower-angular-cookies)

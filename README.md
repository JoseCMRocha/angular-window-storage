# angular-window-storage
Angular module to ease the access of local and session storage
[Table of contents]("#Table-of-Contents")
## Usage
### Require WindowStorageModule and Inject the windowStorageService
```javascript
angular.module('yourLegendaryApp', ['WindowStorageModule'])
  .controller('youAwesomeCtrl', ['windowStorageService', function(windowStorageService){
    // Code here...
  }]);
```
That's it you are ready to go ...
### Configure the provider
```javascript
angular.module('yourLegendaryApp', ['WindowStorageModule'])
  .config(['windowStorageServiceProvider', function(windowStorageServiceProvider){
    windowStorageServiceProvider
      .setPrefix('wS_Demo') // default prefix - 'ws_'
      .setDefaultStorageType('localStorage'); // default storage - 'sessionStorage'
  }]);
```
### Setter/s
`@key*` The key of the key value pair <br/>
`@value*` The value of the key value pair <br/>
`@ttl` The time to live in milliseconds <br/>
**Required arguments*
#### set a key value pair to the default storage in use
```javascript
windowStorageService.set(key, value)  
windowStorageService.set(key, value, ttl)
```
#### set a key value pair to the session storage
```javascript
windowStorageService.setToSessionStorage(key, value) 
windowStorageService.sessionStorage.set(key, value) 
windowStorageService['sessionStorage'].set(key, value)
windowStorageService.setToSessionStorage(key, value, ttl) 
windowStorageService.sessionStorage.set(key, value, ttl) 
windowStorageService['sessionStorage'].set(key, value, ttl)
```
#### set a key value pair to the local storage
```javascript
windowStorageService.setToLocalStorage(key, value) 
windowStorageService.localStorage.set(key, value) 
windowStorageService['localStorage'].set(key, value)
windowStorageService.setToLocalStorage(key, value, ttl) 
windowStorageService.localStorage.set(key, value, ttl) 
windowStorageService['localStorage'].set(key, value, ttl)
```
#### set
```javascript
windowStorageService.set(key, value); // sets a key value pair to the default storage in use  
// options
windowStorageService.set(key, value, ttl); // ttl - time to live in milliseconds
```
#### setToSessionStorage
```javascript
windowStorageService.setToSessionStorage(key, value); // sets a key value pair to the session storage 
// options
windowStorageService.setToSessionStorage(key, value, ttl); // ttl - time to live in milliseconds
```
#### sessionStorage.set
```javascript
windowStorageService.sessionStorage.set(key, value); // sets a key value pair to the session storage  
// options
windowStorageService.sessionStorage.set(key, value, ttl); // ttl - time to live in milliseconds
```
#### ['sessionStorage'].set
```javascript
windowStorageService['sessionStorage'].set(key, value); // sets a key value pair to the session storage  
// options
windowStorageService['sessionStorage'].set(key, value, ttl); // ttl - time to live in milliseconds
```
#### setToLocalStorage
```javascript
windowStorageService.setToLocalStorage(key); // sets a key value pair to the local storage 
// options
windowStorageService.setToLocalStorage(key, value, ttl); // ttl - time to live in milliseconds
```
#### localStorage.set
```javascript
windowStorageService.sessionStorage.set(key, value); // sets a key value pair to the local storage  
// options
windowStorageService.sessionStorage.set(key, value, ttl); // ttl - time to live in milliseconds
```
#### ['localStorage'].set
```javascript
windowStorageService['sessionStorage'].set(key, value); // sets a key value pair to the local storage  
// options
windowStorageService['sessionStorage'].set(key, value, ttl); // ttl - time live in milliseconds
```
### Getter/s
#### get
```javascript
windowStorageService.get(key); // gets by key in the default storage in use
```
#### getFromSessionStorage
```javascript
windowStorageService.getFromSessionStorage(key); // gets by key in the session storage  
```
#### sessionStorage.get
```javascript
windowStorageService.sessionStorage.get(key); // gets by key in the session storage  
```
#### ['sessionStorage'].get
```javascript
windowStorageService['sessionStorage'].get(key); // gets by key in the session storage  
```
#### getFromLocalStorage
```javascript
windowStorageService.getFromLocalStorage(key); // gets by key in the local storage  
```
#### localStorage.get
```javascript
windowStorageService.localStorage.get(key); // gets by key in the local storage  
```
#### ['localStorage'].get
```javascript
windowStorageService['localStorage'].get(key); // gets by key in the local storage  
```
### Remove/s
#### remove
```javascript
windowStorageService.remove(key); // removes the key value pair by key in the default storage in use
// options
windowStorageService.remove(key1, key2,..., keyN); // removes by keys in the default storage in use
```
#### removeFromSessionStorage
```javascript
windowStorageService.removeFromSessionStorage(key); // removes the key value pair by key in the session storage  
// options
windowStorageService.removeFromSessionStorage(key1, key2,..., keyN); // removes by args keys in the session storage in use
```
#### sessionStorage.remove
```javascript
windowStorageService.sessionStorage.remove(key); // removes the key value pair by key in the session storage  
// options
windowStorageService.sessionStorage.remove(key1, key2,..., keyN); // removes by args keys in the session storage in use
```
#### ['sessionStorage'].remove
```javascript
windowStorageService['sessionStorage'].remove(key); // removes the key value pair by key in the session storage  
// options
windowStorageService['sessionStorage'].remove(key1, key2,..., keyN); // removes by args keys in the session storage
```
#### removeFromLocalStorage
```javascript
windowStorageService.removeFromLocalStorage(key); // removes the key value pair by key in the local storage  
// options
windowStorageService.removeFromLocalStorage(key1, key2,..., keyN); // removes by args keys in the local storage
```
#### localStorage.remove
```javascript
windowStorageService.localStorage.remove(key); // removes the key value pair by key in the local storage  
// options
windowStorageService.localStorage.remove(key1, key2,..., keyN); // removes by args keys in the local storage
```
#### ['localStorage'].remove
```javascript
windowStorageService['localStorage'].remove(key); // removes the key value pair by key in the local storage  
// options
windowStorageService['localStorage'].remove(key1, key2,..., keyN); // removes by args keys in the local storage
```
### Clear/s
#### clear
```javascript
windowStorageService.clear(); // removes all key value pairs in the default storage  
```
#### clearSessionStorage
```javascript
windowStorageService.clearSessionStorage(); // removes all key value pairs in the session storage  
```
#### sessionStorage.clear
```javascript
windowStorageService.sessionStorage.clear(); // removes all key value pairs in the session storage  
```
#### ['sessionStorage'].clear
```javascript
windowStorageService['sessionStorage'].clear(); // removes all key value pairs in the session storage  
```
#### clearLocalStorage
```javascript
windowStorageService.clearLocalStorage(); // removes all key value pairs in the local storage  
```
#### localStorage.clear
```javascript
windowStorageService.localStorage.clear(); // removes all key value pairs in the local storage  
```
#### ['localStorage'].clear
```javascript
windowStorageService['sessionStorage'].clear(); // removes all key value pairs in the local storage  
```
#### clearAll
```javascript
windowStorageService.clearAll(); // removes all key value pairs in All the storages
```
### Key/s
#### getKeys
```javascript
windowStorageService.getKeys();
```
#### getKeysFromSessionStorage
```javascript
windowStorageService.getKeysFromSessionStorage();
```
#### sessionStorage.getKeys
```javascript
windowStorageService.sessionStorage.getKeys();
```
#### ['sessionStorage'].getKeys
```javascript
windowStorageService['sessionStorage'].getKeys();
```
#### getKeysFromLocalStorage
```javascript
windowStorageService.getKeysFromLocalStorage();
```
#### localStorage.getKeys
```javascript
windowStorageService.localStorage.getKeys();
```
#### ['localStorage'].getKeys
```javascript
windowStorageService['localStorage'].getKeys();
```
### TTL setter/s
#### setTTL
```javascript
windowStorageService.setTTL(key, ttl); // sets a ttl in milliseconds to a key value pair in the default storage  
```
#### setTTLSessionStorage
```javascript
windowStorageService.clearSessionStorage(); // sets a ttl in milliseconds to a key value pairs in the session storage  
```
#### sessionStorage.setTTL
```javascript
windowStorageService.sessionStorage.setTTL(); // sets a ttl in milliseconds to a key value pairs in the session storage  
```
#### ['sessionStorage'].setTTL
```javascript
windowStorageService['sessionStorage'].setTTL(); // sets a ttl in milliseconds to a key value pairs in the session storage  
```
#### setTTLLocalStorage
```javascript
windowStorageService.setTTLLocalStorage(); // sets a ttl in milliseconds to a key value pairs in the local storage  
```
#### localStorage.setTTL
```javascript
windowStorageService.localStorage.setTTL(); // sets a ttl in milliseconds to a key value pairs in the local storage  
```
#### ['localStorage'].setTTL
```javascript
windowStorageService['sessionStorage'].setTTL(); // sets a ttl in milliseconds to a key value pairs in the local storage  
```
### Default storage type
#### setDefaultStorageType
```javascript
windowStorageService.setDefaultStorageType(storageType); // sets the default storage to be used as default from now on  
```
#### getDefaultStorageType
```javascript
windowStorageService.getDefaultStorageType(storageType); // gets the default storage in use  
```
### Prefix
#### getPrefix
```javascript
windowStorageService.getPrefix(); // gets the prefix for the construction of derive keys in use
```
## Table of contents
- [Usage](#Usage)
- [Authors](#Authors)
- [License](#License)
- [Acknowledgments](#Acknowledgments)
## Authors
* **José Rocha** - *Initial work* - [josecmrocha](https://github.com/josecmrocha)
See also the list of [contributors](https://github.com/josecmrocha/angular-window-storage/contributors) who participated in this project.
## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
## Acknowledgments
* [grevory - angular-local-storage](https://github.com/grevory/angular-local-storage)
* [PurpleBooth - A template to make good README.md](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
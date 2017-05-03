# angular-window-storage
Angular module to ease the access of local and session storage<br/>
[Table of contents](#Table-of-Contents)
## Usage
### Require WindowStorageModule and Inject the windowStorageService
```javascript
angular.module('yourLegendaryApp', ['WindowStorageModule'])
  .controller('youAwesomeCtrl', ['windowStorageService', function(windowStorageService){
    // Code here...
  }]);
```
That's it you are ready to go, but if you need ...
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
`@key*` The key of the key value pair to set. <br/>
`@value*` The value of the key value pair to set. <br/>
`@ttl` The time to live in milliseconds of the key value pair to set. <br/>
**Required arguments*
#### Set a key value pair to the default storage in use
```javascript
windowStorageService.set(key, value)  
windowStorageService.set(key, value, ttl)
```
#### Set a key value pair to the session storage
```javascript
windowStorageService.setToSessionStorage(key, value) 
windowStorageService.sessionStorage.set(key, value) 
windowStorageService['sessionStorage'].set(key, value)
windowStorageService.setToSessionStorage(key, value, ttl) 
windowStorageService.sessionStorage.set(key, value, ttl) 
windowStorageService['sessionStorage'].set(key, value, ttl)
```
#### Set a key value pair to the local storage
```javascript
windowStorageService.setToLocalStorage(key, value) 
windowStorageService.localStorage.set(key, value) 
windowStorageService['localStorage'].set(key, value)
windowStorageService.setToLocalStorage(key, value, ttl) 
windowStorageService.localStorage.set(key, value, ttl) 
windowStorageService['localStorage'].set(key, value, ttl)
```
### Getter/s
`@key*` The key of the key value pair to fetch. <br/>
**Required arguments*
#### Get a key value pair from the default storage in use
```javascript
windowStorageService.get(key);
```
#### Get a key value pair from the session storage
```javascript
windowStorageService.getFromSessionStorage(key); 
windowStorageService.sessionStorage.get(key);
windowStorageService['sessionStorage'].get(key);
```
#### Get a key value pair from the local storage
```javascript
windowStorageService.getFromLocalStorage(key); 
windowStorageService.localStorage.get(key);
windowStorageService['localStorage'].get(key);
```
### Remove/s
`@key* **` The key of the key value pair to remove. <br/>
**Required arguments* <br/>
*\**A number between 1 and n*
#### Removes the key value pair by key in the default storage in use
```javascript
windowStorageService.remove(key); 
windowStorageService.remove(key1, key2,..., keyN);
```
#### Removes the key value pair by key in the session storage
```javascript
windowStorageService.removeFromSessionStorage(key);
windowStorageService.sessionStorage.remove(key);
windowStorageService['sessionStorage'].remove(key); 
windowStorageService.removeFromSessionStorage(key1, key2,..., keyN); 
windowStorageService.sessionStorage.remove(key1, key2,..., keyN); 
windowStorageService['sessionStorage'].remove(key1, key2,..., keyN);
```
#### Removes the key value pair by key in the local storage
```javascript
windowStorageService.removeFromLocalStorage(key); 
windowStorageService.localStorage.remove(key);
windowStorageService['localStorage'].remove(key);
windowStorageService.removeFromLocalStorage(key1, key2,..., keyN); 
windowStorageService.localStorage.remove(key1, key2,..., keyN);
windowStorageService['localStorage'].remove(key1, key2,..., keyN);
```
### Clear/s
#### Clear the default storage in use
```javascript
windowStorageService.clear(); 
```
#### Clear the session storage
```javascript
windowStorageService.clearSessionStorage();   
windowStorageService.sessionStorage.clear(); 
windowStorageService['sessionStorage'].clear();
```
#### Clear the local storage
```javascript
windowStorageService.clearLocalStorage(); 
windowStorageService.localStorage.clear(); 
windowStorageService['sessionStorage'].clear();
```
#### Clear all storages
```javascript
windowStorageService.clearAll(); 
```
### Key/s
#### Gets the keys from the default storage in use
```javascript
windowStorageService.getKeys();
```
#### Gets the keys from the session storage
```javascript
windowStorageService.getKeysFromSessionStorage();
windowStorageService.sessionStorage.getKeys();
windowStorageService['sessionStorage'].getKeys();
```
#### Gets the keys from the local storage
```javascript
windowStorageService.getKeysFromLocalStorage();
windowStorageService.localStorage.getKeys();
windowStorageService['localStorage'].getKeys();
```
### TTL setter/s
`@key*` The key of the key value pair to set the ttl. <br/>
`@ttl` The time to live in milliseconds of the key value pair to set. <br/>
**Required arguments*
#### Set a time to live of a key value pair in the default storage in use
```javascript
windowStorageService.setTTL(key, ttl);
```
#### Set a time to live of a key value pair in the session storage
```javascript
windowStorageService.setTTLToSessionStorage(key, ttl);
windowStorageService.sessionStorage.setTTL(key, ttl);
windowStorageService['sessionStorage'].setTTL(key, ttl);
```
#### Set a time to live of a key value pair in the local storage
```javascript
windowStorageService.setTTLToLocalStorage(key, ttl); 
windowStorageService.localStorage.setTTL(key, ttl);
windowStorageService['sessionStorage'].setTTL(key, ttl);
```
### Default storage type
`@storageType*` The storage type to be set as default. <br/>
#### Sets the default storage type to use from now on
```javascript
windowStorageService.setDefaultStorageType(storageType);   
```
#### Gets the default storage type in use
```javascript
windowStorageService.getDefaultStorageType();   
```
### Prefix
#### Gets the prefix used in the construction of derive key
```javascript
windowStorageService.getPrefix(); 
```
## Table of contents
- [Usage](#Usage)
- [Authors](#Authors)
- [License](#License)
- [Acknowledgments](#Acknowledgments)
## Authors
* **José Rocha** - *Initial work* - [josecmrocha](https://github.com/josecmrocha) <br/>
See also the list of [contributors](https://github.com/josecmrocha/angular-window-storage/contributors) who participated in this project.
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
## Acknowledgments
* [grevory - angular-local-storage](https://github.com/grevory/angular-local-storage)
* [PurpleBooth - A template to make good README.md](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)

# angular-window-storage
Angular module to ease the access of local and session storage

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

#### set
```javascript
windowStorageService.set(key, value) // sets a key value pair to the default storage in use  
// options
windowStorageService.set(key, value, ttl) // ttl - time to live in milliseconds
```
#### setToSessionStorage
```javascript
windowStorageService.setToSessionStorage(key) // sets a key value pair to the session storage 
// options
windowStorageService.setToSessionStorage(key, value, ttl) // ttl - time to live in milliseconds
```
#### sessionStorage.set
```javascript
windowStorageService.sessionStorage.set(key, value) // sets a key value pair to the session storage  
// options
windowStorageService.sessionStorage.set(key, value, ttl) // ttl - time to live in milliseconds
```
#### ['sessionStorage'].set
```javascript
windowStorageService['sessionStorage'].set(key, value) // sets a key value pair to the session storage  
// options
windowStorageService['sessionStorage'].set(key, value, ttl) // ttl - time to live in milliseconds
```
#### setToLocalStorage
```javascript
windowStorageService.setToLocalStorage(key) // sets a key value pair to the local storage 
// options
windowStorageService.setToLocalStorage(key, value, ttl) // ttl - time to live in milliseconds
```
#### localStorage.set
```javascript
windowStorageService.sessionStorage.set(key, value) // sets a key value pair to the local storage  
// options
windowStorageService.sessionStorage.set(key, value, ttl) // ttl - time to live in milliseconds
```
#### ['localStorage'].set
```javascript
windowStorageService['sessionStorage'].set(key, value) // sets a key value pair to the local storage  
// options
windowStorageService['sessionStorage'].set(key, value, ttl) // ttl - time live in milliseconds
```

### Getter/s

#### get
```javascript
windowStorageService.get(key) // gets by key in the default storage in use
```
#### getFromSessionStorage
```javascript
windowStorageService.getFromSessionStorage(key) // gets by key in the session storage  
```
#### sessionStorage.get
```javascript
windowStorageService.sessionStorage.get(key) // gets by key in the session storage  
```
#### ['sessionStorage'].get
```javascript
windowStorageService['sessionStorage'].get(key) // gets by key in the session storage  
```
#### getFromLocalStorage
```javascript
windowStorageService.getFromLocalStorage(key) // gets by key in the local storage  
```
#### localStorage.get
```javascript
windowStorageService.localStorage.get(key) // gets by key in the local storage  
```
#### ['localStorage'].get
```javascript
windowStorageService['localStorage'].get(key) // gets by key in the local storage  
```

### Remove/s

#### remove
```javascript
windowStorageService.remove(key) // removes the key value pair by key in the default storage in use
// options
windowStorageService.remove(key1, key2,..., keyN) // removes by keys in the default storage in use
```
#### removeFromSessionStorage
```javascript
windowStorageService.removeFromSessionStorage(key) // removes the key value pair by key in the session storage  
// options
windowStorageService.removeFromSessionStorage(key1, key2,..., keyN) // removes by args keys in the session storage in use
```
#### sessionStorage.remove
```javascript
windowStorageService.sessionStorage.remove(key) // removes the key value pair by key in the session storage  
// options
windowStorageService.sessionStorage.remove(key1, key2,..., keyN) // removes by args keys in the session storage in use
```
#### ['sessionStorage'].remove
```javascript
windowStorageService['sessionStorage'].remove(key) // removes the key value pair by key in the session storage  
// options
windowStorageService['sessionStorage'].remove(key1, key2,..., keyN) // removes by args keys in the session storage
```
#### removeFromLocalStorage
```javascript
windowStorageService.removeFromLocalStorage(key) // removes the key value pair by key in the local storage  
// options
windowStorageService.removeFromLocalStorage(key1, key2,..., keyN) // removes by args keys in the local storage
```
#### localStorage.remove
```javascript
windowStorageService.localStorage.remove(key) // removes the key value pair by key in the local storage  
// options
windowStorageService.localStorage.remove(key1, key2,..., keyN) // removes by args keys in the local storage
```
#### ['localStorage'].remove
```javascript
windowStorageService['localStorage'].remove(key) // removes the key value pair by key in the local storage  
// options
windowStorageService['localStorage'].remove(key1, key2,..., keyN) // removes by args keys in the local storage
```

### Clear/s
#### clear
```javascript
windowStorageService.clear() // removes all key value pairs in the default storage  
```
#### clearAll
```javascript
windowStorageService.clearAll() // removes all key value pairs in All the storages
```

## Acknowledgments

* [grevory - angular-local-storage](https://github.com/grevory/angular-local-storage)
* [PurpleBooth - A template to make good README.md](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)

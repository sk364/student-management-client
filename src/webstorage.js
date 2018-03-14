var isLocalStorageSupported = localStorageTest();
var WebStorage = {};

WebStorage.setItem = function(key, value) {
  if (typeof key === 'undefined' || typeof value === 'undefined') {
    console.error("Uncaught TypeError: Failed to execute 'setItem' on 'Storage': 2 arguments required");
  } else {
    if (isLocalStorageSupported) {
      return localStorage.setItem(key, value);
    } else {
      // Use Trubil Local Storage
      var webStorage = window.name === "" ? {} : JSON.parse(window.name);
      webStorage[key] = value;
      window.name = JSON.stringify(webStorage);
      return true;
    }
  }  
};

WebStorage.getItem = function(key) {
  if (typeof key === 'undefined') {
    console.error("Uncaught TypeError: Failed to execute 'getItem' on 'Storage': 1 arguments required");
  } else {
    if (isLocalStorageSupported) {
      return localStorage.getItem(key);
    } else {
      var webStorage = window.name === "" ? {} : JSON.parse(window.name);
      return typeof webStorage[key] === "undefined" ? null : webStorage[key];
    }
  }  
};

WebStorage.removeItem = function(key) {
  if (typeof key === 'undefined') {
    console.error("Uncaught TypeError: Failed to execute 'removeItem' on 'Storage': 1 arguments required");
  } else {
    if (isLocalStorageSupported) {
      return localStorage.removeItem(key);
    } else {
      var webStorage = window.name === "" ? {} : JSON.parse(window.name);
      if (webStorage[key]) {
        delete webStorage[key];  
        window.name = JSON.stringify(webStorage);
        return true;
      } else {
        return undefined;
      }
    }
  }  
};

WebStorage.clear = function() {
  if (isLocalStorageSupported) {
    return localStorage.clear();
  } else {
    window.name = "";
  }
};

function localStorageTest() {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch(e) {
    return false;
  }
};

export default WebStorage;
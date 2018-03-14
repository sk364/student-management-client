import Config from 'react-global-configuration';
import WebStorage from './webstorage';

const _jwt = WebStorage.getItem('jwt'),
  requestHeaders = _jwt ? {'Authorization': 'JWT ' + _jwt} : {},
  isUserLoggedIn = WebStorage.getItem('isUserLoggedIn') === 'true',
  isAdmin = WebStorage.getItem('isAdmin') === 'true',
  userId = WebStorage.getItem('userId');

requestHeaders['Content-Type'] = 'application/json';

Config.set({
  server: 'http://localhost:8000',
  isUserLoggedIn: isUserLoggedIn,
  isAdmin: isAdmin,
  userId: userId,
  requestHeaders: requestHeaders
}, {freeze: false});

Config.update = function(key, val) {
  var existingConfig = Config.get();
  existingConfig[key] = val;
  Config.set(existingConfig);
}

Config.updateBatch = function(data) {
  var existingConfig = Config.get();
  for (var key in data) {
    var keyInCamelCase = key.replace(/_([a-z])/g, function(c) { return c[1].toUpperCase(); });
    existingConfig[keyInCamelCase] = typeof data[key] === 'object' ? Object.assign({}, existingConfig[keyInCamelCase], data[key]) : data[key];
  }
  Config.set(existingConfig);
}
import Config from 'react-global-configuration';
import 'whatwg-fetch';

/**
 * @desc Wrapper function over `fetch` API to add common request headers in each request
 * @param `url` URL to fetch
 * @param `method` HTTP request method
 * @param `formData` Form body
 * @return Promise object
 *
 */
export var fetchWithHeaders = (url, method='GET', requestHeaders=null, formData=null, useRequestHeaders=true) => {
  var serverURL = Config.get('server'),
      _requestHeaders = Object.assign({}, Config.get('requestHeaders'), requestHeaders),
      options = { method: method },
      queryParams = '';

  if (useRequestHeaders) {
    options['headers'] = _requestHeaders;
  }

  if (formData) {
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        options['body'] = formData;
    } else {
      for (var key in formData) {
        queryParams += key + '=' + formData[key] + '&';
      }
    }
  }

  if (!url.endsWith('/')) {
    url += '/';
  }

  if (queryParams.length) {
    url += '?' + queryParams;
    if (url.endsWith('&')) {
      url = url.substring(0, url.length - 1);
    }
  }

  return fetch(
    serverURL + url,
    options
  ).then(function(response) {
    return response;
  }).then(function(response) {
    return response.json();
  });
}

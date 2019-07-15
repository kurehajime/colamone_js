/* @license Copyright (c) @kurehajime / source code: https://github.com/kurehajime/colamone_js */
let version = '201907152031';
self.addEventListener('install', function(event) {
  caches.keys().then(function(names) {
    for (let i in names){
      if(names[i]!==version){
        caches.delete(names[i]);
      }
    }
  });
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.indexOf(location.origin) === 0) {
    event.respondWith(caches.match(event.request).then(function(response) {
      if (response !== undefined && !navigator.onLine) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          let responseClone = response.clone();        
          caches.open(version).then(function (cache) {
            if((event.request.url.indexOf('http') === 0)){
              cache.put(event.request, responseClone);
            }
          });
          return response;
        });
      }
    }));
  }
});
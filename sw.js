const CACHE_NAME = 'todo-pwa-v1';

const urlsToCache = [
	'/',
	'/index.html',
	'/styles.css',
	'/script.js',
	'/img/feather-sprite.svg',
	'https://unpkg.com/react@16/umd/react.development.js',
	'https://unpkg.com/react-dom@16/umd/react-dom.development.js',
	'https://unpkg.com/babel-standalone@latest/babel.min.js'
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			// Cache hit - return response
			if (response) {
				return response;
			}
			return fetch(event.request);
		})
	);
});

// deletes old caches
self.addEventListener('activate', function (event) {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

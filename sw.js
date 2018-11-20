importScripts('/lib/idb-keyval-iife.min.js');

const SERVER_URL = 'https://www.jsonstore.io/df5d931f3d12b166bdd9acc7b21c5346be91e20f272bd41857a8b7edb0897e21';
const CACHE_NAME = 'todo-pwa-v2';

const urlsToCache = [
	'/',
	'/styles.css',
	'/script.js',
	'/register-sw.js',
	'/lib/idb-keyval-iife.min.js',
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
			}).catch(console.error)
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			// handle backend requests in network first, cache second order
			if (event.request.url.startsWith(SERVER_URL)) {
				return fetch(event.request).then(function (networkResponse) {
					caches.open(CACHE_NAME).then(function (cache) {
						cache.put(event.request, networkResponse)
					})
					return networkResponse.clone();
				}).catch(function() {
					return response
				})
			}
			if (response) {
				return response;
			}
			return fetch(event.request);
		})
	);
});

// background sync
self.addEventListener('sync', function (event) {
	if (event.tag === 'sync') {
		event.waitUntil(
			idbKeyval.get('todos').then(todos => {
				return idbKeyval.get('login').then(login => {
					return fetch(SERVER_URL + '/todos/' + login, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
						},
						body: JSON.stringify(todos)
					}).then(() => {
						console.log('synced')
					}).catch(console.error)
				})
			})
		)
	}
})

// push notification
self.addEventListener('push', function (e) {
	let body = e.data ? e.data.text() : 'Push message no payload'
	let options = {
		body: body,
		icon: 'favicon.png'
	}
	e.waitUntil(
		self.registration.showNotification('Push Notification', options)
	)
})

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

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');
firebase.initializeApp({
  apiKey: 'AIzaSyAeRLeyg9EN8F7gwycCnzH2mSNb3fdAq74',
  authDomain: 'kudigo-b891c.firebaseapp.com',
  databaseURL: 'https://kudigo-b891c.firebaseio.com',
  projectId: 'kudigo-b891c',
  storageBucket: 'kudigo-b891c.appspot.com',
  messagingSenderId: '129573425499',
  appId: '1:129573425499:web:4585dfa1922a4bb1f80a7e',
  measurementId: 'G-WXX5WW2K5R'
  });

  const messaging = firebase.messaging();

//   navigator.serviceWorker.register('ngsw-worker.js')
// .then((registration) => {
//   messaging.useServiceWorker(registration);


// });

  messaging.setBackgroundMessageHandler(function(payload) {
    self.addEventListener('notificationclick', function(event) {
      event.notification.close();

      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 1000);
      }).then(function() {
        return clients.openWindow(event.data.locator);
      });

      event.waitUntil(promise);
    });
    console.log(payload)

    // here you can override some options describing what's in the message;
    // however, the actual content will come from the Webtask
    const data = JSON.parse(payload.data.notification);
    const notificationTitle = data.title;
    const notificationOptions = {
      icon: '/assets/img/logos/green.png',
      body: data.body,
      vibrate: [200, 100, 200, 100, 200, 100, 200]
    };
    // self.registration.showNotificpation(notificationTitle, notificationOptions);
    return self.clients.claim().then(() => {
      return self.clients.matchAll({type: 'window'}).then(clients => {
        return self.registration.showNotification('Title', {body: 'Body', icon: '/icon.png'});
      })
    })
  });



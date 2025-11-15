import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import './icons';

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/ngsw-worker.js');  
      // console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      error
      // console.error('Service Worker registration failed:', error);
    }
  }
}

registerServiceWorker();

import { Injectable, ErrorHandler } from '@angular/core';
import * as Sentry from '@sentry/browser';
import { environment } from 'src/environments/environment';

Sentry.init({
  dsn: 'https://fcbbbf56894440188913d145162399e9@sentry.io/1477454'
});
@Injectable({
  providedIn: 'root'
})
export class SentryErrorHandlerService  implements ErrorHandler {

  constructor() { }
  handleError(error: any): void {
    if (environment.production === true) {
      Sentry.captureException(error.originalError || error);
    }
    throw error;
  }
}

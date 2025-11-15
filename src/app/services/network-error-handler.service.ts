import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkErrorHandlerService {

  constructor(private router: Router) { }
  /**
   * Handle HttpReseponse errors.
   * @param error HttpErrorResponse
   * @returns JSON data of error with detail key
   */
  handleError(error: HttpErrorResponse) {
    if (error.status === 415) {
      return throwError({ detail: 'An error occurred when processing request.' });
    } else if (error.status === 405) {
      return throwError({ detail: 'An error occurred when processing request.' });
    } else if (error.status === 403) {
      return throwError(error.error);
    } else if (error.status === 404) {
      return throwError(error.error);
    } else if (error.status === 401) {
      const count = localStorage.getItem('logedInCount');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('prefix');
      localStorage.setItem('logedInCount', count);
      window.location.href = '/login';
      return throwError({ detail: 'Your session has expired. Signing Out' });
    } else if (error.status > 415) {
      return throwError(error.error);
    } else if (error.status === 400) {
      return throwError(error.error);
    }
    return throwError(error.error);
    //return throwError({ detail: 'An error occurred when processing request. Please check your internet connection.' });
  }
}

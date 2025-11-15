import { Injectable } from '@angular/core';
import { Observable, timer, of, throwError } from 'rxjs';
import { map, catchError, filter, debounceTime, distinctUntilChanged, switchMap, retryWhen, delayWhen, mergeMap, delay, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ConstantValuesService } from './constant-values.service';
import { NetworkErrorHandlerService } from './network-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  headers;
  headersForFormData;
  headersNoToken;
  options;
  fdkOptions;
  optionsForFormData;
  optionsNoToken;
  freshDeskHeader;
  pagaOptions;
  pagaHeader;
  constructor(private http: HttpClient, private authService: AuthService, private constantValuesService: ConstantValuesService,
    private handleNetworkErrorsService: NetworkErrorHandlerService) {
      this.headers = new HttpHeaders();
      this.headersNoToken = new HttpHeaders();
      this.headersForFormData = new HttpHeaders();
      this.freshDeskHeader = new HttpHeaders();
      this.pagaHeader = new HttpHeaders();
      this.headers = this.headers.set('Authorization', 'Token');
      this.headers = this.headers.set('Content-Type', 'application/json');
      this.headersNoToken = this.headersNoToken.set('Content-Type', 'application/json');
      this.headersForFormData = this.headersForFormData.append('Authorization', 'Token');
      this.freshDeskHeader = this.freshDeskHeader.set('Authorization', 'Basic ' + this.constantValuesService.FDK_API_KEY);
      this.freshDeskHeader = this.freshDeskHeader.set('Content-Type', 'application/json');
      this.pagaHeader = this.pagaHeader.set('Authorization', 'Basic ' + this.constantValuesService.PAGA_API_KEY);
      this.pagaHeader = this.pagaHeader.set('hash', this.constantValuesService.PAGA_HASH_KEY);
      this.pagaHeader = this.pagaHeader.set('Content-Type', 'application/json');
      this.options = { headers: this.headers };
      this.optionsForFormData = { headers: this.headersForFormData };
      this.optionsNoToken = { headers: this.headersNoToken };
      this.fdkOptions = { headers: this.freshDeskHeader };
      this.pagaOptions = { headers: this.pagaHeader };
  }
   /**
   * HTTP POST request to fetch data
   * @param endPoint Endpoint
   * @param jsonResource Request Payload
   */
  getAll<T>(endPoint: string, jsonResource?: any): Observable<T> | Observable<any> {
    return this.http.post<T>(this.constantValuesService.BASE_URL + endPoint, JSON.stringify(jsonResource), this.options)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
   /**
   * HTTP POST request to fetch data
   * @param endPoint Endpoint
   * @param jsonResource Request Payload
   */
  postSearch(endPoint: string, jsonResource?: any): Observable<any> {
    return this.http.post(this.constantValuesService.BASE_URL + endPoint, JSON.stringify(jsonResource), this.options)
      .pipe(
        debounceTime(500),
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
  /**
   * HTTP GET request to fetch data
   * @param endPoint Endpoint
   */
  httpGetAll(endPoint: string): Observable<any> {
    return this.http.get(this.constantValuesService.BASE_URL + endPoint, this.options)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
  /**
   * HTTP GET request to fetch data
   * @param url URL
   */
  httpGetNextPage(url: string): Observable<any> {
    return this.http.get(url, this.options)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
  /**
   * HTTP POST request to fetch data
   * @param url URL
   * @param resource request payload. OPTIONAL
   */
  httpPostNextPage(url: string, resource?: any): Observable<any> {
    return this.http.post(url, JSON.stringify(resource), this.options)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
  /**
   * HTTP POST request to submit data
   * @param endPoint Endpoint
   * @param resource Request Payload
   */
  create(endPoint: string, resource?: any): Observable<any> {
    return this.http.post(this.constantValuesService.BASE_URL + endPoint, JSON.stringify(resource), this.options)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
  /**
   * HTTP POST request to submit data
   * @param endPoint Endpoint
   * @param resource Request Payload
   */
  transactionPolling(endPoint: string, resource?: any): Observable<any> {
    return this.http.post(this.constantValuesService.BASE_URL + endPoint, JSON.stringify(resource), this.options)
      .pipe(
        retryWhen(obs => {
          return obs.pipe(
              mergeMap((response) => {
                console.log('polling', response);
                  if (response.status === 500) {
                      return of(response).pipe(
                          delay(2000),
                          take(9)
                      );
                  }
                  if (response.status === 404) {
                    //do something
                    throw({error: response});
                  }

                  return throwError({detail: 'An error occurred when processing your request'});
              }),
          );
      }),
      catchError(this.handleNetworkErrorsService.handleError),
      );
  }
  /**
   * HTTP POST request to submit data
   * @param endPoint Endpoint
   * @param resource Request Payload
   */
  createNoToken(endPoint: string, resource?: any): Observable<any> {
    return this.http.post(this.constantValuesService.BASE_URL + endPoint, JSON.stringify(resource), this.optionsNoToken)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
   /**
   * HTTP POST request to submit data
   * @param endPoint Endpoint
   * @param resource Request Payload
   */
  resouresCreateNoToken(endPoint: string, resource?: any): Observable<any> {
    return this.http.post(this.constantValuesService.RESOURCES_BASE_URL + endPoint, JSON.stringify(resource), this.optionsNoToken)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
  /**
   * HTTP POST to create record with FormData payload
   * @param endPoint Endpoint
   * @param resource FormData Request Payload
   */
  createForFormData(endPoint: string, resource?: FormData): Observable<any> {
    return this.http.post(this.constantValuesService.BASE_URL + endPoint, resource, this.optionsForFormData)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
  /**
   * HTTP PUT request to update data
   * @param endPoint Endpoint
   * @param resource Request Payload
   */
  update(endPoint: string, resource?: any): Observable<any> {
    return this.http.put(this.constantValuesService.BASE_URL + endPoint, JSON.stringify(resource), this.options)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
  /**
   * HTTP PUT to update data with FormData payload
   * @param endPoint Endpoint
   * @param resource FormData Request Payload
   */
  updateForFormData(endPoint: string, resource?: FormData): Observable<any> {
    return this.http.put(this.constantValuesService.BASE_URL + endPoint, resource, this.optionsForFormData)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }
  /**
   * HTTP DELETE request to delete data
   * @param endPoint Endpoint
   */
  delete(endPoint: string): Observable<any> {
    return this.http.delete(this.constantValuesService.BASE_URL + endPoint, this.options)
      .pipe(
        catchError(this.handleNetworkErrorsService.handleError),
        map((response) => response)
      );
  }


  /**
   * HTTP GET request to fetch data
   * @param endPoint Endpoint
   */
   fdkHttpGet(endPoint: string): Observable<any> {
    return this.http.get(this.constantValuesService.FDK_BASE_URL + endPoint, this.fdkOptions)
      .pipe(
        map((response) => response)
      );
  }
 /**
   * HTTP POST request to submit data
   * @param endPoint Endpoint
   * @param resource Request Payload
   */
  fdkHttpPOS(endPoint: string, resource?: any): Observable<any> {
    return this.http.post(this.constantValuesService.FDK_BASE_URL + endPoint, JSON.stringify(resource), this.fdkOptions)
      .pipe(
        map((response) => response)
      );
  }

  /**
   * HTTP GET request to fetch data
   * @param endPoint Endpoint
   */
   pagaHttpGet(endPoint: string): Observable<any> {
    return this.http.get(this.constantValuesService.PAGA_URL + endPoint, this.pagaOptions)
      .pipe(
        map((response) => response)
      );
  }
 /**
   * HTTP POST request to submit data
   * @param endPoint Endpoint
   * @param resource Request Payload
   */
  pagaHttpPOST(endPoint: string, resource?: any): Observable<any> {
    return this.http.post(this.constantValuesService.PAGA_URL + endPoint, JSON.stringify(resource), this.pagaOptions)
      .pipe(
        map((response) => response)
      );
  }
  /**
   * HTTP PUT request to update data
   * @param endPoint Endpoint
   * @param resource Request Payload
   */
   pagaHttpPUT(endPoint: string, resource?: any): Observable<any> {
    return this.http.put(this.constantValuesService.PAGA_URL + endPoint, JSON.stringify(resource), this.pagaOptions)
      .pipe(
        map((response) => response)
      );
  }

   /**
   * Fetch country names and phone codes locally
   */
  public getIntTelCodes(): Observable<any> {
    return this.http.get('./assets/json/country-codes.json');
  }
  /**
   * Fetch current location info
   */
  public getCurrentLocationInfo(): Observable<any> {
    return this.http.get(this.constantValuesService.GET_CURRENT_LOCATION);
  }

}

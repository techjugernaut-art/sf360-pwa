import { ICallback } from 'src/app/interfaces/callback.interface';
import { Injectable } from '@angular/core';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';
import { Observable } from 'rxjs';
import { RequestMethds } from 'src/app/utils/enums.util';

@Injectable({
  providedIn: 'root'
})
export class SharedDataApiCallsService {
  pageChangedObservable: Observable<any>;
  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }
    /**
   * Get Current Location Info
   * @param callback ICallback function that returns an error or result
   */
  getCurrentLocationInfo(callback: ICallback) {
    this.dataProvider.getCurrentLocationInfo().subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
  /**
  * Upload image
  * @param data file to upload to server
   * @param callback ICallback function that returns an error or result
   */
  uploadImage(data, callback: ICallback) {
    this.dataProvider.createForFormData(this.constantValues.UPLOAD_ALL_IMAGES_ENDPOINT, data).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.detail);
    });
  }
   /**
   * Upload Base64 image and return image_url
   * @param base64ImageData Base64 Image data
   * @param callback ICallback function that returns error or result after processing request
   */
  uploadBase64Image(base64ImageData, callback: ICallback) {
    this.dataProvider.create(this.constantValues.UPLOAD_BASE_64_ENDPOINT, {base64_image_data: base64ImageData})
      .subscribe(result => {
        callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, error.detail);
    });
  }
  /**
   * Get KudiGo Help
   * @param callback ICallback function that returns error or result after processing request
   */
  getKudiGoHelp(callback: ICallback) {
    this.dataProvider.httpGetAll(this.constantValues.KUDIGO_HELP_ENDPOINT)
      .subscribe(result => {
        callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.error(this.constantValues.APP_NAME, error.detail);
    });
  }

   /**
   * Load more data with next page url
   * @param nextPageUrl next page url
   * @param requestMethod request method of type RequestMethds
   * @param requestPayload request payload
   * @param callback ICallback function that returns an error or result
   */
  loadAllDataWithNextURL(nextPageUrl, requestMethod: RequestMethds, requestPayload, callback: ICallback) {
    if (nextPageUrl === null || nextPageUrl === '' || nextPageUrl === undefined) {
      return;
    }
    if (requestMethod === RequestMethds.POST) {
    this.pageChangedObservable = this.dataProvider.httpPostNextPage(nextPageUrl, requestPayload);
    } else if (requestMethod === RequestMethds.GET) {
      this.pageChangedObservable = this.dataProvider.httpGetNextPage(nextPageUrl);
    }
      this.pageChangedObservable.subscribe(result => {
        if (result) {
          callback(null, result);
          if (result.next !== null && result.next !== '' && result.next !== undefined) {
            this.loadAllDataWithNextURL(result.next, requestMethod, requestPayload, callback);
          } else {

          }
        }
      }, error => {
        callback(error, null);
      });
  }
}

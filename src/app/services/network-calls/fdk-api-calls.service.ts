import { Injectable } from '@angular/core';
import { ICallback } from 'src/app/interfaces/callback.interface';
import { ConstantValuesService } from '../constant-values.service';
import { DataProviderService } from '../data-provider.service';
import { NotificationsService } from '../notifications.service';

@Injectable({
  providedIn: 'root'
})
export class FdkApiCallsService {

  constructor(
    private constantValues: ConstantValuesService,
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }


  /**
   * Gets expense categories
   * @param callback ICallback function that returns an error or result
   */
   getCategories(callback: ICallback) {
    this.dataProvider.fdkHttpGet(this.constantValues.FDK_GET_CATEGORIES_ENDPOINT).subscribe(result => {
      callback(null, result);
    }, error => {
      callback(error, null);
      this.notificationService.snackBarMessage(error.error.message);
    });
  }
    /**
 * Get Category folders
 * @param catId Category Id
 * @param filterParams Filter parameters
 * @param callback ICallback function that returns an error or result
 */
     getCategoryFolders(catId, callback: ICallback) {
      this.constantValues.primaryKey = catId;
      this.dataProvider.fdkHttpGet(this.constantValues.FDK_GET_CATEGORIES_FOLDERS_ENDPOINT).subscribe(result => {
        callback(null, result);
      }, error => {
        callback(error, null);
        this.notificationService.snackBarErrorMessage(error.error.message);
      });
    }
    /**
 * Get Folder Arrticle
 * @param folderId Folder Id
 * @param filterParams Filter parameters
 * @param callback ICallback function that returns an error or result
 */
     getFolderArticles(folderId, callback: ICallback) {
      this.constantValues.primaryKey = folderId;
      this.dataProvider.fdkHttpGet(this.constantValues.FDK_GET_FOLDER_ARTICLES_ENDPOINT).subscribe(result => {
        callback(null, result);
      }, error => {
        callback(error, null);
        this.notificationService.snackBarErrorMessage(error.error.message);
      });
    }
    
    /**
 * Get Folder Arrticle
 * @param id Article Id
 * @param filterParams Filter parameters
 * @param callback ICallback function that returns an error or result
 */
  getArticle(id, callback: ICallback) {
      this.dataProvider.fdkHttpGet(this.constantValues.FDK_GET_ARTICLE_ENDPOINT + '/' + id).subscribe(result => {
        callback(null, result);
      }, error => {
        callback(error, null);
        this.notificationService.snackBarErrorMessage(error.error.message);
      });
    }
    
}

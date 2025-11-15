import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class LocalDataProviderService {

  constructor(private dbService: NgxIndexedDBService) {
  }
  /**
   * Store data in current store in indexedDB
   * @param currentStore current store to hold data
   * @param primaryKey Primary Key to serve as the keypath
   * @param data data to store in current store
   */
  createWithKey(currentStore, primaryKey, data) {
    return this.dbService.add(currentStore, data, primaryKey);
  }
  /**
   * Store data in current store in indexedDB
   * @param currentStore current store to hold data
   * @param data data to store in current store
   */
  create(currentStore, data) {
    return this.dbService.add(currentStore, data);
  }
  /**
   * Update data in current store in indexedDB
   * @param currentStore current store to hold data
   * @param id id/keypath to the location of the data stored on the local store
   * @param data data to update in current store
   */
  update(currentStore, id, data) {
    return this.dbService.update(currentStore, data, id);
  }
   /**
   * Update data in current store in indexedDB
   * @param currentStore current store to hold data
   * @param id id/keypath to the location of the data stored on the local store
   * @param data data to update in current store
   */
    updateWithoutKey(currentStore, data) {
      return this.dbService.update(currentStore, data);
    }
  /**
   * Delete data from current store in indexedDB
   * @param currentStore current store holding data
   * @param id id of data to delete
   */
  delete(currentStore, id) {
    return this.dbService.delete(currentStore, id);
  }
    /**
   * Clear data from current store in indexedDB
   * @param currentStore current store holding data
   */
  clear(currentStore) {
    return this.dbService.clear(currentStore);
  }
  /**
   * Get all data from current store in indexedDB
   * @param currentStore current store holding data
   */
  getAll(currentStore) {
    return this.dbService.getAll(currentStore);
  }
  /**
   * Get all data from current store in indexedDB by an id (primary key)
   * @param currentStore current store holding data
   */
  getById(currentStore, id) {
    return this.dbService.getByID(currentStore, id);
  }
  /**
   * Get data buy a key
   * @param currentStore current store name
   * @param key key name
   * @param value key value
   */
  getByKeyAndValue(currentStore, key, value) {
    return this.dbService.getByIndex(currentStore, key, value);
  }
}

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { DataProviderService } from '../../../services/data-provider.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {
  @Input() pageSize = 10;
  previousTotalPage = 0;
  @Input() prevPage = '';
  @Input() nextPage = '';
  @Input() totalPage = 0;
  pageIndex = 0;
  @Input() requestMethod = 'POST';
  @Input() requestPayload = {};
  @Input() dataSet = [];
  @Output() pageChanged = new EventEmitter();
  @Input() isProcessing = false;
  isProcessingMoreData = false;
  @Output() isProcessingChange = new EventEmitter();
  pageChangedObservable: Observable<any>;
  requestUrl: string;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  constructor(
    private dataProvider: DataProviderService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
  }
  ngOnDestroy() {
    // this.pageChangedObservable.subscribe().unsubscribe();
  }
/**
  *Navigate to next or previous page
  *@param e event data
   */
  changePage(e) {
    this.pageIndexCalculation(e);
    this.isProcessingMoreData = true;
    if (this.requestMethod === 'POST') {
    this.pageChangedObservable = this.dataProvider.httpPostNextPage(this.requestUrl, this.requestPayload);
    } else if (this.requestMethod === 'GET') {
      this.pageChangedObservable = this.dataProvider.httpGetNextPage(this.requestUrl);
    }
      this.pageChangedObservable.subscribe(result => {
        this.isProcessingMoreData = false;
        if (result) {
          this.prevPage = result.previous;
          this.nextPage = result.next;
          this.totalPage = result.count;
          this.dataSet = result.results;
          this.pageChanged.emit(result);
        }
      }, error => {
        this.isProcessingMoreData = false;
        this.notificationService.snackBarErrorMessage(error.detail);
      });
  }
  /**
   * Page Index Calculation
   * @param e change page event
   */
  pageIndexCalculation(e) {
    if (e.pageIndex > this.pageIndex) {
      if (this.nextPage !== null && this.nextPage !== '' && this.nextPage !== undefined) {
        this.requestUrl = this.nextPage;
        this.pageIndex = e.pageIndex;
      } else { return; }
    } else {
      if (this.prevPage !== null && this.prevPage !== '' && this.prevPage !== undefined) {
        this.requestUrl = this.prevPage;
        this.pageIndex = e.pageIndex;
      } else { return; }
    }
  }
}

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
}

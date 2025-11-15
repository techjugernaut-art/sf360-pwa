import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITableHeaderActions } from '../../../interfaces/table-header-actions.interace';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { datePickerLocales, datePickerRanges } from 'src/app/utils/const-values.utils';

@Component({
  selector: 'app-table-header-actions',
  templateUrl: './table-header-actions.component.html',
  styleUrls: ['./table-header-actions.component.scss']
})
export class TableHeaderActionsComponent implements OnInit {
  @Input() tableHeaderOptions: ITableHeaderActions;
  searchFormControl = new FormControl;
  @Output() searchTextChanged = new EventEmitter();
  @Output() selectedDateChanged = new EventEmitter();
  @Input() selectedDate = {start_date: moment(), end_date: moment()};
  locale = datePickerLocales;
  ranges: any = datePickerRanges;
  constructor() { }

  ngOnInit() {
    this.searchFormControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTextChanged.emit(searchTerm);
    });
  }

  /**
   * Update shared data with selected date range when changed
   * @param dateRangeSelected date range selected
   */
  dateChanged(dateRangeSelected) {
    this.selectedDate = dateRangeSelected;
    this.selectedDateChanged.emit(dateRangeSelected);
  }
}

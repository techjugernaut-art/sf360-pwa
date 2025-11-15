import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-record',
  templateUrl: './empty-record.component.html',
  styleUrls: ['./empty-record.component.scss']
})
export class EmptyRecordComponent implements OnInit {
@Input() icon = 'assets/img/icons/empty-box.svg';
@Input() text = 'Not enough data';
  constructor() { }

  ngOnInit() {
  }

}

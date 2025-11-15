import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html'
})
export class DashboardOverviewComponent implements OnInit {
  isProcessing: boolean;


  title = 'Orders';
  type = 'PieChart';
  data = [
    ['Pending', 10],
    ['Cancelled', 30],
    ['Returned', 35],
    ['Delivered', 24]
  ];
  columnNames = ['Browser', 'Percentage'];
  options = {
    pieHole: 0.4,
  };
  width = 450;
  height = 355;

  constructor() {
  }

  ngOnInit() {
  }

}

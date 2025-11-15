import { ApexAxisChartSeries, ApexTitleSubtitle, ApexDataLabels, ApexFill, ApexMarkers, ApexYAxis, ApexXAxis, ApexTooltip, ApexStroke, ChartComponent } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: any; //ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  grid: any; //ApexGrid;
  colors: any;
  toolbar: any;
};

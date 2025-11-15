import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { colors } from '../utils/colors';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor() { }
/**
 * Render doughnut graph for the KPIs
 * @param elementId Element Id
 * @param title Title of chart
 * @param labels Graph labels
 * @param dataPoints Graph dataPoint
 */
renderDoughnutGraph(myPieChart: Chart, elementId, title, labels, dataPoints) {
  if (myPieChart) { myPieChart.destroy(); }
  const ctrl = document.getElementById(elementId);
  myPieChart = new Chart(ctrl, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          data: dataPoints,
          fill: true,
          label: title,
          backgroundColor: colors
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true
      },
      cutoutPercentage: 50
    }
  });
  myPieChart.chart.update();
}
/**
* Render Multiliine graph for the KPIs
* @param labels Graph labels
* @param dataSet Graph dataSet
*/
renderMultilineGraph(multilineChart: Chart, elementId, labels, dataSet) {
  if (multilineChart) { multilineChart.destroy(); }
  const ctrl = document.getElementById(elementId);
  multilineChart = new Chart(ctrl, {
    type: 'line',
    data: {
      labels: labels,
      datasets: dataSet
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true
      },
      cutoutPercentage: 50
    }
  });
  multilineChart.chart.update();
}
}

export const scalesCallback = {
  yAxes: [{
      ticks: {
          callback: function(value, index, values) {
              return (value as number).toLocaleString();
          }
      }
  }]
};

export const toolTipCallback = {
  label: function(tooltipItem, data) {
      let label = data.datasets[tooltipItem.datasetIndex].label || '';

      if (label) {
          label += ': ';
      }
      label += (tooltipItem.yLabel as number).toLocaleString();
      return label;
  }
};

export const doughnutGraphTooltipCallback = {
  label: function(tooltipItem, data) {
      let label = data.labels[tooltipItem.index] || '';
      if (label) {
          label += ': ';
      }
      label += (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] as number).toLocaleString();
      return label;
  }
};

export const horizontalToolTipCallback = {
  label: function(tooltipItem, data) {
    let label = data.datasets[tooltipItem.datasetIndex].label || '';

      if (label) {
          label += ': ';
      }
      label += (tooltipItem.xLabel as number).toLocaleString();
      return label;
  }
};

import moment from "moment";

export const commonChartOptions = {
  chart: {
    zoom: {
      enabled: false
    }
  },
  xaxis: {
    categories: [],
    type: "datetime",
    title: {
      text: "Date / time (UTC)"
    },
    labels: {
      formatter: function(val) {
        return moment.unix(val).format("MM/DD/YYYY HH:mm");
      }
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    title: {
      text: "Total bonded (DOT)"
    },
    labels: {
      formatter: function(val) {
        return val;
      }
    }
  }
};

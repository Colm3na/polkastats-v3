const yaxis = {
  show: true,
  showAlways: true,
  showForNullSeries: true,
  seriesName: undefined,
  opposite: false,
  reversed: false,
  logarithmic: false,
  forceNiceScale: false,
  floating: false,
  decimalsInFloat: undefined,
  labels: {
    show: true,
    align: "right",
    minWidth: 0,
    maxWidth: 160,
    height: 600,
    style: {
      colors: [],
      fontSize: "12px",
      fontFamily: "Roboto, sans-serif",
      fontWeight: 400,
      cssClass: "apexcharts-yaxis-label"
    },
    offsetX: 0,
    offsetY: 0,
    rotate: 0,
    formatter: undefined
  },
  axisBorder: {
    show: true,
    color: "#78909C",
    offsetX: 0,
    offsetY: 0
  },
  axisTicks: {
    show: true,
    borderType: "solid",
    color: "#78909C",
    width: 6,
    offsetX: 0,
    offsetY: 0
  },
  title: {
    text: undefined,
    rotate: 90,
    offsetX: 0,
    offsetY: 0,
    style: {
      color: "#000",
      fontSize: "12px",
      fontFamily: "Roboto, sans-serif",
      fontWeight: 600,
      cssClass: "apexcharts-yaxis-title"
    }
  },
  crosshairs: {
    show: true,
    position: "back",
    stroke: {
      color: "#b6b6b6",
      width: 1,
      dashArray: 0
    }
  },
  tooltip: {
    enabled: true,
    offsetX: 0
  }
};

export default yaxis;

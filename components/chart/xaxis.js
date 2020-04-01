const xaxis = {
  type: "category",
  categories: [],
  labels: {
    show: true,
    rotate: -60,
    rotateAlways: false,
    hideOverlappingLabels: true,
    showDuplicates: false,
    trim: false,
    minHeight: undefined,
    maxHeight: 120,
    style: {
      colors: [],
      fontSize: "12px",
      fontFamily: "Roboto, sans-serif",
      fontWeight: 400,
      cssClass: "apexcharts-xaxis-label"
    },
    offsetX: 0,
    offsetY: 0,
    format: undefined,
    formatter: undefined,
    datetimeUTC: true,
    datetimeFormatter: {
      year: "yyyy",
      month: "MMM 'yy",
      day: "dd MMM",
      hour: "HH:mm"
    }
  },
  axisBorder: {
    show: true,
    color: "#78909C",
    height: 1,
    width: "100%",
    offsetX: 0,
    offsetY: 0
  },
  axisTicks: {
    show: true,
    borderType: "solid",
    color: "#78909C",
    height: 6,
    offsetX: 0,
    offsetY: 0
  },
  tickAmount: undefined,
  tickPlacement: "between",
  min: undefined,
  max: undefined,
  range: undefined,
  floating: false,
  position: "bottom",
  title: {
    text: undefined,
    offsetX: 0,
    offsetY: 0,
    style: {
      color: undefined,
      fontSize: "12px",
      fontFamily: "Roboto, sans-serif",
      fontWeight: 600,
      cssClass: "apexcharts-xaxis-title"
    }
  },
  crosshairs: {
    show: true,
    width: 1,
    position: "back",
    opacity: 0.9,
    stroke: {
      color: "#b6b6b6",
      width: 0,
      dashArray: 0
    },
    fill: {
      type: "solid",
      color: "#B1B9C4",
      gradient: {
        colorFrom: "#D8E3F0",
        colorTo: "#BED1E6",
        stops: [0, 100],
        opacityFrom: 0.4,
        opacityTo: 0.5
      }
    },
    dropShadow: {
      enabled: false,
      top: 0,
      left: 0,
      blur: 1,
      opacity: 0.4
    }
  },
  tooltip: {
    enabled: true,
    formatter: undefined,
    offsetY: 0,
    style: {
      fontSize: 0,
      fontFamily: 0
    }
  }
};

export default xaxis;

import animations from "./animations";
import chart from "./chart";
import xaxis from "./xaxis";
import yaxis from "./yaxis";
import mergeDeepRight from "ramda/src/mergeDeepRight";

const mobile = {
  labels: {
    maxWidth: 90,
    style: {
      fontSize: "8px"
    }
  }
};

const customizations = {
  title: {
    align: "center",
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      fontFamily: "Roboto, sans-serif",
      color: "#d75ea1"
    }
  },
  colors: ["#d75ea1"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "straight"
  },
  grid: {
    colors: ["#f3f3f3", "transparent"],
    opacity: 0.5
  },
  markers: {
    size: 6
  }
};

const options = {
  ...customizations,
  chart: chart,
  xaxis,
  yaxis,
  responsive: [
    {
      breakpoint: 415,
      options: {
        ...customizations,
        animations: animations,
        chart: chart,
        xaxis: mergeDeepRight(xaxis, mobile),
        yaxis: mergeDeepRight(yaxis, mobile)
      }
    }
  ]
};

export default options;

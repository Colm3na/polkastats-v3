import xaxis from "./xaxis";
import yaxis from "./yaxis";

const options = {
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
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.5
    }
  },
  animations: {
    enabled: true,
    easing: "easeinout",
    speed: 800,
    animateGradually: {
      enabled: true,
      delay: 150
    },
    dynamicAnimation: {
      enabled: true,
      speed: 350
    }
  },
  chart: {
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
        customIcons: []
      },
      autoSelected: "zoom"
    }
  },
  xaxis,
  yaxis
};

export default options;

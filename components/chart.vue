<template>
  <div class="w-100 chart">
    <div v-if="!loading">
      <apexchart
        :options="customOptions"
        :series="series"
        :title="title"
        :type="selected"
      />
      <b-container>
        <div v-if="custom" class="options_container chart_types">
          <b-form-group>
            <b-form-radio-group
              :id="id"
              v-model="selected"
              :name="id"
              :options="chartTypes"
            />
          </b-form-group>
        </div>
      </b-container>
    </div>
    <b-container v-else class="w-75 loader_container" align-v="center">
      <b-spinner type="grow" class="loader" align-v="center" />
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import VueApexCharts from "vue-apexcharts";
import moment from "moment";
import mergeDeepRight from "ramda/src/mergeDeepRight";
import defaultOptions from "./chart/options";

Vue.component("apexchart", VueApexCharts);

export default {
  props: {
    categories: {
      type: Array,
      default() {
        return [];
      },
      required: true
    },
    custom: {
      type: Boolean,
      default: false,
      required: false
    },
    id: {
      type: String,
      default() {
        return `chartId-${Math.floor(Math.random() * 10000).toString()}`;
      },
      required: false
    },
    labelx: {
      type: String,
      default: "Era",
      required: false
    },
    labely: {
      type: String,
      default: "",
      required: false
    },
    loading: {
      type: Boolean,
      default: false,
      required: false
    },
    options: {
      type: Object,
      default() {
        return {};
      },
      required: false
    },
    series: {
      type: Array,
      default() {
        return [];
      },
      required: true
    },
    title: {
      type: String,
      default: "",
      required: false
    },
    type: {
      type: String,
      default: "line",
      required: false
    }
  },
  data: function() {
    return {
      selected: this.type,
      chartTypes: ["area", "bar", "heatmap", "line", "histogram", "scatter"]
    };
  },
  computed: {
    customOptions: function() {
      const propsOptions = {
        title: {
          text: this.title
        },
        xaxis: {
          categories: this.categories,
          title: {
            text: this.labelx,
            formatter: function(val) {
              return moment.unix(val / 1000).format("MM/DD/YYYY HH:mm");
            }
          }
        },
        yaxis: {
          title: {
            text: this.labely
          }
        }
      };
      const options = this.options;
      const opt = mergeDeepRight(
        defaultOptions,
        mergeDeepRight(propsOptions, this.options)
      );
      return opt;
    }
  }
};
</script>

<style>
.chart {
  background-color: rgba(185, 202, 201, 0.226);
  border-radius: 1rem;
  padding: 1rem 1rem 0 0;
}
.chart_types {
  text-align: center;
  padding-bottom: 0.5rem;
}
.loader_container {
  display: flex;
  flex: 1;
  width: 100%;
  text-align: center;
  padding: 0 0 1rem 1rem;
  height: 200px;
}
.loader {
  color: #d75ea1;
  margin: auto;
}
</style>

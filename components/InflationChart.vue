<template>
  <chart :options="InflationChartOptions" :series="InflationChartSeries" />
</template>

<script>
import moment from "moment";
import chart from "./chart";
import gql from "graphql-tag";

export default {
  components: {
    chart
  },
  data: function() {
    return {
      loading: true,
      totalIssuance: [],
      InflationChartOptions: {
        chart: {
          zoom: {
            enabled: false
          }
        },
        markers: {
          size: 0
        },
        xaxis: {
          categories: [],
          type: "number",
          title: {
            text: "Block"
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          title: {
            text: `Total Issuance`
          },
          tooltip: {
            enabled: false
          }
        }
      },
      InflationChartSeries: [
        {
          name: `Total Issuance`,
          data: []
        }
      ]
    };
  },
  apollo: {
    block: {
      query: gql`
        query block {
          block(distinct_on: total_issuance) {
            block_number
            total_issuance
          }
        }
      `,
      result({ data }) {
        this.InflationChartOptions = {
          ...{
            xaxis: {
              categories: data.block.map(({ block_number }) => block_number),
              type: "number",
              title: {
                text: "Block height"
              }
            },
            yaxis: {
              title: {
                text: `Total issuance`
              },
              labels: {
                formatter: function(val) {
                  return (val / 1000000000000).toFixed(3);
                }
              }
            }
          }
        };
        this.InflationChartSeries = [
          {
            data: data.block.map(({ total_issuance }) => total_issuance)
          }
        ];
      }
    }
  }
};
</script>

<style>
.sent-transfers {
  background-color: white;
}
.spinner {
  color: #d3d2d2;
}
</style>

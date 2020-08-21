<template>
  <highcharts :options="InflationChartOptions"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";
import gql from "graphql-tag";
import { network } from "../../polkastats.config.js";

export default {
  components: {
    highcharts: Chart
  },
  data: function() {
    return {
      loading: true,
      last24hInflation: 0,
      last24hInflationPercentage: 0,
      initialTotalIssuance: 0,
      totalIssuance: [],
      InflationChartOptions: {
        title: {
          text: "Total issuance over last 24h"
        },
        yAxis: {
          title: {
            text: "Total issuance"
          }
        },
        series: [
          {
            name: "Total issuance",
            data: []
          }
        ]
      },
      network
    };
  },
  apollo: {
    block: {
      query: gql`
        query block {
          block(limit: 14400, order_by: { block_number: desc }) {
            block_number
            total_issuance
          }
        }
      `,
      skip() {
        return !this.initialTotalIssuance;
      },
      result({ data }) {
        this.InflationChartOptions.series[0].data = data.block.map(
          ({ total_issuance, block_number }) => [
            block_number,
            total_issuance / Math.pow(10, this.network.decimalPlacess)
          ]
        );

        const lastTotalIssuance = data.block[0].total_issuance;
        const firstTotalIssuance =
          data.block[data.block.length - 1].total_issuance;
        this.last24hInflation = lastTotalIssuance - firstTotalIssuance;

        this.last24hInflationPercentage =
          (this.last24hInflation * 100) / lastTotalIssuance;

        console.log(`Last issuance:`, lastTotalIssuance);
        console.log(
          `Last 24h inflation:`,
          this.last24hInflation / Math.pow(10, this.network.decimalPlaces)
        );
        console.log(
          `Last 24h percentage:`,
          this.last24hInflationPercentage.toFixed(6)
        );
        console.log(
          `Annualized inflation percentage (based on last 24h):`,
          this.last24hInflationPercentage * 365
        );
        console.log(
          `Acumulated inflation:`,
          (lastTotalIssuance - this.initialTotalIssuance) /
            Math.pow(10, this.network.decimalPlaces)
        );
        console.log(
          `Acumulated inflation percentage:`,
          ((lastTotalIssuance - this.initialTotalIssuance) * 100) /
            lastTotalIssuance
        );
      }
    },
    totalIssuance: {
      query: gql`
        query totalIssuance {
          totalIssuance: block(
            limit: 1
            where: { total_issuance: { _neq: "0" } }
            order_by: { total_issuance: asc }
          ) {
            total_issuance
          }
        }
      `,
      result({ data }) {
        console.log(data);
        this.initialTotalIssuance = data.totalIssuance[0].total_issuance;
        console.log(`Initial issuance:`, this.initialTotalIssuance);
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

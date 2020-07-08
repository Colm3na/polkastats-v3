<template>
  <chart :options="chartOptions" :series="chartSeries" />
</template>
<script>
import chart from "../../components/chart";
import gql from "graphql-tag";

export default {
  components: {
    chart
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["accountId"],
  data: function() {
    return {
      chartSeries: [
        {
          name: "Era slashes (DOT)",
          data: []
        }
      ],
      chartOptions: {}
    };
  },
  apollo: {
    $subscribe: {
      validator_era_slash: {
        query: gql`
          query validator_era_slash($account_id: String!) {
            validator_era_slash(
              where: { stash_id: { _eq: $account_id } }
              order_by: { era_index: asc }
            ) {
              era_index
              amount
            }
          }
        `,
        variables() {
          return {
            account_id: this.accountId
          };
        },
        skip() {
          return !this.accountId;
        },
        result({ data }) {
          var newCategories = [];
          var newData = [];
          const { validator_era_slash } = data;
          for (var i = 0; i < validator_era_slash.length; i++) {
            newCategories.push(validator_era_slash[i].era_index);
            newData.push(validator_era_slash[i].era_rewards * 1e-12 || 0);
          }

          this.chartOptions = {
            series: [
              {
                name: "Era slashes (DOT)",
                data: newData
              }
            ],
            chart: {
              height: 350,
              type: "line",
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight"
            },
            title: {
              text: "Era slashes",
              align: "left"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5
              }
            },
            xaxis: {
              categories: newCategories,
              tooltip: {
                enabled: false
              }
            }
          };
        }
      }
    }
  }
};
</script>

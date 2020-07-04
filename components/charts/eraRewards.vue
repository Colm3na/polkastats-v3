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
          name: "Era rewards (DOT)",
          data: []
        }
      ],
      chartOptions: {}
    };
  },
  apollo: {
    $subscribe: {
      validator_era_staking: {
        query: gql`
          query validator_era_staking($account_id: String!) {
            validator_era_staking(
              where: { stash_id: { _eq: $account_id } }
              order_by: { era_index: asc }
            ) {
              era_index
              era_rewards
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
          const { validator_era_staking } = data;
          for (var i = 0; i < validator_era_staking.length; i++) {
            newCategories.push(validator_era_staking[i].era_index);
            newData.push(
              (validator_era_staking[i].era_rewards * 1e-12).toFixed(3)
            );
          }

          this.chartOptions = {
            series: [
              {
                name: "Era rewards (DOT)",
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
              text: "Era rewards",
              align: "left"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5
              }
            },
            xaxis: {
              categories: newCategories
            }
          };
        }
      }
    }
  }
};
</script>

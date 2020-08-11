<template>
  <b-container class="py-5">
    <h1 class="mb-4">
      {{
        $t("pages.economics.title", {
          networkName:
            network.name.charAt(0).toUpperCase() + network.name.slice(1)
        })
      }}
    </h1>
    <div v-if="lastBlock && validators.length > 0" class="row">
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">{{ $t("pages.economics.total_issuance") }}</h4>
            <h5 class="d-inline-block">
              {{ formatAmount(lastBlock.total_issuance) }}
            </h5>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">
              {{ $t("pages.economics.fiat", { networkDenom: network.denom }) }}
            </h4>
            <h5 class="d-inline-block">
              <span
                v-if="network.coinGeckoDenom"
                class="fiat ml-2"
                data-testid="fiat"
              >
                ${{ USDConversion }} ({{ USD24hChange }}%)
              </span>
            </h5>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">
              {{ $t("components.chain.staked") }}
            </h4>
            <h5 class="d-inline-block">
              {{ formatAmount(totalStakeBonded) }} ({{
                bondedStakePercentage
              }}%)
            </h5>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">
              {{ $t("pages.economics.lowest_validator_stake") }}
            </h4>
            <h5 class="d-inline-block">
              {{ formatAmount(lowestValidatorStake) }}
            </h5>
          </div>
        </div>
      </div>
    </div>
    <InflationChartHC />
  </b-container>
</template>

<script>
import { mapMutations } from "vuex";
import { network } from "../polkastats.config.js";
import InflationChartHC from "../components/charts/InflationChartHC.vue";
import commonMixin from "../mixins/commonMixin.js";
import gql from "graphql-tag";
import BN from "bn.js";
import { isHex } from "@polkadot/util";

export default {
  components: {
    InflationChartHC
  },
  mixins: [commonMixin],
  data() {
    return {
      network,
      lastBlock: undefined,
      validators: [],
      intentions: [],
      currentSessionIndex: 0,
      validatorCount: 0,
      waitingCount: 0,
      nominatorCount: 0,
      inElection: false
    };
  },
  computed: {
    USDConversion: function() {
      return this.$store.state.fiat.usd;
    },
    USD24hChange: function() {
      return this.$store.state.fiat.usd_24h_change
        ? parseFloat(this.$store.state.fiat.usd_24h_change).toFixed(2)
        : 0;
    },
    totalStakeBonded() {
      let totalStakeBonded = new BN(0);
      this.validators.forEach(validator => {
        let totalExposure;
        if (isHex(validator.exposure_total)) {
          totalExposure = new BN(validator.exposure_total.toString(), 16);
        } else {
          totalExposure = new BN(validator.exposure_total.toString(), 10);
        }
        totalStakeBonded = totalStakeBonded.add(totalExposure);
      });
      return totalStakeBonded.toString(10);
    },
    bondedStakePercentage() {
      if (this.totalStakeBonded !== 0 && this.lastBlock.total_issuance !== 0) {
        const totalIssuance = new BN(
          this.lastBlock.total_issuance.toString(),
          10
        );
        const totalStakeBonded = new BN(this.totalStakeBonded, 10).mul(
          new BN("100", 10)
        );
        return totalStakeBonded.div(totalIssuance).toString(10);
      }
      return 0;
    },
    lowestValidatorStake() {
      console.log(this.validators);
      return this.validators[this.validators.length - 1].exposure_total;
    }
  },
  created: async function() {
    this.$store.dispatch("system/update");
    // Refresh fiat conversion values every minute
    if (this.network.coinGeckoDenom) {
      this.$store.dispatch("fiat/update");
      setInterval(() => {
        this.$store.dispatch("fiat/update");
      }, 60000);
    }
  },
  apollo: {
    $subscribe: {
      block: {
        query: gql`
          subscription blocks {
            block(order_by: { block_number: desc }, where: {}, limit: 1) {
              block_number
              block_number_finalized
              block_author
              current_era
              current_index
              era_length
              era_progress
              is_election
              session_length
              session_per_era
              session_progress
              validator_count
              total_issuance
            }
          }
        `,
        result({ data }) {
          this.lastBlock = data.block[0];
          if (data.block[0].current_index > this.currentSessionIndex) {
            this.currentSessionIndex = data.block[0].current_index;
          }
          if (this.lastBlock.is_election) {
            this.inElection = true;
          } else {
            this.inElection = false;
          }
        }
      },
      validators: {
        query: gql`
          subscription validator($session_index: Int!) {
            validator(
              order_by: { rank: asc }
              where: { session_index: { _eq: $session_index } }
            ) {
              account_id
              exposure_total
            }
          }
        `,
        variables() {
          return {
            session_index: this.currentSessionIndex
          };
        },
        skip() {
          return !this.currentSessionIndex;
        },
        result({ data }) {
          console.log(data);
          this.validators = data.validator;
          this.validatorCount = data.validator.length;
        }
      },
      intentions: {
        query: gql`
          subscription intention($session_index: Int!) {
            intention(
              order_by: { rank: asc }
              where: { session_index: { _eq: $session_index } }
            ) {
              account_id
            }
          }
        `,
        variables() {
          return {
            session_index: this.currentSessionIndex
          };
        },
        skip() {
          return !this.currentSessionIndex;
        },
        result({ data }) {
          this.waitingCount = data.intention.length;
        }
      },
      nominators: {
        query: gql`
          subscription nominator($session_index: Int!) {
            nominator(where: { session_index: { _eq: $session_index } }) {
              account_id
            }
          }
        `,
        variables() {
          return {
            session_index: this.currentSessionIndex
          };
        },
        skip() {
          return !this.currentSessionIndex;
        },
        result({ data }) {
          this.nominators = data.nominator;
          this.nominatorCount = data.nominator.length;
        }
      }
    }
  },
  head() {
    return {
      title: this.$t("pages.economics.head_title", {
        networkName:
          network.name.charAt(0).toUpperCase() + network.name.slice(1)
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.economics.head_content", {
            networkName:
              network.name.charAt(0).toUpperCase() + network.name.slice(1)
          })
        }
      ]
    };
  }
};
</script>

<style scoped></style>

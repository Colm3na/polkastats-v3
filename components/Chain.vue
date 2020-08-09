<template>
  <div v-if="lastBlock">
    <div class="row">
      <div v-if="inElection" class="col-12">
        <b-alert show dismissible variant="warning" class="text-center">
          <div>
            <h3>
              {{ $t("pages.dashboard.ongoing_election_title") }}
              {{
                (
                  100 -
                  (100 *
                    (lastBlock.session_length - lastBlock.session_progress)) /
                    150
                ).toFixed(0)
              }}%
            </h3>
          </div>
          <p>
            {{
              $t("pages.dashboard.ongoing_election_1", {
                numBlocks:
                  lastBlock.session_length - lastBlock.session_progress,
                minutes: (
                  (lastBlock.session_length - lastBlock.session_progress) /
                  10
                ).toFixed(0)
              })
            }}
          </p>
          <p>
            <strong>{{ $t("pages.dashboard.ongoing_election_2") }}</strong>
          </p>
        </b-alert>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">{{ $t("components.network.last_block") }}</h4>
            <Identicon
              :key="lastBlock.block_author"
              :value="lastBlock.block_author"
              :size="25"
              :theme="'polkadot'"
              class="d-inline-block"
            />
            <nuxt-link
              v-b-tooltip.hover
              :to="`/block?blockNumber=${lastBlock.block_number}`"
              title="Click to see block info!"
            >
              <h5 class="d-inline-block">
                #{{ formatNumber(lastBlock.block_number) }}
              </h5>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">
              {{ $t("components.network.last_block_finalized") }}
            </h4>
            <nuxt-link
              v-b-tooltip.hover
              :to="`/block?blockNumber=${lastBlock.block_number_finalized}`"
              title="Click to see block info!"
            >
              <h5 class="d-inline-block">
                #{{ formatNumber(lastBlock.block_number_finalized) }}
              </h5>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4
              v-b-tooltip.hover
              :title="
                `${$t('components.chain.progress')} ${formatNumber(
                  lastBlock.session_progress
                )} / ${formatNumber(lastBlock.session_length)}`
              "
              class="mb-3"
            >
              {{ $t("components.chain.current_session") }} #{{
                formatNumber(lastBlock.current_index)
              }}
            </h4>
            <b-progress
              :max="lastBlock.session_length"
              height="1.4rem"
              class="mb-2"
            >
              <b-progress-bar :value="lastBlock.session_progress" animated>
                <strong
                  >{{ lastBlock.session_progress }} /
                  {{ lastBlock.session_length }}</strong
                >
              </b-progress-bar>
            </b-progress>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4
              v-b-tooltip.hover
              :title="
                `${$t('components.chain.progress')} ${formatNumber(
                  lastBlock.era_progress
                )} / ${formatNumber(lastBlock.era_length)}`
              "
              class="mb-3"
            >
              {{ $t("components.chain.current_era") }} #{{
                formatNumber(lastBlock.current_era)
              }}
            </h4>
            <b-progress
              :max="lastBlock.era_length"
              height="1.4rem"
              class="mb-2"
            >
              <b-progress-bar :value="lastBlock.era_progress" animated>
                <strong
                  >{{ lastBlock.era_progress }} /
                  {{ lastBlock.era_length }}</strong
                >
              </b-progress-bar>
            </b-progress>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">{{ $t("components.chain.validators") }}</h4>
            <h5 class="d-inline-block">
              <span
                v-b-tooltip.hover
                :title="$t('components.chain.validator_count')"
              >
                {{ formatNumber(validatorCount) }}
              </span>
              /
              <span
                v-b-tooltip.hover
                :title="$t('components.chain.validator_ideal_number')"
              >
                {{ formatNumber(lastBlock.validator_count) }}
              </span>
              /
              <span
                v-b-tooltip.hover
                :title="$t('components.chain.waiting_validators')"
              >
                <small>
                  {{ formatNumber(waitingCount) }}
                </small>
              </span>
            </h5>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">
              {{ $t("components.chain.nominators") }}
            </h4>
            <h5 class="d-inline-block">
              {{ formatNumber(nominatorCount) }}
            </h5>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">
              {{ $t("components.chain.total_issuance") }}
            </h4>
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
    </div>
  </div>
</template>

<script>
import commonMixin from "../mixins/commonMixin.js";
import Identicon from "../components/identicon.vue";
import gql from "graphql-tag";
import BN from "bn.js";
import { isHex } from "@polkadot/util";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
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
          if (data.block[0].current_index > this.currentSessionIndex) {
            this.currentSessionIndex = data.block[0].current_index;
          }
          this.lastBlock = data.block[0];
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
  }
};
</script>

<style scoped>
.network .card h5 {
  color: #670d35;
}
.network .card .card-body {
  padding: 1rem 0.5rem;
}
.network .identicon {
  display: inline-block;
  margin: 0 0.2rem 0 0;
  cursor: copy;
  height: 25px;
}
</style>

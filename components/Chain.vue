<template>
  <div v-if="lastBlock">
    <div class="row">
      <div class="col-md-3 mb-4">
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
      <div class="col-md-3 mb-4">
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
      <div class="col-md-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">
              {{ $t("components.chain.current_session") }} #{{
                formatNumber(lastBlock.current_index)
              }}
            </h4>
            <h5>
              {{ formatNumber(lastBlock.session_progress) }}/{{
                formatNumber(lastBlock.session_length)
              }}
            </h5>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-4">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">
              {{ $t("components.chain.current_era") }} #{{
                formatNumber(lastBlock.current_era)
              }}
            </h4>
            <h5>
              {{ formatNumber(lastBlock.era_progress) }}/{{
                formatNumber(lastBlock.era_length)
              }}
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

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      lastBlock: undefined
    };
  },
  apollo: {
    $subscribe: {
      block: {
        query: gql`
          subscription blocks {
            block(order_by: { block_number: desc }, where: {}, limit: 1) {
              block_number
              block_number_finalized
              block_hash
              block_author
              block_author_name
              current_era
              current_index
              era_length
              era_progress
              extrinsics_root
              is_epoch
              new_accounts
              num_transfers
              parent_hash
              session_length
              session_per_era
              session_progress
              spec_name
              spec_version
              state_root
              timestamp
              total_events
              validator_count
            }
          }
        `,
        result({ data }) {
          this.lastBlock = data.block[0];
        }
      }
    }
  }
};
</script>

<style>
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

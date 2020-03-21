<template>
  <div
    v-if="showNetworkStats && lastBlock !== undefined"
    class="network row text-center mt-4"
    data-testid="blocksInfo"
  >
    <div class="col-12 text-right">
      <button
        type="button"
        class="close"
        data-testid="blocksInfoCloseButton"
        @click="showNetworkStats = false"
      >
        ×
      </button>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card" data-testid="lastBlock">
        <div class="card-body">
          <p>Last block</p>
          <Identicon
            :key="lastBlock.block_author"
            :value="lastBlock.block_author"
            :size="25"
            :theme="'polkadot'"
            class="d-inline-block"
          />
          <h5 class="d-inline-block">
            {{ formatNumber(lastBlock.block_number) }}
          </h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card" data-testid="lastFinalized">
        <div class="card-body">
          <p>Validator count</p>
          <h5>
            {{ formatNumber(lastBlock.validator_count) }}
          </h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card" data-testid="currentSession">
        <div class="card-body">
          <p>Current session</p>
          <h5>
            {{ formatNumber(lastBlock.current_index) }}
          </h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card" data-testid="epoch">
        <div class="card-body">
          <p>Epoch</p>
          <h5>
            {{ formatNumber(lastBlock.session_progress) }}/{{
              formatNumber(lastBlock.session_length)
            }}
          </h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card" data-testid="currentEra">
        <div class="card-body">
          <p>Current era</p>
          <h5>
            {{ formatNumber(lastBlock.current_era) }}
          </h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card" data-testid="era">
        <div class="card-body">
          <p>Era</p>
          <h5>
            {{ formatNumber(lastBlock.era_progress) }}/{{
              formatNumber(lastBlock.era_length)
            }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isHex } from "@polkadot/util";
import commonMixin from "../mixins/commonMixin.js";
import Identicon from "../components/identicon.vue";
import gql from "graphql-tag";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  // eslint-disable-next-line vue/require-prop-types
  props: ["network"],
  data: function() {
    return {
      showNetworkStats: true,
      lastBlock: undefined
    };
  },
  methods: {
    formatNumber(n) {
      if (isHex(n)) {
        return parseInt(n, 16)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      } else {
        return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
    }
  },
  apollo: {
    $subscribe: {
      block: {
        query: gql`
          subscription blocks {
            block(order_by: { block_number: desc }, where: {}, limit: 1) {
              block_number
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

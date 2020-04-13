<template>
  <div>
    <section>
      <b-container class="block-page main pt-4 pb-5">
        <template v-if="block">
          <div class="card mt-4 mb-3">
            <div class="card-body">
              <h4 class="text-center mb-4">
                {{ $t("details.block.block") }} #{{ formatNumber(blockNumber) }}
              </h4>
              <table class="table table-striped block-table">
                <tbody>
                  <tr>
                    <td>{{ $t("details.block.block_author") }}</td>
                    <td class="text-right">
                      <a
                        :href="blockExplorer.account + parsedBlock.block_author"
                        target="_blank"
                        class="d-block"
                      >
                        <Identicon
                          :key="parsedBlock.block_author"
                          :value="parsedBlock.block_author"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <span
                          v-b-tooltip.hover
                          :title="$t('details.block.see_address_in_polkastats')"
                        >
                          {{ shortAddress(parsedBlock.block_author) }}
                        </span>
                        <span v-if="parsedBlock.block_author_name !== ``"
                          >[ {{ parsedBlock.block_author_name }} ]</span
                        >
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.block_hash") }}</td>
                    <td class="text-right">
                      <p class="mb-0">
                        <nuxt-link
                          :to="`/block?blockNumber=${blockNumber - 1}`"
                        >
                          {{ parsedBlock.block_hash }}
                        </nuxt-link>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.extrinsic_root") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.extrinsics_root }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.parent_hash") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.parent_hash }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.state_root") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.state_root }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.spec_name") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.spec_name }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.spec_version") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.spec_version }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.current_session_index") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.current_index }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.session_length") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.session_length }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.session_per_era") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.session_per_era }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.session_progress") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.session_progress }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.current_era_index") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.current_era }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.era_length") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.era_length }}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("details.block.era_progress") }}</td>
                    <td class="text-right">
                      <p class="mb-0">{{ parsedBlock.era_progress }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
        <template v-if="parsedEvents">
          <div class="card mt-4 mb-3">
            <div class="card-body">
              <h4 class="text-center mb-4">
                {{ $t("details.block.system_events") }}
              </h4>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>{{ $t("details.block.section") }}</th>
                    <th>{{ $t("details.block.method") }}</th>
                    <th>{{ $t("details.block.phase") }}</th>
                    <th>{{ $t("details.block.data") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in parsedEvents" :key="event.event_index">
                    <td>{{ event.section }}</td>
                    <td>{{ event.method }}</td>
                    <td>{{ event.phase }}</td>
                    <td>
                      <template
                        v-if="
                          event.section === `balances` &&
                            event.method === `Transfer`
                        "
                      >
                        <Identicon
                          :key="JSON.parse(event.data)[0]"
                          :value="JSON.parse(event.data)[0]"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <nuxt-link
                          :to="{
                            name: 'account',
                            query: { accountId: JSON.parse(event.data)[0] }
                          }"
                          :title="$t('details.block.account_details')"
                        >
                          {{ shortAddress(JSON.parse(event.data)[0]) }}
                        </nuxt-link>
                        <i class="fas fa-arrow-right"></i>
                        <Identicon
                          :key="JSON.parse(event.data)[1]"
                          :value="JSON.parse(event.data)[1]"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <nuxt-link
                          :to="{
                            name: 'account',
                            query: { accountId: JSON.parse(event.data)[1] }
                          }"
                          :title="$t('details.block.account_details')"
                        >
                          {{ shortAddress(JSON.parse(event.data)[1]) }}
                        </nuxt-link>
                        <i class="fas fa-arrow-right"></i>
                        <span class="amount">
                          {{ formatAmount(JSON.parse(event.data)[2]) }}
                        </span>
                      </template>
                      <template v-else>
                        {{ event.data }}
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import Identicon from "../../components/identicon.vue";
import { blockExplorer } from "../../polkastats.config.js";
import commonMixin from "../../mixins/commonMixin.js";
import gql from "graphql-tag";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      blockNumber: this.$route.query.blockNumber,
      blockExplorer,
      parsedBlock: undefined,
      parsedEvents: undefined
    };
  },
  watch: {
    $route() {
      this.blockNumber = this.$route.query.blockNumber;
    }
  },
  apollo: {
    block: {
      query: gql`
        query block($block_number: bigint!) {
          block(where: { block_number: { _eq: $block_number } }) {
            block_author
            block_author_name
            block_hash
            block_number
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
      variables() {
        return {
          block_number: this.$route.query.blockNumber
        };
      },
      result({ data }) {
        this.parsedBlock = {
          ...data.block[0]
        };
      }
    },
    event: {
      query: gql`
        query event($block_number: bigint!) {
          event(where: { block_number: { _eq: $block_number } }) {
            block_number
            data
            event_index
            method
            phase
            section
          }
        }
      `,
      variables() {
        return {
          block_number: this.$route.query.blockNumber
        };
      },
      result({ data }) {
        this.parsedEvents = {
          ...data.event
        };
      }
    }
  },
  head() {
    return {
      title: "PolkaStats - Kusama block " + this.$route.query.blockNumber,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Kusama block " + this.$route.query.blockNumber
        }
      ]
    };
  }
};
</script>
<style>
.identicon {
  cursor: pointer;
}
.block-table tr td:first-child {
  width: 30%;
  font-weight: bold;
}
.block-table tr td:nth-child(2) {
  width: 70%;
}
.block-table tr td .identicon {
  display: inline-block;
}
.block-page .amount {
  color: #ef1073;
  font-weight: 700;
}
.block-page .clipboard {
  display: inline-block;
}
</style>

<template>
  <div>
    <section>
      <b-container class="main py-5 dashboard">
        <b-alert
          v-if="network.validators.length > 0"
          show
          dismissible
          variant="primary"
          class="text-center"
        >
          <div>
            <h3>{{ $t("pages.dashboard.polkastats_validator") }}</h3>
            <h5>
              {{
                $t("pages.dashboard.polkastats_validator_subtitle", {
                  networkName: network.name
                })
              }}
            </h5>
          </div>
          <b-row>
            <div
              v-for="validator in network.validators"
              :key="validator.address"
              class="col text-center"
            >
              <Identicon
                :value="validator.address"
                size="30"
                theme="polkadot"
                class="mt-2 mb-3"
              />
              <nuxt-link :to="`/${validator.path}/${validator.address}`">
                {{ validator.name }} {{ validator.address }}
              </nuxt-link>
            </div>
          </b-row>
        </b-alert>

        <Chain />

        <div class="row">
          <div class="col-md-6 mb-4">
            <h3>
              <nuxt-link
                v-b-tooltip.hover
                :to="`/blocks`"
                title="Click to see last blocks"
              >
                {{ $t("pages.dashboard.recent_blocks") }}
              </nuxt-link>
            </h3>
            <LastBlocks />
          </div>
          <div class="col-md-6 mb-4">
            <h3>
              <nuxt-link
                v-b-tooltip.hover
                :to="`/accounts`"
                title="Click to see all active accounts"
              >
                {{ $t("pages.dashboard.top_rich") }}
              </nuxt-link>
            </h3>
            <Top10Rich />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-4">
            <h3>
              <nuxt-link
                v-b-tooltip.hover
                :to="`/transfers`"
                title="Click to see last transfers"
              >
                {{ $t("pages.dashboard.recent_transfers") }}
              </nuxt-link>
            </h3>
            <LastTransfers />
          </div>
          <div class="col-md-6 mb-4">
            <h3>
              <nuxt-link
                v-b-tooltip.hover
                :to="`/events`"
                title="Click to see last events"
              >
                {{ $t("pages.dashboard.recent_events") }}
              </nuxt-link>
            </h3>
            <LastEvents />
          </div>
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import Chain from "../components/Chain.vue";
import LastBlocks from "../components/LastBlocks.vue";
import LastEvents from "../components/LastEvents.vue";
import LastTransfers from "../components/LastTransfers.vue";
import Top10Rich from "../components/Top10Rich.vue";
import commonMixin from "../mixins/commonMixin.js";
import Identicon from "../components/identicon.vue";
import { network } from "../polkastats.config.js";

export default {
  components: {
    Chain,
    LastBlocks,
    LastEvents,
    LastTransfers,
    Top10Rich,
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      network
    };
  },
  head() {
    return {
      title: this.$t("pages.dashboard.head_title", {
        networkName: network.name
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.dashboard.head_content", {
            networkName: network.name
          })
        }
      ]
    };
  }
};
</script>
<style>
.dashboard .clipboard {
  display: inline-block;
}
.dashboard .identicon {
  margin-right: 0.2rem;
  cursor: copy;
}
</style>

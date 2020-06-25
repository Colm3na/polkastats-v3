<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5">
        <h1 class="mb-4">
          {{ $t("pages.dashboard.title") }}
        </h1>

        <b-alert
          show
          dismissible
          variant="primary"
          class="text-center"
          data-testid="serverAlert"
        >
          <div>
            <h3>{{ $t("pages.dashboard.polkastats_validator") }}</h3>
            <h5>{{ $t("pages.dashboard.polkastats_validator_subtitle") }}</h5>
          </div>
          <img
            v-b-tooltip.hover
            src="img/PolkaStats_Logo_Circle.png"
            class="img-fluid my-3"
            style="max-width: 60px;"
            title="PolkaStats"
          />
          <Identicon
            value="GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY"
            size="20"
            theme="polkadot"
          />
          <nuxt-link
            to="/intention?accountId=15psTaipmWG86U5vNkF7Guv9TRPMRLKHkGS8cXT74v3RCC5t"
          >
            <span
              v-b-tooltip.hover
              class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
              title="GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY"
              >{{
                shortAddress(`15psTaipmWG86U5vNkF7Guv9TRPMRLKHkGS8cXT74v3RCC5t`)
              }}</span
            >
            <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
              >15psTaipmWG86U5vNkF7Guv9TRPMRLKHkGS8cXT74v3RCC5t</span
            >
          </nuxt-link>
        </b-alert>

        <Chain />

        <div class="row">
          <div class="col-md-6 mb-4">
            <h3>{{ $t("pages.dashboard.recent_blocks") }}</h3>
            <LastBlocks />
          </div>
          <div class="col-md-6 mb-4">
            <h3>{{ $t("pages.dashboard.top_rich") }}</h3>
            <Top10Rich />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-4">
            <h3>{{ $t("pages.dashboard.recent_extrinsics") }}</h3>
            <LastExtrinsics />
          </div>
          <div class="col-md-6 mb-4">
            <h3>{{ $t("pages.dashboard.recent_events") }}</h3>
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
import LastExtrinsics from "../components/LastExtrinsics.vue";
import Top10Rich from "../components/Top10Rich.vue";
import commonMixin from "../mixins/commonMixin.js";

export default {
  components: {
    Chain,
    LastBlocks,
    LastEvents,
    LastExtrinsics,
    Top10Rich
  },
  mixins: [commonMixin],
  head() {
    return {
      title: this.$t("pages.dashboard.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.dashboard.head_content")
        }
      ]
    };
  }
};
</script>
<style></style>

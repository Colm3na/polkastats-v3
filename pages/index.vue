<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5">
        <h1 class="mb-4">
          {{ $t("pages.dashboard.title") }}
        </h1>

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
export default {
  components: {
    Chain,
    LastBlocks,
    LastEvents,
    LastExtrinsics,
    Top10Rich
  },
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

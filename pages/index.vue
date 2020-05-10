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
            <h2>Recent blocks</h2>
            <LastBlocks />
          </div>
          <div class="col-md-6 mb-4">
            <h2>Recent events</h2>
            <LastEvents />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4">
            <h2>Recent extrinsics</h2>
            <LastExtrinsics />
          </div>
          <div class="col-md-6 mb-4">
            <!-- <h2>Top 10 rich accounts</h2>
            <Top10Rich /> -->
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
// import Top10Rich from "../components/Top10Rich.vue";
export default {
  components: {
    Chain,
    LastBlocks,
    LastEvents,
    LastExtrinsics
    // Top10Rich
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

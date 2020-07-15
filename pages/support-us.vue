<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5 support-us">
        <h1 class="mb-4">
          {{ $t("pages.support-us.support_polkastats") }}
        </h1>

        <p>
          {{ $t("pages.support-us.polkastats_software_TEXT") }}
        </p>

        <p>
          {{ $t("pages.support-us.i_enjoy_developing_TEXT") }}
        </p>

        <p>
          {{ $t("pages.support-us.if_you_like_TEXT") }}
        </p>

        <h2 class="mt-5 mb-4">
          {{ $t("pages.support-us.feedback") }}
        </h2>

        <p>
          {{ $t("pages.support-us.we_love_feedback_TEXT") }}
          <a href="https://github.com/Colm3na/polkastats-v3" target="_blank">{{
            $t("pages.support-us.github_repository")
          }}</a
          >.
        </p>

        <h2 class="mt-5 mb-4">
          {{ $t("pages.support-us.stake_in_our_validator") }}
        </h2>

        <p>
          {{ $t("pages.support-us.this_is_an_TEXT") }}
        </p>

        <b-card class="mb-3">
          <div class="row">
            <div class="col-md-2 text-center">
              <img
                v-b-tooltip.hover
                src="https://s3.amazonaws.com/keybase_processed_uploads/ceb4f17440dc978fa4faa64814290005_360_360.jpg"
                class="img-fluid"
                style="max-width: 80px;"
                title="PolkaStats"
              />
            </div>
            <div class="col-md-10">
              <h3 class="mt-1 mb-2">
                PolkaStats validator
              </h3>
              <Identicon
                value="15psTaipmWG86U5vNkF7Guv9TRPMRLKHkGS8cXT74v3RCC5t"
                size="20"
                theme="polkadot"
              />
              <nuxt-link
                :to="{
                  name: 'account',
                  query: {
                    accountId: `15psTaipmWG86U5vNkF7Guv9TRPMRLKHkGS8cXT74v3RCC5t`
                  }
                }"
              >
                <span
                  v-b-tooltip.hover
                  class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                  title="GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY"
                  >{{
                    shortAddress(
                      `15psTaipmWG86U5vNkF7Guv9TRPMRLKHkGS8cXT74v3RCC5t`
                    )
                  }}</span
                >
                <span
                  class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                  >15psTaipmWG86U5vNkF7Guv9TRPMRLKHkGS8cXT74v3RCC5t</span
                >
              </nuxt-link>
            </div>
          </div>
        </b-card>
        <h2 class="mt-5 mb-4">
          {{ $t("pages.support-us.follow_polkastats_on_twitter") }}
        </h2>
        <p>
          {{ $t("pages.support-us.are_you_a_TEXT") }}
          <a target="_blank" href="https://twitter.com/polkastats"
            ><i class="fab fa-twitter" /> @PolkaStats</a
          >
          {{ $t("pages.support-us.on_twitter_to_get_TEXT") }}.
        </p>
      </b-container>
    </section>
  </div>
</template>
<script>
import Identicon from "../components/identicon.vue";
import commonMixin from "../mixins/commonMixin.js";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  head() {
    return {
      title: this.$t("pages.support-us.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.support-us.head_content")
        }
      ]
    };
  }
};
</script>
<style>
.support-us .clipboard {
  display: inline-block;
}
.support-us .identicon {
  margin-right: 0.2rem;
  cursor: copy;
}
</style>

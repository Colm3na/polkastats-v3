<template>
  <div>
    <section class="cta">
      <b-container>
        <div class="row text-center">
          <div class="col-md-12 pt-5 pb-5">
            <h3>
              {{ $t("pages.for-validators.want_to_have_your_validator_TEXT_1")
              }}<br />
              {{
                $t("pages.for-validators.want_to_have_your_validator_TEXT_2")
              }}
            </h3>
          </div>
        </div>
      </b-container>
    </section>
    <section>
      <b-container class="main pb-5 text-center">
        <h2 class="mt-4 mb-4">
          {{ $t("pages.for-validators.how_to_include_TEXT") }}
        </h2>
        <b-alert variant="success" show>
          {{ $t("pages.for-validators.you_will_need_both") }}
          <a href="https://keybase.io" target="_blank">Keybase</a>
          {{ $t("pages.for-validators.and") }}
          <a href="https://github.com" target="_blank">GitHub</a>
          {{ $t("pages.for-validators.accounts_in_order_to_continue") }}.<br />
          {{ $t("pages.for-validators.make_sure_TEXT") }}
        </b-alert>
        <b-card-group deck class="mt-4 mb-4">
          <b-card title="Step 1">
            <b-card-text>
              {{ $t("pages.for-validators.login_with_your_github_TEXT") }}:
              <a href="https://github.com/Colm3na/polkastats-v2" target="_blank"
                >https://github.com/Colm3na/polkastats-v2</a
              >.
            </b-card-text>
          </b-card>
          <b-card title="Step 2">
            <b-card-text>
              {{ $t("pages.for-validators.create_a_new_folder_TEXT") }}
              <a
                href="https://github.com/Colm3na/polkastats-v2/tree/master/identities"
                target="_blank"
                >{{ $t("pages.for-validators.identities_folder") }}</a
              >. {{ $t("pages.for-validators.in_that_folder_TEXT") }}
              <a href="https://keybase.io" target="_blank">Keybase</a>
              {{ $t("pages.for-validators.username_on_it") }}.
              {{ $t("pages.for-validators.a_logo_TEXT") }}
              <a
                href="https://raw.githubusercontent.com/derfredy/polkastats-v2/master/identities/DSpbbk6HKKyS78c4KDLSxCetqbwnsemv2iocVXwNe2FAvWC/validator_info.json"
                target="_blank"
                >validator_info.json</a
              >
              {{ $t("pages.for-validators.following_this_schema") }}.
            </b-card-text>
          </b-card>
          <b-card title="Step 3">
            <b-card-text>
              {{ $t("pages.for-validators.make_a_pull_rquest_TEXT") }}:
              <a href="https://github.com/Colm3na/polkastats-v2" target="_blank"
                >https://github.com/Colm3na/polkastats-v2</a
              >.
            </b-card-text>
          </b-card>
        </b-card-group>
        <h4 class="mt-4">
          {{ $t("pages.for-validators.need_help_TEXT") }}
          <a target="_blank" href="mailto:polkastats@protonmail.com"
            >polkastats@protonmail.com</a
          >.
        </h4>
      </b-container>
    </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  head() {
    return {
      title: this.$t("pages.for-validators.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.for-validators.head_content")
        }
      ]
    };
  }
};
</script>
<style scoped>
.card-title {
  color: #ef1073;
}

/* Call to action */

.cta {
  color: #fff;
  background-color: #5bc0de;
  border-color: #14b6e6;
  background-image: linear-gradient(135deg, #670d35, #b1e2f1);
}

.cta h3 {
  line-height: 3rem;
}
</style>

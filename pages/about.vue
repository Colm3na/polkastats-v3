<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5">
        <h1 class="mb-4">
          {{ $t("pages.about.about") }}
        </h1>
        <p>
          {{ $t("pages.about.this_is_about") }}
          <a href="https://polkadot.network" target="_blank"
            ><strong>Polkadot</strong></a
          >
          {{ $t("pages.about.and_now") }}
          <a href="https://kusama.network" target="_blank"
            ><strong>Kusama</strong></a
          >, {{ $t("pages.about.of_course") }} ;-)
        </p>
        <p>
          {{ $t("pages.about.i_code_this_app_TEXT_1") }} ({{
            $t("pages.about.i_code_this_app_TEXT_2")
          }}
          :-)) {{ $t("pages.about.i_code_this_app_TEXT_3") }}.
        </p>
        <p>
          {{ $t("pages.about.thanks_to_all_people_from") }}
          <a
            href="https://riot.im/app/#/room/#polkadot-watercooler:matrix.org"
            target="_blank"
            >Polkadot Watercooler</a
          >
          {{ $t("pages.about.for_point_me_TEXT") }}.
        </p>

        <h2 class="mt-5 mb-4">
          {{ $t("pages.about.changelog") }}
        </h2>

        <p><strong>26/10/2019</strong></p>

        <ul>
          <li>Version 2!</li>
          <li>
            {{ $t("pages.about.new_github_repos") }}:
            <a href="https://github.com/Colm3na/polkastats-v2" target="_blank"
              >https://github.com/Colm3na/polkastats-v2</a
            >
            {{ $t("pages.about.and") }}
            <a
              href="https://github.com/Colm3na/polkastats-backend-v2"
              target="_blank"
              >https://github.com/Colm3na/polkastats-backend-v2</a
            >
          </li>
          <li>{{ $t("pages.about.add_kusma_cc2_network_support") }}.</li>
          <li>
            {{ $t("pages.about.changed_default_network_to_kusama_cc2") }} (<a
              href="https://polkastats.io"
              target="_blank"
              >https://polkastats.io</a
            >).
          </li>
          <li>
            {{ $t("pages.about.alexander_network_now_is_at") }}
            <a href="https://alexander.polkastats.io" target="_blank"
              >https://alexander.polkastats.io</a
            >.
          </li>
          <li>{{ $t("pages.about.improved_mysql_backend") }}</li>
        </ul>

        <p><strong>07/08/2019</strong></p>

        <ul>
          <li>
            {{ $t("pages.about.use_new") }}
            <a
              href="https://github.com/polkadot-js/ui/tree/master/packages/vue-identicon"
              target="_blank"
              >{{ $t("pages.about.vue_identicon_component") }}</a
            >.
          </li>
          <li>
            {{ $t("pages.about.use_formatbalance_function_from") }}
            @polkadot/util
          </li>
        </ul>

        <p><strong>01/08/2019</strong></p>

        <ul>
          <li>{{ $t("pages.about.polkadot_identiti_icons_support") }}</li>
          <li>
            {{ $t("pages.about.new_weekly_and_monthly_total_bonded_charts") }}
          </li>
          <li>
            {{ $t("pages.about.show_period_changes_TEXT") }}
          </li>
          <li>{{ $t("pages.about.show_last_block_and_sessionera_info") }}</li>
          <li>{{ $t("pages.about.improved_navigation_speed") }}</li>
        </ul>
      </b-container>
    </section>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: this.$t("pages.about.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.about.head_content")
        }
      ]
    };
  }
};
</script>
<style></style>

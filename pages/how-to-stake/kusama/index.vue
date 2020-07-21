<template>
  <div>
    <section>
      <b-container class="main py-5 support-us">
        <h1 class="mb-4">
          {{
            $t("pages.how_to_stake.kusama.title", {
              networkName: network.name
            })
          }}
        </h1>
        <b-breadcrumb :items="breadcrumbsItems"></b-breadcrumb>
        <nuxt-link
          to="/how-to-stake/kusama/using-polkastats"
          active-class="nuxt-link-exact-active"
          class="nav-link"
        >
          {{ $t("pages.how_to_stake.kusama.polkastats.title") }}
        </nuxt-link>
        <nuxt-link
          to="/how-to-stake/kusama/using-lunie"
          active-class="nuxt-link-exact-active"
          class="nav-link"
        >
          {{ $t("pages.how_to_stake.kusama.lunie.title") }}
        </nuxt-link>
        <nuxt-link
          to="/how-to-stake/kusama/using-polkadotjs"
          active-class="nuxt-link-exact-active"
          class="nav-link"
        >
          {{ $t("pages.how_to_stake.kusama.polkadotjs.title") }}
        </nuxt-link>
      </b-container>
    </section>
  </div>
</template>
<script>
import commonMixin from "~/mixins/commonMixin.js";
import { network } from "~/polkastats.config.js";

export default {
  mixins: [commonMixin],
  data: function() {
    return {
      network,
      breadcrumbsItems: [
        {
          text: this.$t("pages.home.title"),
          href: "/"
        },
        {
          text: this.$t("pages.how_to_stake.title", {
            networkName: network.name
          }),
          href: "/how-to-stake"
        },
        {
          text: this.$t("pages.how_to_stake.kusama.title", {
            networkName: network.name
          }),
          href: "#"
        }
      ]
    };
  },
  head() {
    return {
      title: this.$t("pages.how_to_stake.kusama.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.how_to_stake.kusama.head_content")
        }
      ]
    };
  }
};
</script>
<style></style>

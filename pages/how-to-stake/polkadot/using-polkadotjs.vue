<template>
  <div>
    <section>
      <b-container class="main py-5 support-us">
        <h1 class="mb-4">
          {{
            $t("pages.how_to_stake.polkadot.polkadotjs.title", {
              networkName: network.name
            })
          }}
        </h1>
        <b-breadcrumb :items="breadcrumbsItems"></b-breadcrumb>
        <p></p>
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
          text: this.$t("pages.how_to_stake.polkadot.title", {
            networkName: network.name
          }),
          href: "/how-to-stake/polkadot"
        },
        {
          text: this.$t("pages.how_to_stake.polkadot.polkadotjs.title", {
            networkName: network.name
          }),
          href: "#"
        }
      ]
    };
  },
  head() {
    return {
      title: this.$t("pages.how_to_stake.polkadot.polkadotjs.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t(
            "pages.how_to_stake.polkadot.polkadotjs.head_content"
          )
        }
      ]
    };
  }
};
</script>
<style></style>

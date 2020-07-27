<template>
  <div>
    <section>
      <b-container class="main py-5 support-us">
        <h1 class="mb-4">
          {{
            $t("pages.how_to_stake.kusama.lunie.title", {
              networkName: network.name
            })
          }}
        </h1>
        <b-breadcrumb :items="breadcrumbsItems"></b-breadcrumb>

        <p>This step by step guide explains how to nominate on Kusama.</p>

        <p>
          Kusama is the "canary" network for Polkadot. It is a separate network
          with its own native KSM token.
        </p>

        <p>
          The same principles described in this guide apply for Kusama, Polkadot
          and other Substrate networks, but make sure you double-check which
          network you are performing actions on.
        </p>

        <p>
          Note that Kusama and Polkadot has different token lockup periods at
          nominating, that means the time you need to wait for unbond (7 days
          for Kusama and 28 days for Polkadot).
        </p>

        <p>
          For aditional security we will also use Lunie Browser Extension to
          interact with the chain in a secure way.
        </p>

        <h2>Before start</h2>

        You will need:

        <ul>
          <li>Chrome/Brave browser.</li>
          <li>A Kusama address with some available KSM tokens.</li>
        </ul>

        <h2>1. Install Lunie Browser Extension</h2>

        <p>
          Open <a href="http://bit.ly/lunie-ext">http://bit.ly/lunie-ext</a> in
          your browser and install it.
        </p>

        <h2>2. Import your Kusama address in the extension</h2>

        <ul>
          <li>Click on "Recover with backup code".</li>
          <li>Select network "Kusama".</li>
          <li>Enter your seed phrase and click next.</li>
          <li>Enter a descriptive account name and click next.</li>
          <li>Enter a password for the account and click next.</li>
          <li>Click on "Go to Lunie"</li>
        </ul>

        <h2>3. Nominate to PolkaStats</h2>

        <ul>
          <li>Go to "Validators".</li>
          <li>
            Search "PolkaStats" and click on it to open the validator profile
            page.
          </li>
          <li>Click on Stake button.</li>
          <li>Enter the amount you want to bond and click next.</li>
          <li>Check the fee and click next.</li>
          <li>Click on "Send"</li>
          <li>
            Open Lunie Browser Extension, enter the password and click on
            "Aprove".
          </li>
        </ul>
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
          href: "/how-to-stake/kusama"
        },
        {
          text: this.$t("pages.how_to_stake.kusama.lunie.title", {
            networkName: network.name
          }),
          href: "#"
        }
      ]
    };
  },
  head() {
    return {
      title: this.$t("pages.how_to_stake.kusama.lunie.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.how_to_stake.kusama.lunie.head_content")
        }
      ]
    };
  }
};
</script>
<style></style>

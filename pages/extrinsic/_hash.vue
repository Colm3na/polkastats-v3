<template>
  <div>
    <section>
      <b-container class="block-page main py-5">
        <template v-if="!parsedExtrinsic">
          <h1 class="text-center">Extrinsic not found!</h1>
        </template>
        <template v-else>
          <div class="card mt-4 mb-3">
            <div class="card-body">
              <h4 class="text-center mb-4">Extrinsic {{ extrinsicHash }}</h4>
            </div>
          </div>
        </template>
      </b-container>
    </section>
  </div>
</template>
<script>
// import Identicon from "../../components/identicon.vue";
import commonMixin from "../../mixins/commonMixin.js";
import gql from "graphql-tag";
import { network } from "../../polkastats.config.js";

export default {
  // components: {
  //   Identicon
  // },
  mixins: [commonMixin],
  data: function() {
    return {
      extrinsicHash: this.$route.params.hash,
      parsedExtrinsic: undefined
    };
  },
  watch: {
    $route() {
      this.extrinsicHash = this.$route.params.hash;
    }
  },
  methods: {
    getDateFromTimestamp(timestamp) {
      if (timestamp === 0) {
        return `--`;
      }
      var newDate = new Date();
      newDate.setTime(timestamp * 1000);
      return newDate.toUTCString();
    }
  },
  apollo: {
    extrinsic: {
      query: gql`
        query extrinsic($extrinsic_hash: String!) {
          extrinsic(where: { extrinsic_hash: { _eq: $extrinsic_hash } }) {
            block_number
            extrinsic_index
            is_signed
            signer
            section
            method
            args
            hash
            doc
            success
          }
        }
      `,
      variables() {
        return {
          extrinsic_hash: this.extrinsicHash
        };
      },
      result({ data }) {
        this.parsedExtrinsics = data.extrinsic;
      }
    }
  },
  head() {
    return {
      title: this.$t("pages.extrinsic.head_title", {
        networkName: network.name,
        extrinsicHash: this.extrinsicHash
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$tc("pages.extrinsic.head_content", {
            networkName: network.name,
            extrinsicHash: this.extrinsicHash
          })
        }
      ]
    };
  }
};
</script>
<style>
.identicon {
  cursor: pointer;
}
.block-table tr td:first-child {
  width: 30%;
  font-weight: bold;
}
.block-table tr td:nth-child(2) {
  width: 70%;
}
.block-table tr td .identicon {
  display: inline-block;
}
.block-page .amount {
  color: #ef1073;
  font-weight: 700;
}
.block-page .clipboard {
  display: inline-block;
}
</style>

<template>
  <div>
    <section>
      <b-container class="extrinsic-page main py-5">
        <div v-if="loading" class="text-center py-4">
          <Loading />
        </div>
        <template v-else-if="!parsedExtrinsic">
          <h1 class="text-center">Extrinsic not found!</h1>
        </template>
        <template v-else>
          <div class="card mt-4 mb-3">
            <div class="card-body">
              <h4 class="text-center mb-4">
                Extrinsic {{ blockNumber }}-{{ extrinsicIndex }}
              </h4>
              <div class="table-responsive pb-4">
                <table class="table table-striped extrinsic-table">
                  <tbody>
                    <tr>
                      <td>Block number</td>
                      <td class="text-right">
                        <nuxt-link
                          v-b-tooltip.hover
                          :to="`/block?blockNumber=${blockNumber}`"
                          title="Check block information"
                        >
                          #{{ formatNumber(blockNumber) }}
                        </nuxt-link>
                      </td>
                    </tr>
                    <tr>
                      <td>Extrinsic index</td>
                      <td class="text-right">
                        {{ parsedExtrinsic.extrinsic_index }}
                      </td>
                    </tr>
                    <tr>
                      <td>Hash</td>
                      <td class="text-right">
                        {{ parsedExtrinsic.hash }}
                      </td>
                    </tr>
                    <tr>
                      <td>Signed?</td>
                      <td class="text-right">
                        {{ parsedExtrinsic.is_signed }}
                      </td>
                    </tr>
                    <tr>
                      <td>Signer</td>
                      <td class="text-right">
                        {{ parsedExtrinsic.signer }}
                      </td>
                    </tr>
                    <tr>
                      <td>Extrinsic</td>
                      <td class="text-right">
                        {{ parsedExtrinsic.section }} ➡
                        {{ parsedExtrinsic.method }}
                      </td>
                    </tr>
                    <tr>
                      <td>Doc</td>
                      <td class="text-right">
                        {{ parsedExtrinsic.doc }}
                      </td>
                    </tr>
                    <tr>
                      <td>Args</td>
                      <td class="text-right">
                        {{ parsedExtrinsic.args }}
                      </td>
                    </tr>
                    <tr>
                      <td>Success</td>
                      <td class="text-right">
                        <i
                          v-if="parsedExtrinsic.success"
                          class="fa fa-check-circle text-success"
                          aria-hidden="true"
                        ></i>
                        <i
                          v-else
                          class="fa fa-check-circle text-danger"
                          aria-hidden="true"
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </template>
      </b-container>
    </section>
  </div>
</template>
<script>
// import Identicon from "../../components/identicon.vue";
import Loading from "../../../components/Loading.vue";
import commonMixin from "../../../mixins/commonMixin.js";
import gql from "graphql-tag";
import { network } from "../../../polkastats.config.js";

export default {
  components: {
    Loading
  },
  mixins: [commonMixin],
  data: function() {
    return {
      loading: true,
      blockNumber: this.$route.params.block,
      extrinsicIndex: this.$route.params.index,
      parsedExtrinsic: undefined
    };
  },
  watch: {
    $route() {
      this.blockNumber = this.$route.params.block;
      this.extrinsicIndex = this.$route.params.index;
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
        query extrinsic($block_number: bigint!, $extrinsic_index: Int!) {
          extrinsic(
            where: {
              block_number: { _eq: $block_number }
              extrinsic_index: { _eq: $extrinsic_index }
            }
          ) {
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
      skip() {
        return !this.blockNumber || !this.extrinsicIndex;
      },
      variables() {
        return {
          block_number: this.blockNumber,
          extrinsic_index: this.extrinsicIndex
        };
      },
      result({ data }) {
        this.parsedExtrinsic = data.extrinsic[0];
        this.loading = false;
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
.extrinsic-table tr td:first-child {
  width: 30%;
  font-weight: bold;
}
.extrinsic-table tr td:nth-child(2) {
  width: 70%;
}
.extrinsic-table tr td .identicon {
  display: inline-block;
}
.extrinsic-page .amount {
  color: #ef1073;
  font-weight: 700;
}
.extrinsic-page .clipboard {
  display: inline-block;
}
</style>

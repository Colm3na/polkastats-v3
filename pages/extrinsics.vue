<template>
  <div>
    <section>
      <b-container class="main py-5">
        <h1 class="mb-4">
          {{ $t("pages.extrinsics.title") }}
        </h1>
        <div class="last-extrinsics">
          <div class="table-responsive">
            <b-table striped hover :fields="fields" :items="extrinsics">
              <template v-slot:cell(block_number)="data">
                <p class="mb-0">
                  <nuxt-link
                    v-b-tooltip.hover
                    :to="`/block?blockNumber=${data.item.block_number}`"
                    title="Check block information"
                  >
                    #{{ formatNumber(data.item.block_number) }}
                  </nuxt-link>
                </p>
              </template>
              <template v-slot:cell(section)="data">
                <p class="mb-0">
                  {{ data.item.section }} ➡
                  {{ data.item.method }}
                </p>
              </template>
              <template v-slot:cell(success)="data">
                <p class="mb-0">
                  <i
                    v-if="data.item.success"
                    class="fa fa-check-circle text-success"
                    aria-hidden="true"
                  ></i>
                  <i
                    v-else
                    class="fa fa-check-circle text-danger"
                    aria-hidden="true"
                  ></i>
                </p>
              </template>
            </b-table>
          </div>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
import commonMixin from "../mixins/commonMixin.js";
import Identicon from "../components/identicon.vue";
import gql from "graphql-tag";
import { network } from "../polkastats.config.js";

export default {
  mixins: [commonMixin],
  data: function() {
    return {
      extrinsics: [],
      fields: [
        {
          key: "block_number",
          label: "Block",
          sortable: true
        },
        {
          key: "extrinsic_index",
          label: "Index",
          sortable: true
        },
        {
          key: "section",
          label: "Extrinsic",
          sortable: true
        },
        {
          key: "success",
          label: "Success",
          sortable: true
        }
      ]
    };
  },
  apollo: {
    $subscribe: {
      extrinsic: {
        query: gql`
          subscription extrinsics {
            extrinsic(
              order_by: { block_number: desc }
              where: { is_signed: { _eq: true } }
              limit: 50
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
        result({ data }) {
          this.extrinsics = data.extrinsic;
        }
      }
    }
  },
  head() {
    return {
      title: this.$t("pages.extrinsics.head_title", {
        networkName: network.name
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.extrinsics.head_content", {
            networkName: network.name
          })
        }
      ]
    };
  }
};
</script>

<style>
.last-blocks .identicon {
  display: inline-block;
  margin: 0 0.2rem 0 0;
  cursor: copy;
}
</style>

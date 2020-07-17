<template>
  <div>
    <section>
      <b-container class="main py-5">
        <h1 class="mb-4">
          {{ $t("pages.events.title") }}
        </h1>
        <div class="last-events">
          <div class="table-responsive">
            <b-table striped hover :fields="fields" :items="events">
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
      events: [],
      fields: [
        {
          key: "block_number",
          label: "Block",
          sortable: true
        },
        {
          key: "event_index",
          label: "Index",
          sortable: true
        },
        {
          key: "section",
          label: "Event",
          sortable: true
        },
        {
          key: "data",
          label: "Data",
          sortable: true
        }
      ]
    };
  },
  apollo: {
    $subscribe: {
      event: {
        query: gql`
          subscription events {
            event(order_by: { block_number: desc }, where: {}, limit: 50) {
              block_number
              event_index
              data
              method
              phase
              section
            }
          }
        `,
        result({ data }) {
          this.events = data.event;
        }
      }
    }
  },
  head() {
    return {
      title: this.$t("pages.events.head_title", {
        networkName: network.name
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.events.head_content", {
            networkName: network.name
          })
        }
      ]
    };
  }
};
</script>

<style></style>

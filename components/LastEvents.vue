<template>
  <div class="last-events">
    <div class="table-responsive">
      <b-table striped hover :fields="fields" :items="events">
        <template slot="block_number" slot-scope="data">
          <p class="mb-0">
            <nuxt-link
              v-b-tooltip.hover
              :to="`/block?blockNumber=${data.item.block_number}`"
              title="Check block information"
            >
              #{{ formatNumber(data.item.block_number) }}-{{
                data.item.event_index
              }}
            </nuxt-link>
          </p>
        </template>
        <template slot="section" slot-scope="data">
          <p class="mb-0">
            {{ data.item.section }} ➡
            {{ data.item.method }}
          </p>
        </template>
        <template slot="data" slot-scope="data">
          <p class="mb-0 d-inline-block">
            {{ data.item.data }}
          </p>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import commonMixin from "../mixins/commonMixin.js";
import gql from "graphql-tag";

export default {
  mixins: [commonMixin],
  data: function() {
    return {
      events: [],
      fields: [
        {
          key: "block_number",
          label: "Id",
          sortable: true
        },
        {
          key: "section",
          label: "Event",
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
            event(order_by: { block_number: desc }, where: {}, limit: 10) {
              block_number
              event_index
              data
              event_index
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
  }
};
</script>

<style>
.last-events .identicon {
  display: inline-block;
  margin: 0 0.2rem 0 0;
  cursor: copy;
}
</style>

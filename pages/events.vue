<template>
  <div>
    <section>
      <b-container class="main py-5">
        <h1 class="mb-4">
          {{ $t("pages.events.title") }}
        </h1>
        <div class="last-events">
          <!-- Filter -->
          <b-row style="margin-bottom: 1rem">
            <b-col cols="12">
              <b-form-input
                id="filterInput"
                v-model="filter"
                type="search"
                :placeholder="$t('pages.events.search_placeholder')"
              />
            </b-col>
          </b-row>
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
            <div class="mt-2" style="display: flex">
              <b-pagination
                v-model="page"
                :total-rows="totalRows"
                :per-page="perPage"
                aria-controls="validators-table"
              />
              <b-button-group class="mx-4">
                <b-button
                  v-for="(item, index) in tableOptions"
                  :key="index"
                  @click="handleNumFields(item)"
                >
                  {{ item }}
                </b-button>
              </b-button-group>
            </div>
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
import { network, paginationOptions } from "../polkastats.config.js";

export default {
  mixins: [commonMixin],
  data: function() {
    return {
      filter: "",
      events: [],
      tableOptions: paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
        : 10,
      page: 1,
      totalRows: 1,
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
  methods: {
    handleNumFields(num) {
      localStorage.paginationOptions = num;
      this.perPage = parseInt(num);
    }
  },
  apollo: {
    $subscribe: {
      event: {
        query: gql`
          subscription events(
            $blockNumber: bigint
            $perPage: Int!
            $offset: Int!
          ) {
            event(
              limit: $perPage
              offset: $offset
              where: { block_number: { _eq: $blockNumber } }
              order_by: { block_number: desc, event_index: desc }
            ) {
              block_number
              event_index
              data
              method
              phase
              section
            }
          }
        `,
        variables() {
          return {
            blockNumber: this.filter ? parseInt(this.filter) : undefined,
            perPage: this.perPage,
            offset: (this.page - 1) * this.perPage
          };
        },
        result({ data }) {
          this.events = data.event;
          if (this.filter) {
            this.totalRows = this.events.length;
          }
        }
      },
      totalEvents: {
        query: gql`
          subscription total {
            total(where: { name: { _eq: "events" } }, limit: 1) {
              count
            }
          }
        `,
        result({ data }) {
          if (!this.filter) {
            this.totalRows = data.total[0].count;
          }
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

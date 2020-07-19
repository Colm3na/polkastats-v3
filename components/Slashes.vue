<template>
  <div class="slashes">
    <div v-if="loading" class="text-center py-4">
      <Loading />
    </div>
    <div v-else-if="slashes.length === 0" class="text-center py-4">
      <h5>{{ $t("components.slashes.no_slash_found") }}</h5>
    </div>
    <div v-else>
      <!-- Filter -->
      <b-row style="margin-bottom: 1rem">
        <b-col cols="12">
          <b-form-input
            id="filterInput"
            v-model="filter"
            type="search"
            :placeholder="$t('components.slashes.search')"
          />
        </b-col>
      </b-row>
      <JsonCSV
        :data="slashes"
        class="download-csv mb-2"
        :name="`polkastats.io_slashes_${accountId}.csv`"
      >
        <i class="fas fa-file-csv"></i>
        {{ $t("pages.accounts.download_csv") }}
      </JsonCSV>
      <div class="table-responsive">
        <b-table
          striped
          hover
          :fields="fields"
          :per-page="perPage"
          :current-page="currentPage"
          :items="slashes"
          :filter="filter"
          @filtered="onFiltered"
        >
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
          <template v-slot:cell(event_index)="data">
            <p class="mb-0">
              <nuxt-link
                v-b-tooltip.hover
                :to="`/block?blockNumber=${data.item.block_number}`"
                title="Check block information"
              >
                {{ formatNumber(data.item.block_number) }}-{{
                  data.item.event_index
                }}
              </nuxt-link>
            </p>
          </template>
          <template v-slot:cell(data)="data">
            <p class="mb-0">
              {{ formatAmount(JSON.parse(data.item.data)[1]) }}
            </p>
          </template>
        </b-table>
        <div class="mt-4 d-flex">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
          />
          <b-button-group class="ml-2">
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
  </div>
</template>

<script>
import commonMixin from "../mixins/commonMixin.js";
import Loading from "../components/Loading.vue";
import { paginationOptions } from "../polkastats.config.js";
import gql from "graphql-tag";
import JsonCSV from "vue-json-csv";

export default {
  components: {
    JsonCSV,
    Loading
  },
  mixins: [commonMixin],
  props: {
    accountId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      loading: true,
      slashes: [],
      filter: null,
      filterOn: [],
      tableOptions: paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
        : 10,
      currentPage: 1,
      totalRows: 1,
      fields: [
        {
          key: "block_number",
          label: "Block number",
          class: "d-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell",
          sortable: true
        },
        {
          key: "event_index",
          label: "Event index",
          class: "d-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell",
          sortable: true
        },
        {
          key: "data",
          label: "Amount",
          sortable: true
        }
      ]
    };
  },
  created: function() {
    var vm = this;
    // Force update of identity list if empty
    if (this.$store.state.identities.list.length === 0) {
      vm.$store.dispatch("identities/update");
    }
    // Update data every 60 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("identities/update");
    }, 60000);
  },
  methods: {
    handleNumFields(num) {
      localStorage.paginationOptions = num;
      this.perPage = parseInt(num);
    },
    isFavorite(accountId) {
      return this.favorites.includes(accountId);
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getDisplayName: function(accountId) {
      let identity = this.$store.state.identities.list.find(
        identity => identity.accountId === accountId
      );
      if (identity) {
        identity = identity.identity;
        if (
          identity.displayParent &&
          identity.displayParent !== `` &&
          identity.display &&
          identity.display !== ``
        ) {
          return `${identity.displayParent} / ${identity.display}`;
        } else {
          return identity.display;
        }
      }
      return ``;
    }
  },
  apollo: {
    $subscribe: {
      event: {
        query: gql`
          subscription event($accountId: String!) {
            event(
              order_by: { block_number: desc, event_index: desc }
              where: {
                section: { _eq: "staking" }
                method: { _eq: "Slash" }
                data: { _like: $accountId }
              }
            ) {
              block_number
              event_index
              data
            }
          }
        `,
        variables() {
          return {
            accountId: `%${this.accountId}%`
          };
        },
        skip() {
          return !this.accountId;
        },
        result({ data }) {
          this.slashes = data.event;
          this.totalRows = this.slashes.length;
          this.loading = false;
        }
      }
    }
  }
};
</script>

<style scoped>
.slashes {
  background-color: white;
}
.loader {
  text-align: center;
}
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  text-align: center;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #d75ea1;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>

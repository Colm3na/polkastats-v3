<template>
  <div class="nominations">
    <div v-if="loading" class="text-center py-4">
      <Loading />
    </div>
    <div v-else-if="nominations.length === 0" class="text-center py-4">
      <h5>{{ $t("components.transfers.no_transfer_found") }}</h5>
    </div>
    <div v-else>
      <!-- Filter -->
      <b-row style="margin-bottom: 1rem">
        <b-col cols="12">
          <b-form-input
            id="filterInput"
            v-model="filter"
            type="search"
            :placeholder="$t('components.transfers.search')"
          />
        </b-col>
      </b-row>
      <JsonCSV
        :data="nominations"
        class="download-csv mb-2"
        :name="`polkastats.io_nominator_${accountId}_nominations.csv`"
      >
        <i class="fas fa-file-csv"></i>
        {{ $t("pages.accounts.download_csv") }}
      </JsonCSV>
      <!-- Table with sorting and pagination-->
      <div class="table-responsive">
        <b-table
          id="nominations-table"
          striped
          hover
          :fields="fields"
          :items="nominations"
          :per-page="perPage"
          :current-page="currentPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :filter="filter"
          :filter-included-fields="filterOn"
          @filtered="onFiltered"
        >
          <template v-slot:cell(validator)="data">
            <div
              class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center py-2"
              style="border: 1px solid #bbb; border-radius: 0.3rem;"
            >
              <p class="mt-2 mb-0">
                <Identicon
                  :key="data.item.validator"
                  :value="data.item.validator"
                  :size="20"
                  :theme="'polkadot'"
                />
                <nuxt-link
                  :to="{
                    name: 'validator',
                    query: { accountId: data.item.validator }
                  }"
                  title="Validator details"
                >
                  <span v-if="data.item.displayName">
                    {{ data.item.displayName }}
                  </span>
                  <span v-else>
                    {{ shortAddress(data.item.validator) }}
                  </span>
                </nuxt-link>
              </p>
              <p class="mt-2 mb-0">
                {{ formatAmount(data.item.amount) }}
              </p>
            </div>
            <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
              <p class="mb-0">
                <Identicon
                  :key="data.item.validator"
                  :value="data.item.validator"
                  :size="20"
                  :theme="'polkadot'"
                />
                <nuxt-link
                  :to="{
                    name: 'validator',
                    query: { accountId: data.item.validator }
                  }"
                  title="$t('details.validator.nominator_details')"
                >
                  <span v-if="data.item.displayName">
                    {{ data.item.displayName }}
                  </span>
                  <span v-else>
                    {{ shortAddress(data.item.validator) }}
                  </span>
                </nuxt-link>
              </p>
            </div>
          </template>
          <template v-slot:cell(percent)="data">
            <p class="text-right mb-0">{{ data.item.percent }}%</p>
          </template>
          <template v-slot:cell(amount)="data">
            <p class="text-right mb-0">
              {{ formatAmount(data.item.amount) }}
            </p>
          </template>
        </b-table>
        <div class="mt-4 d-flex">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="nominations-table"
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
import Identicon from "../components/identicon.vue";
import Loading from "../components/Loading.vue";
import { paginationOptions } from "../polkastats.config.js";
import gql from "graphql-tag";
import JsonCSV from "vue-json-csv";

export default {
  components: {
    Identicon,
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
      currentSessionIndex: 0,
      nominations: [],
      filter: null,
      filterOn: [],
      tableOptions: paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
        : 10,
      currentPage: 1,
      totalRows: 1,
      sortBy: `rank`,
      sortDesc: false,
      fields: [
        { key: "validator", label: "Validator", sortable: true },
        {
          key: "percent",
          label: this.$t("details.validator.percentage"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "amount",
          label: this.$t("details.validator.amount"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
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
      nominator: {
        query: gql`
          subscription nominator($session_index: Int!, $account_id: String!) {
            nominator(
              where: {
                session_index: { _eq: $session_index }
                account_id: { _eq: $account_id }
              }
            ) {
              targets
              total_staked
            }
          }
        `,
        variables() {
          return {
            account_id: this.accountId,
            session_index: this.currentSessionIndex
          };
        },
        skip() {
          return !this.currentSessionIndex;
        },
        result({ data }) {
          this.nominations = JSON.parse(data.nominator[0].targets).map(
            nomination => {
              return {
                ...nomination,
                percent: this.getStakePercent(
                  nomination.amount,
                  data.nominator[0].total_staked
                )
              };
            }
          );
          this.totalRows = this.nominations.length;
          this.loading = false;
        }
      },
      sessionIndex: {
        query: gql`
          subscription nominator {
            nominator(order_by: { session_index: desc }, where: {}, limit: 1) {
              session_index
            }
          }
        `,
        result({ data }) {
          if (data.nominator[0].session_index > this.currentSessionIndex) {
            this.currentSessionIndex = data.nominator[0].session_index;
          }
        }
      }
    }
  }
};
</script>

<style>
.nominations {
  background-color: white;
}
</style>

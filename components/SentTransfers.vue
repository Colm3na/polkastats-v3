<template>
  <div v-if="transfers.length > 0" class="sent-transfers">
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
      :data="transfers"
      class="download-csv mb-2"
      :name="`polkastats.io_sent_transfers_{${accountId}.csv`"
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
        :items="transfers"
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
        <template v-slot:cell(hash)="data">
          <p class="mb-0">
            <nuxt-link
              v-b-tooltip.hover
              :to="`/block?blockNumber=${data.item.block_number}`"
              title="Check block information"
            >
              {{ shortHash(data.item.hash) }}
            </nuxt-link>
          </p>
        </template>
        <template v-slot:cell(from)="data">
          <p class="mb-0">
            <nuxt-link
              :to="{
                name: 'account',
                query: { accountId: data.item.from }
              }"
              :title="$t('pages.validators.validator_details')"
            >
              <Identicon
                :key="data.item.from"
                :value="data.item.from"
                :size="20"
                :theme="'polkadot'"
              />
              <span v-if="getDisplayName(data.item.from)">
                {{ getDisplayName(data.item.from) }}
              </span>
              <span v-else>
                {{ shortAddress(data.item.from) }}
              </span>
            </nuxt-link>
          </p>
        </template>
        <template v-slot:cell(to)="data">
          <p class="mb-0">
            <nuxt-link
              :to="{
                name: 'account',
                query: { accountId: data.item.to }
              }"
              :title="$t('pages.validators.validator_details')"
            >
              <Identicon
                :key="data.item.to"
                :value="data.item.to"
                :size="20"
                :theme="'polkadot'"
              />
              <span v-if="getDisplayName(data.item.to)">
                {{ getDisplayName(data.item.to) }}
              </span>
              <span v-else>
                {{ shortAddress(data.item.to) }}
              </span>
            </nuxt-link>
          </p>
        </template>
        <template v-slot:cell(amount)="data">
          <p class="mb-0">
            {{ formatAmount(data.item.amount) }}
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
      <div class="mt-4 d-flex">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="validators-table"
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
</template>

<script>
import commonMixin from "../mixins/commonMixin.js";
import Identicon from "../components/identicon.vue";
import { paginationOptions } from "../polkastats.config.js";
import gql from "graphql-tag";
import JsonCSV from "vue-json-csv";

export default {
  components: {
    Identicon,
    JsonCSV
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
      transfers: [],
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
          key: "hash",
          label: "Hash",
          class: "d-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell",
          sortable: true
        },
        {
          key: "from",
          label: "From",
          sortable: true
        },
        {
          key: "to",
          label: "To",
          sortable: true
        },
        {
          key: "amount",
          label: "Amount",
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
      extrinsic: {
        query: gql`
          subscription extrinsic($signer: String!) {
            extrinsic(
              order_by: { block_number: desc }
              where: {
                section: { _eq: "balances" }
                method: { _eq: "transfer" }
                signer: { _eq: $signer }
              }
            ) {
              block_number
              hash
              args
              success
            }
          }
        `,
        variables() {
          return {
            signer: this.accountId
          };
        },
        skip() {
          return !this.accountId;
        },
        result({ data }) {
          this.transfers = data.extrinsic.map(transfer => {
            return {
              block_number: transfer.block_number,
              hash: transfer.hash,
              from: this.accountId,
              to: JSON.parse(transfer.args)[0],
              amount: JSON.parse(transfer.args)[1],
              success: transfer.success
            };
          });
          this.totalRows = this.transfers.length;
        }
      }
    }
  }
};
</script>

<style>
.sent-trnasfers {
  background-color: white;
}
</style>

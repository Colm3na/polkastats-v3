<template>
  <div v-if="transfers.length > 0" class="received-transfers">
    <!-- Filter -->
    <b-row style="margin-bottom: 1rem">
      <b-col cols="12">
        <b-form-input
          id="filterInput"
          v-model="filter"
          type="search"
          placeholder="Search transfer by block number, hash, source or destination address"
        />
      </b-col>
    </b-row>
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
              {{ shortAddress(data.item.from) }}
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
              {{ shortAddress(data.item.to) }}
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

export default {
  components: {
    Identicon
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
                args: { _like: $signer }
              }
            ) {
              block_number
              hash
              signer
              args
              success
            }
          }
        `,
        variables() {
          return {
            signer: `%${this.accountId}%`
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
              from: transfer.signer,
              to: this.accountId,
              amount: JSON.parse(transfer.args)[1],
              success: transfer.success
            };
          });
          this.totalRows = this.transfers.length;
          console.log(this.transfers);
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

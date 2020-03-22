<template>
  <div>
    <section>
      <b-container class="page-accounts main pt-4">
        <h1 class="text-center mb-4">
          Active accounts
        </h1>
        <!-- Filter -->
        <b-row>
          <b-col lg="12" class="mb-4">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              placeholder="Search account by address, index or identity"
            />
          </b-col>
        </b-row>
        <!-- Mobile sorting -->
        <div class="row d-block d-sm-block d-md-block d-lg-none d-xl-none">
          <b-col lg="6" class="my-1">
            <b-form-group
              label="Sort"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-4"
            >
              <b-input-group size="sm">
                <b-form-select
                  id="sortBySelect"
                  v-model="sortBy"
                  :options="sortOptions"
                  class="w-75"
                >
                  <template v-slot:first>
                    <option value="">
                      -- none --
                    </option>
                  </template>
                </b-form-select>
                <b-form-select
                  v-model="sortDesc"
                  size="sm"
                  :disabled="!sortBy"
                  class="w-25"
                >
                  <option :value="false">
                    Asc
                  </option>
                  <option :value="true">
                    Desc
                  </option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
        </div>
        <!-- Table with sorting and pagination-->
        <div>
          <b-table
            id="accounts-table"
            stacked="md"
            head-variant="dark"
            :fields="fields"
            :items="accounts"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered"
          >
            <template slot="rank" slot-scope="data">
              <p class="text-right mb-0">#{{ data.item.rank }}</p>
            </template>
            <template slot="accountId" slot-scope="data">
              <div
                class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center"
              >
                <p class="mb-2">rank #{{ data.item.rank }}</p>
                <Identicon
                  :key="data.item.accountId"
                  :value="data.item.accountId"
                  :size="40"
                  :theme="'polkadot'"
                />
                <nuxt-link
                  :to="{
                    name: 'account',
                    query: { accountId: data.item.accountId }
                  }"
                  title="Account details"
                >
                  <h4>{{ shortAddress(data.item.accountId) }}</h4>
                </nuxt-link>
                <p v-if="data.item.identity.display" class="mb-0">
                  {{ data.item.identity.display }}
                </p>
                <table class="table table-striped mt-4">
                  <tbody>
                    <tr>
                      <td class="text-left">
                        <strong>Free Balance</strong>
                      </td>
                      <td class="text-right">
                        {{ formatAmount(data.item.freeBalance) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-left">
                        <strong>Available Balance</strong>
                      </td>
                      <td class="text-right">
                        {{ formatAmount(data.item.availableBalance) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-left">
                        <strong>Locked Balance</strong>
                      </td>
                      <td class="text-right">
                        {{ formatAmount(data.item.lockedBalance) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
                <Identicon
                  :key="data.item.accountId"
                  :value="data.item.accountId"
                  :size="20"
                  :theme="'polkadot'"
                />
                <nuxt-link
                  :to="{
                    name: 'account',
                    query: { accountId: data.item.accountId }
                  }"
                  title="Account details"
                >
                  {{ shortAddress(data.item.accountId) }}
                </nuxt-link>
              </div>
            </template>
            <template slot="identity" slot-scope="data">
              {{ data.item.identity.display }}
            </template>
            <template slot="freeBalance" slot-scope="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.freeBalance) }}
              </p>
            </template>
            <template slot="lockedBalance" slot-scope="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.lockedBalance) }}
              </p>
            </template>
            <template slot="availableBalance" slot-scope="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.availableBalance) }}
              </p>
            </template>
            <template slot="favorite" slot-scope="data">
              <p class="text-center mb-0">
                <a
                  class="favorite"
                  @click="toggleFavorite(data.item.accountId)"
                >
                  <i
                    v-if="data.item.favorite"
                    v-b-tooltip.hover
                    class="fas fa-star"
                    style="color: #f1bd23"
                    title="Remove from Favorites"
                  />
                  <i
                    v-else
                    v-b-tooltip.hover
                    class="fas fa-star"
                    style="color: #e6dfdf;"
                    title="Add to Favorites"
                  />
                </a>
              </p>
            </template>
          </b-table>
          <div style="display: flex">
            <b-pagination
              v-model="currentPage"
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
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import axios from "axios";
import bootstrap from "bootstrap";
import Identicon from "../components/identicon.vue";
import commonMixin from "../mixins/commonMixin.js";
import { numItemsTableOptions } from "../polkastats.config.js";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      tableOptions: numItemsTableOptions,
      perPage: localStorage.numItemsTableSelected
        ? localStorage.numItemsTableSelected
        : 10,
      currentPage: 1,
      sortBy: `favorite`,
      sortDesc: true,
      filter: null,
      filterOn: [],
      totalRows: 1,
      fields: [
        {
          key: "rank",
          label: "Rank",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        { key: "accountId", label: "Account", sortable: true },
        {
          key: "identity",
          label: "Identity",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "freeBalance",
          label: "Total balance",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "lockedBalance",
          label: "Locked balance",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "availableBalance",
          label: "Available balance",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "favorite",
          label: "⭐",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        }
      ],
      favorites: [],
      polling: null
    };
  },
  computed: {
    accounts() {
      let accounts = [];
      for (let i = 0; i < this.$store.state.accounts.list.length; i++) {
        let account = this.$store.state.accounts.list[i];
        const accountIndex = account.accountIndex;

        accounts.push({
          ...account,
          accountIndex,
          favorite: this.isFavorite(account.accountId)
        });
      }
      return accounts;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  watch: {
    favorites: function(val) {
      this.$cookies.set("favorites", val, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      });
    }
  },
  created: async function() {
    var vm = this;

    // Get favorites from cookie
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }

    // Force update of account list if empty
    if (this.$store.state.accounts.list.length === 0) {
      await vm.$store.dispatch("accounts/update");
    }
    this.totalRows = this.$store.state.accounts.list.length;

    // Update data every 5 minutes
    this.polling = setInterval(() => {
      vm.$store.dispatch("accounts/update");
      if (!this.filter) this.totalRows = this.$store.state.accounts.list.length;
    }, 300000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
  },
  methods: {
    handleNumFields(num) {
      this.perPage = num;
    },
    toggleFavorite(validator) {
      // Receives validator accountId
      if (this.isFavorite(validator)) {
        this.favorites.splice(validator, 1);
      } else {
        this.favorites.push(validator);
      }
      return true;
    },
    isFavorite(validator) {
      // Receives accountId
      return this.favorites.includes(validator);
    },
    getIndex(validator) {
      // Receives accountId
      return this.favorites.indexOf(validator);
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  head() {
    return {
      title: "PolkaStats - Polkadot Kusama active accounts",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Polkadot Kusama active accounts"
        }
      ]
    };
  }
};
</script>
<style>
#accounts-table th {
  text-align: center;
}
.page-accounts .identicon {
  display: inline-block;
}

.page-accounts td div {
  padding: 0 !important;
}
.btn-group {
  margin-bottom: 1rem;
  display: inline-flex;
}
.btn-secondary {
  font-size: 0.8rem;
}
</style>

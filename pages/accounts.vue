<template>
  <div>
    <section>
      <b-container class="page-accounts main pt-4">
        <h1 class="text-center mb-4">
          {{ $t("pages.accounts.active_accounts") }}
        </h1>
        <!-- Filter -->
        <b-row>
          <b-col lg="12" class="mb-4">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              :placeholder="$t('pages.accounts.search_placeholder')"
            />
          </b-col>
        </b-row>
        <!-- Mobile sorting -->
        <div class="row d-block d-sm-block d-md-block d-lg-none d-xl-none">
          <b-col lg="6" class="my-1">
            <b-form-group
              :label="$t('pages.accounts.sort')"
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
        <div v-if="!busy">
          <b-alert
            show
            dismissible
            variant="primary"
            class="text-center"
            data-testid="serverAlert"
          >
            <div>{{ $t("pages.accounts.loading_data") }}</div>
          </b-alert>
        </div>
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
            :busy="busy"
            @filtered="onFiltered"
          >
            <template v-slot:cell(rank)="data">
              <p class="text-right mb-0">#{{ data.item.rank }}</p>
            </template>
            <template v-slot:cell(accountId)="data">
              <div
                class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center"
              >
                <p class="mb-2">
                  {{ $t("pages.accounts.rank") }} #{{ data.item.rank }}
                </p>
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
                  :title="$t('pages.accounts.account_details')"
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
                        <strong>{{ $t("pages.accounts.free_balance") }}</strong>
                      </td>
                      <td class="text-right">
                        {{ formatAmount(data.item.freeBalance) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-left">
                        <strong>{{
                          $t("pages.accounts.available_balance")
                        }}</strong>
                      </td>
                      <td class="text-right">
                        {{ formatAmount(data.item.availableBalance) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-left">
                        <strong>{{
                          $t("pages.accounts.locked_balance")
                        }}</strong>
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
                  :title="$t('pages.accounts.account_details')"
                >
                  {{ shortAddress(data.item.accountId) }}
                </nuxt-link>
              </div>
            </template>
            <template v-slot:cell(identity)="data">
              <span v-if="data.item.parentIdentity && data.item.identity">
                {{ data.item.parentIdentity }} / {{ data.item.identity }}
              </span>
              <span v-else>
                {{ data.item.identity }}
              </span>
            </template>
            <template v-slot:cell(freeBalance)="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.freeBalance) }}
              </p>
            </template>
            <template v-slot:cell(lockedBalance)="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.lockedBalance) }}
              </p>
            </template>
            <template v-slot:cell(availableBalance)="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.availableBalance) }}
              </p>
            </template>
            <template v-slot:cell(favorite)="data">
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
                    :title="$t('pages.accounts.remove_from_favorites')"
                  />
                  <i
                    v-else
                    v-b-tooltip.hover
                    class="fas fa-star"
                    style="color: #e6dfdf;"
                    :title="$t('pages.accounts.add_to_favorites')"
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
      busy: false,
      tableOptions: numItemsTableOptions,
      perPage: localStorage.numItemsTableSelected
        ? parseInt(localStorage.numItemsTableSelected)
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
          label: this.$t("pages.accounts.rank"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        { key: "accountId", label: "Account", sortable: true },
        {
          key: "identity",
          label: this.$t("pages.accounts.identity"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "freeBalance",
          label: this.$t("pages.accounts.free_balance"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "lockedBalance",
          label: this.$t("pages.accounts.locked_balance"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "availableBalance",
          label: this.$t("pages.accounts.available_balance"),
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
      return this.$store.state.accounts.list.map(account => {
        return {
          ...account,
          favorite: this.isFavorite(account.accountId)
        };
      });
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
      this.perPage = parseInt(num);
    },
    toggleFavorite(accountId) {
      if (this.favorites.indexOf(accountId) !== -1) {
        this.favorites.splice(this.favorites.indexOf(accountId), 1);
      } else {
        this.favorites.push(accountId);
      }
      return true;
    },
    isFavorite(accountId) {
      return this.favorites.includes(accountId);
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    setDataLoaded() {
      this.busy = true;
    }
  },
  head() {
    return {
      title: this.$t("pages.accounts.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.accounts.head_content")
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
table.b-table[aria-busy="true"] {
  opacity: 1;
}
</style>

<template>
  <div>
    <section>
      <b-container class="main py-5">
        <h1 class="mb-4">
          {{ $t("pages.nominators.title") }}
        </h1>
        <!-- Filter -->
        <b-row>
          <b-col lg="12" class="mb-4">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              :placeholder="$t('pages.nominators.search_placeholder')"
            />
          </b-col>
        </b-row>
        <!-- Mobile sorting -->
        <div class="row d-block d-sm-block d-md-none d-lg-none d-xl-none">
          <b-col lg="6" class="my-1">
            <b-form-group
              :label="$t('pages.nominators.sort')"
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
        <JsonCSV
          :data="nominatorsJSON"
          class="download-csv mb-2"
          name="polkastats.io_polkadot_nominators.csv"
        >
          <i class="fas fa-file-csv"></i>
          {{ $t("pages.accounts.download_csv") }}
        </JsonCSV>
        <!-- Table with sorting and pagination-->
        <div class="table-responsive">
          <b-table
            id="nominators-table"
            striped
            stacked="md"
            :fields="fields"
            :items="nominators"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered"
          >
            <template v-slot:cell(rank)="data">
              {{ data.item.rank }}
            </template>
            <template v-slot:cell(account_id)="data">
              <div
                class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center"
              >
                <template>
                  <b-container>
                    <b-row class="nominator-row">
                      <b-col cols="6" class="column">
                        <div>
                          <Identicon
                            :key="data.item.account_id"
                            :value="data.item.account_id"
                            :size="48"
                            :theme="'polkadot'"
                          />
                        </div>
                        <div>
                          <nuxt-link
                            :to="{
                              name: 'nominator',
                              query: { accountId: data.item.account_id }
                            }"
                            :title="$t('pages.nominators.nominator_details')"
                          >
                            <span v-if="data.item.display_name">
                              {{ data.item.display_name }}
                            </span>
                            <span v-else>
                              <span
                                class="d-inline d-sm-inline d-md-inline d-lg-inline d-xl-none"
                                >{{ shortAddress(data.item.account_id) }}</span
                              >
                              <span
                                class="d-none d-sm-none d-md-none d-lg-none d-xl-inline"
                                >{{ shortAddress(data.item.account_id) }}</span
                              >
                            </span>
                          </nuxt-link>
                        </div>
                      </b-col>
                      <b-col cols="6" class="column">
                        <div>
                          <p class="mt-2 mb-2">rank #{{ data.item.rank }}</p>
                        </div>
                        <div>
                          <p class="mb-0">
                            {{ $t("pages.nominators.total_stake") }}:
                          </p>
                        </div>
                        <div>
                          <p class="mb-0">
                            {{ formatAmount(data.item.total_staked) }}
                          </p>
                        </div>
                      </b-col>
                    </b-row>
                  </b-container>
                </template>
              </div>
              <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
                <Identicon
                  :key="data.item.account_id"
                  :value="data.item.account_id"
                  :size="20"
                  :theme="'polkadot'"
                />
                <nuxt-link
                  :to="{
                    name: 'nominator',
                    query: { accountId: data.item.account_id }
                  }"
                  :title="$t('pages.nominators.nominator_details')"
                >
                  <span v-if="data.item.display_name">
                    {{ data.item.display_name }}
                  </span>
                  <span v-else>
                    <span
                      class="d-inline d-sm-inline d-md-inline d-lg-inline d-xl-none"
                      >{{ shortAddress(data.item.account_id) }}</span
                    >
                    <span
                      class="d-none d-sm-none d-md-none d-lg-none d-xl-inline"
                      >{{ shortAddress(data.item.account_id) }}</span
                    >
                  </span>
                </nuxt-link>
              </div>
            </template>
            <template v-slot:cell(controller_id)="data">
              <Identicon
                :key="data.item.controller_id"
                :value="data.item.controller_id"
                :size="20"
                :theme="'polkadot'"
              />
              <nuxt-link
                :to="{
                  name: 'account',
                  query: { accountId: data.item.controller_id }
                }"
                :title="$t('pages.nominators.controller_details')"
              >
                {{ shortAddress(data.item.controller_id) }}
              </nuxt-link>
            </template>
            <template v-slot:cell(num_targets)="data">
              <p class="text-right mb-0">
                {{ data.item.num_targets }}
              </p>
            </template>
            <template v-slot:cell(total_staked)="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.total_staked) }}
              </p>
            </template>
            <template v-slot:cell(favorite)="data">
              <p class="text-center mb-0">
                <a
                  class="favorite"
                  @click="toggleFavorite(data.item.account_id)"
                >
                  <i
                    v-if="data.item.favorite"
                    v-b-tooltip.hover
                    class="fas fa-star"
                    style="color: #f1bd23"
                    :title="$t('pages.nominators.remove_from_favorites')"
                  />
                  <i
                    v-else
                    v-b-tooltip.hover
                    class="fas fa-star"
                    style="color: #e6dfdf;"
                    :title="$t('pages.nominators.add_to_favorites')"
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
import gql from "graphql-tag";
import Identicon from "../components/identicon.vue";
import { paginationOptions, network } from "../polkastats.config.js";
import commonMixin from "../mixins/commonMixin.js";
import JsonCSV from "vue-json-csv";

export default {
  components: {
    Identicon,
    JsonCSV
  },
  mixins: [commonMixin],
  data: function() {
    return {
      currentSessionIndex: 0,
      nominators: [],
      tableOptions: paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
        : 10,
      currentPage: 1,
      sortBy: "favorite",
      sortDesc: true,
      filter: null,
      filterOn: [],
      totalRows: 1,
      fields: [
        {
          key: "rank",
          label: this.$t("pages.nominators.rank"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "account_id",
          label: this.$t("pages.nominators.nominator"),
          sortable: true
        },
        {
          key: "controller_id",
          label: this.$t("pages.nominators.controller"),
          sortable: true
        },
        {
          key: "num_targets",
          label: this.$t("pages.nominators.nominations"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "total_staked",
          label: this.$t("pages.nominators.total_stake"),
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
      favorites: []
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },
    nominatorsJSON() {
      return this.nominators.map(nominator => {
        return {
          rank: nominator.rank,
          name: nominator.display_name,
          stash_account: nominator.stash_id,
          controller_account: nominator.controller_id,
          num_targets: JSON.parse(nominator.targets).length,
          targets: JSON.parse(nominator.targets).map(
            target => target.validator
          ),
          total_staked: nominator.total_staked,
          free_balance: nominator.free_balance,
          locked_balance: nominator.locked_balance,
          nonce: nominator.nonce
        };
      });
    }
  },
  watch: {
    favorites: function(favorites) {
      this.$cookies.set("favorites", favorites, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      });
    }
  },
  created: function() {
    // Get favorites from cookie
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }
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
      this.nominators = this.nominators.map(nominator => {
        if (nominator.account_id === accountId) {
          nominator.favorite = !nominator.favorite;
        }
        return nominator;
      });
      return true;
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
      nominators: {
        query: gql`
          subscription nominator($session_index: Int!) {
            nominator(
              order_by: { rank: asc }
              where: { session_index: { _eq: $session_index } }
            ) {
              account_id
              available_balance
              balances
              block_height
              controller_id
              display_name
              free_balance
              identity
              locked_balance
              nonce
              rank
              stash_id
              targets
              timestamp
              total_staked
            }
          }
        `,
        variables() {
          return {
            session_index: this.currentSessionIndex
          };
        },
        skip() {
          return !this.currentSessionIndex;
        },
        result({ data }) {
          this.totalRows = data.nominator.length;
          this.nominators = data.nominator.map(nominator => {
            return {
              ...nominator,
              num_targets: JSON.parse(nominator.targets).length,
              favorite: this.isFavorite(nominator.account_id)
            };
          });
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
  },
  head() {
    return {
      title: this.$t("pages.nominators.head_title", {
        networkName: network.name
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.nominators.head_content", {
            networkName: network.name
          })
        }
      ]
    };
  }
};
</script>
<style>
#nominators-table {
  margin-bottom: 1rem;
}
#nominators-table .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
#nominators-table .identicon div {
  display: inline;
}
.btn-group {
  margin-bottom: 1rem;
  display: inline-flex;
}
.btn-secondary {
  font-size: 0.8rem;
}
@media (max-width: 765px) {
  #nominators-table {
    background-color: transparent;
  }
  .nominator-row {
    border: 1px solid #bbb;
    border-radius: 0.3rem;
    text-align: center;
    padding: 0.5rem;
    margin-bottom: 0.3rem;
    background-color: white;
    display: flex;
    flex: 1;
  }
  .column {
    flex: 1;
    flex-direction: column;
    justify-content: center;
  }
}
</style>

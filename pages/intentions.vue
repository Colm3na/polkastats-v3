<template>
  <div>
    <section>
      <b-container class="main py-5 page-intentions">
        <!-- Filter -->
        <b-row>
          <b-col lg="12" class="mb-4">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              :placeholder="$t('pages.intentions.search_placeholder')"
            />
          </b-col>
        </b-row>
        <!-- Mobile sorting -->
        <div class="row d-block d-sm-block d-md-block d-lg-none d-xl-none">
          <b-col lg="6" class="my-1">
            <b-form-group
              :label="$t('pages.intentions.sort')"
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
          :data="intentionsJSON"
          class="download-csv mb-2"
          name="polkastats.io_polkadot_intentions.csv"
        >
          <i class="fas fa-file-csv"></i>
          {{ $t("pages.accounts.download_csv") }}
        </JsonCSV>
        <!-- Table with sorting and pagination-->
        <div class="table-responsive">
          <b-table
            id="intentions-table"
            stacked="md"
            head-variant="dark"
            :fields="fields"
            :items="intentions"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered"
          >
            <template v-slot:cell(rank)="data">
              <p class="text-right mb-0">
                {{ data.item.rank }}
              </p>
            </template>
            <template v-slot:cell(accountId)="data">
              <div
                class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center"
              >
                <template>
                  <b-row class="intention-row">
                    <b-col cols="6">
                      <div>
                        <Identicon
                          :key="data.item.account_id"
                          :value="data.item.account_id"
                          :size="48"
                          :theme="'polkadot'"
                        />
                      </div>
                      <nuxt-link
                        :to="{
                          name: 'intention',
                          query: { accountId: data.item.account_id }
                        }"
                        :title="$t('pages.intentions.intention_details')"
                      >
                        <h4 v-if="data.item.display_name" class="mt-2 mb-2">
                          {{ data.item.display_name }}
                        </h4>
                        <h4 v-else class="mt-2 mb-2">
                          <span
                            class="d-inline d-sm-inline d-md-inline d-lg-inline d-xl-none"
                            >{{ shortAddress(data.item.account_id) }}</span
                          >
                          <span
                            class="d-none d-sm-none d-md-none d-lg-none d-xl-inline"
                            >{{ shortAddress(data.item.account_id) }}</span
                          >
                        </h4>
                      </nuxt-link>
                    </b-col>
                    <b-col cols="6">
                      <p class="mb-0 rank">rank #{{ data.item.rank }}</p>
                      <div v-if="data.item.staking_ledger_total">
                        <p
                          v-b-tooltip.hover
                          class="bonded mb-0"
                          :title="$t('pages.intentions.active_bonded')"
                        >
                          {{ formatAmount(data.item.staking_ledger_total) }}
                        </p>
                      </div>
                      <div v-if="data.item.staking_ledger_total">
                        <p class="mb-0">
                          <small>
                            <span
                              v-b-tooltip.hover
                              :title="$t('pages.intentions.total_bonded')"
                            >
                              {{ $t("pages.intentions.total_stake") }}:
                              {{ formatAmount(data.item.staking_ledger_total) }}
                            </span>
                          </small>
                        </p>
                      </div>
                    </b-col>
                  </b-row>
                </template>
              </div>
              <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
                <span v-if="data.item.next_elected" class="circle blue">
                  <i class="fa fa-chevron-right mr-1" aria-hidden="true"></i>
                </span>
                <div class="d-inline-block">
                  <Identicon
                    :key="data.item.account_id"
                    :value="data.item.account_id"
                    :size="20"
                    :theme="'polkadot'"
                  />
                </div>
                <nuxt-link
                  :to="{
                    name: 'intention',
                    query: { accountId: data.item.account_id }
                  }"
                  :title="$t('pages.intentions.intention_details')"
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
            <template v-slot:cell(staking_ledger_total)="data">
              <div v-if="data.item.staking_ledger_total">
                <p class="text-right mb-0">
                  {{ formatAmount(data.item.staking_ledger_total) }}
                </p>
              </div>
            </template>
            <template v-slot:cell(num_stakers)="data">
              <p class="text-right mb-0">
                {{ data.item.num_stakers }}
              </p>
            </template>
            <template v-slot:cell(commission)="data">
              <div v-if="data.item.commission">
                <p class="text-right mb-0">
                  {{ (data.item.commission / 10000000).toFixed(2) }}%
                </p>
              </div>
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
                    :title="$t('pages.intentions.remove_from_favorites')"
                  />
                  <i
                    v-else
                    v-b-tooltip.hover
                    class="fas fa-star"
                    style="color: #e6dfdf;"
                    :title="$t('pages.intentions.add_to_favorites')"
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
      intentions: [],
      tableOptions: paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
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
          label: "#",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        { key: "accountId", label: "Intention", sortable: true },
        {
          key: "staking_ledger_total",
          label: this.$t("pages.intentions.total_stake"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "num_stakers",
          label: this.$t("pages.intentions.stakers"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "commission",
          label: this.$t("pages.intentions.commission"),
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
    intentionsJSON() {
      return this.intentions.map(intention => {
        return {
          rank: intention.rank,
          name: intention.display_name,
          stash_account: intention.account_id,
          commission_percent: (
            parseInt(intention.commission) / 10000000
          ).toFixed(2),
          self_stake: intention.staking_ledger_total,
          stakers: intention.stakers,
          num_stakers: intention.num_stakers
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
      localStorage.paginationOptions = num;
      this.perPage = parseInt(num);
    },
    toggleFavorite(accountId) {
      if (this.favorites.indexOf(accountId) !== -1) {
        this.favorites.splice(this.favorites.indexOf(accountId), 1);
      } else {
        this.favorites.push(accountId);
      }
      this.intentions = this.intentions.map(intention => {
        if (intention.account_id === accountId) {
          intention.favorite = !intention.favorite;
        }
        return intention;
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
      intentions: {
        query: gql`
          subscription intention($session_index: Int!) {
            intention(
              order_by: { rank: asc }
              where: { session_index: { _eq: $session_index } }
            ) {
              account_id
              stash_id
              commission
              next_elected
              display_name
              staking_ledger_total
              rank
              stakers
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
          this.totalRows = data.intention.length;
          this.intentions = data.intention.map(intention => {
            return {
              ...intention,
              num_stakers: JSON.parse(intention.stakers).length,
              favorite: this.isFavorite(intention.account_id)
            };
          });
        }
      },
      sessionIndex: {
        query: gql`
          subscription intention {
            intention(order_by: { session_index: desc }, where: {}, limit: 1) {
              session_index
            }
          }
        `,
        result({ data }) {
          if (data.intention[0].session_index > this.currentSessionIndex) {
            this.currentSessionIndex = data.intention[0].session_index;
          }
        }
      }
    }
  },
  head() {
    return {
      title: this.$t("pages.intentions.head_title", {
        networkName: network.name
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.intentions.head_content", {
            networkName: network.name
          })
        }
      ]
    };
  }
};
</script>
<style>
body {
  font-size: 0.9rem;
}
.page-intentions
  .table.b-table.b-table-stacked-md
  > tbody
  > tr
  > [data-label]
  > div {
  padding: 0;
}
.page-intentions .favorite {
  font-size: 1.1rem;
}
.validator .bg-offline {
  background-color: rgba(239, 57, 74, 0.12) !important;
}
.validator .bg-candidate {
  background-color: rgba(21, 240, 86, 0.12) !important;
}
.rank {
  font-size: 1.6rem;
  color: #7d7378;
}
.account {
  color: #670d35;
}
.bonded {
  color: #d75ea1;
  font-weight: 700;
  font-size: 1.3rem;
}
[data-toggle="collapse"] .fas:before {
  content: "\f078";
}
[data-toggle="collapse"][aria-expanded="false"] .fas:before {
  content: "\f054";
}
.nominators {
  color: #670d35;
}
.nominator {
  font-size: 0.9rem;
}
.nominator .value {
  color: #d75ea1;
  font-weight: 700;
}
.fee,
.unstake {
  color: #d75ea1;
  font-weight: 700;
}
.block {
  color: #d75ea1;
  font-weight: bold;
}
.block:hover {
  color: #d75ea1;
}
.tab-content .validator:nth-child(1) {
  border-top: 0;
}
.fas.fa-copy {
  cursor: pointer;
  color: #d75ea1;
  font-size: 0.9rem;
  margin-left: 0.1rem;
}
#intentions-table {
  margin-bottom: 1rem;
}
#intentions-table th {
  text-align: center;
}
#intentions-table th:first-child {
  width: 8%;
}
#intentions-table th:nth-child(2) {
  width: 42%;
}
#intentions-table th:nth-child(3) {
  width: 20%;
}
#intentions-table th:nth-child(4) {
  width: 20%;
}
#intentions-table th:nth-child(5) {
  width: 10%;
}
#intentions-table .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
#intentions-table .identicon div {
  display: inline;
}
.page-item.active .page-link {
  z-index: 1;
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
}
.page-link {
  position: relative;
  display: block;
  padding: 0.5rem 0.75rem;
  margin-left: -1px;
  line-height: 1.25;
  color: #343a40;
  background-color: #fff;
  border: 1px solid #dee2e6;
}
.btn-group {
  margin-bottom: 1rem;
  display: inline-flex;
}
.btn-secondary {
  font-size: 0.8rem;
}
@media (max-width: 765px) {
  table.b-table.b-table-stacked-md > tbody > tr > [data-label] {
    display: block;
    grid-template-columns: inherit !important;
  }

  .table th,
  .table td {
    border-top: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
  .table tr {
    padding: 0 0.2rem;
  }
  #intentions-table {
    background-color: transparent;
  }
  .intention-row {
    border: 1px solid #bbb;
    border-radius: 0.3rem;
    text-align: center;
    padding: 0.5rem;
    margin-bottom: 0.3rem;
    background-color: white;
  }
  .identity-column {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>

<template>
  <div>
    <section>
      <b-container class="main pt-4 page-intentions">
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
                      <div v-if="data.item.identity && data.item.identity.logo">
                        <img
                          :src="data.item.identity.logo"
                          class="identity mt-2"
                        />
                        <h4 class="mt-2 mb-2">
                          {{
                            data.item.identity.fullname ||
                              data.item.identity.display
                          }}
                        </h4>
                      </div>
                      <div v-else>
                        <Identicon
                          :key="data.item.accountId"
                          :value="data.item.accountId"
                          :size="48"
                          :theme="'polkadot'"
                        />
                      </div>
                      <nuxt-link
                        :to="{
                          name: 'intention',
                          query: { accountId: data.item.accountId }
                        }"
                        :title="$t('pages.intentions.intention_details')"
                      >
                        <h4 v-if="data.item.identity" class="mt-2 mb-2">
                          {{
                            data.item.identity.fullname ||
                              data.item.identity.display
                          }}
                        </h4>
                        <h4 v-else class="mt-2 mb-2">
                          <span
                            class="d-inline d-sm-inline d-md-inline d-lg-inline d-xl-none"
                            >{{ shortAddress(data.item.accountId) }}</span
                          >
                          <span
                            class="d-none d-sm-none d-md-none d-lg-none d-xl-inline"
                            >{{ shortAddress(data.item.accountId) }}</span
                          >
                        </h4>
                      </nuxt-link>
                    </b-col>
                    <b-col cols="6">
                      <p class="mb-0 rank">rank #{{ data.item.rank }}</p>
                      <div v-if="data.item.activeStake">
                        <p
                          v-b-tooltip.hover
                          class="bonded mb-0"
                          :title="$t('pages.intentions.active_bonded')"
                        >
                          {{ formatAmount(data.item.activeStake) }}
                        </p>
                      </div>
                      <div v-if="data.item.totalStake">
                        <p class="mb-0">
                          <small>
                            <span
                              v-b-tooltip.hover
                              :title="$t('pages.intentions.total_bonded')"
                            >
                              {{ $t("pages.intentions.total_stake") }}:
                              {{ formatAmount(data.item.totalStake) }}
                            </span>
                          </small>
                        </p>
                      </div>
                    </b-col>
                  </b-row>
                </template>
              </div>
              <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
                <div
                  v-if="data.item.identity && data.item.identity.logo"
                  class="d-inline-block"
                >
                  <img
                    :src="data.item.identity.logo"
                    class="identity-small d-inline-block"
                  />
                </div>
                <div v-else class="d-inline-block">
                  <Identicon
                    :key="data.item.accountId"
                    :value="data.item.accountId"
                    :size="20"
                    :theme="'polkadot'"
                  />
                </div>
                <nuxt-link
                  :to="{
                    name: 'intention',
                    query: { accountId: data.item.accountId }
                  }"
                  :title="$t('pages.intentions.intention_details')"
                >
                  <span v-if="data.item.identity !== null">
                    {{
                      data.item.identity.fullname || data.item.identity.display
                    }}
                  </span>
                  <span v-else>
                    <span
                      class="d-inline d-sm-inline d-md-inline d-lg-inline d-xl-none"
                      >{{ shortAddress(data.item.accountId) }}</span
                    >
                    <span
                      class="d-none d-sm-none d-md-none d-lg-none d-xl-inline"
                      >{{ shortAddress(data.item.accountId) }}</span
                    >
                  </span>
                </nuxt-link>
              </div>
            </template>
            <template v-slot:cell(totalStake)="data">
              <div v-if="data.item.totalStake">
                <p class="text-right mb-0">
                  {{ formatAmount(data.item.totalStake) }}
                </p>
              </div>
            </template>
            <template v-slot:cell(commission)="data">
              <div v-if="typeof data.item.commission == 'number'">
                <p class="text-right mb-0">
                  {{ (data.item.commission / 10000000).toFixed(2) }}%
                </p>
              </div>
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
import { mapMutations } from "vuex";
import gql from "graphql-tag";
import * as R from "ramda";
import Identicon from "../components/identicon.vue";
import { isHex } from "@polkadot/util";
import BN from "bn.js";
import { blockExplorer, numItemsTableOptions } from "../polkastats.config.js";
import commonMixin from "../mixins/commonMixin.js";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      intentions: [],
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
          label: "#",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        { key: "accountId", label: "Intention", sortable: true },
        {
          key: "totalStake",
          label: this.$t("pages.intentions.total_stake"),
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
      blockExplorer,
      favorites: [],
      polling: null
    };
  },
  computed: {
    network() {
      return this.$store.state.network.info;
    },
    identities() {
      return this.$store.state.identities.list;
    },
    totalStakeBonded() {
      return this.$store.state.validators.totalStakeBonded;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },
    identitiesLoaded() {
      return this.$store.state.identities.dataLoaded;
    },
    kusamaIdentitiesLoaded() {
      return this.$store.state.stakingIdentities.dataLoaded;
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
    var vm = this;

    // Get favorites from cookie
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }

    // Force update of network info
    vm.$store.dispatch("network/update");

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length == 0) {
      vm.$store.dispatch("identities/update");
    }

    // Force update of staking identities list if empty
    if (this.$store.state.stakingIdentities.list.length === 0) {
      vm.$store.dispatch("stakingIdentities/update");
    }

    // Update network info and intention validators every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("network/update");
      vm.$store.dispatch("intentions/update");
    }, 10000);
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
      this.intentions = this.intentions.map(intention => {
        if (intention.accountId === accountId) {
          intention.favorite = !intention.favorite;
        }
        return intention;
      });
      return true;
    },
    isFavorite(accountId) {
      return this.favorites.includes(accountId);
    },
    getRank(validator) {
      // Receives validator accountId
      for (var i = 0; i < this.validators.length; i++) {
        if (this.validators[i].accountId == validator) {
          return i + 1;
        }
      }
      return false;
    },
    hasIdentity(stashId) {
      return this.$store.state.identities.list.some(obj => {
        return obj.stashId === stashId;
      });
    },
    getIdentity(stashId) {
      let filteredArray = this.$store.state.identities.list.filter(obj => {
        return obj.stashId === stashId;
      });
      return filteredArray[0];
    },
    hasKusamaIdentity(stashId) {
      return this.$store.state.stakingIdentities.list.some(obj => {
        return obj.accountId === stashId;
      });
    },
    getKusamaIdentity(stashId) {
      let filteredArray = this.$store.state.stakingIdentities.list.filter(
        obj => {
          return obj.accountId === stashId;
        }
      );
      return filteredArray[0] ? filteredArray[0].identity : null;
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
          subscription intentions {
            intention_staking(order_by: { timestamp: desc }) {
              timestamp
              session_index
              json
              block_number
            }
          }
        `,
        result({ data }) {
          const { intention_staking } = data;
          const intentions = JSON.parse(intention_staking[0].json);
          intentions.sort((a, b) =>
            a.stakingLedger.total < b.stakingLedger.total ? 1 : -1
          );
          let rank = 0;

          const transformations = intention => {
            let identity = this.getIdentity(intention.accountId);
            if (identity !== [] && typeof identity !== "undefined") {
              intention.identity = identity.identity;
            } else {
              let kusamaIdentity = this.getKusamaIdentity(intention.accountId);
              if (kusamaIdentity) {
                intention.identity = kusamaIdentity;
              } else {
                intention.identity = null;
              }
            }

            intention.rank = rank + 1;
            intention.totalStake = intention.stakingLedger.total;
            intention.activeStake = intention.stakingLedger.active;
            intention.commission = intention.validatorPrefs.commission;
            intention.favorite = this.isFavorite(intention.accountId);
            rank++;
          };

          R.mapObjIndexed(transformations, intentions);

          this.intentions = intentions;
          this.totalRows = this.intentions.length;
        },
        skip() {
          if (!this.identitiesLoaded) {
            this.$store.dispatch("identities/update");
            return true;
          }
          if (!this.kusamaIdentitiesLoaded) {
            this.$store.dispatch("stakingIdentities/update");
            return true;
          }
          return false;
        }
      }
    }
  },
  head() {
    return {
      title: "PolkaStats -  Polkadot Kusama intention validators",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Polkadot Kusama intention validators"
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
/* .identity {
  max-width: 80px;
} */
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

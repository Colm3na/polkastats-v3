<template>
  <div>
    <section>
      <b-container class="main pt-4">
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
        <!-- Table with sorting and pagination-->
        <div class="table-responsive">
          <b-table
            id="nominators-table"
            stacked="md"
            head-variant="dark"
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
            <template slot="rank" slot-scope="data">
              {{ data.item.rank }}
            </template>
            <template slot="accountId" slot-scope="data">
              <div
                class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center w-100"
              >
                <template>
                  <b-container class="nominators w-100 pr-0;">
                    <b-row class="nominator-row w-100">
                      <div class="rank w-100">
                        <span class="rank-number">{{ data.item.rank }}</span>
                      </div>
                      <div style="flex: 8" class="w-100">
                        <Identicon
                          :key="data.item.accountId"
                          :value="data.item.accountId"
                          :size="24"
                          :theme="'polkadot'"
                        />
                        <nuxt-link
                          :to="{
                            name: 'nominator',
                            query: { accountId: data.item.accountId }
                          }"
                          :title="$t('pages.nominators.nominator_details')"
                        >
                          <span v-if="data.item.identity">
                            {{
                              data.item.identity.display ||
                                data.item.identity.display
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
                        <div>
                          <span class="mb-0">
                            {{ $t("pages.nominators.total_stake") }}:
                            {{ formatAmount(data.item.totalStake) }}
                          </span>
                        </div>
                      </div>
                      <div class="favorites w-100">
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
                              :title="
                                $t('pages.validators.remove_from_favorites')
                              "
                            />
                            <i
                              v-else
                              v-b-tooltip.hover
                              class="fas fa-star"
                              style="color: #e6dfdf;"
                              :title="$t('pages.validators.add_to_favorites')"
                            />
                          </a>
                        </p>
                      </div>
                    </b-row>
                  </b-container>
                </template>
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
                    name: 'nominator',
                    query: { accountId: data.item.accountId }
                  }"
                  :title="$t('pages.nominators.nominator_details')"
                >
                  <span v-if="data.item.identity">
                    {{
                      data.item.identity.display || data.item.identity.display
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
            <template slot="nominations" slot-scope="data">
              <p class="text-right mb-0">
                {{ data.item.nominations }}
              </p>
            </template>
            <template slot="totalStake" slot-scope="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.totalStake) }}
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
import { mapMutations } from "vuex";
import gql from "graphql-tag";
import * as R from "ramda";
import Identicon from "../components/identicon.vue";
import Network from "../components/network.vue";
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
      nominators: [],
      blockExplorer,
      polling: null,
      tableOptions: numItemsTableOptions,
      perPage: localStorage.numItemsTableSelected
        ? parseInt(localStorage.numItemsTableSelected)
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
          key: "accountId",
          label: this.$t("pages.nominators.nominator"),
          sortable: true
        },
        {
          key: "nominations",
          label: this.$t("pages.nominators.nominations"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "totalStake",
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
    identities() {
      return this.$store.state.identities.list;
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
        if (nominator.accountId === accountId) {
          nominator.favorite = !nominator.favorite;
        }
        return nominator;
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
        return obj.accountId === stashId;
      });
      return filteredArray[0];
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
      validators: {
        query: gql`
          subscription validator_staking {
            validator_staking(limit: 1, order_by: { timestamp: desc }) {
              json
            }
          }
        `,
        result({ data }) {
          const { validator_staking } = data;
          const validators = JSON.parse(validator_staking[0].json);
          validators.sort((a, b) => {
            let stakeA = 0;
            let stakeB = 0;

            if (a.stakers && b.stakers) {
              if (a.stakers.total > 0) {
                stakeA = a.stakers.total;
              } else {
                stakeA = a.stakingLedger.total;
              }
              if (b.stakers.total > 0) {
                stakeB = b.stakers.total;
              } else {
                stakeB = b.stakingLedger.total;
              }
              return stakeA < stakeB ? 1 : -1;
            } else {
              return 1;
            }
          });
          let nominatorStaking = [];
          for (let i = 0; i < validators.length; i++) {
            let validator = validators[i];
            if (validator.exposure.others.length > 0) {
              for (let j = 0; j < validator.exposure.others.length; j++) {
                let nominator = validator.exposure.others[j];
                if (
                  nominatorStaking.find(nom => nom.accountId === nominator.who)
                ) {
                  let nominatorTmp = nominatorStaking.filter(nom => {
                    return nom.accountId === nominator.who;
                  });
                  let bn;
                  if (isHex(nominator.value)) {
                    bn = new BN(
                      nominator.value.substring(2, nominator.value.length),
                      16
                    );
                  } else {
                    bn = new BN(nominator.value.toString(), 10);
                  }
                  nominatorTmp[0].totalStake = nominatorTmp[0].totalStake.add(
                    bn
                  );
                  nominatorTmp[0].nominations++;
                  nominatorTmp[0].staking.push({
                    validator: validator.accountId,
                    amount: nominator.value
                  });
                } else {
                  let bn;
                  if (isHex(nominator.value)) {
                    bn = new BN(
                      nominator.value.substring(2, nominator.value.length),
                      16
                    );
                  } else {
                    bn = new BN(nominator.value.toString(), 10);
                  }

                  let identity = this.getIdentity(nominator.who);
                  if (identity !== [] && typeof identity !== "undefined") {
                    identity = identity.identity;
                  } else {
                    let kusamaIdentity = this.getKusamaIdentity(nominator.who);
                    if (kusamaIdentity) {
                      identity = kusamaIdentity;
                    } else {
                      identity = null;
                    }
                  }

                  nominatorStaking.push({
                    accountId: nominator.who,
                    identity,
                    totalStake: bn,
                    nominations: 1,
                    staking: [
                      {
                        validator: validator.accountId,
                        amount: nominator.value
                      }
                    ],
                    favorite: this.isFavorite(nominator.who)
                  });
                }
              }
            }
          }
          nominatorStaking.sort(function compare(a, b) {
            if (a.totalStake.lt(b.totalStake)) {
              return 1;
            }
            if (a.totalStake.gt(b.totalStake)) {
              return -1;
            }
            return 0;
          });
          nominatorStaking.map((nominator, index) => {
            nominator.rank = index + 1;
          });
          this.totalRows = nominatorStaking.length;
          this.nominators = nominatorStaking;
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
      title: "PolkaStats - Polkadot Kusama nominators",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Polkadot Kusama nominators"
        }
      ]
    };
  }
};
</script>
<style>
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
  /* .container {
    padding-right: 0;
  } */
  #nominators-table {
    background-color: transparent;
    margin-right: 0;
  }
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
  .nominator-row {
    border: 1px solid #bbb;
    border-radius: 0.3rem;
    text-align: center;
    padding: 0.5rem;
    margin-bottom: 0.3rem;
    background-color: white;
    display: flex;
    flex: 1;
    grid-template-columns: none;
  }
  .column {
    flex: 1;
    flex-direction: column;
    justify-content: center;
  }
  .rank,
  .favorites {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .rank-number {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #ef1073;
    border-radius: 50%;
    width: 35px;
    height: 35px;
  }
}
</style>

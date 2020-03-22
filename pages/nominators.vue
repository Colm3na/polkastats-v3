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
              placeholder="Search nominator by account, account index or identity display name"
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
                class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center"
              >
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
                  title="Nominator details"
                >
                  <span v-if="hasKusamaIdentity(data.item.accountId)">
                    {{ getKusamaIdentity(data.item.accountId).display }}
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
                <p class="mt-2 mb-2">rank #{{ data.item.rank }}</p>
                <p class="mb-0">
                  {{ formatAmount(data.item.totalStake) }}
                </p>
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
                  title="Nominator details"
                >
                  <span v-if="hasKusamaIdentity(data.item.accountId)">
                    {{ getKusamaIdentity(data.item.accountId).display }}
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
      blockExplorer,
      polling: null,
      tableOptions: numItemsTableOptions,
      perPage: localStorage.numItemsTableSelected
        ? localStorage.numItemsTableSelected
        : 10,
      currentPage: 1,
      sortBy: ``,
      sortDesc: false,
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
        { key: "accountId", label: "Nominator", sortable: true },
        {
          key: "nominations",
          label: "Nominations",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "totalStake",
          label: "Total stake",
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
    validators() {
      return this.$store.state.validators.list;
    },
    identities() {
      return this.$store.state.identities.list;
    },
    indexes() {
      return this.$store.state.indexes.list;
    },
    nominators() {
      let nominatorStaking = [];
      for (let i = 0; i < this.validators.length; i++) {
        let validator = this.validators[i];
        if (validator.exposure.others.length > 0) {
          for (let j = 0; j < validator.exposure.others.length; j++) {
            let nominator = validator.exposure.others[j];
            const accountIndex = this.indexes[nominator.who];
            if (nominatorStaking.find(nom => nom.accountId === nominator.who)) {
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
              nominatorTmp[0].totalStake = nominatorTmp[0].totalStake.add(bn);
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

              let kusamaIdentity = "";
              if (this.hasKusamaIdentity(nominator.who)) {
                kusamaIdentity = this.hasKusamaIdentity(nominator.who);
              }

              nominatorStaking.push({
                accountId: nominator.who,
                accountIndex,
                kusamaIdentity,
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
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.totalRows = nominatorStaking.length;
      return nominatorStaking;
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
      console.log(val);
      this.$cookies.set("favorites", val, {
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

    // Force update of validators list if empty
    if (this.$store.state.validators.list.length === 0) {
      vm.$store.dispatch("validators/update");
    }

    // Force update of indentities list if empty
    if (this.$store.state.identities.list.length === 0) {
      vm.$store.dispatch("identities/update");
    }

    // Force update of staking identities list if empty
    if (this.$store.state.stakingIdentities.list.length === 0) {
      vm.$store.dispatch("stakingIdentities/update");
    }

    // Force update of account indexes list if empty
    if (this.$store.state.indexes.list.length == 0) {
      vm.$store.dispatch("indexes/update");
    }

    // Update validators and staking identities every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("validators/update");
      vm.$store.dispatch("stakingIdentities/update");
    }, 10000);

    // Update PolkaStats identities and account indexes every 1 min
    this.pollingIndexes = setInterval(() => {
      vm.$store.dispatch("identities/update");
      vm.$store.dispatch("indexes/update");
    }, 60000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
    clearInterval(this.pollingIndexes);
  },
  methods: {
    handleNumFields(num) {
      this.perPage = num;
    },
    toggleFavorite(validator) {
      // Receives validator accountId
      if (this.isFavorite(validator)) {
        this.favorites.splice(this.getIndex(validator), 1);
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
      console.log(filteredArray[0]);
      return filteredArray[0].identity;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
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
</style>

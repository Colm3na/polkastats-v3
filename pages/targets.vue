<template>
  <b-container class="pt-4">
    <TargetInfo
      id="delegators_rewards"
      :button="$t('pages.targets.accordion-info.delegator_rewards')"
      :list="infoList"
    />
    <TargetInfo
      id="risks"
      :button="$t('pages.targets.accordion-info.risks')"
      :text="$t('pages.targets.accordion-info.risks_TEXT')"
    />
    <b-row class="pt-2 mb-1 ml-1 mr-1">
      <b-form-input
        id="filterInput"
        v-model="filter"
        type="search"
        :placeholder="$t('pages.targets.search_placeholder')"
      />
    </b-row>
    <div v-if="rewards === null || era === null" class="pt-4">
      <b-container class="w-100 loader">
        <div class="lds-ripple center">
          <div></div>
          <div></div>
        </div>
        <div>{{ $t("pages.targets.loading_data") }}</div>
      </b-container>
    </div>
    <div v-else class="pt-2">
      <b-container>
        <!-- <div class="row d-block d-sm-none d-md-block d-lg-block d-xl-block"> -->
        <div class="table-responsive">
          <b-table
            id="rewards-table"
            head-variant="dark"
            :fields="fields"
            :items="rewards"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered"
          >
            <template slot="stash_id" slot-scope="data">
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
                  :key="data.item.stash_id"
                  :value="data.item.stash_id"
                  :size="20"
                  :theme="'polkadot'"
                />
              </div>
              <nuxt-link
                :to="{
                  name: 'validator',
                  query: { accountId: data.item.stash_id }
                }"
                :title="$t('pages.validators.validator_details')"
              >
                <span v-if="data.item.identity !== null">
                  {{
                    data.item.identity.fullname || data.item.identity.display
                  }}
                </span>
                <span v-else>
                  <span
                    class="d-inline d-sm-inline d-md-inline d-lg-inline d-xl-none"
                    >{{ shortAddress(data.item.stash_id) }}</span
                  >
                  <span
                    class="d-none d-sm-none d-md-none d-lg-none d-xl-inline"
                    >{{ shortAddress(data.item.stash_id) }}</span
                  >
                </span>
              </nuxt-link>
            </template>
            <template slot="favorite" slot-scope="data">
              <p class="text-center mb-0">
                <a class="favorite" @click="toggleFavorite(data.item.stash_id)">
                  <i
                    v-if="data.item.favorite"
                    v-b-tooltip.hover
                    class="fas fa-star"
                    style="color: #f1bd23"
                    :title="$t('pages.targets.remove_from_favorites')"
                  />
                  <i
                    v-else
                    v-b-tooltip.hover
                    class="fas fa-star"
                    style="color: #e6dfdf;"
                    :title="$t('pages.targets.add_to_favorites')"
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
    </div>
  </b-container>
</template>

<script>
import gql from "graphql-tag";
import * as R from "ramda";
import commonMixin from "../mixins/commonMixin.js";
import BN from "bn.js";
import { isHex } from "@polkadot/util";
import { numItemsTableValidatorOptions } from "../polkastats.config.js";
import Identicon from "../components/identicon.vue";
import TargetInfo from "../components/accordion-info";

export default {
  components: { Identicon, TargetInfo },
  mixins: [commonMixin],
  data: function() {
    return {
      era: null,
      rewards: null,
      tableOptions: numItemsTableValidatorOptions,
      perPage: localStorage.numItemsTableSelected
        ? parseInt(localStorage.numItemsTableSelected)
        : 20,
      currentPage: 1,
      sortBy: `favorite`,
      sortDesc: true,
      totalRows: 1,
      favorites: [],
      filter: null,
      filterOn: [],
      filterField: null,
      fields: [
        {
          key: "stash_id",
          label: this.$t("pages.targets.validator"),
          sortable: true,
          filterByFormatted: true
        },
        {
          key: "commission",
          label: "% " + this.$t("pages.targets.commission"),
          sortable: true,
          class: `d-table-cell d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "stake_info.total",
          label: this.$t("pages.targets.total_stake"),
          sortable: false,
          class: `d-table-cell d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "stake_info.own",
          label: this.$t("pages.targets.own_stake"),
          sortable: false,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "stake_info.others_amount",
          label: this.$t("pages.targets.other_stake"),
          sortable: false,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "estimated_payout",
          label: this.$t("pages.targets.estimated_payout"),
          sortable: true,
          class: `d-table-cell d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "favorite",
          label: "⭐",
          sortable: true,
          class: `d-table-cell d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell`
        }
      ],
      infoList: [
        {
          id: 1,
          text: this.$t("pages.targets.accordion-info.there_are_225_TEXT")
        },
        {
          id: 2,
          text: this.$t("pages.targets.accordion-info.an_slot_is_TEXT")
        },
        {
          id: 3,
          text: this.$t(
            "pages.targets.accordion-info.validators_acummulate_TEXT"
          )
        },
        {
          id: 4,
          text: this.$t("pages.targets.accordion-info.at_the_end_TEXT")
        },
        {
          id: 5,
          text: this.$t("pages.targets.accordion-info.once_each_slots_TEXT")
        },
        {
          id: 6,
          text: this.$t("pages.targets.accordion-info.the_rest_of_TEXT")
        }
      ]
    };
  },
  computed: {
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
    },
    filterField: function() {
      this.filterOn[0] = this.filterField;
    }
  },
  created: function() {
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }
  },
  methods: {
    hasIdentity(stashId) {
      return this.$store.state.identities.list.some(obj => {
        return obj.accountId === stashId;
      });
    },
    getIdentity(stashId) {
      let filteredArray = this.$store.state.identities.list.filter(obj => {
        return obj.accountId === stashId;
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
      return filteredArray[0].identity;
    },
    formatId(stashId) {
      if (this.hasIdentity(stashId)) {
        return this.getIdentity(stashId);
      }
      if (this.hasKusamaIdentity(stashId)) {
        return this.getKusamaIdentity(stashId);
      }
      return this.shortAddress(stashId);
    },
    getOthersAmount(others) {
      let amount = 0;
      others.forEach(staker => {
        const { value } = staker;
        if (isHex(value)) {
          amount = amount + parseInt(value, 16);
        } else if (Number.isInteger(value)) {
          amount = amount + value;
        }
      });

      return this.formatAmount(amount);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    handleNumFields(num) {
      localStorage.numItemsTableSelected = num;
      this.perPage = parseInt(num);
    },
    isFavorite(accountId) {
      return this.favorites.includes(accountId);
    },
    toggleFavorite(accountId) {
      if (this.favorites.indexOf(accountId) !== -1) {
        this.favorites.splice(this.favorites.indexOf(accountId), 1);
      } else {
        this.favorites.push(accountId);
      }
      return true;
    },
    getSmallNumber(amount) {
      if (amount === 0) return 0;
      if (isHex(amount)) {
        const bn = new BN(amount.substring(2, amount.length), 16);
        const factor = new BN(1000000000);
        return bn.div(factor);
      }
      const bn = new BN(amount);
      const factor = new BN(1000000000);

      return bn.div(factor);
    }
  },
  apollo: {
    block: {
      query: gql`
        query block {
          block(limit: 1, order_by: { timestamp: desc }) {
            current_era
          }
        }
      `,
      result({ data }) {
        this.era = data.block[0].current_era - 1;
      }
    },
    $subscribe: {
      rewards: {
        query: gql`
          subscription rewards($era: Int) {
            rewards(
              where: { era_index: { _eq: $era } }
              order_by: { commission: asc }
            ) {
              commission
              estimated_payout
              stake_info
              stash_id
              timestamp
            }
          }
        `,
        result({ data }) {
          const { rewards } = data;
          if (rewards.length === 0) {
            this.era--;
          } else {
            const formatData = (value, key) => {
              value.commission = `${(value.commission / 10000000).toFixed(
                2
              )} %`;
              value.stake_info = JSON.parse(value.stake_info);
              value.stake_info.total = this.formatAmount(
                value.stake_info.total
              );
              value.stake_info.own = this.formatAmount(value.stake_info.own);
              value.stake_info.others_amount = this.getOthersAmount(
                value.stake_info.others
              );
              value.estimated_payout = this.formatAmount(
                value.estimated_payout
              );
              value.favorite = this.isFavorite(value.stash_id);
              const ident = this.getIdentity(value.stash_id);
              if (ident !== [] && typeof ident !== "undefined") {
                value.identity = ident.identity;
              } else if (this.hasKusamaIdentity(value.stash_id)) {
                const kusama = this.getKusamaIdentity(value.stash_id);
              } else {
                value.identity = null;
              }
            };

            R.mapObjIndexed(formatData, rewards);
            this.rewards = rewards;
          }
        },
        variables() {
          return {
            era: parseInt(this.era)
          };
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
          return this.era === null;
        }
      }
    }
  },
  head() {
    return {
      title: `Polkastats - ${this.$t("pages.targets.targets")}`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Polkastats - ${this.$t("pages.targets.targets")}`
        }
      ]
    };
  }
};
</script>

<style>
.loader {
  text-align: center;
}
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  text-align: center;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #d75ea1;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
.favorite {
  cursor: pointer;
  font-size: 1.1rem;
}
.favorite {
  cursor: pointer;
  font-size: 1.1rem;
}
#validators-table tr td:nth-child(3) div .d-block .favorite {
  right: 0;
  text-align: right;
}
</style>

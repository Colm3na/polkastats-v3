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
    <b-row class="pt-2 ml-1 mr-1 mb-4">
      <b-form-input
        id="filterInput"
        v-model="filter"
        type="search"
        :placeholder="$t('pages.targets.search_placeholder')"
      />
    </b-row>
    <div class="d-block d-sm-block d-md-none d-lg-none d-xl-none">
      <b-col class="my-1 mt-3">
        <b-form-group
          label-align-sm="right"
          label-size="sm"
          label-for="sortBySelect"
          class="mb-3"
        >
          <b-input-group size="sm">
            <b-form-select
              id="sortBySelect"
              v-model="sortBy"
              :options="sortOptions"
            >
              <template v-slot:first>
                <option value="">
                  -- none --
                </option>
              </template>
            </b-form-select>
            <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy">
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
    <div v-if="rewards.length === 0" class="pt-4">
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
        <JsonCSV
          :data="targetsJSON"
          class="download-csv mb-2"
          name="polkastats.io_polkadot_targets.csv"
        >
          <i class="fas fa-file-csv"></i>
          {{ $t("pages.accounts.download_csv") }}
        </JsonCSV>
        <div class="table-responsive">
          <b-table
            id="rewards-table"
            stacked="md"
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
            <template v-slot:cell(stash_id)="data">
              <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
                <template>
                  <div class="d-inline-block">
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
                    <span v-if="data.item.display_name">
                      {{ data.item.display_name }}
                    </span>
                    <span v-else>
                      {{ shortAddress(data.item.stash_id) }}
                    </span>
                  </nuxt-link>
                </template>
              </div>
              <div class="d-block d-sm-block d-md-none d-lg-none d-xl-none">
                <template>
                  <b-container>
                    <b-row class="validators-row">
                      <b-col cols="4" class="identity-column">
                        <div>
                          <Identicon
                            :key="data.item.stash_id"
                            :value="data.item.stash_id"
                            :size="48"
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
                          <span v-if="data.item.display_name">
                            {{ data.item.display_name }}
                          </span>
                          <span v-else>
                            {{ shortAddress(data.item.stash_id) }}
                          </span>
                        </nuxt-link>
                      </b-col>
                      <b-col cols="8">
                        <div>
                          {{ $t("pages.targets.commission") }}:
                          {{ data.item.commission }}
                        </div>
                        <div>
                          {{ $t("pages.targets.total_stake") }}:
                          {{ data.item.stake_info.total }}
                        </div>
                        <div>
                          {{
                            $t("pages.targets.estimated_payout", {
                              networkDenom: network.denom
                            })
                          }}:
                          {{ data.item.estimated_payout }}
                        </div>
                        <div>
                          {{
                            $t(
                              "pages.targets.estimated_annualized_payout_percentage"
                            )
                          }}:
                          {{ data.item.estimated_annualized_payout_percentage }}
                        </div>
                      </b-col>
                    </b-row>
                  </b-container>
                </template>
              </div>
            </template>
            <template v-slot:cell(favorite)="data">
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
import { paginationOptions } from "../polkastats.config.js";
import Identicon from "../components/identicon.vue";
import TargetInfo from "../components/accordion-info";
import JsonCSV from "vue-json-csv";
import { network } from "../polkastats.config.js";

export default {
  components: { Identicon, TargetInfo, JsonCSV },
  mixins: [commonMixin],
  data: function() {
    return {
      era: null,
      rewards: [],
      tableOptions: paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
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
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "stake_info.total",
          label: this.$t("pages.targets.total_stake"),
          sortable: false,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "estimated_payout",
          label: this.$t("pages.targets.estimated_payout"),
          sortable: false,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "estimated_annualized_payout_percentage",
          label: this.$t(
            "pages.targets.estimated_annualized_payout_percentage"
          ),
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
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },
    targetsJSON() {
      return this.rewards.map(reward => {
        return {
          name: reward.display_name,
          stash_account: reward.stash_id,
          commission_percent: reward.commission,
          total_stake: reward.stake_info.total,
          annualized_reward_percentage:
            reward.estimated_annualized_payout_percentage,
          estimated_daily_payout_100_DOT: reward.estimated_payout
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
      localStorage.paginationOptions = num;
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
      this.rewards = this.rewards.map(reward => {
        if (reward.stash_id === accountId) {
          reward.favorite = !reward.favorite;
        }
        return reward;
      });
      return true;
    },
    getAnnualizedRewards(eraPayout) {
      return (
        (
          parseInt(
            new BN(eraPayout)
              .mul(new BN(100))
              .mul(new BN(network.erasPerDay))
              .mul(new BN(365))
              .div(new BN(10).pow(new BN(network.decimalPlaces)))
              .toString()
          ) / 100
        ).toFixed(2) + " %"
      );
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
          subscription validator_era_staking($era: Int) {
            validator_era_staking(
              where: { era_index: { _eq: $era } }
              order_by: { estimated_payout: desc }
            ) {
              display_name
              commission
              estimated_payout
              stake_info
              stash_id
              timestamp
            }
          }
        `,
        result({ data }) {
          const { validator_era_staking } = data;
          if (validator_era_staking.length === 0) {
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
              // Annualized return percentage
              value.estimated_annualized_payout_percentage = this.getAnnualizedRewards(
                value.estimated_payout
              );
              // Payout per era per 100 DOT
              value.estimated_payout = this.formatAmount(
                value.estimated_payout
              );
              value.favorite = this.isFavorite(value.stash_id);
            };

            R.mapObjIndexed(formatData, validator_era_staking);
            this.totalRows = validator_era_staking.length;
            this.rewards = validator_era_staking;
          }
        },
        variables() {
          return {
            era: parseInt(this.era)
          };
        },
        skip() {
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

<style scoped>
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
#validators-table tr td:nth-child(3) div .d-block .favorite {
  right: 0;
  text-align: right;
}

.validators-row {
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
#rewards-table {
  margin-bottom: 1rem;
}

@media (max-width: 765px) {
  #rewards-table {
    background-color: transparent;
  }
  .validators-row {
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

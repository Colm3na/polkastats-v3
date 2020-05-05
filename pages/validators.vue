<template>
  <div>
    <section>
      <b-container id="page-index" class="main pt-4">
        <!-- Filter -->
        <b-row style="margin-bottom: 1rem">
          <b-col cols="10">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              :placeholder="$t('pages.validators.search_placeholder')"
            />
          </b-col>
          <b-col cols="auto">
            <b-button
              v-b-toggle.collapse-filter
              class="filter-button"
              @click="handleFilter()"
            >
              <font-awesome-icon
                :icon="['fas', 'filter']"
                :style="{
                  color: '#d75ea1',
                  width: '15px',
                  height: '15px'
                }"
              />
            </b-button>
          </b-col>
        </b-row>
        <b-row style="margin-bottom: 1rem">
          <b-container>
            <b-collapse id="collapse-filter" class="w-100">
              <b-card>
                <b-row>
                  <b-col cols="2" class="filter-label">
                    <span>{{ $t("pages.validators.filter") }}</span>
                  </b-col>
                  <b-col>
                    <b-form-select
                      id="filter1"
                      v-model="filterField"
                      class="filters"
                      :options="filterFieldsOptions"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="2" class="filter-label">
                    <span style="font-size: 1rem">{{
                      $t("pages.validators.where")
                    }}</span>
                  </b-col>
                  <b-col>
                    <b-form-select
                      v-model="filterOperator"
                      class="filters"
                      :options="filterOperatorsOptions"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="2" class="filter-label">
                    <span style="font-size: 1rem">{{
                      $t("pages.validators.than")
                    }}</span>
                  </b-col>
                  <b-col>
                    <b-form-input v-model="filterText" class="filters" />
                  </b-col>
                </b-row>
                <div class="filter-trash-button-container">
                  <b-button class="filter-trash-button" @click="resetFilter()">
                    <font-awesome-icon
                      :icon="['fas', 'trash']"
                      :style="{
                        color: '#d75ea1',
                        width: '15px',
                        height: '15px'
                      }"
                    />
                  </b-button>
                </div>
              </b-card>
            </b-collapse>
          </b-container>
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
            id="validators-table"
            stacked="md"
            head-variant="dark"
            :fields="fields"
            :items="filteredValidators"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered"
          >
            <template slot="rank" slot-scope="data">
              <p class="text-center mb-0">
                {{ data.item.rank }}
              </p>
            </template>
            <template slot="imOnline" slot-scope="data">
              <p class="text-center mb-0">
                <i
                  v-if="data.item.imOnline"
                  v-b-tooltip.hover
                  class="imOnline fas fa-check-circle"
                  :title="data.item.imOnlineMessage"
                />
                <i
                  v-else
                  v-b-tooltip.hover
                  class="imOffline fas fa-times-circle"
                  :title="data.item.imOnlineMessage"
                />
              </p>
            </template>
            <template slot="accountId" slot-scope="data">
              <div class="d-block d-sm-block d-md-none d-lg-none d-xl-none">
                <b-container>
                  <b-row class="flags">
                    <div class="activity-container">
                      <p class="ml-2 rank">
                        <span
                          v-b-tooltip.hover
                          class="rank-detail"
                          :title="$t('pages.index.rank')"
                          >#{{ data.item.rank }}</span
                        >
                        <!-- <i
                          v-if="data.item.imOnline"
                          v-b-tooltip.hover
                          class="imOnline fas fa-check-circle ml-1"
                          :title="data.item.imOnlineMessage"
                        />
                        <i
                          v-else
                          v-b-tooltip.hover
                          class="imOffline fas fa-times-circle ml-1"
                          :title="data.item.imOnlineMessage"
                        /> -->
                        <i
                          v-if="data.item.currentElected"
                          v-b-tooltip.hover
                          class="elected fas fa-chevron-circle-right"
                          title="$t('pages.index.elected_for_next_session')"
                        />
                        <i
                          v-else
                          v-b-tooltip.hover
                          class="notElected fas fa-times-circle"
                          title="$t('pages.index.not_elected_for_next_session')"
                        />
                      </p>
                    </div>
                    <div class="favorite-container">
                      <a
                        class="favorite"
                        @click="toggleFavorite(data.item.accountId)"
                      >
                        <i
                          v-if="data.item.favorite"
                          v-b-tooltip.hover
                          class="fas fa-star"
                          style="color: #f1bd23"
                          :title="$t('pages.index.remove_from_favorites')"
                        />
                        <i
                          v-else
                          v-b-tooltip.hover
                          class="fas fa-star"
                          style="color: #e6dfdf;"
                          :title="$t('pages.index.add_to_favorites')"
                        />
                      </a>
                    </div>
                  </b-row>
                  <b-row>
                    <b-col cols="4">
                      <nuxt-link
                        :to="{
                          name: 'validator',
                          query: { accountId: data.item.accountId }
                        }"
                        :title="$t('pages.validators.validator_details')"
                      >
                        <div v-if="hasIdentity(data.item.accountId)">
                          <div
                            v-if="getIdentity(data.item.accountId).logo !== ''"
                          >
                            <img
                              :src="getIdentity(data.item.accountId).logo"
                              class="identity mt-2"
                            />
                          </div>
                        </div>
                        <div v-else class="logo">
                          <Identicon
                            :key="data.item.accountId"
                            :value="data.item.accountId"
                            :size="48"
                            :theme="'polkadot'"
                          />
                        </div>
                      </nuxt-link>
                    </b-col>
                    <b-col cols="8">
                      <div>
                        <nuxt-link
                          :to="{
                            name: 'validator',
                            query: { accountId: data.item.accountId }
                          }"
                          :title="$t('pages.validators.validator_details')"
                        >
                          <h4 v-if="hasIdentity(data.item.accountId)">
                            {{ getIdentity(data.item.accountId).full_name }}
                          </h4>
                          <h4
                            v-else-if="hasKusamaIdentity(data.item.accountId)"
                          >
                            {{ getKusamaIdentity(data.item.accountId).display }}
                          </h4>
                          <h4 v-else>
                            <span
                              class="validator-name d-inline d-sm-inline d-md-inline d-lg-inline d-xl-none"
                              >{{ shortAddress(data.item.accountId) }}</span
                            >
                            <span
                              class="d-none d-sm-none d-md-none d-lg-none d-xl-inline"
                              >{{ shortAddress(data.item.accountId) }}</span
                            >
                          </h4>
                          <div v-if="data.item.stakers">
                            <p
                              v-if="data.item.stake && data.item.stake > 0"
                              v-b-tooltip.hover
                              class="bonded mb-0"
                              :title="$t('pages.validators.total_bonded')"
                            >
                              <!-- <i class="far fa-handshake"></i> -->
                              <font-awesome-icon
                                :icon="['fas', 'plug']"
                                :style="{
                                  color: 'black',
                                  width: '20px',
                                  height: '20px'
                                }"
                              />
                              {{ formatAmount(data.item.stake) }}
                            </p>
                            <div style="margin-top: 8px">
                              <p
                                v-if="data.item.stakers.total"
                                v-b-tooltip.hover
                                :title="
                                  $t(
                                    'pages.validators.percentage_over_total_bonded_stake'
                                  )
                                "
                              >
                                <span>
                                  <!-- <i class="fas fa-share-alt"></i>-> -->
                                  <font-awesome-icon
                                    :icon="['fas', 'chart-line']"
                                    :style="{
                                      color: 'black',
                                      width: '15px',
                                      height: '15px'
                                    }"
                                  />
                                  {{
                                    parseFloat(
                                      getStakePercent(
                                        data.item.stakers.total,
                                        totalStakeBonded
                                      )
                                    ).toFixed(2)
                                  }}%
                                </span>
                                <span
                                  v-if="typeof data.item.commission == 'number'"
                                  style="position:relative;left:25%"
                                >
                                  <!-- <i class="fas fa-percentage"></i> -->
                                  <font-awesome-icon
                                    :icon="['fas', 'project-diagram']"
                                    :style="{
                                      color: 'black',
                                      width: '15px',
                                      height: '15px'
                                    }"
                                  />
                                  {{
                                    (data.item.commission / 10000000).toFixed(
                                      2
                                    )
                                  }}%
                                </span>
                              </p>
                            </div>
                            <!-- <p class="mb-0 small-text" v-if="data.item.stakers.own !== data.item.stake">
                    <small>
                      <span v-b-tooltip.hover title="Self bonded" v-if="data.item.stakers.own > 0">{{ formatAmount(data.item.stakers.own) }}</span>
                      <span v-b-tooltip.hover title="Bonded by nominators" v-if="(data.item.stakers.total - data.item.stakers.own) > 0">(+{{ formatAmount(data.item.stakers.total - data.item.stakers.own) }})</span>
                    </small>
                  </p> -->
                          </div>
                        </nuxt-link>
                      </div>
                    </b-col>
                  </b-row>
                </b-container>
              </div>
              <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
                <div
                  v-if="hasIdentity(data.item.accountId)"
                  class="d-inline-block"
                >
                  <div
                    v-if="getIdentity(data.item.accountId).logo !== ''"
                    class="d-inline-block"
                  >
                    <img
                      :src="getIdentity(data.item.accountId).logo"
                      class="identity-small d-inline-block"
                    />
                  </div>
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
                    name: 'validator',
                    query: { accountId: data.item.accountId }
                  }"
                  :title="$t('pages.validators.validator_details')"
                >
                  <span v-if="hasIdentity(data.item.accountId)">
                    {{ getIdentity(data.item.accountId).full_name }}
                  </span>
                  <span v-else-if="hasKusamaIdentity(data.item.accountId)">
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
            <template slot="numStakers" slot-scope="data">
              <p class="text-center mb-0">
                {{ data.item.numStakers }}
              </p>
            </template>
            <template slot="stakeIndex" slot-scope="data">
              <p v-if="data.item.stake > 0" class="text-center mb-0">
                {{ formatAmount(data.item.stake) }}
              </p>
            </template>
            <template slot="percent" slot-scope="data">
              <p class="text-center mb-0">
                <!-- {{ formatNumber(data.item.percent) }}% -->
                {{
                  parseFloat(
                    getStakePercent(data.item.stakers.total, totalStakeBonded)
                  ).toFixed(2)
                }}%
              </p>
            </template>
            <template slot="commission" slot-scope="data">
              <p
                v-if="typeof data.item.commission == 'number'"
                class="text-center mb-0"
              >
                {{ (data.item.commission / 10000000).toFixed(2) }}%
              </p>
            </template>
            <template slot="eraPoints" slot-scope="data">
              <p class="text-center mb-0">
                {{ data.item.eraPoints }}
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
                    :title="$t('pages.validators.remove_from_favorites')"
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
import { isHex } from "@polkadot/util";
import BN from "bn.js";
import {
  blockExplorer,
  numItemsTableValidatorOptions
} from "../polkastats.config.js";
import commonMixin from "../mixins/commonMixin.js";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      tableOptions: numItemsTableValidatorOptions,
      perPage: localStorage.numItemsTableSelected
        ? parseInt(localStorage.numItemsTableSelected)
        : 10,
      currentPage: 1,
      sortBy: `favorite`,
      sortDesc: true,
      filter: null,
      filterOn: [],
      filterField: null,
      filterOperator: null,
      filterText: null,
      filterFieldsOptions: ["Stakers", "Total Stake", "% Stake", "Commission"],
      filterOperatorsOptions: [">", "=", "<"],
      totalRows: 1,
      fields: [
        {
          key: "rank",
          label: "#",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        // TODO fix validators online
        // {
        //   key: "imOnline",
        //   label: "✔️",
        //   sortable: true,
        //   class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        // },
        {
          key: "accountId",
          label: "✅ " + this.$t("pages.validators.validator"),
          sortable: true,
          filterByFormatted: true
        },
        {
          key: "numStakers",
          label: "👥 " + this.$t("pages.validators.stakers"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "stakeIndex",
          label: "💰" + this.$t("pages.validators.total_stake"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "percent",
          label: "% " + this.$t("pages.validators.stake"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "commission",
          label: "💸 " + this.$t("pages.validators.commission"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "eraPoints",
          label: this.$t("pages.validators.era_points"),
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
    filteredValidators() {
      const getStake = value => {
        const stake = commonMixin.methods.formatAmount(value);
        const float = stake.toString().includes("k")
          ? parseFloat(stake) * 1000
          : parseFloat(stake);

        return parseInt(float);
      };

      // No filters
      if (
        this.filterOn.length === 0 ||
        !this.filterField ||
        !this.filterOperator ||
        !this.filterText
      )
        return this.validators;

      // Filtering by Number of Stakers
      if (this.filterField === "Stakers") {
        const filtering = parseInt(this.filterText);

        if (this.filterOperator === ">")
          return this.validators.filter(
            validator => validator["numStakers"] > filtering
          );
        else if (this.filterOperator === "=")
          return this.validators.filter(
            validator => validator["numStakers"] === filtering
          );
        return this.validators.filter(
          validator => validator["numStakers"] < filtering
        );
      }

      // Filtering by Total Stake
      else if (this.filterField === "Total Stake") {
        const filtering = this.filterText.toString().includes(".")
          ? parseFloat(this.filterText) * 1000
          : parseInt(this.filterText);

        if (this.filterOperator === ">")
          return this.validators.filter(
            validator => getStake(validator.stake) > filtering
          );
        else if (this.filterOperator === "=")
          return this.validators.filter(
            validator => getStake(validator.stake) === filtering
          );
        return this.validators.filter(
          validator => getStake(validator.stake) < filtering
        );
      }

      // Filtering by & Stake
      else if (this.filterField === "% Stake") {
        const filtering = parseFloat(this.filterText).toFixed(2);

        if (this.filterOperator === ">")
          return this.validators.filter(
            validator => parseFloat(validator["percent"]).toFixed(2) > filtering
          );
        else if (this.filterOperator === "=")
          return this.validators.filter(
            validator =>
              parseFloat(validator["percent"]).toFixed(2) === filtering
          );
        return this.validators.filter(
          validator => parseFloat(validator["percent"]).toFixed(2) < filtering
        );
      }

      // Filtering by Commission
      else if (this.filterField === "Commission") {
        const filtering = parseFloat(this.filterText) * 10000000;

        if (this.filterOperator === ">")
          return this.validators.filter(
            validator => parseFloat(validator["commission"]) > filtering
          );
        else if (this.filterOperator === "=")
          return this.validators.filter(
            validator => parseFloat(validator["commission"]) === filtering
          );
        return this.validators.filter(
          validator => parseFloat(validator["commission"]) < filtering
        );
      }

      return this.validators;
    },
    validators() {
      let validatorsObject = [];
      for (let i = 0; i < this.$store.state.validators.list.length; i++) {
        let validator = this.$store.state.validators.list[i];
        let stake = 0;
        if (validator.exposure || validator.stakingLedger) {
          if (validator.exposure.total > 0) {
            stake = validator.exposure.total;
          } else {
            stake = validator.stakingLedger.total;
          }
        }
        let stakePercent = 0;
        if (validator.exposure) {
          stakePercent = this.getStakePercent(
            validator.exposure.total,
            this.totalStakeBonded
          );
        }

        let commission = 0;
        if (validator.validatorPrefs) {
          commission = validator.validatorPrefs.commission;
        }

        let identity = "";
        if (this.hasIdentity(validator.accountId)) {
          identity = this.getIdentity(validator.accountId);
        }

        let kusamaIdentity = "";
        if (this.hasKusamaIdentity(validator.accountId)) {
          kusamaIdentity = this.hasKusamaIdentity(validator.accountId);
        }

        validatorsObject.push({
          rank: i + 1,
          imOnline: validator.imOnline.isOnline,
          imOnlineMessage: this.getImOnlineMessage(validator),
          accountId: validator.accountId,
          stake: stake,
          stakers: validator.exposure,
          numStakers: validator.exposure.others.length,
          eraPoints: validator.currentEraPointsEarned,
          commission,
          percent: stakePercent,
          favorite: this.isFavorite(validator.accountId),
          currentElected: validator.currentElected,
          kusamaIdentity,
          identity
        });
      }
      return validatorsObject;
    },
    intentions() {
      return this.$store.state.intentions.list;
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
    var vm = this;

    // Get favorites from cookie
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }

    // Force update of network info
    vm.$store.dispatch("network/update");

    // Initialize validators table
    vm.$store.dispatch("validators/update");

    // Get the numbers of Rows
    this.totalRows = this.$store.state.validators.list.length;

    // Force update of intentions list if empty
    if (this.$store.state.intentions.list.length == 0) {
      vm.$store.dispatch("intentions/update");
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length === 0) {
      vm.$store.dispatch("identities/update");
    }

    // Force update of staking identities list if empty
    if (this.$store.state.stakingIdentities.list.length === 0) {
      vm.$store.dispatch("stakingIdentities/update");
    }

    // Update network info validators and intentions every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("network/update");
      vm.$store.dispatch("validators/update");
      vm.$store.dispatch("intentions/update");
      vm.$store.dispatch("stakingIdentities/update");
      if (!this.filter)
        this.totalRows = this.$store.state.validators.list.length;
    }, 10000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
  },
  methods: {
    handleFilter() {
      this.filter = "";
    },
    resetFilter() {
      this.filterField = null;
      this.filterOperator = null;
      this.filterText = null;
      this.filterOn.length = 0;
    },
    handleNumFields(num) {
      localStorage.numItemsTableSelected = num;
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
      title: this.$t("pages.validators.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.validators.head_content")
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
.table td,
.table th {
  padding: 0.35rem;
  border-top: 1px solid #dee2e6;
}
.favorite {
  cursor: pointer;
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
.filters {
  margin: 5px 10px;
}
.filter-label {
  font-size: 1rem;
  padding: 0.5rem;
}
.filter-button {
  background-color: white;
}
.filter-trash-button-container {
  text-align: right;
}
.filter-trash-button {
  background-color: white;
  font-size: 0.6rem;
  margin-top: 0.5rem;
}
.identity {
  max-width: 80px;
}
.identity-small {
  max-width: 25px;
  margin-right: 0.2rem;
}
#validators-table th {
  text-align: center;
}
#validators-table .identicon {
  cursor: copy;
}
.image-container {
  flex: 1;
  justify-content: center;
  align-items: center;
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
.imOnline {
  font-size: 1.1rem;
  color: green;
}
.imOffline {
  font-size: 1.1rem;
  color: red;
}
.table.b-table > thead > tr > th[aria-sort]::before,
.table.b-table > tfoot > tr > th[aria-sort]::before {
  margin-left: -0.5em;
}
.btn-group {
  margin-bottom: 1rem;
  display: inline-flex;
}
.btn-secondary {
  font-size: 0.8rem;
}
@media (max-width: 767px) {
  table.b-table.b-table-stacked-md > tbody > tr > [data-label] {
    grid-template-columns: inherit !important;
  }
  .table th,
  .table td {
    border-top: 0;
    padding: 0;
  }
  #validators-table {
    background-color: transparent;
    padding: 0 0.5rem;
  }
  #validators-table tr {
    border-radius: 0.3rem;
    box-shadow: 1px 1px 2px 2px #a2a6a8;
    padding: 0.5rem 1rem 0 0;
    margin: 1rem 0;
  }
  #validators-table td[data-label="Validator"] {
    border-left: 0;
    border-right: 0;
    border-top: 0;
    padding: 0;
  }
  #validators-table tr td:nth-child(3) div .d-block {
    position: relative;
  }
  .flags {
    margin: 0;
    display: flex;
    flex: 1;
    max-height: 35px;
  }

  .favorite-container {
    flex: 1;
    text-align: right;
  }

  .identity-container {
    display: flex;
    flex: 1;
  }
  #validators-table tr td:nth-child(3) div .d-block .favorite {
    right: 0;
    text-align: right;
  }
  #validators-table .elected {
    font-size: 1.1rem;
    color: #2697e2;
  }
  #validators-table .notElected {
    font-size: 1.1rem;
    color: red;
  }
  #validators-table .validator-name {
    font-size: 1.7em;
  }
  .bonded {
    color: #d75ea1;
    font-weight: 700;
    font-size: 1.3rem;
  }
  #validators-table .fullname {
    font-size: 3em;
    position: relative;
    left: 50%;
    top: -2em;
  }
  #validators-table .fullname2 {
    font-size: 3em;
    position: relative;
    left: 50%;
    top: -1.1em;
  }
  #validators-table .rank-detail {
    width: 50px;
    font-size: 1.1rem;
  }
  #validators-table .small-text small {
    font-size: 0.9rem;
  }
  .logo {
    text-align: center;
    margin-top: 1rem;
  }
}

@media (max-width: 991px) {
  #page-index.container {
    max-width: 100%;
    padding-right: 15px !important;
    padding-left: 15px !important;
  }
}
@media (max-width: 767px) {
  #validators-table td[data-label="Validator"] {
    padding-top: 0.5em;
  }
}

@media (max-width: 470px) {
  td {
    border-top: 0;
  }
  #validators-table h4 {
    margin-bottom: 0;
  }
  #validators-table .validator-name {
    font-size: 0.9em;
  }
  #validators-table .bonded {
    width: 70%;
    font-size: 1.1em;
    color: #212529;
    font-weight: 400;
  }
  #validators-table .fullname2 {
    font-size: 1.4em;
  }
  #validators-table .fullname {
    font-size: 1.3em;
  }
  #validators-table .logo-identity {
    height: 48px;
  }
  #validators-table .small-text {
    font-size: 1.1em;
    padding-bottom: 0;
  }
  #validators-table .identicon {
    cursor: copy;
  }
  .identity {
    max-width: 48px;
  }
}
</style>

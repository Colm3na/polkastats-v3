<template>
  <div>
    <section>
      <b-container id="page-index" class="main pt-4">
        <!-- Filter -->
        <b-row style="margin-bottom: 1rem">
          <b-col cols="12">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              :placeholder="$t('pages.validators.search_placeholder')"
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
            id="validators-table"
            stacked="md"
            head-variant="dark"
            :fields="fields"
            :items="validators"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered"
          >
            <template v-slot:cell(rank)="data">
              <p class="text-center mb-0">
                {{ data.item.rank }}
              </p>
            </template>
            <template v-slot:cell(accountId)="data">
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
                      </p>
                    </div>
                    <div class="favorite-container">
                      <a
                        class="favorite"
                        @click="toggleFavorite(data.item.account_id)"
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
                          query: { accountId: data.item.account_id }
                        }"
                        :title="$t('pages.validators.validator_details')"
                      >
                        <div class="logo">
                          <Identicon
                            :key="data.item.account_id"
                            :value="data.item.account_id"
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
                            query: { accountId: data.item.account_id }
                          }"
                          :title="$t('pages.validators.validator_details')"
                        >
                          <h4 v-if="data.item.display_name">
                            {{ data.item.display_name }}
                          </h4>
                          <h4 v-else>
                            <span
                              class="validator-name d-inline d-sm-inline d-md-inline d-lg-inline d-xl-none"
                              >{{ shortAddress(data.item.account_id) }}</span
                            >
                            <span
                              class="d-none d-sm-none d-md-none d-lg-none d-xl-inline"
                              >{{ shortAddress(data.item.account_id) }}</span
                            >
                          </h4>
                          <div v-if="data.item.exposure_total">
                            <p
                              v-b-tooltip.hover
                              class="bonded mb-0"
                              :title="$t('pages.validators.total_bonded')"
                            >
                              <font-awesome-icon
                                :icon="['fas', 'plug']"
                                :style="{
                                  color: 'black',
                                  width: '20px',
                                  height: '20px'
                                }"
                              />
                              {{ formatAmount(data.item.exposure_total) }}
                            </p>
                            <div style="margin-top: 8px">
                              <p>
                                <span
                                  v-if="data.item.commission"
                                  style="position:relative;left:25%"
                                >
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
                          </div>
                        </nuxt-link>
                      </div>
                    </b-col>
                  </b-row>
                </b-container>
              </div>
              <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
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
                    name: 'validator',
                    query: { accountId: data.item.account_id }
                  }"
                  :title="$t('pages.validators.validator_details')"
                >
                  <span v-if="data.item.display_name !== ``">
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
            <template v-slot:cell(num_stakers)="data">
              <p class="text-right mb-0">
                {{ data.item.num_stakers }}
              </p>
            </template>
            <template v-slot:cell(produced_blocks)="data">
              <p class="text-right mb-0">
                <span class="circle green">
                  {{ data.item.produced_blocks }}
                </span>
              </p>
            </template>
            <template v-slot:cell(exposure_total)="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.exposure_total) }}
                ({{
                  (getTotalStakePercen(data.item.exposure_total) / 100).toFixed(
                    2
                  )
                }}%)
              </p>
            </template>
            <template v-slot:cell(commission)="data">
              <p class="text-center mb-0">
                {{ (parseInt(data.item.commission) / 10000000).toFixed(2) }}%
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
import gql from "graphql-tag";
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
      currentSessionIndex: 0,
      validators: [],
      tableOptions: numItemsTableValidatorOptions,
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
        {
          key: "accountId",
          label: this.$t("pages.validators.validator"),
          sortable: true,
          filterByFormatted: true
        },
        {
          key: "produced_blocks",
          label: this.$t("pages.validators.produced_blocks"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "exposure_total",
          label: this.$t("pages.validators.total_stake"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "num_stakers",
          label: this.$t("pages.validators.stakers"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "commission",
          label: this.$t("pages.validators.commission"),
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
    totalStakeBonded() {
      let totalStakeBonded = new BN(0);
      this.validators.forEach(validator => {
        let totalExposure;
        if (isHex(validator.exposure_total)) {
          totalExposure = new BN(validator.exposure_total.toString(), 16);
        } else {
          totalExposure = new BN(validator.exposure_total.toString(), 10);
        }
        totalStakeBonded = totalStakeBonded.add(totalExposure);
      });
      return totalStakeBonded;
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
    // Get favorites from cookie
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }
  },
  methods: {
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
      this.validators = this.validators.map(validator => {
        if (validator.account_id === accountId)
          validator.favorite = !validator.favorite;
        return validator;
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
    },
    getTotalStakePercen(amount) {
      if (this.totalStakeBonded && amount) {
        let bn;
        if (isHex(amount)) {
          bn = new BN(amount.substring(2, amount.length), 16);
        } else {
          bn = new BN(amount.toString(), 10);
        }
        bn = bn.mul(new BN("10000", 10));
        return bn.div(this.totalStakeBonded);
      } else {
        return 0;
      }
    }
  },
  apollo: {
    $subscribe: {
      validators: {
        query: gql`
          subscription validator($session_index: Int!) {
            validator(
              order_by: { rank: asc }
              where: { session_index: { _eq: $session_index } }
            ) {
              account_id
              stash_id
              commission
              current_elected
              display_name
              exposure_others
              exposure_own
              exposure_total
              produced_blocks
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
          this.totalRows = data.validator.length;
          this.validators = data.validator.map(validator => {
            return {
              ...validator,
              num_stakers: JSON.parse(validator.stakers).length,
              favorite: this.isFavorite(validator.account_id)
            };
          });
        }
      },
      block: {
        query: gql`
          subscription blocks {
            block(order_by: { block_number: desc }, where: {}, limit: 1) {
              current_index
            }
          }
        `,
        result({ data }) {
          if (data.block[0].current_index > this.currentSessionIndex) {
            this.currentSessionIndex = data.block[0].current_index;
          }
        }
      }
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
#validators-table {
  margin-bottom: 1rem;
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
.circle {
  float: right;
  display: block;
  padding: 0.1rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  text-align: center;
  font-size: 0.8rem;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 3px;
}
.green {
  color: white;
  background: green;
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
    border: 1px solid #bbb;
    border-radius: 0.3rem;
    padding: 0.5rem 1rem 0 0;
    margin: 1rem 0;
    background-color: white;
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

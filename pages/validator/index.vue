<template>
  <div>
    <section>
      <b-container class="page-validator main pt-3 pb-5">
        <template v-if="validator">
          <div :key="validator.account_id" class="row accountIdMar mt-4">
            <div class="col-12 text-center">
              <h4 class="mb-1">
                {{ $t("details.validator.validator") }}
                <span v-if="validator.display_name">{{
                  validator.display_name
                }}</span>
                <span v-else>{{ accountId }}</span>
              </h4>
            </div>
          </div>
          <div class="validator-detail card mt-4 mb-3">
            <div>
              <span
                v-if="validator.next_elected"
                v-b-tooltip.hover
                :title="$t('details.validator.elected_for_next_session')"
                class="elected circle blue"
              >
                <i class="fa fa-chevron-right mr-1" aria-hidden="true"></i>
              </span>
              <span
                v-b-tooltip.hover
                :title="
                  `${validator.produced_blocks} ${$t(
                    'details.validator.produced_blocks'
                  )}`
                "
                class="blocks circle green"
              >
                {{ validator.produced_blocks }}
              </span>
            </div>
            <div class="card-body">
              <div>
                <i
                  v-if="isFavorite(validator.account_id)"
                  v-b-tooltip.hover
                  class="favorite fas fa-star"
                  style="color: #f1bd23"
                  :title="$t('details.validator.in_favorites')"
                />
                <i
                  v-else
                  v-b-tooltip.hover
                  class="favorite fas fa-star"
                  style="color: #e6dfdf;"
                  :title="$t('details.validator.not_in_favorites')"
                />
              </div>
              <div class="row">
                <div class="col-md-3 mb-2 text-center">
                  <div v-if="validator.display_name">
                    <Identicon
                      :key="validator.account_id"
                      :value="validator.account_id"
                      :size="80"
                      :theme="'polkadot'"
                    />
                    {{ validator.display_name }}
                  </div>
                  <div v-else>
                    <Identicon
                      :key="validator.account_id"
                      :value="validator.account_id"
                      :size="80"
                      :theme="'polkadot'"
                    />
                  </div>
                  <p class="mt-3 mb-0 rank">rank #{{ validator.rank }}</p>
                  <template v-if="validator.exposure_total">
                    <p
                      v-if="validator.exposure_total > 0"
                      v-b-tooltip.hover
                      class="bonded mb-0"
                      :title="$t('details.validator.total_bonded')"
                    >
                      {{ formatAmount(validator.exposure_total) }}
                    </p>
                    <p v-if="validator.exposure_own" class="mb-0">
                      <small>
                        <span
                          v-if="validator.exposure_own > 0"
                          v-b-tooltip.hover
                          :title="$t('details.validator.self_bonded')"
                          >{{ formatAmount(validator.exposure_own) }}</span
                        >
                        <span
                          v-if="
                            validator.exposure_total - validator.exposure_own >
                              0
                          "
                          v-b-tooltip.hover
                          :title="$t('details.validator.bonded_by_nominators')"
                          >(+{{
                            formatAmount(
                              validator.exposure_total - validator.exposure_own
                            )
                          }})</span
                        >
                      </small>
                    </p>
                    <p
                      v-b-tooltip.hover
                      class="mb-0"
                      :title="
                        $t(
                          'details.validator.percentage_over_total_bonded_stake'
                        )
                      "
                    >
                      {{
                        getStakePercent(
                          validator.exposure_total,
                          totalStakeBonded
                        )
                      }}% {{ $t("details.validator.of_total_stake") }}
                    </p>
                  </template>
                </div>

                <hr class="separator" />

                <div class="col-md-9">
                  <div v-if="validator.account_id" class="row">
                    <div class="col-md-3 mb-2">
                      <strong>Stash</strong>
                    </div>
                    <div class="col-md-9 mb-2">
                      <Identicon
                        :key="validator.stash_id"
                        :value="validator.stash_id"
                        :size="20"
                        :theme="'polkadot'"
                      />
                      <nuxt-link
                        :to="{
                          name: 'account',
                          query: {
                            accountId: validator.stash_id
                          }
                        }"
                      >
                        <span
                          v-b-tooltip.hover
                          class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                          :title="validator.account_id"
                          >{{ shortAddress(validator.stash_id) }}</span
                        >
                        <span
                          class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                          >{{ shortAddress(validator.stash_id) }}</span
                        >
                      </nuxt-link>
                    </div>
                  </div>
                  <div v-if="validator.controller_id" class="row">
                    <div class="col-md-3 mb-2">
                      <strong>Controller</strong>
                    </div>
                    <div class="col-md-9 mb-2">
                      <Identicon
                        :key="validator.controller_id"
                        :value="validator.controller_id"
                        :size="20"
                        :theme="'polkadot'"
                      />
                      <nuxt-link
                        :to="{
                          name: 'account',
                          query: {
                            accountId: validator.controller_id
                          }
                        }"
                      >
                        <span
                          v-b-tooltip.hover
                          class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                          :title="validator.controller_id"
                          >{{ shortAddress(validator.controller_id) }}
                        </span>
                        <span
                          class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                          >{{ shortAddress(validator.controller_id) }}</span
                        >
                      </nuxt-link>
                    </div>
                  </div>
                  <div v-if="validator.session_id_hex" class="row">
                    <div class="col-md-3 mb-2">
                      <strong>{{ $t("details.validator.session_id") }}</strong>
                    </div>
                    <div id="session-id-info" class="col-md-9 mb-2">
                      <b-button
                        v-b-toggle="`accordion-sessionIdHex-validator`"
                        variant="link"
                        style="text-decoration: none; font-size: 0.9rem; padding: 0; border: 0; color: #670d35"
                      >
                        >
                        {{ shortSessionId(validator.session_id_hex) }}
                      </b-button>
                      <b-collapse
                        :id="`accordion-sessionIdHex-validator`"
                        class="collapse pt-2 pb-3"
                        :data-parent="'#session-id-info'"
                      >
                        {{ validator.session_id_hex }}
                      </b-collapse>
                    </div>
                  </div>
                  <div v-if="validator.next_session_id_hex" class="row">
                    <div class="col-md-3 mb-2">
                      <strong>{{
                        $t("details.validator.next_session_id")
                      }}</strong>
                    </div>
                    <div id="next-session-id-info" class="col-md-9 mb-2">
                      <b-button
                        v-b-toggle="`accordion-nextSessionIdHex-validator`"
                        variant="link"
                        style="text-decoration: none; font-size: 0.9rem; padding: 0; border: 0; color: #670d35"
                      >
                        >
                        {{ shortSessionId(validator.next_session_id_hex) }}
                      </b-button>
                      <b-collapse
                        :id="`accordion-nextSessionIdHex-validator`"
                        class="collapse pt-2 pb-3"
                        :data-parent="'#next-session-id-info'"
                      >
                        {{ validator.next_session_id_hex }}
                      </b-collapse>
                    </div>
                  </div>
                  <div v-if="validator.commission" class="row">
                    <div class="col-md-3 mb-2">
                      <strong>{{ $t("details.validator.commission") }}</strong>
                    </div>
                    <div class="col-md-9 mb-2 fee">
                      {{ (validator.commission / 10000000).toFixed(2) }}%
                    </div>
                  </div>
                  <div v-if="validator.reward_destination" class="row mb-2">
                    <div class="col-md-3 mb-2">
                      <strong>{{
                        $t("details.validator.reward_destination")
                      }}</strong>
                    </div>
                    <div class="col-md-9 mb-2 fee">
                      {{ validator.reward_destination }}
                    </div>
                  </div>

                  <!-- identity start -->
                  <div v-if="validator.display_name">
                    <div v-if="validator.display_name" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("details.validator.name") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ validator.display_name }}
                      </div>
                    </div>
                    <div
                      v-if="JSON.parse(validator.identity).email"
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>{{ $t("details.validator.email") }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="
                            `mailto:${JSON.parse(validator.identity).email}`
                          "
                          target="_blank"
                        >
                          {{ JSON.parse(validator.identity).email }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="JSON.parse(validator.identity).legal"
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>{{ $t("details.validator.legal") }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        {{ JSON.parse(validator.identity).legal }}
                      </div>
                    </div>
                    <div v-if="JSON.parse(validator.identity).riot" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>{{ $t("details.validator.riot") }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="
                            `https://riot.im/app/#/user/${
                              JSON.parse(validator.identity).riot
                            }`
                          "
                          target="_blank"
                        >
                          {{ JSON.parse(validator.identity).riot }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="JSON.parse(validator.identity).twitter"
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>Twitter</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="
                            `https://twitter.com/${
                              JSON.parse(validator.identity).twitter
                            }`
                          "
                          target="_blank"
                        >
                          {{ JSON.parse(validator.identity).twitter }}
                        </a>
                      </div>
                    </div>
                    <div v-if="JSON.parse(validator.identity).web" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Web</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="JSON.parse(validator.identity).web"
                          target="_blank"
                        >
                          {{ JSON.parse(validator.identity).web }}
                        </a>
                      </div>
                    </div>
                  </div>
                  <!-- identity end -->
                </div>
              </div>
              <hr class="separator" />
              <!-- Charts -->
              <div class="row">
                <div class="col-md-12">
                  <h5 class="h5 account my-3">
                    {{ $t("details.validator.charts") }}
                  </h5>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-4">
                  <eraRewards :account-id="accountId" />
                </div>
                <div class="col-md-6 mb-4">
                  <eraPoints :account-id="accountId" />
                </div>
                <div class="col-md-6 mb-4">
                  <eraStake :account-id="accountId" />
                </div>
                <div class="col-md-6 mb-4">
                  <eraSlashes :account-id="accountId" />
                </div>
                <div class="col-md-6 mb-4">
                  <eraCommission :account-id="accountId" />
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <!-- Charts end -->
                  <hr class="separator" />
                  <!-- Stakers -->
                  <h5 class="h5 account my-3">
                    {{ $t("details.validator.nominators") }}
                  </h5>
                  <!-- Filter -->
                  <b-row class="mb-4">
                    <b-col lg="12">
                      <b-form-input
                        id="filterInput"
                        v-model="filter"
                        type="search"
                        :placeholder="
                          $t('details.validator.search_placeholder')
                        "
                      />
                    </b-col>
                  </b-row>
                  <!-- Mobile sorting -->
                  <div
                    class="row d-block d-sm-block d-md-block d-lg-none d-xl-none"
                  >
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
                      :items="JSON.parse(validator.stakers)"
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
                      <template v-slot:cell(who)="data">
                        <div
                          class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center py-2"
                          style="border: 1px solid #bbb; border-radius: 0.3rem;"
                        >
                          <p class="mb-0">rank #{{ data.item.rank }}</p>
                          <p class="mt-2 mb-0">
                            <Identicon
                              :key="data.item.who"
                              :value="data.item.who"
                              :size="20"
                              :theme="'polkadot'"
                            />
                            <nuxt-link
                              :to="{
                                name: 'nominator',
                                query: { accountId: data.item.who }
                              }"
                              title="Nominator details"
                            >
                              <span
                                v-b-tooltip.hover
                                class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none"
                                :title="data.item.who"
                                >{{ shortAddress(data.item.who) }}</span
                              >
                              <span
                                class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block"
                                >{{ shortAddress(data.item.who) }}</span
                              >
                            </nuxt-link>
                          </p>
                          <p class="mt-2 mb-0">
                            {{ formatAmount(data.item.value) }} ({{
                              parseFloat(data.item.percent).toFixed(3)
                            }}
                            %)
                          </p>
                        </div>
                        <div
                          class="d-none d-sm-none d-md-block d-lg-block d-xl-block"
                        >
                          <p class="mb-0">
                            <Identicon
                              :key="data.item.who"
                              :value="data.item.who"
                              :size="20"
                              :theme="'polkadot'"
                            />
                            <nuxt-link
                              :to="{
                                name: 'nominator',
                                query: { accountId: data.item.who }
                              }"
                              title="$t('details.validator.nominator_details')"
                            >
                              <span
                                v-b-tooltip.hover
                                class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none"
                                :title="data.item.who"
                                >{{ shortAddress(data.item.who) }}</span
                              >
                              <span
                                class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block"
                                >{{ shortAddress(data.item.who) }}</span
                              >
                            </nuxt-link>
                          </p>
                        </div>
                      </template>
                      <template v-slot:cell(percent)="data">
                        <p class="text-right mb-0">
                          {{
                            getStakePercent(
                              data.item.value,
                              validator.exposure_total
                            )
                          }}%
                        </p>
                      </template>
                      <template v-slot:cell(value)="data">
                        <p class="text-right mb-0">
                          {{ formatAmount(data.item.value) }}
                        </p>
                      </template>
                    </b-table>
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="totalRows"
                      :per-page="perPage"
                      aria-controls="nominators-table"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import gql from "graphql-tag";
import moment from "moment";
import * as R from "ramda";
import Identicon from "../../components/identicon.vue";
import { isHex } from "@polkadot/util";
import BN from "bn.js";
import { network } from "../../polkastats.config.js";
import commonMixin from "../../mixins/commonMixin.js";

import eraRewards from "../../components/charts/eraRewards";
import eraPoints from "../../components/charts/eraPoints";
import eraStake from "../../components/charts/eraStake";
import eraSlashes from "../../components/charts/eraSlashes";
import eraCommission from "../../components/charts/eraCommission";

export default {
  components: {
    Identicon,
    eraRewards,
    eraPoints,
    eraStake,
    eraSlashes,
    eraCommission
  },
  mixins: [commonMixin],
  data: function() {
    return {
      totalStakeBonded: 0,
      currentSessionIndex: 0,
      validator: undefined,
      accountId: this.$route.query.accountId,
      polling: null,
      graphPolling: null,
      favorites: [],
      perPage: 10,
      currentPage: 1,
      sortBy: `rank`,
      sortDesc: false,
      filter: null,
      filterOn: [],
      totalRows: 1,
      fields: [
        {
          key: "rank",
          label: this.$t("details.validator.rank"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        { key: "who", label: "Staker", sortable: true },
        {
          key: "percent",
          label: this.$t("details.validator.percentage"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "value",
          label: this.$t("details.validator.amount"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        }
      ],
      totalIssuance: ""
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
    }
  },
  watch: {
    $route() {
      this.accountId = this.$route.query.accountId;
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
    }
  },
  apollo: {
    $subscribe: {
      validators: {
        query: gql`
          subscription validator($session_index: Int!, $account_id: String!) {
            validator(
              where: {
                session_index: { _eq: $session_index }
                account_id: { _eq: $account_id }
              }
            ) {
              account_id
              block_height
              commission
              controller_id
              display_name
              exposure
              exposure_others
              exposure_own
              exposure_total
              identity
              next_elected
              next_session_id_hex
              next_session_ids
              nominators
              produced_blocks
              rank
              redeemable
              reward_destination
              session_id_hex
              session_ids
              session_index
              stakers
              staking_ledger
              stash_id
              timestamp
              validator_prefs
            }
          }
        `,
        variables() {
          return {
            account_id: this.accountId,
            session_index: this.currentSessionIndex
          };
        },
        skip() {
          return !this.currentSessionIndex;
        },
        result({ data }) {
          this.validator = {
            ...data.validator[0],
            num_stakers: JSON.parse(data.validator[0].stakers).length,
            favorite: this.isFavorite(data.validator[0].account_id)
          };
          this.totalRows = this.validator.num_stakers;
        }
      },
      totalStakeBonded: {
        query: gql`
          subscription validator($session_index: Int!) {
            validator(
              order_by: { rank: asc }
              where: { session_index: { _eq: $session_index } }
            ) {
              account_id
              exposure_total
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
          let totalStakeBonded = new BN(0);
          data.validator.forEach(validator => {
            let totalExposure;
            if (isHex(validator.exposure_total)) {
              totalExposure = new BN(validator.exposure_total.toString(), 16);
            } else {
              totalExposure = new BN(validator.exposure_total.toString(), 10);
            }
            totalStakeBonded = totalStakeBonded.add(totalExposure);
          });
          this.totalStakeBonded = totalStakeBonded.toString(10);
        }
      },
      sessionIndex: {
        query: gql`
          subscription validator {
            validator(order_by: { session_index: desc }, where: {}, limit: 1) {
              session_index
            }
          }
        `,
        result({ data }) {
          if (data.validator[0].session_index > this.currentSessionIndex) {
            this.currentSessionIndex = data.validator[0].session_index;
          }
        }
      }
    }
  },
  head() {
    return {
      title: this.$t("pages.validator.head_title", {
        networkName: network.name,
        address: this.$route.query.accountId
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$tc("pages.validator.head_content", {
            networkName: network.name,
            address: this.$route.query.accountId
          })
        }
      ]
    };
  }
};
</script>
<style>
.charts {
  display: block;
  width: 100%;
}
.fas.fa-copy {
  cursor: pointer;
  color: #d75ea1;
  font-size: 0.9rem;
  margin-left: 0.1rem;
}
.rank {
  font-size: 1.4rem;
  color: #7d7378;
}
.validator-detail .favorite {
  cursor: initial;
}
.change {
  vertical-align: middle;
}
.validator-detail .col-md-9 .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
.validator-detail .col-md-9 .identicon div {
  display: inline;
}
.page-validator .imOnline {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  font-size: 1.1rem;
  color: green;
}
.page-validator .imOffline {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  font-size: 1.1rem;
  color: red;
}

.page-validator .elected {
  position: absolute;
  top: 0.4rem;
  left: 0;
  display: block;
  cursor: pointer;
}

.page-validator .blocks {
  position: absolute;
  top: 0.4rem;
  left: 2rem;
  display: block;
  cursor: pointer;
}

.page-validator .notElected {
  position: absolute;
  top: 0.4rem;
  left: 2rem;
  font-size: 1.1rem;
  color: red;
}
.page-validator .favorite {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
}
.page-validator #nominators-table th,
.page-validator #nominators-table td {
  padding: 0.5rem;
}
.page-validator #nominators-table th {
  text-align: center;
}
.page-validator .identicon {
  margin-bottom: 0.8rem;
}
</style>

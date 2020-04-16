<template>
  <div>
    <section>
      <b-container class="validator-page main pt-3 pb-5">
        <template v-for="(validator, index) in validators">
          <template v-if="validator.accountId === accountId">
            <div :key="validator.accountId" class="row accountIdMar mt-4">
              <div class="col-2 col-lg-1">
                <template v-if="index > 0">
                  <nuxt-link
                    :to="{
                      name: 'validator',
                      query: { accountId: validators[index - 1].accountId }
                    }"
                    :title="
                      $t('details.validator.previous_validator').concat(
                        validators[index - 1].accountId
                      )
                    "
                  >
                    <i class="fas fa-2x fa-chevron-left" />
                  </nuxt-link>
                </template>
              </div>
              <div class="col-8 col-lg-10 text-center">
                <h4 class="mb-1">
                  {{ $t("details.validator.validator") }} {{ accountId }}
                </h4>
              </div>
              <div class="col-2 col-lg-1 text-right">
                <template v-if="index < validators.length - 1">
                  <nuxt-link
                    :to="{
                      name: 'validator',
                      query: { accountId: validators[index + 1].accountId }
                    }"
                    :title="
                      $t('details.validator.next_validator').concat(
                        validators[index + 1].accountId
                      )
                    "
                  >
                    <i class="fas fa-2x fa-chevron-right" />
                  </nuxt-link>
                </template>
              </div>
            </div>
            <div :key="index" class="validator-detail card mt-4 mb-3">
              <div class="card-body">
                <i
                  v-if="validator.imOnline.isOnline"
                  v-b-tooltip.hover
                  class="imOnline fas fa-check-circle"
                  :title="getImOnlineMessage(validator)"
                />
                <i
                  v-else
                  v-b-tooltip.hover
                  class="imOffline fas fa-times-circle"
                  :title="getImOnlineMessage(validator)"
                />
                <i
                  v-if="validator.currentElected"
                  v-b-tooltip.hover
                  class="elected fas fa-chevron-circle-right"
                  :title="$t('details.validator.elected_for_next_session')"
                />
                <i
                  v-else
                  v-b-tooltip.hover
                  class="notElected fas fa-times-circle"
                  :title="$t('details.validator.not_elected_for_next_session')"
                />
                <i
                  v-if="isFavorite(validator.accountId)"
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
                <div class="row">
                  <div class="col-md-3 mb-2 text-center">
                    <div v-if="hasPolkaStatsIdentity(validator.stashId)">
                      <div
                        v-if="getPolkaStatsIdentity(validator.accountId).logo"
                      >
                        <img
                          :src="getPolkaStatsIdentity(validator.accountId).logo"
                          class="img-fluid"
                          style="max-width: 150px;"
                        />
                        <h3
                          v-if="
                            getPolkaStatsIdentity(validator.accountId).full_name
                          "
                          class="mt-2 mb-2"
                        >
                          {{
                            getPolkaStatsIdentity(validator.accountId).full_name
                          }}
                        </h3>
                      </div>
                      <div v-else>
                        <Identicon
                          :key="validator.accountId"
                          :value="validator.accountId"
                          :size="80"
                          :theme="'polkadot'"
                        />
                      </div>
                    </div>
                    <div v-else>
                      <Identicon
                        :key="validator.accountId"
                        :value="validator.accountId"
                        :size="80"
                        :theme="'polkadot'"
                      />
                    </div>
                    <p class="mt-3 mb-0 rank">rank #{{ index + 1 }}</p>
                    <template v-if="validator.exposure">
                      <p
                        v-if="validator.exposure.total > 0"
                        v-b-tooltip.hover
                        class="bonded mb-0"
                        :title="$t('details.validator.total_bonded')"
                      >
                        {{ formatAmount(validator.exposure.total) }}
                      </p>
                      <p
                        v-else
                        v-b-tooltip.hover
                        class="bonded mb-0"
                        :title="$t('details.validator.total_bonded')"
                      >
                        {{ formatAmount(validator.stakingLedger.total) }}
                      </p>
                      <p
                        v-if="
                          validator.exposure.own !== validator.exposure.total
                        "
                        class="mb-0"
                      >
                        <small>
                          <span
                            v-if="validator.exposure.own > 0"
                            v-b-tooltip.hover
                            :title="$t('details.validator.self_bonded')"
                            >{{ formatAmount(validator.exposure.own) }}</span
                          >
                          <span
                            v-if="
                              validator.exposure.total -
                                validator.exposure.own >
                                0
                            "
                            v-b-tooltip.hover
                            :title="
                              $t('details.validator.bonded_by_nominators')
                            "
                            >(+{{
                              formatAmount(
                                validator.exposure.total -
                                  validator.exposure.own
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
                            validator.exposure.total,
                            totalStakeBonded
                          )
                        }}% {{ $t("details.validator.of_total_stake") }}
                      </p>
                    </template>
                    <p v-if="validator.currentEraPointsEarned" class="mb-0">
                      {{ validator.currentEraPointsEarned }}
                      {{ $t("details.validator.era_points") }}
                    </p>
                  </div>
                  <div class="col-md-9">
                    <div v-if="hasNickname(validator.accountId)" class="row">
                      <div class="col-md-12">
                        <h4
                          class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0"
                        >
                          {{ getNickname(validator.accountId) }}
                        </h4>
                      </div>
                    </div>
                    <div v-if="validator.accountId" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Stash</strong>
                      </div>
                      <div class="col-md-9 mb-2">
                        <Identicon
                          :key="validator.accountId"
                          :value="validator.accountId"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <a
                          :href="blockExplorer.account + validator.accountId"
                          target="_blank"
                        >
                          <span
                            v-b-tooltip.hover
                            class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                            :title="validator.accountId"
                            >{{ shortAddress(validator.accountId) }}</span
                          >
                          <span
                            class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                            >{{ shortAddress(validator.accountId) }}</span
                          >
                        </a>
                      </div>
                    </div>
                    <div v-if="validator.controllerId" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Controller</strong>
                      </div>
                      <div class="col-md-9 mb-2">
                        <Identicon
                          :key="validator.controllerId"
                          :value="validator.controllerId"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <a
                          :href="blockExplorer.account + validator.controllerId"
                          target="_blank"
                        >
                          <span
                            v-b-tooltip.hover
                            class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                            :title="validator.controllerId"
                            >{{ shortAddress(validator.controllerId) }}
                          </span>
                          <span
                            class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                            >{{ shortAddress(validator.controllerId) }}</span
                          >
                        </a>
                      </div>
                    </div>
                    <div v-if="validator.sessionIdHex" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>{{
                          $t("details.validator.session_id")
                        }}</strong>
                      </div>
                      <div id="session-id-info" class="col-md-9 mb-2">
                        <a
                          class=""
                          data-toggle="collapse"
                          :href="'#sessionIdHex'"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'sessionIdHex'"
                        >
                          <i class="fas" />
                          {{ shortSessionId(validator.sessionIdHex) }}
                        </a>
                        <div
                          :id="'sessionIdHex'"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#session-id-info'"
                        >
                          {{ validator.sessionIdHex }}
                        </div>
                      </div>
                    </div>
                    <div v-if="validator.nextSessionIdHex" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>{{
                          $t("details.validator.next_session_id")
                        }}</strong>
                      </div>
                      <div id="next-session-id-info" class="col-md-9 mb-2">
                        <a
                          class=""
                          data-toggle="collapse"
                          :href="'#nextSessionIdHex'"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'nextSessionIdHex'"
                        >
                          <i class="fas" />
                          {{ shortSessionId(validator.nextSessionIdHex) }}
                        </a>
                        <div
                          :id="'nextSessionIdHex'"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#next-session-id-info'"
                        >
                          {{ validator.nextSessionIdHex }}
                        </div>
                      </div>
                    </div>
                    <div v-if="validator.validatorPrefs.commission" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>{{
                          $t("details.validator.commission")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        {{
                          (
                            validator.validatorPrefs.commission / 10000000
                          ).toFixed(2)
                        }}%
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-3 mb-2">
                        <strong>{{
                          $t("details.validator.reward_destination")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        {{ formatRewardDest(validator.rewardDestination) }}
                      </div>
                    </div>
                    <!-- identity start -->
                    <div v-if="hasIdentity(validator.accountId)">
                      <div
                        v-if="
                          getIdentity(
                            validator.accountId
                          ).identity.hasOwnProperty('display')
                        "
                        class="row"
                      >
                        <div class="col-md-3 mb-1">
                          <strong>{{ $t("details.validator.name") }}</strong>
                        </div>
                        <div class="col-md-9 mb-1 fee">
                          {{
                            getIdentity(validator.accountId).identity.display
                          }}
                        </div>
                      </div>
                      <div
                        v-if="
                          getIdentity(
                            validator.accountId
                          ).identity.hasOwnProperty('email')
                        "
                        class="row"
                      >
                        <div class="col-md-3 mb-2">
                          <strong>{{ $t("details.validator.email") }}</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          <a
                            :href="
                              `mailto:${
                                getIdentity(validator.accountId).identity.email
                              }`
                            "
                            target="_blank"
                          >
                            {{
                              getIdentity(validator.accountId).identity.email
                            }}
                          </a>
                        </div>
                      </div>
                      <div
                        v-if="
                          getIdentity(
                            validator.accountId
                          ).identity.hasOwnProperty('legal')
                        "
                        class="row"
                      >
                        <div class="col-md-3 mb-2">
                          <strong>{{ $t("details.validator.legal") }}</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          {{ getIdentity(validator.accountId).identity.legal }}
                        </div>
                      </div>
                      <div
                        v-if="
                          getIdentity(
                            validator.accountId
                          ).identity.hasOwnProperty('riot')
                        "
                        class="row"
                      >
                        <div class="col-md-3 mb-2">
                          <strong>{{ $t("details.validator.riot") }}</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          <a
                            :href="
                              `https://riot.im/app/#/user/${
                                getIdentity(validator.accountId).identity.riot
                              }`
                            "
                            target="_blank"
                          >
                            {{ getIdentity(validator.accountId).identity.riot }}
                          </a>
                        </div>
                      </div>
                      <div
                        v-if="
                          getIdentity(
                            validator.accountId
                          ).identity.hasOwnProperty('twitter')
                        "
                        class="row"
                      >
                        <div class="col-md-3 mb-2">
                          <strong>Twitter</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          <a
                            :href="
                              `https://twitter.com/${
                                getIdentity(validator.accountId).identity
                                  .twitter
                              }`
                            "
                            target="_blank"
                          >
                            {{
                              getIdentity(validator.accountId).identity.twitter
                            }}
                          </a>
                        </div>
                      </div>
                      <div
                        v-if="
                          getIdentity(
                            validator.accountId
                          ).identity.hasOwnProperty('web')
                        "
                        class="row"
                      >
                        <div class="col-md-3 mb-2">
                          <strong>Web</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          <a
                            :href="
                              getIdentity(validator.accountId).identity.web
                            "
                            target="_blank"
                          >
                            {{ getIdentity(validator.accountId).identity.web }}
                          </a>
                        </div>
                      </div>
                    </div>
                    <!-- identity end -->

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
                        :items="validatorStakers"
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
                        <template slot="who" slot-scope="data">
                          <div
                            class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center py-2"
                          >
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
                        <template slot="percent" slot-scope="data">
                          <p class="text-right mb-0">
                            {{ parseFloat(data.item.percent).toFixed(3) }} %
                          </p>
                        </template>
                        <template slot="amountOrder" slot-scope="data">
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
        </template>
        <div>
          <section>
            <b-card>
              <h3 class="mb-4">Charts</h3>
              <b-tabs>
                <b-tab :title="$t('details.validator.total_bonded')" active>
                  <b-tabs
                    pills
                    :card="overBreakpoint"
                    :vertical="overBreakpoint"
                    :end="!overBreakpoint"
                  >
                    <b-tab :title="$t('details.validator.monthly')" active>
                      <div
                        id="stake-evolution-monthly-chart"
                        class="text-center w-100"
                      >
                        <chartHeader
                          :first="parseInt(monthly.first)"
                          :last="parseInt(monthly.last)"
                        />
                        <chart
                          :options="StakeEvolutionMonthlyChartOptions"
                          :series="StakeEvolutionMonthlySeries"
                        />
                      </div>
                    </b-tab>
                    <b-tab :title="$t('details.validator.weekly')">
                      <div
                        id="stake-evolution-weekly-chart"
                        class="text-center"
                      >
                        <chartHeader
                          :first="parseInt(weekly.first)"
                          :last="parseInt(weekly.last)"
                        />
                        <chart
                          :options="StakeEvolutionWeeklyChartOptions"
                          :series="StakeEvolutionWeeklySeries"
                        />
                      </div>
                    </b-tab>
                    <b-tab :title="$t('details.validator.daily')">
                      <div id="stake-evolution-daily-chart" class="text-center">
                        <chartHeader
                          :first="parseInt(daily.first)"
                          :last="parseInt(daily.last)"
                        />
                        <chart
                          :options="StakeEvolutionDailyChartOptions"
                          :series="StakeEvolutionDailySeries"
                        />
                      </div>
                    </b-tab>
                  </b-tabs>
                </b-tab>
                <b-tab :title="$t('details.validator.reward')"
                  ><p>Here is Rewards charts tab</p></b-tab
                >
                <b-tab :title="$t('details.validator.slashes')"
                  ><p>Here is Slashes charts tab!</p></b-tab
                >
                <b-tab :title="$t('details.validator.produced_block')"
                  ><p>Here is Produced Block charts tab!</p></b-tab
                >
                <b-tab title="Status"><p>Here is Status charts tab!</p></b-tab>
              </b-tabs>
            </b-card>
          </section>
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import axios from "axios";
import moment from "moment";
import chart from "../../components/chart";
import { commonChartOptions } from "../commons/chartOptions";
import Identicon from "../../components/identicon.vue";
import chartHeader from "../../components/chart-header.vue";
import { isHex } from "@polkadot/util";
import BN from "bn.js";
import {
  backendBaseURL,
  blockExplorer,
  mediumBreakpoint,
  mobileBreakpoint
} from "../../polkastats.config.js";
import commonMixin from "../../mixins/commonMixin.js";

export default {
  components: {
    chart,
    Identicon,
    chartHeader
  },
  mixins: [commonMixin],
  data: function() {
    return {
      accountId: this.$route.query.accountId,
      blockExplorer,
      backendBaseURL,
      mediumBreakpoint,
      mobileBreakpoint,
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
          key: "amountOrder",
          label: this.$t("details.validator.amount"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        }
      ],
      daily: {
        last: 0,
        first: 0
      },
      weekly: {
        last: 0,
        first: 0
      },
      monthly: {
        last: 0,
        first: 0
      },
      StakeEvolutionDailySeries: [
        {
          name: "Total bonded (KSM)",
          data: []
        }
      ],
      StakeEvolutionWeeklySeries: [
        {
          name: "Total bonded (KSM)",
          data: []
        }
      ],
      StakeEvolutionMonthlySeries: [
        {
          name: "Total bonded (KSM)",
          data: []
        }
      ],
      StakeEvolutionDailyChartOptions: {
        ...commonChartOptions
      },
      StakeEvolutionWeeklyChartOptions: {
        ...commonChartOptions
      },
      StakeEvolutionMonthlyChartOptions: {
        ...commonChartOptions
      },
      totalIssuance: "",
      overBreakpoint: window.innerWidth > mediumBreakpoint
    };
  },
  computed: {
    validators() {
      if (this.$store.state.validators.list.length > 0) {
        let validator = this.$store.state.validators.list.find(
          validator => validator.accountId === this.accountId
        );
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.totalRows = validator.exposure.others.length;
      }
      return this.$store.state.validators.list;
    },
    // eslint-disable-next-line vue/return-in-computed-property
    validatorStakers() {
      if (this.$store.state.validators.list.length > 0) {
        let validator = this.$store.state.validators.list.find(
          validator => validator.accountId === this.accountId
        );

        // Calculate others stake total amount
        let stakeTotal, stakeOwn, stakeOthers;

        if (isHex(validator.exposure.total)) {
          stakeTotal = new BN(
            validator.exposure.total
              .toString()
              .substring(2, validator.exposure.total.length),
            16
          );
        } else {
          stakeTotal = new BN(validator.exposure.total, 10);
        }

        if (isHex(validator.exposure.own)) {
          stakeOwn = new BN(
            validator.exposure.own
              .toString()
              .substring(2, validator.exposure.own.length),
            16
          );
        } else {
          stakeOwn = new BN(validator.exposure.own, 10);
        }
        stakeOthers = stakeTotal.sub(stakeOwn);

        let stakers = validator.exposure.others.slice();

        stakers.sort((a, b) => {
          if (a.value && b.value) {
            let stakeA, stakeB;

            if (isHex(a.value)) {
              stakeA = new BN(
                a.value.toString().substring(2, a.value.length),
                16
              );
            } else {
              stakeA = new BN(a.value, 10);
            }

            if (isHex(b.value)) {
              stakeB = new BN(
                b.value.toString().substring(2, b.value.length),
                16
              );
            } else {
              stakeB = new BN(b.value, 10);
            }

            return stakeA.lt(stakeB) ? 1 : -1;
          }
        });

        return stakers.map((staker, index) => {
          return {
            ...staker,
            rank: index + 1,
            amountOrder: index + 1,
            accountIndex: this.indexes[staker.who],
            percent: this.getStakePercent(staker.value, stakeOthers)
          };
        });
      }
    },
    identities() {
      return this.$store.state.identities.list;
    },
    nicknames() {
      return this.$store.state.nicknames.list;
    },
    indexes() {
      return this.$store.state.indexes.list;
    },
    totalStakeBonded() {
      return this.$store.state.validators.totalStakeBonded;
    },
    totalStakeBondedPercen() {
      if (this.totalStakeBonded !== 0 && this.totalIssuance !== "") {
        let totalIssuance = new BN(this.totalIssuance, 10);
        let totalStakeBonded = this.totalStakeBonded.mul(new BN("100000", 10));
        return totalStakeBonded.div(totalIssuance);
      } else {
        return 0;
      }
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
    $route() {
      this.accountId = this.$route.query.accountId;

      // Update graph data
      this.getValidatorDailyGraphData();
      this.getValidatorWeeklyGraphData();
      this.getValidatorMonthlyGraphData();

      // Restart graph data polling
      clearInterval(this.graphPolling);
      this.graphPolling = setInterval(() => {
        this.getValidatorDailyGraphData();
        this.getValidatorWeeklyGraphData();
        this.getValidatorMonthlyGraphData();
      }, 60000);
    }
  },
  created: function() {
    var vm = this;

    // Get favorites from cookie
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }

    // Load graph data first time
    this.getValidatorDailyGraphData();
    this.getValidatorWeeklyGraphData();
    this.getValidatorMonthlyGraphData();

    // Force update of validators list if empty
    if (this.$store.state.validators.list.length == 0) {
      vm.$store.dispatch("validators/update");
    }

    // Force update of staking_identity list if empty
    if (this.$store.state.stakingIdentities.list.length == 0) {
      vm.$store.dispatch("stakingIdentities/update");
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length == 0) {
      vm.$store.dispatch("identities/update");
    }

    // Force update of nicknames list if empty
    if (this.$store.state.nicknames.list.length == 0) {
      vm.$store.dispatch("nicknames/update");
    }

    // Force update of account indexes list if empty
    if (this.$store.state.indexes.list.length == 0) {
      vm.$store.dispatch("indexes/update");
    }

    // Update validators every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("validators/update");
      vm.$store.dispatch("stakingIdentities/update");
    }, 10000);

    // Refresh graph data and account indexes every minute
    this.graphPolling = setInterval(() => {
      this.getValidatorDailyGraphData();
      this.getValidatorWeeklyGraphData();
      this.getValidatorMonthlyGraphData();
      vm.$store.dispatch("indexes/update");
    }, 60000);

    window.addEventListener("resize", this.resizeWindow);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeWindow);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
    clearInterval(this.graphPolling);
  },
  methods: {
    resizeWindow(e) {
      this.overBreakpoint = window.innerWidth > this.mediumBreakpoint;
    },
    getValidatorDailyGraphData: function() {
      var vm = this;
      axios
        .get(`${this.backendBaseURL}/validator/graph/daily/${this.accountId}`)
        .then(function(response) {
          // Update chart data
          var newCategories = [];
          var newData = [];

          for (var i = 0; i < response.data.length; i++) {
            // Insert firt point, last point and points with different values
            if (
              i == 0 ||
              i == response.data.length - 1 ||
              (i > 0 && response.data[i].amount != response.data[i - 1].amount)
            ) {
              // Save first and last point
              if (i == 0) vm.daily.last = response.data[i].amount;
              if (i == response.data.length - 1)
                vm.daily.first = response.data[i].amount;

              newCategories.push(
                moment
                  .unix(
                    response.data[i].timestamp,
                    "YYYY-MM-DD HH:mm:ss.SSSSSS Z"
                  )
                  .format("YYYY-MM-DD HH:mm:ss")
              );
              newData.push(response.data[i].amount);
            }
          }

          newCategories.reverse();
          newData.reverse();

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          vm.StakeEvolutionDailyChartOptions = {
            ...vm.StakeEvolutionDailyChartOptions,
            ...{
              xaxis: {
                categories: newCategories,
                type: "datetime",
                title: {
                  text: "Date time (UTC)"
                },
                labels: {
                  formatter: function(val) {
                    return moment.unix(val / 1000).format("MM/DD/YYYY HH:mm");
                  }
                }
              },
              yaxis: {
                title: {
                  text: "Total bonded (KSM)"
                },
                labels: {
                  formatter: function(val) {
                    return (val / 1000000000000).toFixed(6);
                  }
                }
              }
            }
          };

          // In the same way, update the series option
          vm.StakeEvolutionDailySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getValidatorWeeklyGraphData: function() {
      var vm = this;
      axios
        .get(`${this.backendBaseURL}/validator/graph/weekly/${this.accountId}`)
        .then(function(response) {
          // Update chart data
          var newCategories = [];
          var newData = [];

          for (var i = 0; i < response.data.length; i++) {
            // Save first and last point
            if (i == 0) vm.weekly.last = response.data[i].amount;
            if (i == response.data.length - 1)
              vm.weekly.first = response.data[i].amount;

            newCategories.push(
              moment
                .unix(
                  response.data[i].timestamp,
                  "YYYY-MM-DD HH:mm:ss.SSSSSS Z"
                )
                .format("YYYY-MM-DD HH:mm:ss")
            );
            newData.push(response.data[i].amount);
          }

          newCategories.reverse();
          newData.reverse();

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          vm.StakeEvolutionWeeklyChartOptions = {
            ...vm.StakeEvolutionWeeklyChartOptions,
            ...{
              xaxis: {
                categories: newCategories,
                type: "datetime",
                title: {
                  text: "Date time (UTC)"
                },
                labels: {
                  formatter: function(val) {
                    return moment.unix(val / 1000).format("MM/DD/YYYY HH:mm");
                  }
                }
              },
              yaxis: {
                title: {
                  text: "Total bonded (KSM)"
                },
                labels: {
                  formatter: function(val) {
                    return (val / 1000000000000).toFixed(6);
                  }
                }
              }
            }
          };

          // In the same way, update the series option
          vm.StakeEvolutionWeeklySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getValidatorMonthlyGraphData: function() {
      var vm = this;
      axios
        .get(`${this.backendBaseURL}/validator/graph/monthly/${this.accountId}`)
        .then(function(response) {
          // Update chart data
          var newCategories = [];
          var newData = [];

          for (var i = 0; i < response.data.length; i++) {
            // Save first and last point
            if (i == 0) vm.monthly.last = response.data[i].amount;
            if (i == response.data.length - 1)
              vm.monthly.first = response.data[i].amount;

            newCategories.push(
              moment
                .unix(
                  response.data[i].timestamp,
                  "YYYY-MM-DD HH:mm:ss.SSSSSS Z"
                )
                .format("YYYY-MM-DD HH:mm:ss")
            );
            newData.push(response.data[i].amount);
          }

          newCategories.reverse();
          newData.reverse();

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          vm.StakeEvolutionMonthlyChartOptions = {
            ...vm.StakeEvolutionMonthlyChartOptions,
            ...{
              xaxis: {
                categories: newCategories,
                type: "datetime",
                title: {
                  text: "Date time (UTC)"
                },
                labels: {
                  formatter: function(val) {
                    return moment.unix(val / 1000).format("MM/DD/YYYY HH:mm");
                  }
                }
              },
              yaxis: {
                title: {
                  text: "Total bonded (KSM)"
                },
                labels: {
                  formatter: function(val) {
                    return (val / 1000000000000).toFixed(6);
                  }
                }
              }
            }
          };

          // In the same way, update the series option
          vm.StakeEvolutionMonthlySeries = [
            {
              data: newData
            }
          ];
        });
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
    getIdentity(stashId) {
      let filteredArray = this.$store.state.stakingIdentities.list.filter(
        obj => {
          return obj.accountId === stashId;
        }
      );
      return filteredArray[0];
    },
    hasIdentity(stashId) {
      return this.$store.state.stakingIdentities.list.some(obj => {
        return obj.accountId === stashId;
      });
    },
    hasPolkaStatsIdentity(stashId) {
      return this.$store.state.identities.list.some(obj => {
        return obj.stashId === stashId;
      });
    },
    getPolkaStatsIdentity(stashId) {
      let filteredArray = this.$store.state.identities.list.filter(obj => {
        return obj.stashId === stashId;
      });
      return filteredArray[0];
    },
    hasNickname(accountId) {
      return this.$store.state.nicknames.list.some(obj => {
        return obj.accountId === accountId;
      });
    },
    getNickname(accountId) {
      let filteredArray = this.$store.state.nicknames.list.filter(obj => {
        return obj.accountId === accountId;
      });
      return filteredArray[0].nickname;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  head() {
    return {
      title:
        "PolkaStats - Polkadot Kusama validator " + this.$route.query.accountId,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Polkadot Kusama validator " + this.$route.query.accountId
        }
      ]
    };
  }
};
</script>
<style>
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
.validator-page .imOnline {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  font-size: 1.1rem;
  color: green;
}
.validator-page .imOffline {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  font-size: 1.1rem;
  color: red;
}
.validator-page .elected {
  position: absolute;
  top: 0.4rem;
  left: 2rem;
  font-size: 1.1rem;
  color: #2697e2;
}
.validator-page .notElected {
  position: absolute;
  top: 0.4rem;
  left: 2rem;
  font-size: 1.1rem;
  color: red;
}
.validator-page .favorite {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
}
.validator-page #nominators-table th,
.validator-page #nominators-table td {
  padding: 0.5rem;
}
.validator-page #nominators-table th {
  text-align: center;
}
</style>

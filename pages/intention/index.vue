<template>
  <div>
    <section>
      <b-container class="page-intention main pt-3 pb-5">
        <template v-for="(validator, index) in intentions">
          <template v-if="validator.accountId == accountId">
            <div :key="validator.accountId" class="row">
              <div class="col-2 col-lg-1">
                <template v-if="index > 0">
                  <nuxt-link
                    :to="{
                      name: 'intention',
                      query: { accountId: intentions[index - 1].accountId }
                    }"
                    :title="
                      $t('details.intention.previous_intention').concat(
                        intentions[index - 1].accountId
                      )
                    "
                  >
                    <i class="fas fa-2x fa-chevron-left" />
                  </nuxt-link>
                </template>
              </div>
              <div class="col-8 col-lg-10 text-center">
                <h4 class="mb-1">
                  {{ $t("details.intention.intention") }} {{ accountId }}
                </h4>
              </div>
              <div class="col-2 col-lg-1 text-right">
                <template v-if="index < intentions.length - 1">
                  <nuxt-link
                    :to="{
                      name: 'intention',
                      query: { accountId: intentions[index + 1].accountId }
                    }"
                    :title="
                      $t('details.intention.next_intention').concat(
                        intentions[index + 1].accountId
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
                  v-if="isFavorite(validator.accountId)"
                  v-b-tooltip.hover
                  class="favorite fas fa-star"
                  style="color: #f1bd23"
                  :title="$t('details.intention.in_favorites')"
                />
                <i
                  v-else
                  v-b-tooltip.hover
                  class="favorite fas fa-star"
                  style="color: #e6dfdf;"
                  :title="$t('details.intention.not_in_favorites')"
                />
                <div class="row">
                  <div class="col-md-3 mb-2 text-center">
                    <div v-if="hasPolkaStatsIdentity(validator.accountId)">
                      <div
                        v-if="
                          getPolkaStatsIdentity(validator.accountId).logo !== ''
                        "
                      >
                        <img
                          :src="getPolkaStatsIdentity(validator.accountId).logo"
                          class="img-fluid"
                          style="max-width: 150px;"
                        />
                        <h3
                          v-if="
                            getPolkaStatsIdentity(validator.accountId)
                              .full_name !== ''
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
                    <p class="mb-0 rank">rank #{{ index + 1 }}</p>
                    <p
                      v-b-tooltip.hover
                      class="bonded mb-0"
                      :title="$t('details.intention.active_bonded')"
                    >
                      {{ formatAmount(validator.stakingLedger.active) }}
                    </p>
                    <p class="mb-0">
                      <small>
                        <span v-b-tooltip.hover title="Total bonded">
                          {{ formatAmount(validator.stakingLedger.total) }}
                        </span>
                      </small>
                    </p>
                  </div>
                  <div class="col-md-9">
                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Stash</strong>
                      </div>
                      <div class="col-md-9 mb-2">
                        <Identicon
                          :key="validator.stashId"
                          :value="validator.stashId"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <a
                          :href="blockExplorer.account + validator.stashId"
                          target="_blank"
                        >
                          <span
                            v-b-tooltip.hover
                            class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                            :title="validator.stashId"
                            >{{ shortAddress(validator.stashId) }}</span
                          >
                          <span
                            class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                            >{{ shortAddress(validator.stashId) }}</span
                          >
                        </a>
                      </div>
                    </div>
                    <div class="row">
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
                          $t("details.intention.session_id")
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
                          $t("details.intention.next_session_id")
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
                    <div
                      v-if="
                        typeof validator.validatorPrefs.commission == 'number'
                      "
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>{{
                          $t("details.intention.commission")
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
                          $t("details.intention.reward_destination")
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
                          <strong>{{ $t("details.intention.name") }}</strong>
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
                          <strong>{{ $t("details.intention.email") }}</strong>
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
                          <strong>{{ $t("details.intention.legal") }}</strong>
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
                          <strong>{{ $t("details.intention.riot") }}</strong>
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
                    <div :id="'validator-info-' + index" class="mt-2">
                      <template v-if="validator.exposure.others.length > 0">
                        <a
                          class=""
                          data-toggle="collapse"
                          :href="'#staker' + index"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'staker' + index"
                        >
                          <h6 class="h6 nominators d-inline mr-4">
                            <i class="fas" />
                            {{ $t("details.intention.stakers") }} ({{
                              validator.exposure.others.length
                            }})
                          </h6>
                        </a>
                      </template>
                      <template v-if="validator.sessionIds.length > 0">
                        <a
                          class=""
                          data-toggle="collapse"
                          :href="'#current-session-id-' + index"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'current-session-id-' + index"
                        >
                          <h6 class="h6 nominators d-inline mr-4">
                            <i class="fas" />
                            {{ $t("details.intention.current_session_ids") }}
                            ({{ validator.sessionIds.length }})
                          </h6>
                        </a>
                      </template>
                      <template v-if="validator.nextSessionIds.length > 0">
                        <a
                          class=""
                          data-toggle="collapse"
                          :href="'#session-id-' + index"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'session-id-' + index"
                        >
                          <h6 class="h6 nominators d-inline mr-4">
                            <i class="fas" />
                            {{ $t("details.intention.next_session_ids") }} ({{
                              validator.nextSessionIds.length
                            }})
                          </h6>
                        </a>
                      </template>
                      <template v-if="validator.sessionIds.length > 0">
                        <div
                          :id="'current-session-id-' + index"
                          class="nominator collapse pt-2 pb-3"
                          :data-parent="'#validator-info-' + index"
                        >
                          <div
                            v-for="(sessionId, index) in validator.sessionIds"
                            :key="index"
                            class="row"
                          >
                            <div class="col-12 mb-1 who">
                              {{ index + 1 }}.
                              <Identicon
                                :key="sessionId"
                                :value="sessionId"
                                :size="20"
                                :theme="'polkadot'"
                              />
                              <a
                                :href="blockExplorer.account + sessionId"
                                target="_blank"
                              >
                                <span
                                  v-b-tooltip.hover
                                  class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none"
                                  :title="sessionId"
                                  >{{ shortAddress(sessionId) }}</span
                                >
                                <span
                                  class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block"
                                  >{{ sessionId }}</span
                                >
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="validator.nextSessionIds.length > 0">
                        <div
                          :id="'session-id-' + index"
                          class="nominator collapse pt-2 pb-3"
                          :data-parent="'#validator-info-' + index"
                        >
                          <div
                            v-for="(sessionId,
                            index) in validator.nextSessionIds"
                            :key="index"
                            class="row"
                          >
                            <div class="col-12 mb-1 who">
                              {{ index + 1 }}.
                              <Identicon
                                :key="sessionId"
                                :value="sessionId"
                                :size="20"
                                :theme="'polkadot'"
                              />
                              <a
                                :href="blockExplorer.account + sessionId"
                                target="_blank"
                              >
                                <span
                                  v-b-tooltip.hover
                                  class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none"
                                  :title="sessionId"
                                  >{{ shortAddress(sessionId) }}</span
                                >
                                <span
                                  class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block"
                                  >{{ sessionId }}</span
                                >
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="validator.exposure.others.length > 0">
                        <div
                          :id="'staker' + index"
                          class="nominator collapse pt-2 pb-3"
                          :data-parent="'#validator-info-' + index"
                        >
                          <div
                            v-for="(staker, index) in validator.exposure.others"
                            :key="index"
                            class="row"
                          >
                            <div class="col-8 mb-1 who">
                              <Identicon
                                :key="staker.who"
                                :value="staker.who"
                                :size="20"
                                :theme="'polkadot'"
                              />
                              <a
                                :href="blockExplorer.account + staker.who"
                                target="_blank"
                              >
                                <span
                                  v-b-tooltip.hover
                                  class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none"
                                  :title="staker.who"
                                  >{{ shortAddress(staker.who) }}</span
                                >
                                <span
                                  class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block"
                                  >{{ shortAddress(staker.who) }}</span
                                >
                              </a>
                            </div>
                            <div class="col-4 text-right value">
                              {{ formatAmount(staker.value) }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <div id="stake-evolution-monthly-chart" class="mt-5 text-center">
          <h3>
            {{ $t("details.intention.total_bonded") }} -
            {{ $t("details.intention.monthly_chart") }}
            <small
              v-if="monthly.last - monthly.first > 0"
              class="change text-success ml-3"
              ><i class="far fa-thumbs-up" /> +{{
                formatAmount(monthly.last - monthly.first)
              }}</small
            ><small
              v-if="monthly.last - monthly.first < 0"
              class="change text-danger ml-3"
              ><i class="far fa-thumbs-down" />
              {{ formatAmount(monthly.last - monthly.first) }}</small
            >
          </h3>
          <chart
            :options="StakeEvolutionMonthlyChartOptions"
            :series="StakeEvolutionMonthlySeries"
          />
        </div>
        <div id="stake-evolution-weekly-chart" class="mt-5 mb-5 text-center">
          <h3>
            {{ $t("details.intention.total_bonded") }} -
            {{ $t("details.intention.weekly_chart") }}
            <small
              v-if="weekly.last - weekly.first > 0"
              class="change text-success ml-3"
              ><i class="far fa-thumbs-up" /> +{{
                formatAmount(weekly.last - weekly.first)
              }}</small
            ><small
              v-if="weekly.last - weekly.first < 0"
              class="change text-danger ml-3"
              ><i class="far fa-thumbs-down" />
              {{ formatAmount(weekly.last - weekly.first) }}</small
            >
          </h3>
          <chart
            :options="StakeEvolutionWeeklyChartOptions"
            :series="StakeEvolutionWeeklySeries"
          />
        </div>
        <div id="stake-evolution-daily-chart" class="mb-5 text-center">
          <h3>
            {{ $t("details.intention.total_bonded") }} -
            {{ $t("details.intention.daily_chart") }}
            <small
              v-if="daily.last - daily.first > 0"
              class="change text-success ml-3"
              ><i class="far fa-thumbs-up" /> +{{
                formatAmount(daily.last - daily.first)
              }}</small
            ><small
              v-if="daily.last - daily.first < 0"
              class="change text-danger ml-3"
              ><i class="far fa-thumbs-down" />
              {{ formatAmount(daily.last - daily.first) }}</small
            >
          </h3>
          <chart
            :options="StakeEvolutionDailyChartOptions"
            :series="StakeEvolutionDailySeries"
          />
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
import { isHex } from "@polkadot/util";
import BN from "bn.js";
import { backendBaseURL, blockExplorer } from "../../polkastats.config.js";
import commonMixin from "../../mixins/commonMixin.js";

export default {
  components: {
    chart,
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      accountId: this.$route.query.accountId,
      blockExplorer,
      backendBaseURL,
      polling: null,
      graphPolling: null,
      favorites: [],
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
      }
    };
  },
  computed: {
    intentions() {
      return this.$store.state.intentions.list;
    },
    identities() {
      return this.$store.state.identities.list;
    },
    indexes() {
      return this.$store.state.indexes.list;
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
    if (this.$store.state.intentions.list.length == 0) {
      vm.$store.dispatch("intentions/update");
    }

    // Force update of staking_identity list if empty
    if (this.$store.state.stakingIdentities.list.length == 0) {
      vm.$store.dispatch("stakingIdentities/update");
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length == 0) {
      vm.$store.dispatch("identities/update");
    }

    // Force update of account indexes list if empty
    if (this.$store.state.indexes.list.length == 0) {
      vm.$store.dispatch("indexes/update");
    }

    // Update intention validators every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("intentions/update");
      vm.$store.dispatch("stakingIdentities/update");
    }, 10000);

    // Refresh graph data and account indexes every minute
    this.graphPolling = setInterval(() => {
      this.getValidatorDailyGraphData();
      this.getValidatorWeeklyGraphData();
      this.getValidatorMonthlyGraphData();
      vm.$store.dispatch("indexes/update");
    }, 60000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
    clearInterval(this.graphPolling);
  },
  methods: {
    getValidatorDailyGraphData: function() {
      var vm = this;
      axios
        .get(`${this.backendBaseURL}/intention/graph/daily/${this.accountId}`)
        .then(function(response) {
          // Update chart data
          var newCategories = [];
          var newData = [];

          //console.log(response.data);

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
        .get(`${this.backendBaseURL}/intention/graph/weekly/${this.accountId}`)
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
        .get(`${this.backendBaseURL}/intention/graph/monthly/${this.accountId}`)
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
    }
  },
  head() {
    return {
      title:
        "PolkaStats - Polkadot Kusama intention validator " +
        this.$route.query.accountId,
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Polkadot Kusama intention validator " + this.$route.query.accountId
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
.page-intention .favorite {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  cursor: initial;
}
</style>

<template>
  <div>
    <section>
      <b-container class="page-intention main pt-3 pb-5">
        <template v-if="intention">
          <div :key="intention.account_id" class="row">
            <div class="col-12 mt-4 text-center">
              <h4 class="mb-1">
                {{ $t("details.intention.intention") }}
                <span v-if="intention.display_name">{{
                  intention.display_name
                }}</span>
                <span v-else>{{ accountId }}</span>
              </h4>
            </div>
          </div>
          <div class="validator-detail card mt-4 mb-3">
            <div class="card-body">
              <i
                v-if="isFavorite(intention.account_id)"
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
                  <div v-if="intention.display_name">
                    <Identicon
                      :key="intention.account_id"
                      :value="intention.account_id"
                      :size="80"
                      :theme="'polkadot'"
                    />
                    {{ intention.display_name }}
                  </div>
                  <div v-else>
                    <Identicon
                      :key="intention.account_id"
                      :value="intention.account_id"
                      :size="80"
                      :theme="'polkadot'"
                    />
                  </div>
                  <p class="mb-0 rank">rank #{{ intention.rank }}</p>
                  <p
                    v-b-tooltip.hover
                    class="bonded mb-0"
                    :title="$t('details.intention.active_bonded')"
                  >
                    {{
                      formatAmount(JSON.parse(intention.staking_ledger).active)
                    }}
                  </p>
                  <p class="mb-0">
                    <small>
                      <span v-b-tooltip.hover title="Total bonded">
                        {{ formatAmount(intention.staking_ledger_total) }}
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
                        :key="intention.stash_id"
                        :value="intention.stash_id"
                        :size="20"
                        :theme="'polkadot'"
                      />
                      <a
                        :href="blockExplorer.account + intention.stash_id"
                        target="_blank"
                      >
                        <span
                          v-b-tooltip.hover
                          class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                          :title="intention.stash_id"
                          >{{ shortAddress(intention.stash_id) }}</span
                        >
                        <span
                          class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                          >{{ shortAddress(intention.stash_id) }}</span
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
                        :key="intention.controller_id"
                        :value="intention.controller_id"
                        :size="20"
                        :theme="'polkadot'"
                      />
                      <a
                        :href="blockExplorer.account + intention.controller_id"
                        target="_blank"
                      >
                        <span
                          v-b-tooltip.hover
                          class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                          :title="intention.controller_id"
                          >{{ shortAddress(intention.controller_id) }}
                        </span>
                        <span
                          class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                          >{{ shortAddress(intention.controller_id) }}</span
                        >
                      </a>
                    </div>
                  </div>
                  <div v-if="intention.session_id_hex" class="row">
                    <div class="col-md-3 mb-2">
                      <strong>{{ $t("details.intention.session_id") }}</strong>
                    </div>
                    <div id="session-id-info" class="col-md-9 mb-2">
                      <b-button
                        v-b-toggle="`accordion-sessionIdHex`"
                        variant="link"
                        style="text-decoration: none; font-size: 0.9rem; padding: 0; border: 0; color: #670d35"
                      >
                        <i
                          class="fa fa-chevron-right mr-1"
                          aria-hidden="true"
                        ></i>
                        {{ shortSessionId(intention.session_id_hex) }}
                      </b-button>
                      <b-collapse
                        :id="`accordion-sessionIdHex`"
                        class="collapse pt-2 pb-3"
                        :data-parent="'#session-id-info'"
                      >
                        {{ intention.session_id_hex }}
                      </b-collapse>
                    </div>
                  </div>
                  <div v-if="intention.next_session_id_hex" class="row">
                    <div class="col-md-3 mb-2">
                      <strong>{{
                        $t("details.intention.next_session_id")
                      }}</strong>
                    </div>
                    <div id="next-session-id-info" class="col-md-9 mb-2">
                      <b-button
                        v-b-toggle="`accordion-nextSessionIdHex`"
                        variant="link"
                        style="text-decoration: none; font-size: 0.9rem; padding: 0; border: 0; color: #670d35"
                      >
                        <i
                          class="fa fa-chevron-right mr-1"
                          aria-hidden="true"
                        ></i>
                        {{ shortSessionId(intention.next_session_id_hex) }}
                      </b-button>
                      <b-collapse
                        :id="`accordion-nextSessionIdHex`"
                        class="collapse pt-2 pb-3"
                        :data-parent="'#next-session-id-info'"
                      >
                        {{ intention.next_session_id_hex }}
                      </b-collapse>
                    </div>
                  </div>
                  <div v-if="intention.commission" class="row">
                    <div class="col-md-3 mb-2">
                      <strong>{{ $t("details.intention.commission") }}</strong>
                    </div>
                    <div class="col-md-9 mb-2 fee">
                      {{ (intention.commission / 10000000).toFixed(2) }}%
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col-md-3 mb-2">
                      <strong>{{
                        $t("details.intention.reward_destination")
                      }}</strong>
                    </div>
                    <div class="col-md-9 mb-2 fee">
                      {{ intention.reward_destination }}
                    </div>
                  </div>
                  <!-- identity start -->
                  <div v-if="JSON.parse(intention.identity)">
                    <div v-if="intention.display_name" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("details.intention.name") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ intention.display_name }}
                      </div>
                    </div>
                    <div
                      v-if="JSON.parse(intention.identity).email"
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>{{ $t("details.intention.email") }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="
                            `mailto:${JSON.parse(intention.identity).email}`
                          "
                          target="_blank"
                        >
                          {{ JSON.parse(intention.identity).email }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="JSON.parse(intention.identity).legal"
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>{{ $t("details.intention.legal") }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        {{ JSON.parse(intention.identity).legal }}
                      </div>
                    </div>
                    <div v-if="JSON.parse(intention.identity).riot" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>{{ $t("details.intention.riot") }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="
                            `https://riot.im/app/#/user/${
                              JSON.parse(intention.identity).riot
                            }`
                          "
                          target="_blank"
                        >
                          {{ JSON.parse(intention.identity).riot }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="JSON.parse(intention.identity).twitter"
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>Twitter</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="
                            `https://twitter.com/${
                              JSON.parse(intention.identity).twitter
                            }`
                          "
                          target="_blank"
                        >
                          {{ JSON.parse(intention.identity).twitter }}
                        </a>
                      </div>
                    </div>
                    <div v-if="JSON.parse(intention.identity).web" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Web</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="JSON.parse(intention.identity).web"
                          target="_blank"
                        >
                          {{ JSON.parse(intention.identity).web }}
                        </a>
                      </div>
                    </div>
                  </div>
                  <!-- identity end -->
                  <div id="validator-info" class="mt-2">
                    <template v-if="intention.num_stakers > 0">
                      <b-button
                        v-b-toggle="`accordion-staker-intention`"
                        variant="link"
                        style="text-decoration: none"
                      >
                        <h6 class="h6 nominators d-inline mr-4">
                          <i
                            class="fa fa-chevron-right mr-1"
                            aria-hidden="true"
                          ></i>
                          {{ $t("details.intention.stakers") }} ({{
                            intention.num_stakers
                          }})
                        </h6>
                      </b-button>
                    </template>
                    <template
                      v-if="JSON.parse(intention.next_session_ids).length > 0"
                    >
                      <b-button
                        v-b-toggle="`accordion-session-id-intention`"
                        variant="link"
                        style="text-decoration: none"
                      >
                        <h6 class="h6 nominators d-inline mr-4">
                          <i
                            class="fa fa-chevron-right mr-1"
                            aria-hidden="true"
                          ></i>
                          {{ $t("details.intention.next_session_ids") }} ({{
                            JSON.parse(intention.next_session_ids).length
                          }})
                        </h6>
                      </b-button>
                    </template>
                    <template
                      v-if="JSON.parse(intention.next_session_ids).length > 0"
                    >
                      <b-collapse
                        :id="`accordion-session-id-intention`"
                        class="nominator collapse pt-2 pb-3"
                        data-parent="#validator-info"
                      >
                        <div
                          v-for="(sessionId, index) in JSON.parse(
                            intention.next_session_ids
                          )"
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
                      </b-collapse>
                    </template>
                    <template v-if="intention.num_stakers > 0">
                      <b-collapse
                        :id="`accordion-staker-intention`"
                        class="nominator collapse pt-2 pb-3"
                        data-parent="#validator-info"
                      >
                        <div
                          v-for="(staker, index) in JSON.parse(
                            intention.stakers
                          )"
                          :key="index"
                          class="row"
                        >
                          <div class="col-12 mb-1 who">
                            <Identicon
                              :key="staker"
                              :value="staker"
                              :size="20"
                              :theme="'polkadot'"
                            />
                            <a
                              :href="blockExplorer.account + staker"
                              target="_blank"
                            >
                              <span
                                v-b-tooltip.hover
                                class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none"
                                :title="staker"
                                >{{ shortAddress(staker) }}</span
                              >
                              <span
                                class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block"
                                >{{ shortAddress(staker) }}</span
                              >
                            </a>
                          </div>
                        </div>
                      </b-collapse>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import gql from "graphql-tag";
import moment from "moment";
import chart from "../../components/chart";
import { commonChartOptions } from "../commons/chartOptions";
import Identicon from "../../components/identicon.vue";
import { isHex } from "@polkadot/util";
import BN from "bn.js";
import { blockExplorer } from "../../polkastats.config.js";
import commonMixin from "../../mixins/commonMixin.js";

export default {
  components: {
    chart,
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      currentSessionIndex: 0,
      intention: undefined,
      accountId: this.$route.query.accountId,
      blockExplorer,
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
          name: "Total bonded (DOT)",
          data: []
        }
      ],
      StakeEvolutionWeeklySeries: [
        {
          name: "Total bonded (DOT)",
          data: []
        }
      ],
      StakeEvolutionMonthlySeries: [
        {
          name: "Total bonded (DOT)",
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

    // Refresh graph data every minute
    this.graphPolling = setInterval(() => {
      this.getValidatorDailyGraphData();
      this.getValidatorWeeklyGraphData();
      this.getValidatorMonthlyGraphData();
    }, 60000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
    clearInterval(this.graphPolling);
  },
  methods: {
    getTimestamp(time) {
      switch (time) {
        case "day":
          return parseInt(new Date().getTime() / 1000) - 86400;
        case "week":
          return parseInt(new Date().getTime() / 1000) - 604800;
        case "month":
          return parseInt(new Date().getTime() / 1000) - 2592000;
        default:
          return parseInt(new Date().getTime() / 1000) - 2592000;
      }
    },
    getValidatorDailyGraphData: function() {
      var vm = this;

      const GET_INTENTION_BONDED = gql`
        query intention {
          intention(
            where: { account_id: { _eq: "${
              this.accountId
            }" }, timestamp: { _gt: ${this.getTimestamp("day")} } }
            order_by: { timestamp: desc }
          ) {
            account_id
            staking_ledger_total
            block_height
            session_index
            timestamp
          }
        }
      `;

      vm.$apolloProvider.defaultClient
        .query({ query: GET_INTENTION_BONDED })
        .then(function(response) {
          // Update chart data
          var newCategories = [];
          var newData = [];
          const { intention } = response.data;

          for (var i = 0; i < intention.length; i++) {
            // Insert firt point, last point and points with different values
            if (
              i == 0 ||
              i == intention.length - 1 ||
              (i > 0 &&
                intention[i].staking_ledger_total !==
                  intention[i - 1].staking_ledger_total)
            ) {
              // Save first and last point
              if (i == 0) vm.daily.last = intention[i].staking_ledger_total;
              if (i == intention.length - 1)
                vm.daily.first = intention[i].staking_ledger_total;

              newCategories.push(
                moment
                  .unix(intention[i].timestamp / 1000)
                  .format("YYYY-MM-DD HH:mm:ss")
              );
              newData.push(intention[i].staking_ledger_total);
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
                  text: "Total bonded (DOT)"
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

      const GET_INTENTION_BONDED = gql`
        query intention {
          intention(
            where: { account_id: { _eq: "${
              this.accountId
            }" }, timestamp: { _gt: ${this.getTimestamp("week")} } }
            order_by: { timestamp: desc }
          ) {
            account_id
            staking_ledger_total
            block_height
            session_index
            timestamp
          }
        }
      `;

      vm.$apolloProvider.defaultClient
        .query({ query: GET_INTENTION_BONDED })
        .then(function(response) {
          // Update chart data
          var newCategories = [];
          var newData = [];
          const { intention } = response.data;

          for (var i = 0; i < intention.length; i++) {
            // Save first and last point
            if (i == 0) vm.weekly.last = intention[i].staking_ledger_total;
            if (i == intention.length - 1)
              vm.weekly.first = intention[i].staking_ledger_total;

            newCategories.push(
              moment
                .unix(intention[i].timestamp / 1000)
                .format("YYYY-MM-DD HH:mm:ss")
            );
            newData.push(intention[i].staking_ledger_total);
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
                  text: "Total bonded (DOT)"
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

      const GET_INTENTION_BONDED = gql`
        query intention {
          intention(
            where: { account_id: { _eq: "${
              this.accountId
            }" }, timestamp: { _gt: ${this.getTimestamp("month")} } }
            order_by: { timestamp: desc }
          ) {
            account_id
            staking_ledger_total
            block_height
            session_index
            timestamp
          }
        }
      `;

      vm.$apolloProvider.defaultClient
        .query({ query: GET_INTENTION_BONDED })
        .then(function(response) {
          // Update chart data
          var newCategories = [];
          var newData = [];
          const { intention } = response.data;

          for (var i = 0; i < intention.length; i++) {
            // Save first and last point
            if (i == 0) vm.monthly.last = intention[i].staking_ledger_total;
            if (i == intention.length - 1)
              vm.monthly.first = intention[i].staking_ledger_total;

            newCategories.push(
              moment
                .unix(intention[i].timestamp / 1000)
                .format("YYYY-MM-DD HH:mm:ss")
            );
            newData.push(intention[i].staking_ledger_total);
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
                  text: "Total bonded (DOT)"
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
    }
  },
  apollo: {
    $subscribe: {
      intention: {
        query: gql`
          subscription intention($session_index: Int!, $account_id: String!) {
            intention(
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
              identity
              next_elected
              next_session_id_hex
              next_session_ids
              nominators
              rank
              reward_destination
              session_index
              stakers
              staking_ledger
              staking_ledger_total
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
          console.log(data);
          this.intention = {
            ...data.intention[0],
            num_stakers: JSON.parse(data.intention[0].stakers).length,
            favorite: this.isFavorite(data.intention[0].account_id)
          };
        }
      },
      sessionIndex: {
        query: gql`
          subscription intention {
            intention(order_by: { session_index: desc }, where: {}, limit: 1) {
              session_index
            }
          }
        `,
        result({ data }) {
          if (data.intention[0].session_index > this.currentSessionIndex) {
            this.currentSessionIndex = data.intention[0].session_index;
          }
        }
      }
    }
  },
  head() {
    return {
      title:
        "PolkaStats - Polkadot intention validator " +
        this.$route.query.accountId,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Polkadot intention validator " + this.$route.query.accountId
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
.page-intention .identicon {
  margin-bottom: 0.8rem;
}
</style>

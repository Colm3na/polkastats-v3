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
            <div class="card-body">
              <div>
                <i
                  v-if="validator.next_elected"
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
              </div>
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

                <hr v-if="!overBreakpoint" class="separator w-100" />

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
                      </a>
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
                  <hr class="separator" />
                  <!-- Charts -->
                  <section>
                    <h5 class="h5 account my-3">
                      {{ $t("details.validator.charts") }}
                    </h5>
                    <b-tabs>
                      <b-tab
                        :title="$t('details.validator.total_bonded')"
                        active
                      >
                        <b-tabs
                          pills
                          :card="overBreakpoint"
                          :vertical="overBreakpoint"
                          :end="!overBreakpoint"
                        >
                          <b-tab
                            :title="$t('details.validator.monthly')"
                            active
                          >
                            <div
                              id="stake-evolution-monthly-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="parseInt(Stake.monthly.first)"
                                :last="parseInt(Stake.monthly.last)"
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
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="parseInt(Stake.weekly.first)"
                                :last="parseInt(Stake.weekly.last)"
                              />
                              <chart
                                :options="StakeEvolutionWeeklyChartOptions"
                                :series="StakeEvolutionWeeklySeries"
                              />
                            </div>
                          </b-tab>
                          <b-tab :title="$t('details.validator.daily')">
                            <div
                              id="stake-evolution-daily-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="parseInt(Stake.daily.first)"
                                :last="parseInt(Stake.daily.last)"
                              />
                              <chart
                                :options="StakeEvolutionDailyChartOptions"
                                :series="StakeEvolutionDailySeries"
                              />
                            </div>
                          </b-tab>
                        </b-tabs>
                      </b-tab>
                      <b-tab :title="$t('details.validator.reward')">
                        <b-tabs
                          pills
                          :card="overBreakpoint"
                          :vertical="overBreakpoint"
                          :end="!overBreakpoint"
                        >
                          <b-tab
                            :title="$t('details.validator.monthly')"
                            active
                          >
                            <div
                              id="rewards-evolution-monthly-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="0"
                                :last="parseInt(rewards.month)"
                              />
                              <chart
                                :options="RewardsMonthlyChartOptions"
                                :series="RewardsEvolutionMonthlySeries"
                              />
                            </div>
                          </b-tab>
                          <b-tab :title="$t('details.validator.weekly')">
                            <div
                              id="rewards-evolution-weekly-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="0"
                                :last="parseInt(rewards.week)"
                              />
                              <chart
                                :options="RewardsWeeklyChartOptions"
                                :series="RewardsEvolutionWeeklySeries"
                              />
                            </div>
                          </b-tab>
                          <b-tab :title="$t('details.validator.daily')">
                            <div
                              id="rewards-evolution-daily-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="0"
                                :last="parseInt(rewards.day)"
                              />
                              <chart
                                :options="RewardsDailyChartOptions"
                                :series="RewardsEvolutionDailySeries"
                              />
                            </div>
                          </b-tab>
                        </b-tabs>
                      </b-tab>
                      <b-tab :title="$t('details.validator.slashes')">
                        <b-tabs
                          pills
                          :card="overBreakpoint"
                          :vertical="overBreakpoint"
                          :end="!overBreakpoint"
                        >
                          <b-tab
                            :title="$t('details.validator.monthly')"
                            active
                          >
                            <div
                              id="slashes-evolution-monthly-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="0"
                                :last="parseInt(slashes.month)"
                              />
                              <chart
                                :options="SlashesMonthlyChartOptions"
                                :series="SlashesEvolutionMonthlySeries"
                              />
                            </div>
                          </b-tab>
                          <b-tab :title="$t('details.validator.weekly')">
                            <div
                              id="slashes-evolution-weekly-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="0"
                                :last="parseInt(slashes.week)"
                              />
                              <chart
                                :options="SlashesWeeklyChartOptions"
                                :series="SlashesEvolutionWeeklySeries"
                              />
                            </div>
                          </b-tab>
                          <b-tab :title="$t('details.validator.daily')">
                            <div
                              id="slashes-evolution-daily-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="0"
                                :last="parseInt(slashes.day)"
                              />
                              <chart
                                :options="SlashesDailyChartOptions"
                                :series="SlashesEvolutionDailySeries"
                              />
                            </div>
                          </b-tab>
                        </b-tabs>
                      </b-tab>
                      <b-tab :title="$t('details.validator.produced_blocks')">
                        <b-tabs
                          pills
                          :card="overBreakpoint"
                          :vertical="overBreakpoint"
                          :end="!overBreakpoint"
                        >
                          <b-tab
                            :title="$t('details.validator.monthly')"
                            active
                          >
                            <div
                              id="produced-blocks-evolution-monthly-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="0"
                                :last="parseInt(producedBlocks.month)"
                                :formated="false"
                              />
                              <chart
                                :options="ProducedBlocksMonthlyChartOptions"
                                :series="ProducedBlocksEvolutionMonthlySeries"
                              />
                            </div>
                          </b-tab>
                          <b-tab :title="$t('details.validator.weekly')">
                            <div
                              id="produced-blockss-evolution-weekly-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="0"
                                :last="parseInt(producedBlocks.week)"
                                :formated="false"
                              />
                              <chart
                                :options="ProducedBlocksWeeklyChartOptions"
                                :series="ProducedBlocksEvolutionWeeklySeries"
                              />
                            </div>
                          </b-tab>
                          <b-tab :title="$t('details.validator.daily')">
                            <div
                              id="produced-blocks-evolution-daily-chart"
                              class="text-center charts"
                            >
                              <chartHeader
                                :first="0"
                                :last="parseInt(producedBlocks.day)"
                                :formated="false"
                              />
                              <chart
                                :options="ProducedBlocksDailyChartOptions"
                                :series="ProducedBlocksEvolutionDailySeries"
                              />
                            </div>
                          </b-tab>
                        </b-tabs>
                      </b-tab>
                    </b-tabs>
                  </section>

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
import chart from "../../components/chart";
import Identicon from "../../components/identicon.vue";
import chartHeader from "../../components/chart-header.vue";
import { isHex } from "@polkadot/util";
import BN from "bn.js";
import {
  mediumBreakpoint,
  mobileBreakpoint
} from "../../polkastats.config.js";
import commonMixin from "../../mixins/commonMixin.js";
import {
  createQueryProducedBlocks,
  createQueryRewards,
  createQuerySlashes,
  createQueryValidadorBonded
} from "./queries";

export default {
  components: {
    chart,
    Identicon,
    chartHeader
  },
  mixins: [commonMixin],
  data: function() {
    return {
      totalStakeBonded: 0,
      currentSessionIndex: 0,
      validator: undefined,
      accountId: this.$route.query.accountId,
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
          key: "value",
          label: this.$t("details.validator.amount"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        }
      ],
      Stake: {
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
        }
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
      StakeEvolutionDailyChartOptions: this.createChartOptions(
        this.$t("details.validator.total_bonded") + " (DOT)"
      ),
      StakeEvolutionWeeklyChartOptions: this.createChartOptions(
        this.$t("details.validator.total_bonded") + " (DOT)"
      ),
      StakeEvolutionMonthlyChartOptions: this.createChartOptions(
        this.$t("details.validator.total_bonded") + " (DOT)"
      ),
      rewards: {
        day: 0,
        week: 0,
        month: 0
      },
      RewardsEvolutionDailySeries: [
        {
          name: "Era rewards (DOT)",
          data: []
        }
      ],
      RewardsEvolutionWeeklySeries: [
        {
          name: "Era rewards (DOT)",
          data: []
        }
      ],
      RewardsEvolutionMonthlySeries: [
        {
          name: "Era rewards (DOT)",
          data: []
        }
      ],
      RewardsDailyChartOptions: this.createChartOptions(
        this.$t("details.validator.reward") + " (DOT)"
      ),
      RewardsWeeklyChartOptions: this.createChartOptions(
        this.$t("details.validator.reward") + " (DOT)"
      ),
      RewardsMonthlyChartOptions: this.createChartOptions(
        this.$t("details.validator.reward") + " (DOT)"
      ),
      // Slashes
      Slashes: {
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
        }
      },
      slashes: {
        day: 0,
        week: 0,
        month: 0
      },
      SlashesEvolutionDailySeries: [
        {
          name: "Slashes",
          data: []
        }
      ],
      SlashesEvolutionWeeklySeries: [
        {
          name: "Slashes",
          data: []
        }
      ],
      SlashesEvolutionMonthlySeries: [
        {
          name: "Slashes",
          data: []
        }
      ],
      SlashesDailyChartOptions: this.createChartOptions(
        this.$t("details.validator.slashes")
      ),
      SlashesWeeklyChartOptions: this.createChartOptions(
        this.$t("details.validator.slashes")
      ),
      SlashesMonthlyChartOptions: this.createChartOptions(
        this.$t("details.validator.slashes")
      ),
      //
      // Pruduced Blocks
      producedBlocks: {
        day: 0,
        week: 0,
        month: 0
      },
      ProducedBlocksEvolutionDailySeries: [
        {
          name: "Produced Blocks",
          data: []
        }
      ],
      ProducedBlocksEvolutionWeeklySeries: [
        {
          name: "Produced Blocks",
          data: []
        }
      ],
      ProducedBlocksEvolutionMonthlySeries: [
        {
          name: "Produced Blocks",
          data: []
        }
      ],
      ProducedBlocksDailyChartOptions: this.createChartOptions(
        this.$t("details.validator.produced_blocks")
      ),
      ProducedBlocksWeeklyChartOptions: this.createChartOptions(
        this.$t("details.validator.produced_blocks")
      ),
      ProducedBlocksMonthlyChartOptions: this.createChartOptions(
        this.$t("details.validator.produced_blocks")
      ),
      //
      totalIssuance: "",
      overBreakpoint: window.innerWidth > mediumBreakpoint
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

      // Update graph data
      this.getAllChartsData();

      // Restart graph data polling
      clearInterval(this.graphPolling);
      this.graphPolling = setInterval(() => {
        // this.getAllChartsData();
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
    this.getAllChartsData();

    // Refresh graph data every minute
    this.graphPolling = setInterval(() => {
      // this.getAllChartsData();
    }, 60000);

    window.addEventListener("resize", this.resizeWindow);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeWindow);
  },
  beforeDestroy: function() {
    clearInterval(this.graphPolling);
  },
  methods: {
    resizeWindow(e) {
      this.overBreakpoint = window.innerWidth > this.mediumBreakpoint;
    },
    getAllChartsData() {
      this.getValidatorDailyGraphData();
      this.getValidatorWeeklyGraphData();
      this.getValidatorMonthlyGraphData();
      this.getRewardsMonthlyGraphData();
      this.getRewardsWeeklyGraphData();
      this.getRewardsDailyGraphData();
      this.getSlashesDailyGraphData();
      this.getSlashesWeeklyGraphData();
      this.getSlashesMonthlyGraphData();
      this.getProducedBlocksDailyGraphData();
      this.getProducedBlocksWeeklyGraphData();
      this.getProducedBlocksMonthlyGraphData();
    },
    getTimestamp(time) {
      switch (time) {
        case "day":
          return parseInt(new Date().getTime()) - 86400000;
        case "week":
          return parseInt(new Date().getTime()) - 604800000;
        case "month":
          return parseInt(new Date().getTime()) - 2592000000;
        default:
          return parseInt(new Date().getTime()) - 2592000000;
      }
    },
    createChartOptions: function(yTitle) {
      return {
        xaxis: {
          type: "datetime",
          title: {
            text: this.$t("details.validator.date_time") + " (UTC)"
          },
          labels: {
            formatter: val => {
              return moment.unix(val / 1000).format("MM/DD/YYYY HH:mm");
            }
          }
        },
        yaxis: {
          title: {
            text: yTitle
          },
          labels: {
            formatter: val => {
              if (this.overBreakpoint) {
                return (val / 1000000000000).toFixed(6);
              } else {
                return (val / 1000000000000).toFixed(4);
              }
            }
          }
        }
      };
    },
    createValidatorsCategoriesAndData: function(validator_bonded, time) {
      let newCategories = [];
      let newData = [];

      for (var i = 0; i < validator_bonded.length; i++) {
        // Insert firt point, last point and points with different values
        if (
          i == 0 ||
          i == validator_bonded.length - 1 ||
          (i > 0 &&
            validator_bonded[i].exposure_total !==
              validator_bonded[i - 1].exposure_total)
        ) {
          // Save first and last point
          switch (time) {
            case "day":
              if (i == 0)
                this.Stake.daily.last = validator_bonded[i].exposure_total;
              if (i == validator_bonded.length - 1)
                this.Stake.daily.first = validator_bonded[i].exposure_total;
              break;
            case "week":
              if (i == 0)
                this.Stake.weekly.last = validator_bonded[i].exposure_total;
              if (i == validator_bonded.length - 1)
                this.Stake.weekly.first = validator_bonded[i].exposure_total;
              break;
            case "month":
              if (i == 0)
                this.Stake.monthly.last = validator_bonded[i].exposure_total;
              if (i == validator_bonded.length - 1)
                this.Stake.monthly.first = validator_bonded[i].exposure_total;
              break;
            default:
              break;
          }

          newCategories.push(
            moment
              .unix(validator_bonded[i].timestamp / 1000)
              .format("YYYY-MM-DD HH:mm:ss")
          );
          newData.push(validator_bonded[i].exposure_total);
        }
      }

      newCategories.reverse();
      newData.reverse();

      return { newCategories, newData };
    },
    getValidatorDailyGraphData: function() {
      const timestamp = this.getTimestamp("day");

      const GET_VALIDATOR_BONDED = gql`
        ${createQueryValidadorBonded(timestamp, this.accountId)}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_VALIDATOR_BONDED })
        .then(response => {
          const { validator } = response.data;

          const {
            newCategories,
            newData
          } = this.createValidatorsCategoriesAndData(validator, "day");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.StakeEvolutionDailyChartOptions = R.mergeDeepRight(
            this.StakeEvolutionDailyChartOptions,
            {
              markers: { size: 4 },
              xaxis: {
                categories: newCategories
              }
            }
          );

          // In the same way, update the series option
          this.StakeEvolutionDailySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getValidatorWeeklyGraphData: function() {
      const timestamp = this.getTimestamp("week");

      const GET_VALIDATOR_BONDED = gql`
        ${createQueryValidadorBonded(timestamp, this.accountId)}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_VALIDATOR_BONDED })
        .then(response => {
          const { validator } = response.data;

          const {
            newCategories,
            newData
          } = this.createValidatorsCategoriesAndData(validator, "week");

          this.StakeEvolutionWeeklyChartOptions = R.mergeDeepRight(
            this.StakeEvolutionWeeklyChartOptions,
            {
              markers: { size: 4 },
              xaxis: {
                categories: newCategories
              }
            }
          );

          // In the same way, update the series option
          this.StakeEvolutionWeeklySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getValidatorMonthlyGraphData: function() {
      const timestamp = this.getTimestamp("month");
      const GET_VALIDATOR_BONDED = gql`
        ${createQueryValidadorBonded(timestamp, this.accountId)}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_VALIDATOR_BONDED })
        .then(response => {
          const { validator } = response.data;
          const {
            newCategories,
            newData
          } = this.createValidatorsCategoriesAndData(validator, "month");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.StakeEvolutionMonthlyChartOptions = R.mergeDeepRight(
            this.StakeEvolutionMonthlyChartOptions,
            {
              markers: { size: 4 },
              xaxis: {
                categories: newCategories
              }
            }
          );

          // In the same way, update the series option
          this.StakeEvolutionMonthlySeries = [
            {
              data: newData
            }
          ];
        });
    },
    createRewardsCategoriesAndData: function(rewards, time) {
      let newCategories = [];
      let newData = [];
      this.rewards[time] = 0;
      if (rewards.length !== 0) {
        for (var i = 0; i < rewards.length; i++) {
          newCategories.push(
            moment
              .unix(rewards[i].timestamp / 1000)
              .format("YYYY-MM-DD HH:mm:ss")
          );
          newData.push(rewards[i].estimated_payout);
          this.rewards[time] += rewards[i].estimated_payout;
        }
      } else {
        newCategories.push(
          moment
            .unix(this.getTimestamp(time) / 1000)
            .format("YYYY-MM-DD HH:mm:ss")
        );
      }

      newCategories.reverse();
      newData.reverse();

      return { newCategories, newData };
    },
    getRewardsMonthlyGraphData: function() {
      const timestamp = this.getTimestamp("month");
      const query = createQueryRewards(timestamp, this.accountId);
      const GET_REWARDS = gql`
        ${query}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_REWARDS })
        .then(response => {
          // Update chart data
          this.rewards.month = 0;
          const { reward: r } = response.data;

          const {
            newCategories,
            newData
          } = this.createRewardsCategoriesAndData(r, "month");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.RewardsMonthlyChartOptions = R.mergeDeepRight(
            this.RewardsMonthlyChartOptions,
            {
              markers: { size: 4 },
              xaxis: {
                categories: newCategories
              }
            }
          );

          // In the same way, update the series option
          this.RewardsEvolutionMonthlySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getRewardsWeeklyGraphData: function() {
      const timestamp = this.getTimestamp("week");
      const query = createQueryRewards(timestamp, this.accountId);
      const GET_REWARDS = gql`
        ${query}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_REWARDS })
        .then(response => {
          // Update chart data
          this.rewards.week = 0;
          const { reward: r } = response.data;

          const {
            newCategories,
            newData
          } = this.createRewardsCategoriesAndData(r, "week");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.RewardsWeeklyChartOptions = R.mergeDeepRight(
            this.RewardsWeeklyChartOptions,
            {
              markers: { size: 4 },
              xaxis: {
                categories: newCategories
              }
            }
          );

          // In the same way, update the series option
          this.RewardsEvolutionWeeklySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getRewardsDailyGraphData: function() {
      const timestamp = this.getTimestamp("day");
      const query = createQueryRewards(timestamp, this.accountId);
      const GET_REWARDS = gql`
        ${query}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_REWARDS })
        .then(response => {
          // Update chart data
          this.rewards.day = 0;
          const { reward: r } = response.data;

          const {
            newCategories,
            newData
          } = this.createRewardsCategoriesAndData(r, "day");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.RewardsDailyChartOptions = R.mergeDeepRight(
            this.RewardsDailyChartOptions,
            {
              xaxis: {
                categories: newCategories
              }
            }
          );

          // In the same way, update the series option
          this.RewardsEvolutionDailySeries = [
            {
              data: newData
            }
          ];
        });
    },
    createSlashesChartOptions(slashes, time) {
      let newCategories = [];
      let newData = [];

      if (slashes.length !== 0) {
        for (var i = 0; i < slashes.length; i++) {
          newCategories.push(
            moment
              .unix(slashes[i].timestamp / 1000)
              .format("YYYY-MM-DD HH:mm:ss")
          );
          newData.push(slashes[i].block_height);
          this.slashes[time] += slashes[i].amount;
        }
      } else {
        newCategories.push(
          moment
            .unix(this.getTimestamp(time) / 1000)
            .format("YYYY-MM-DD HH:mm:ss")
        );
      }

      newCategories.reverse();
      newData.reverse();

      return { newCategories, newData };
    },
    getSlashesDailyGraphData() {
      const timestamp = this.getTimestamp("day");

      const query = createQuerySlashes(timestamp, this.accountId);
      const GET_SLASHES = gql`
        ${query}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_SLASHES })
        .then(response => {
          // Update chart data
          this.slashes.day = 0;
          const { validator_slashes_era } = response.data;
          const { newCategories, newData } = this.createSlashesChartOptions(
            validator_slashes_era,
            "day"
          );
          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.SlashesDailyChartOptions = R.mergeDeepRight(
            this.SlashesDailyChartOptions,
            {
              xaxis: {
                categories: newCategories
              }
            }
          );
          // In the same way, update the series option
          this.SlashesEvolutionDailySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getSlashesWeeklyGraphData() {
      const timestamp = this.getTimestamp("week");

      const query = createQuerySlashes(timestamp, this.accountId);
      const GET_SLASHES = gql`
        ${query}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_SLASHES })
        .then(response => {
          // Update chart data
          this.slashes.week = 0;
          const { validator_slashes_era } = response.data;
          const { newCategories, newData } = this.createSlashesChartOptions(
            validator_slashes_era,
            "week"
          );
          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.SlashesWeeklyChartOptions = R.mergeDeepRight(
            this.SlashesWeeklyChartOptions,
            {
              markers: { size: 4 },
              xaxis: {
                categories: newCategories
              }
            }
          );
          // In the same way, update the series option
          this.SlashesEvolutionWeeklySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getSlashesMonthlyGraphData() {
      const timestamp = this.getTimestamp("month");
      const query = createQuerySlashes(timestamp, this.accountId);
      const GET_SLASHES = gql`
        ${query}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_SLASHES })
        .then(response => {
          // Update chart data
          this.slashes.month = 0;
          const { validator_slashes_era } = response.data;
          const { newCategories, newData } = this.createSlashesChartOptions(
            validator_slashes_era,
            "month"
          );
          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.SlashesMonthlyChartOptions = R.mergeDeepRight(
            this.SlashesMonthlyChartOptions,
            {
              markers: { size: 4 },
              xaxis: {
                categories: newCategories
              }
            }
          );
          // In the same way, update the series option
          this.SlashesEvolutionMonthlySeries = [
            {
              data: newData
            }
          ];
        });
    },
    createProducedBlocksChartOptions(producedBlocksInDB, time) {
      let newCategories = [];
      let newData = [];
      let sumPB = 0;

      if (producedBlocksInDB.length !== 0) {
        producedBlocksInDB.forEach(pb => {
          newCategories.push(
            moment.unix(pb.timestamp / 1000).format("YYYY-MM-DD HH:mm:ss")
          );
          newData.push(pb.produced_blocks);
          sumPB = sumPB + pb.produced_blocks;
        });
      }

      newCategories.reverse();
      newData.reverse();

      this.producedBlocks[time] = sumPB;

      return { newCategories, newData };
    },
    getProducedBlocksDailyGraphData() {
      const timestamp = this.getTimestamp("day");
      const query = createQueryProducedBlocks(timestamp, this.accountId);
      const GET_PRODUCED_BLOCKS = gql`
        ${query}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_PRODUCED_BLOCKS })
        .then(response => {
          // Update chart data
          const { validator } = response.data;
          const {
            newCategories,
            newData
          } = this.createProducedBlocksChartOptions(validator, "day");
          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.ProducedBlocksDailyChartOptions = R.mergeDeepRight(
            this.ProducedBlocksDailyChartOptions,
            {
              xaxis: {
                categories: newCategories
              },
              yaxis: {
                labels: {
                  formatter: val => val
                }
              }
            }
          );
          // In the same way, update the series option
          this.ProducedBlocksEvolutionDailySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getProducedBlocksWeeklyGraphData() {
      const timestamp = this.getTimestamp("week");

      const query = createQueryProducedBlocks(timestamp, this.accountId);
      const GET_PRODUCED_BLOCKS = gql`
        ${query}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_PRODUCED_BLOCKS })
        .then(response => {
          // Update chart data
          const { validator } = response.data;

          const {
            newCategories,
            newData
          } = this.createProducedBlocksChartOptions(validator, "week");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.ProducedBlocksWeeklyChartOptions = R.mergeDeepRight(
            this.ProducedBlocksWeeklyChartOptions,
            {
              markers: { size: 4 },
              xaxis: {
                categories: newCategories
              },
              yaxis: {
                labels: {
                  formatter: val => val
                }
              }
            }
          );

          // In the same way, update the series option
          this.ProducedBlocksEvolutionWeeklySeries = [
            {
              data: newData
            }
          ];
        });
    },
    getProducedBlocksMonthlyGraphData() {
      const timestamp = this.getTimestamp("month");

      const query = createQueryProducedBlocks(timestamp, this.accountId);
      const GET_PRODUCED_BLOCKS = gql`
        ${query}
      `;

      this.$apolloProvider.defaultClient
        .query({ query: GET_PRODUCED_BLOCKS })
        .then(response => {
          // Update chart data
          const { validator } = response.data;

          const {
            newCategories,
            newData
          } = this.createProducedBlocksChartOptions(validator, "month");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.ProducedBlocksMonthlyChartOptions = R.mergeDeepRight(
            this.ProducedBlocksMonthlyChartOptions,
            {
              markers: { size: 4 },
              xaxis: {
                categories: newCategories
              },
              yaxis: {
                labels: {
                  formatter: val => val
                }
              }
            }
          );

          // In the same way, update the series option
          this.ProducedBlocksEvolutionMonthlySeries = [
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
              im_online
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
      title:
        "PolkaStats - Polkadot Polkadot validator " +
        this.$route.query.accountId,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Polkadot Polkadot validator " + this.$route.query.accountId
        }
      ]
    };
  }
};
</script>
<style>
.charts {
  display: table;
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
.separator {
  margin-bottom: 2rem;
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
  left: 2rem;
  font-size: 1.1rem;
  color: #2697e2;
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

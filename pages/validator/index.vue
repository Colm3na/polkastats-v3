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
                <div>
                  <!-- <i
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
                  /> -->
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
                    :title="
                      $t('details.validator.not_elected_for_next_session')
                    "
                  />
                </div>
                <div>
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
                </div>
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

                  <hr v-if="!overBreakpoint" class="separator w-100" />

                  <div class="col-md-9">
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
                        <b-button
                          v-b-toggle="
                            `accordion-${index}-sessionIdHex-validator`
                          "
                          variant="link"
                          style="text-decoration: none; font-size: 1rem; padding: 0; border: 0; color: #670d35"
                        >
                          >
                          {{ shortSessionId(validator.sessionIdHex) }}
                        </b-button>
                        <b-collapse
                          :id="`accordion-${index}-sessionIdHex-validator`"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#session-id-info'"
                        >
                          {{ validator.sessionIdHex }}
                        </b-collapse>
                      </div>
                    </div>
                    <div v-if="validator.nextSessionIdHex" class="row">
                      <div class="col-md-3 mb-2">
                        <strong>{{
                          $t("details.validator.next_session_id")
                        }}</strong>
                      </div>
                      <div id="next-session-id-info" class="col-md-9 mb-2">
                        <b-button
                          v-b-toggle="
                            `accordion-${index}-nextSessionIdHex-validator`
                          "
                          variant="link"
                          style="text-decoration: none; font-size: 1rem; padding: 0; border: 0; color: #670d35"
                        >
                          >
                          {{ shortSessionId(validator.nextSessionIdHex) }}
                        </b-button>
                        <b-collapse
                          :id="`accordion-${index}-nextSessionIdHex-validator`"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#next-session-id-info'"
                        >
                          {{ validator.nextSessionIdHex }}
                        </b-collapse>
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
        <div></div>
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
  blockExplorer,
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
      accountId: this.$route.query.accountId,
      blockExplorer,
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
      StakeEvolutionDailyChartOptions: this.createChartOptions(
        this.$t("details.validator.total_bonded") + " (KSM)"
      ),
      StakeEvolutionWeeklyChartOptions: this.createChartOptions(
        this.$t("details.validator.total_bonded") + " (KSM)"
      ),
      StakeEvolutionMonthlyChartOptions: this.createChartOptions(
        this.$t("details.validator.total_bonded") + " (KSM)"
      ),
      rewards: {
        day: 0,
        week: 0,
        month: 0
      },
      RewardsEvolutionDailySeries: [
        {
          name: "Era rewards (KSM)",
          data: []
        }
      ],
      RewardsEvolutionWeeklySeries: [
        {
          name: "Era rewards (KSM)",
          data: []
        }
      ],
      RewardsEvolutionMonthlySeries: [
        {
          name: "Era rewards (KSM)",
          data: []
        }
      ],
      RewardsDailyChartOptions: this.createChartOptions(
        this.$t("details.validator.reward") + " (KSM)"
      ),
      RewardsWeeklyChartOptions: this.createChartOptions(
        this.$t("details.validator.reward") + " (KSM)"
      ),
      RewardsMonthlyChartOptions: this.createChartOptions(
        this.$t("details.validator.reward") + " (KSM)"
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

        let stakers = validator.exposure
          ? validator.exposure.others.slice()
          : [];

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
            percent: this.getStakePercent(staker.value, stakeOthers)
          };
        });
      }
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
    $route() {
      this.accountId = this.$route.query.accountId;

      // Update graph data
      this.getAllChartsData();

      // Restart graph data polling
      clearInterval(this.graphPolling);
      this.graphPolling = setInterval(() => {
        this.getAllChartsData();
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

    // Update validators every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("validators/update");
      vm.$store.dispatch("stakingIdentities/update");
    }, 10000);

    // Refresh graph data every minute
    this.graphPolling = setInterval(() => {
      this.getAllChartsData();
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
          return parseInt(new Date().getTime() / 1000) - 86400;
        case "week":
          return parseInt(new Date().getTime() / 1000) - 604800;
        case "month":
          return parseInt(new Date().getTime() / 1000) - 2592000;
        default:
          return parseInt(new Date().getTime() / 1000) - 2592000;
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
            validator_bonded[i].amount != validator_bonded[i - 1].amount)
        ) {
          // Save first and last point
          switch (time) {
            case "day":
              if (i == 0) this.Stake.daily.last = validator_bonded[i].amount;
              if (i == validator_bonded.length - 1)
                this.Stake.daily.first = validator_bonded[i].amount;
              break;
            case "week":
              if (i == 0) this.Stake.weekly.last = validator_bonded[i].amount;
              if (i == validator_bonded.length - 1)
                this.Stake.weekly.first = validator_bonded[i].amount;
              break;
            case "month":
              if (i == 0) this.Stake.monthly.last = validator_bonded[i].amount;
              if (i == validator_bonded.length - 1)
                this.Stake.monthly.first = validator_bonded[i].amount;
              break;
            default:
              break;
          }

          newCategories.push(
            moment
              .unix(
                validator_bonded[i].timestamp,
                "YYYY-MM-DD HH:mm:ss.SSSSSS Z"
              )
              .format("YYYY-MM-DD HH:mm:ss")
          );
          newData.push(validator_bonded[i].amount);
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
          const { validator_bonded } = response.data;

          const {
            newCategories,
            newData
          } = this.createValidatorsCategoriesAndData(validator_bonded, "day");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.StakeEvolutionDailyChartOptions = R.mergeDeepRight(
            this.StakeEvolutionDailyChartOptions,
            {
              markers: { size: 6 },
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
          const { validator_bonded } = response.data;

          const {
            newCategories,
            newData
          } = this.createValidatorsCategoriesAndData(validator_bonded, "week");

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
          const { validator_bonded } = response.data;

          const {
            newCategories,
            newData
          } = this.createValidatorsCategoriesAndData(validator_bonded, "month");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.StakeEvolutionMonthlyChartOptions = R.mergeDeepRight(
            this.StakeEvolutionMonthlyChartOptions,
            {
              markers: { size: 2 },
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
              .unix(rewards[i].timestamp, "YYYY-MM-DD HH:mm:ss.SSSSSS Z")
              .format("YYYY-MM-DD HH:mm:ss")
          );
          newData.push(rewards[i].estimated_payout);
          this.rewards[time] += rewards[i].estimated_payout;
        }
      } else {
        newCategories.push(
          moment
            .unix(this.getTimestamp(time), "YYYY-MM-DD HH:mm:ss.SSSSSS Z")
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
          const { rewards: r } = response.data;

          const {
            newCategories,
            newData
          } = this.createRewardsCategoriesAndData(r, "month");

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.RewardsMonthlyChartOptions = R.mergeDeepRight(
            this.RewardsMonthlyChartOptions,
            {
              markers: { size: 2 },
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
          const { rewards: r } = response.data;

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
          const { rewards: r } = response.data;

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
              .unix(slashes[i].timestamp, "YYYY-MM-DD HH:mm:ss.SSSSSS Z")
              .format("YYYY-MM-DD HH:mm:ss")
          );
          newData.push(slashes[i].block_number);
          this.slashes[time] += slashes[i].amount;
        }
      } else {
        newCategories.push(
          moment
            .unix(this.getTimestamp(time), "YYYY-MM-DD HH:mm:ss.SSSSSS Z")
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
              markers: { size: 2 },
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
            moment
              .unix(pb.timestamp, "YYYY-MM-DD HH:mm:ss.SSSSSS Z")
              .format("YYYY-MM-DD HH:mm:ss")
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
          const { validator_produced_blocks } = response.data;
          const {
            newCategories,
            newData
          } = this.createProducedBlocksChartOptions(
            validator_produced_blocks,
            "day"
          );
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
          const { validator_produced_blocks } = response.data;

          const {
            newCategories,
            newData
          } = this.createProducedBlocksChartOptions(
            validator_produced_blocks,
            "week"
          );

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
          const { validator_produced_blocks } = response.data;

          const {
            newCategories,
            newData
          } = this.createProducedBlocksChartOptions(
            validator_produced_blocks,
            "month"
          );

          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          this.ProducedBlocksMonthlyChartOptions = R.mergeDeepRight(
            this.ProducedBlocksMonthlyChartOptions,
            {
              markers: { size: 2 },
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

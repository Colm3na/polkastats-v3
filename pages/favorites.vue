<template>
  <div>
    <section>
      <b-container class="page-favorites main pt-4">
        <!-- Empty favorites message -->
        <div
          v-if="favorites.length === 0"
          class="alert alert-warning alert-dismissible fade show mt-3 mb-4"
          role="alert"
        >
          <strong>{{ $t("pages.favorites.hi_there") }}</strong>
          {{ $t("pages.favorites.you_can_click_TEXT") }}
          <i class="fas fa-star" />
          {{ $t("pages.favorites.of_a_validator_TEXT") }}.
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <!-- START FAVORITE VALIDATORS -->
        <template v-for="(validator, index) in validators">
          <template v-if="isFavorite(validator.accountId)">
            <div :key="validator.accountId" class="validator card mb-3">
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
                :title="$t('pages.favorites.elected_for_next_session')"
              />
              <i
                v-else
                v-b-tooltip.hover
                class="notElected fas fa-times-circle"
                :title="$t('pages.favorites.not_elected_for_next_session')"
              />
              <a class="favorite" @click="toggleFavorite(validator.accountId)">
                <i
                  v-if="isFavorite(validator.accountId)"
                  v-b-tooltip.hover
                  class="fas fa-star"
                  style="color: #f1bd23"
                  :title="$t('pages.favorites.unset_as_favorite')"
                />
                <i
                  v-else
                  v-b-tooltip.hover
                  class="fas fa-star"
                  style="color: #e6dfdf;"
                  :title="$t('pages.favorites.set_as_favorite')"
                />
              </a>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3 mb-2 text-center">
                    <div v-if="hasIdentity(validator.accountId)">
                      <div v-if="getIdentity(validator.accountId).logo !== ''">
                        <img
                          :src="getIdentity(validator.accountId).logo"
                          class="identity mt-2"
                        />
                        <h4
                          v-if="
                            getIdentity(validator.accountId).full_name !== ''
                          "
                          class="mt-2 mb-2"
                        >
                          {{ getIdentity(validator.accountId).full_name }}
                        </h4>
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
                    <div v-else-if="hasKusamaIdentity(validator.accountId)">
                      <Identicon
                        :key="validator.accountId"
                        :value="validator.accountId"
                        :size="80"
                        :theme="'polkadot'"
                      />
                      {{ getKusamaIdentity(validator.accountId).display }}
                    </div>
                    <div v-else>
                      <Identicon
                        :key="validator.accountId"
                        :value="validator.accountId"
                        :size="80"
                        :theme="'polkadot'"
                      />
                    </div>
                    <p class="mt-3 mb-0 rank">
                      {{ $t("pages.favorites.rank") }} #{{ index + 1 }}
                      <i
                        v-b-tooltip.hover
                        class="fas fa-shield-alt"
                        :title="$t('pages.favorites.active_validator')"
                      />
                    </p>
                    <p
                      v-if="validator.exposure.total > 0"
                      v-b-tooltip.hover
                      class="bonded mb-0"
                      :title="$t('pages.favorites.total_bonded')"
                    >
                      {{ formatAmount(validator.exposure.total) }}
                    </p>
                    <p
                      v-else
                      v-b-tooltip.hover
                      class="bonded mb-0"
                      :title="$t('pages.favorites.total_bonded')"
                    >
                      {{ formatAmount(validator.stakingLedger.total) }}
                    </p>
                    <p class="mb-0">
                      <small>
                        <span
                          v-if="validator.exposure.own > 0"
                          v-b-tooltip.hover
                          :title="$t('pages.favorites.self_bonded')"
                          >{{ formatAmount(validator.exposure.own) }}</span
                        >
                        <span
                          v-if="
                            validator.exposure.total - validator.exposure.own >
                              0
                          "
                          v-b-tooltip.hover
                          :title="$t('pages.favorites.bonded_by_nominators')"
                          >(+{{
                            formatAmount(
                              validator.exposure.total - validator.exposure.own
                            )
                          }})</span
                        >
                      </small>
                    </p>
                    <p
                      v-b-tooltip.hover
                      class="mb-0"
                      :title="
                        $t('pages.favorites.percentage_over_total_bonded_stake')
                      "
                    >
                      {{
                        getStakePercent(
                          validator.exposure.total,
                          totalStakeBonded
                        )
                      }}% {{ $t("pages.favorites.of_total_stake") }}
                    </p>
                    <p v-if="validator.currentEraPointsEarned" class="mb-0">
                      {{ validator.currentEraPointsEarned }}
                      {{ $t("pages.favorites.era_points") }}
                    </p>
                  </div>
                  <div class="col-md-9">
                    <h4
                      class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0"
                    >
                      <nuxt-link
                        :to="{
                          name: 'validator',
                          query: { accountId: validator.accountId }
                        }"
                        title="$t('pages.favorites.validator_details')"
                      >
                        <span v-if="hasIdentity(validator.accountId)">
                          {{ getIdentity(validator.accountId).full_name }}
                        </span>
                        <span
                          v-else-if="hasKusamaIdentity(validator.accountId)"
                        >
                          {{ getKusamaIdentity(validator.accountId).display }}
                        </span>
                        <span v-else>
                          {{ validator.accountId }}
                        </span>
                      </nuxt-link>
                    </h4>
                    <div v-if="validator.stashId" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.stash") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1">
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
                    <div v-if="validator.controllerId" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.controller") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1">
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
                            >{{ shortAddress(validator.controllerId) }}</span
                          >
                          <span
                            class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                            >{{ shortAddress(validator.controllerId) }}</span
                          >
                        </a>
                      </div>
                    </div>
                    <div v-if="validator.sessionIdHex" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.session_id") }}</strong>
                      </div>
                      <div
                        :id="'val-session-id-info-' + index"
                        class="col-md-9 mb-1"
                      >
                        <a
                          class=""
                          data-toggle="collapse"
                          :href="'#val-session-id-' + index"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'val-session-id-' + index"
                        >
                          <i class="fas" />
                          {{ shortSessionId(validator.sessionIdHex) }}
                        </a>
                        <div
                          :id="'val-session-id-' + index"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#val-session-id-info-' + index"
                        >
                          {{ validator.sessionIdHex }}
                        </div>
                      </div>
                    </div>
                    <div v-if="validator.nextSessionIdHex" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{
                          $t("pages.favorites.next_session_id")
                        }}</strong>
                      </div>
                      <div
                        :id="'val-next-session-id-info-' + index"
                        class="col-md-9 mb-1"
                      >
                        <a
                          class=""
                          data-toggle="collapse"
                          :href="'#val-next-session-id-' + index"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'val-next-session-id-' + index"
                        >
                          <i class="fas" />
                          {{ shortSessionId(validator.nextSessionIdHex) }}
                        </a>
                        <div
                          :id="'val-next-session-id-' + index"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#val-next-session-id-info-' + index"
                        >
                          {{ validator.nextSessionIdHex }}
                        </div>
                      </div>
                    </div>
                    <div v-if="validator.validatorPrefs.commission" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.commission") }}n</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{
                          (
                            validator.validatorPrefs.commission / 10000000
                          ).toFixed(2)
                        }}%
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-3 mb-1">
                        <strong>{{
                          $t("pages.favorites.reward_destination")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ formatRewardDest(validator.rewardDestination) }}
                      </div>
                    </div>
                    <div :id="'validator-info-' + index">
                      <template v-if="validator.exposure">
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
                              <i class="fas mr-1" />{{
                                validator.exposure.others.length
                              }}
                              {{ $t("pages.favorites.nominators") }}
                            </h6>
                          </a>
                        </template>
                      </template>
                      <template v-if="validator.exposure">
                        <template v-if="validator.exposure.others.length > 0">
                          <div
                            :id="'staker' + index"
                            class="nominator collapse pt-2 pb-3"
                            :data-parent="'#validator-info-' + index"
                          >
                            <div
                              v-for="(staker, index) in validator.exposure
                                .others"
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
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <!-- END FAVORITE VALIDATORS -->
        <!-- START FAVORITE INTENTIONS -->
        <template v-for="(validator, index) in intentions">
          <template v-if="isFavorite(validator.accountId)">
            <div :key="validator.accountId" class="validator card mb-3">
              <a class="favorite" @click="toggleFavorite(validator.accountId)">
                <i
                  v-if="isFavorite(validator.accountId)"
                  v-b-tooltip.hover
                  class="fas fa-star"
                  style="color: #f1bd23"
                  :title="$t('pages.favorites.unset_as_favorite')"
                />
                <i
                  v-else
                  v-b-tooltip.hover
                  class="fas fa-star"
                  style="color: #e6dfdf;"
                  :title="$t('pages.favorites.set_as_favorite')"
                />
              </a>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3 mb-2 text-center">
                    <div v-if="hasIdentity(validator.stashId)">
                      <div v-if="getIdentity(validator.stashId).logo !== ''">
                        <img
                          :src="getIdentity(validator.stashId).logo"
                          class="identity mt-2"
                        />
                        <h4
                          v-if="getIdentity(validator.stashId).full_name !== ''"
                          class="mt-2 mb-2"
                        >
                          {{ getIdentity(validator.stashId).full_name }}
                        </h4>
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
                    <div v-else-if="hasKusamaIdentity(validator.stashId)">
                      <Identicon
                        :key="validator.accountId"
                        :value="validator.accountId"
                        :size="80"
                        :theme="'polkadot'"
                      />
                      {{ getKusamaIdentity(validator.accountId).display }}
                    </div>
                    <div v-else>
                      <Identicon
                        :key="validator.accountId"
                        :value="validator.accountId"
                        :size="80"
                        :theme="'polkadot'"
                      />
                    </div>
                    <p class="mt-3 mb-0 rank">
                      {{ $t("pages.favorites.rank") }} #{{ index + 1 }}
                      <i
                        v-b-tooltip.hover
                        class="fas fa-exclamation-triangle"
                        :title="$t('pages.favorites.intention')"
                      />
                    </p>
                    <template v-if="validator.stakingLedger">
                      <p
                        v-b-tooltip.hover
                        class="bonded mb-0"
                        :title="$t('pages.favorites.active_bonded')"
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
                    </template>
                  </div>
                  <div class="col-md-9">
                    <h4
                      class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0"
                    >
                      <nuxt-link
                        :to="{
                          name: 'intention',
                          query: { accountId: validator.accountId }
                        }"
                        title="$t('pages.favorites.validator_details')"
                      >
                        <span v-if="hasIdentity(validator.accountId)">
                          {{ getIdentity(validator.accountId).full_name }}
                        </span>
                        <span
                          v-else-if="hasKusamaIdentity(validator.accountId)"
                        >
                          {{ getKusamaIdentity(validator.accountId).display }}
                        </span>
                        <span v-else>
                          {{ validator.accountId }}
                        </span>
                      </nuxt-link>
                    </h4>
                    <div v-if="validator.stashId" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.stash") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1">
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
                    <div v-if="validator.controllerId" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.controller") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1">
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
                            >{{ shortAddress(validator.controllerId) }}</span
                          >
                          <span
                            class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                            >{{ shortAddress(validator.controllerId) }}</span
                          >
                        </a>
                      </div>
                    </div>
                    <div v-if="validator.sessionIdHex" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.session_id") }}</strong>
                      </div>
                      <div
                        :id="'int-session-id-info-' + index"
                        class="col-md-9 mb-1"
                      >
                        <a
                          class=""
                          data-toggle="collapse"
                          :href="'#int-session-id-' + index"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'int-session-id-' + index"
                        >
                          <i class="fas" />
                          {{ shortSessionId(validator.sessionIdHex) }}
                        </a>
                        <div
                          :id="'int-session-id-' + index"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#int-session-id-info-' + index"
                        >
                          {{ validator.sessionIdHex }}
                        </div>
                      </div>
                    </div>
                    <div v-if="validator.nextSessionIdHex" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{
                          $t("pages.favorites.next_session_id")
                        }}</strong>
                      </div>
                      <div
                        :id="'int-next-session-id-info-' + index"
                        class="col-md-9 mb-1"
                      >
                        <a
                          class=""
                          data-toggle="collapse"
                          :href="'#int-next-session-id-' + index"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'int-next-session-id-' + index"
                        >
                          <i class="fas" />
                          {{ shortSessionId(validator.nextSessionIdHex) }}
                        </a>
                        <div
                          :id="'int-next-session-id-' + index"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#int-next-session-id-info-' + index"
                        >
                          {{ validator.nextSessionIdHex }}
                        </div>
                      </div>
                    </div>
                    <div v-if="validator.validatorPrefs.commission" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.commission") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{
                          (
                            validator.validatorPrefs.commission / 10000000
                          ).toFixed(2)
                        }}%
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-3 mb-1">
                        <strong>{{
                          $t("pages.favorites.reward_destination")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ formatRewardDest(validator.rewardDestination) }}
                      </div>
                    </div>
                    <div :id="'validator-info-' + index">
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
                            <i class="fas mr-1" />{{
                              validator.exposure.others.length
                            }}
                            {{ $t("pages.favorites.nominators") }}
                          </h6>
                        </a>
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
                                  >{{ staker.who }}</span
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
        <!-- END FAVORITE INTENTIONS -->
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import axios from "axios";
import bootstrap from "bootstrap";
import Identicon from "../components/identicon.vue";
import { isHex } from "@polkadot/util";
import BN from "bn.js";
import { blockExplorer } from "../polkastats.config.js";
import commonMixin from "../mixins/commonMixin.js";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      blockExplorer,
      favorites: [],
      polling: null,
      intention: this.$t("pages.favorites.intention")
    };
  },
  computed: {
    network() {
      return this.$store.state.network.info;
    },
    validators() {
      return this.$store.state.validators.list;
    },
    totalStakeBonded() {
      return this.$store.state.validators.totalStakeBonded;
    },
    intentions() {
      return this.$store.state.intentions.list;
    },
    identities() {
      return this.$store.state.identities.list;
    },
    indexes() {
      return this.$store.state.indexes.list;
    },
    totalStakeBondedPercen() {
      if (this.totalStakeBonded !== 0 && this.network.totalIssuance !== "") {
        let totalIssuance = new BN(this.network.totalIssuance, 10);
        let totalStakeBonded = this.totalStakeBonded.mul(new BN("100", 10));
        return totalStakeBonded.div(totalIssuance);
      } else {
        return 0;
      }
    }
  },
  watch: {
    favorites: function(favorites) {
      this.$cookies.set("favorites", favorites, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      });
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

    // Force update of validators list if empty
    if (this.$store.state.validators.list.length == 0) {
      vm.$store.dispatch("validators/update");
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length == 0) {
      vm.$store.dispatch("identities/update");
    }

    // Force update of staking identities list if empty
    if (this.$store.state.stakingIdentities.list.length === 0) {
      vm.$store.dispatch("stakingIdentities/update");
    }

    // Force update of account indexes list if empty
    if (this.$store.state.indexes.list.length == 0) {
      vm.$store.dispatch("indexes/update");
    }

    // Force update of intention validators list if empty
    if (this.$store.state.intentions.list.length == 0) {
      vm.$store.dispatch("intentions/update");
    }

    // Update network info, validators and intention validators every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("network/update");
      vm.$store.dispatch("validators/update");
      vm.$store.dispatch("intentions/update");
      vm.$store.dispatch("stakingIdentities/update");
    }, 10000);

    // Update account indexes every 1 min
    this.pollingIndexes = setInterval(() => {
      vm.$store.dispatch("indexes/update");
    }, 60000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
    clearInterval(this.pollingIndexes);
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
    }
  },
  head() {
    return {
      title: this.$t("pages.favorites.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.favorites.head_content")
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
.page-favorites .favorite {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  z-index: 10;
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
.validator .col-md-9 .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
.validator .col-md-9 .identicon div {
  display: inline;
}
.identity {
  max-width: 80px;
}
.validator .fa-shield-alt {
  color: green;
}
.validator .fa-exclamation-triangle {
  color: red;
}
.page-favorites .imOnline {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  font-size: 1.1rem;
  color: green;
}
.page-favorites .imOffline {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  font-size: 1.1rem;
  color: red;
}
.page-favorites .elected {
  position: absolute;
  top: 0.4rem;
  left: 2rem;
  font-size: 1.1rem;
  color: #2697e2;
}
.page-favorites .notElected {
  position: absolute;
  top: 0.4rem;
  left: 2rem;
  font-size: 1.1rem;
  color: red;
}
</style>

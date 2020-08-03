<template>
  <div>
    <section>
      <b-container class="page-favorites main py-5">
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
          <template v-if="isFavorite(validator.account_id)">
            <div :key="validator.account_id" class="validator card mb-3">
              <a class="favorite" @click="toggleFavorite(validator.account_id)">
                <i
                  v-if="isFavorite(validator.account_id)"
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
                    <p class="mt-3 mb-0 rank">
                      {{ $t("pages.favorites.rank") }} #{{ index + 1 }}
                      <i
                        v-b-tooltip.hover
                        class="fas fa-shield-alt"
                        :title="$t('pages.favorites.active_validator')"
                      />
                    </p>
                    <p
                      v-b-tooltip.hover
                      class="bonded mb-0"
                      :title="$t('pages.favorites.total_bonded')"
                    >
                      {{ formatAmount(validator.exposure_total) }}
                    </p>
                    <p class="mb-0">
                      <small>
                        <span
                          v-if="validator.exposure_own > 0"
                          v-b-tooltip.hover
                          :title="$t('pages.favorites.self_bonded')"
                          >{{ formatAmount(validator.exposure_own) }}</span
                        >
                        <span
                          v-if="
                            validator.exposure_total - validator.exposure_own >
                              0
                          "
                          v-b-tooltip.hover
                          :title="$t('pages.favorites.bonded_by_nominators')"
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
                        $t('pages.favorites.percentage_over_total_bonded_stake')
                      "
                    >
                      <!-- {{
                        getStakePercent(
                          validator.exposure_total,
                          totalStakeBonded
                        )
                      }}% {{ $t("pages.favorites.of_total_stake") }} -->
                    </p>
                    <p v-if="validator.produced_blocks" class="mb-0">
                      {{ validator.produced_blocks }}
                      {{ $t("pages.favorites.produced_blocks") }}
                    </p>
                  </div>
                  <div class="col-md-9">
                    <h4
                      class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0"
                    >
                      <nuxt-link
                        :to="{
                          name: 'validator',
                          query: { accountId: validator.account_id }
                        }"
                        title="$t('pages.favorites.validator_details')"
                      >
                        <span v-if="validator.display_name">
                          {{ validator.display_name }}
                        </span>
                        <span v-else>
                          {{ validator.account_id }}
                        </span>
                      </nuxt-link>
                    </h4>
                    <div v-if="validator.stash_id" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.stash") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1">
                        <Identicon
                          :key="validator.stash_id"
                          :value="validator.stash_id"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <nuxt-link
                          :to="{
                            name: 'account',
                            query: { accountId: validator.stash_id }
                          }"
                        >
                          <span
                            v-b-tooltip.hover
                            class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                            :title="validator.stash_id"
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
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.controller") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1">
                        <Identicon
                          :key="validator.controller_id"
                          :value="validator.controller_id"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <nuxt-link
                          :to="{
                            name: 'account',
                            query: { accountId: validator.controller_id }
                          }"
                        >
                          <span
                            v-b-tooltip.hover
                            class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                            :title="validator.controller_id"
                            >{{ shortAddress(validator.controller_id) }}</span
                          >
                          <span
                            class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                            >{{ shortAddress(validator.controller_id) }}</span
                          >
                        </nuxt-link>
                      </div>
                    </div>
                    <div v-if="validator.session_id_hex" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.session_id") }}</strong>
                      </div>
                      <div
                        :id="'val-session-id-info-' + index"
                        class="col-md-9 mb-1"
                      >
                        <b-button
                          v-b-toggle="`accordion-${index}-val-session`"
                          variant="link"
                          style="text-decoration: none; font-size: 0.9rem; padding: 0; border: 0; color: #670d35"
                        >
                          <i
                            class="fa fa-chevron-right mr-1"
                            aria-hidden="true"
                          ></i>
                          {{ shortSessionId(validator.session_id_hex) }}
                        </b-button>
                        <b-collapse
                          :id="`accordion-${index}-val-session`"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#val-session-id-info-' + index"
                        >
                          {{ validator.session_id_hex }}
                        </b-collapse>
                      </div>
                    </div>
                    <div v-if="validator.next_session_id_hex" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{
                          $t("pages.favorites.next_session_id")
                        }}</strong>
                      </div>
                      <div
                        :id="'val-next-session-id-info-' + index"
                        class="col-md-9 mb-1"
                      >
                        <b-button
                          v-b-toggle="`accordion-${index}-val-next-session`"
                          variant="link"
                          style="text-decoration: none; font-size: 0.9rem; padding: 0; border: 0; color: #670d35"
                        >
                          <i
                            class="fa fa-chevron-right mr-1"
                            aria-hidden="true"
                          ></i>
                          {{ shortSessionId(validator.next_session_id_hex) }}
                        </b-button>
                        <b-collapse
                          :id="`accordion-${index}-val-next-session`"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#val-next-session-id-info-' + index"
                        >
                          {{ validator.next_session_id_hex }}
                        </b-collapse>
                      </div>
                    </div>
                    <div v-if="validator.commission" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.commission") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ (validator.commission / 10000000).toFixed(2) }}%
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-3 mb-1">
                        <strong>{{
                          $t("pages.favorites.reward_destination")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ formatRewardDest(validator.reward_destination) }}
                      </div>
                    </div>
                    <div :id="'validator-info-' + index">
                      <template v-if="JSON.parse(validator.stakers).length">
                        <template
                          v-if="JSON.parse(validator.stakers).length > 0"
                        >
                          <b-button
                            v-b-toggle="`accordion-${index}-staker`"
                            variant="link"
                            style="text-decoration: none"
                          >
                            <h6 class="h6 nominators d-inline mr-4">
                              <i
                                class="fa fa-chevron-right mr-1"
                                aria-hidden="true"
                              ></i>
                              {{ JSON.parse(validator.stakers).length }}
                              {{ $t("pages.favorites.nominators") }}
                            </h6>
                          </b-button>
                        </template>
                      </template>
                      <template v-if="JSON.parse(validator.stakers).length > 0">
                        <b-collapse
                          :id="`accordion-${index}-staker`"
                          class="nominator collapse pt-2 pb-3"
                          :data-parent="`#validator-info-${index}`"
                        >
                          <div
                            v-for="(staker, index) in JSON.parse(
                              validator.stakers
                            )"
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
                              <nuxt-link
                                :to="{
                                  name: 'account',
                                  query: { accountId: staker.who }
                                }"
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
                              </nuxt-link>
                            </div>
                            <div class="col-4 text-right value">
                              {{ formatAmount(staker.value) }}
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
        </template>
        <!-- END FAVORITE VALIDATORS -->
        <!-- START FAVORITE INTENTIONS -->
        <template v-for="(validator, index) in intentions">
          <template v-if="isFavorite(validator.account_id)">
            <div :key="validator.account_id" class="validator card mb-3">
              <a class="favorite" @click="toggleFavorite(validator.account_id)">
                <i
                  v-if="isFavorite(validator.account_id)"
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
                    <p class="mt-3 mb-0 rank">
                      {{ $t("pages.favorites.rank") }} #{{ index + 1 }}
                      <i
                        v-b-tooltip.hover
                        class="fas fa-exclamation-triangle"
                        :title="$t('pages.favorites.intention')"
                      />
                    </p>
                    <template v-if="validator.staking_ledger_total">
                      <p
                        v-b-tooltip.hover
                        class="bonded mb-0"
                        :title="$t('pages.favorites.active_bonded')"
                      >
                        {{ formatAmount(validator.staking_ledger_total) }}
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
                          query: { accountId: validator.account_id }
                        }"
                        title="$t('pages.favorites.validator_details')"
                      >
                        <span v-if="validator.display_name">
                          {{ validator.display_name }}
                        </span>
                        <span v-else>
                          {{ validator.account_id }}
                        </span>
                      </nuxt-link>
                    </h4>
                    <div v-if="validator.stash_id" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.stash") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1">
                        <Identicon
                          :key="validator.stash_id"
                          :value="validator.stash_id"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <nuxt-link
                          :to="{
                            name: 'account',
                            query: { accountId: validator.stash_id }
                          }"
                        >
                          <span
                            v-b-tooltip.hover
                            class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                            :title="validator.stash_id"
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
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.controller") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1">
                        <Identicon
                          :key="validator.controller_id"
                          :value="validator.controller_id"
                          :size="20"
                          :theme="'polkadot'"
                        />
                        <nuxt-link
                          :to="{
                            name: 'account',
                            query: { accountId: validator.controller_id }
                          }"
                        >
                          <span
                            v-b-tooltip.hover
                            class="d-inline d-sm-none d-md-none d-lg-none d-xl-none"
                            :title="validator.controller_id"
                            >{{ shortAddress(validator.controller_id) }}</span
                          >
                          <span
                            class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline"
                            >{{ shortAddress(validator.controller_id) }}</span
                          >
                        </nuxt-link>
                      </div>
                    </div>
                    <div v-if="validator.session_id_hex" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.session_id") }}</strong>
                      </div>
                      <div
                        :id="'int-session-id-info-' + index"
                        class="col-md-9 mb-1"
                      >
                        <b-button
                          v-b-toggle="`accordion-${index}-int-session`"
                          variant="link"
                          style="text-decoration: none; font-size: 1rem; padding: 0; border: 0; color: #670d35"
                        >
                          <i class="fas" />
                          {{ shortSessionId(validator.session_id_hex) }}
                        </b-button>
                        <b-collapse
                          :id="`accordion-${index}-int-session`"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#int-session-id-info-' + index"
                        >
                          {{ validator.session_id_hex }}
                        </b-collapse>
                      </div>
                    </div>
                    <div v-if="validator.next_session_id_hex" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{
                          $t("pages.favorites.next_session_id")
                        }}</strong>
                      </div>
                      <div
                        :id="'int-next-session-id-info-' + index"
                        class="col-md-9 mb-1"
                      >
                        <b-button
                          v-b-toggle="`accordion-${index}-int-next-session`"
                          variant="link"
                          style="text-decoration: none; font-size: 0.9rem; padding: 0; border: 0; color: #670d35"
                        >
                          <i
                            class="fa fa-chevron-right mr-1"
                            aria-hidden="true"
                          ></i>
                          {{ shortSessionId(validator.next_session_id_hex) }}
                        </b-button>
                        <b-collapse
                          :id="`accordion-${index}-int-next-session`"
                          class="collapse pt-2 pb-3"
                          :data-parent="'#int-next-session-id-info-' + index"
                        >
                          {{ validator.next_session_id_hex }}
                        </b-collapse>
                      </div>
                    </div>
                    <div v-if="validator.commission" class="row">
                      <div class="col-md-3 mb-1">
                        <strong>{{ $t("pages.favorites.commission") }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ (validator.commission / 10000000).toFixed(2) }}%
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-3 mb-1">
                        <strong>{{
                          $t("pages.favorites.reward_destination")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{ validator.reward_destination }}
                      </div>
                    </div>
                    <div :id="'validator-info-' + index">
                      <template v-if="validator.num_stakers > 0">
                        <b-button
                          v-b-toggle="`accordion-${index}-nominators`"
                          variant="link"
                          style="text-decoration: none"
                        >
                          <h6 class="h6 nominators d-inline mr-4">
                            <i
                              class="fa fa-chevron-right mr-1"
                              aria-hidden="true"
                            ></i>
                            {{ validator.num_stakers }}
                            {{ $t("pages.favorites.nominators") }}
                          </h6>
                        </b-button>
                      </template>
                      <template v-if="validator.num_stakers > 0">
                        <b-collapse
                          :id="`accordion-${index}-nominators`"
                          class="nominator collapse pt-2 pb-3"
                          :data-parent="'#validator-info-' + index"
                        >
                          <div
                            v-for="(staker, index) in JSON.parse(
                              validator.stakers
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
                              <nuxt-link
                                :to="{
                                  name: 'account',
                                  query: { accountId: staker }
                                }"
                              >
                                <span
                                  v-b-tooltip.hover
                                  class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none"
                                  :title="staker.who"
                                  >{{ shortAddress(staker) }}</span
                                >
                                <span
                                  class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block"
                                  >{{ staker }}</span
                                >
                              </nuxt-link>
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
        </template>
        <!-- END FAVORITE INTENTIONS -->
      </b-container>
    </section>
  </div>
</template>
<script>
import bootstrap from "bootstrap";
import Identicon from "../components/identicon.vue";
import commonMixin from "../mixins/commonMixin.js";
import gql from "graphql-tag";
import { network } from "../polkastats.config.js";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      currentSessionIndex: 0,
      intentions: [],
      validators: [],
      favorites: [],
      polling: null,
      intention: this.$t("pages.favorites.intention")
    };
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
    // Get favorites from cookie
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
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
              controller_id
              commission
              next_elected
              display_name
              exposure_others
              exposure_own
              exposure_total
              produced_blocks
              rank
              stakers
              reward_destination
              session_id_hex
              next_session_id_hex
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
      intentions: {
        query: gql`
          subscription intention($session_index: Int!) {
            intention(
              order_by: { rank: asc }
              where: { session_index: { _eq: $session_index } }
            ) {
              account_id
              stash_id
              controller_id
              commission
              display_name
              staking_ledger_total
              rank
              stakers
              reward_destination
              next_session_id_hex
              next_elected
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
          this.totalRows = data.intention.length;
          this.intentions = data.intention.map(intention => {
            return {
              ...intention,
              num_stakers: JSON.parse(intention.stakers).length,
              favorite: this.isFavorite(intention.account_id)
            };
          });
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
      title: this.$t("pages.favorites.head_title", {
        networkName: network.name
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.favorites.head_content", {
            networkName: network.name
          })
        }
      ]
    };
  }
};
</script>
<style>
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
  left: 0.2rem;
  font-size: 1.1rem;
  color: #2697e2;
}
.page-favorites .notElected {
  position: absolute;
  top: 0.4rem;
  left: 0.2rem;
  font-size: 1.1rem;
  color: red;
}
.page-favorites .identicon {
  margin-bottom: 0.8rem;
}
</style>

<template>
  <section>
    <b-container class="page-candidate main pt-3 pb-5">
      <template v-for="(candidate, index) in candidates">
        <template v-if="candidate.pub_key_stash == accountId">
          <div :key="candidate.pub_key_stash" class="row">
            <div class="col-2 col-lg-1">
              <template v-if="index > 0">
                <nuxt-link
                  :to="{
                    name: 'phragmen-candidate',
                    query: { accountId: candidates[index - 1].pub_key_stash }
                  }"
                  :title="
                    $t('details.phragmen-candidate.previous_candidate').concat(
                      candidates[index - 1].pub_key_stash
                    )
                  "
                >
                  <i class="fas fa-2x fa-chevron-left"></i>
                </nuxt-link>
              </template>
            </div>
            <div class="col-8 col-lg-10 text-center">
              <h4 class="mb-1">
                {{ $t("details.phragmen-candidate.candidate") }}
                <!-- {{ indexes[accountId] }} -->
              </h4>
            </div>
            <div class="col-2 col-lg-1 text-right">
              <template v-if="index < candidates.length - 1">
                <nuxt-link
                  :to="{
                    name: 'phragmen-candidate',
                    query: { accountId: candidates[index + 1].pub_key_stash }
                  }"
                  :title="
                    $t('details.phragmen-candidate.next_candidate').concat(
                      candidates[index + 1].pub_key_stash
                    )
                  "
                >
                  <i class="fas fa-2x fa-chevron-right"></i>
                </nuxt-link>
              </template>
            </div>
          </div>
          <div :key="index" class="candidate card mt-4 mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-2 text-center">
                  <div v-if="hasPolkStatsIdentity(candidate.pub_key_stash)">
                    <div
                      v-if="
                        getPolkStatsIdentity(candidate.pub_key_stash).logo !==
                          ''
                      "
                    >
                      <img
                        :src="
                          getPolkStatsIdentity(candidate.pub_key_stash).logo
                        "
                        class="identity mt-2"
                      />
                      <h4
                        v-if="
                          getPolkStatsIdentity(candidate.pub_key_stash)
                            .full_name !== ''
                        "
                        class="mt-2 mb-2"
                      >
                        {{
                          getPolkStatsIdentity(candidate.pub_key_stash)
                            .full_name
                        }}
                      </h4>
                    </div>
                    <div v-else>
                      <Identicon
                        :key="candidate.pub_key_stashd"
                        :value="candidate.pub_key_stash"
                        :size="80"
                        :theme="'polkadot'"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <Identicon
                      :key="candidate.pub_key_stash"
                      :value="candidate.pub_key_stash"
                      :size="80"
                      :theme="'polkadot'"
                    />
                  </div>
                  <p class="mt-3 mb-0 rank">rank #{{ candidate.rank }}</p>
                  <p
                    v-b-tooltip.hover
                    class="bonded mb-0"
                    :title="$t('details.phragmen-candidate.total_stake')"
                  >
                    {{ formatAmount(candidate.stake_total) }}
                  </p>
                  <p class="mb-0">
                    <small>
                      <span
                        v-b-tooltip.hover
                        :title="$t('details.phragmen-candidate.self_bonded')"
                        >{{ formatAmount(candidate.stake_validator) }}</span
                      >
                      <span
                        v-b-tooltip.hover
                        :title="
                          $t('details.phragmen-candidate.bonded_by_nominators')
                        "
                        >(+{{ formatAmount(candidate.other_stake_sum) }})</span
                      >
                    </small>
                  </p>
                </div>
                <div class="col-md-9">
                  <h4
                    class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0"
                  >
                    <span>
                      {{ candidate.pub_key_stash }}
                    </span>
                  </h4>
                  <div v-if="candidate.pub_key_stash" class="row">
                    <div class="col-md-3 mb-1">
                      <strong>Stash</strong>
                    </div>
                    <div class="col-md-9 mb-1">
                      <Identicon
                        :key="candidate.pub_key_stash"
                        :value="candidate.pub_key_stash"
                        :size="20"
                        :theme="'polkadot'"
                      />
                    </div>
                  </div>
                  <div v-if="candidate.pub_key_controller" class="row">
                    <div class="col-md-3 mb-1">
                      <strong>Controller</strong>
                    </div>
                    <div class="col-md-9 mb-1">
                      <Identicon
                        :key="candidate.pub_key_controller"
                        :value="candidate.pub_key_controller"
                        :size="20"
                        :theme="'polkadot'"
                      />
                    </div>
                  </div>

                  <div v-if="hasIdentity(candidate.pub_key_stash)">
                    <div
                      v-if="
                        getIdentity(
                          candidate.pub_key_stash
                        ).identity.hasOwnProperty('display')
                      "
                      class="row"
                    >
                      <div class="col-md-3 mb-1">
                        <strong>{{
                          $t("details.phragmen-candidate.name")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-1 fee">
                        {{
                          getIdentity(candidate.pub_key_stash).identity.display
                        }}
                      </div>
                    </div>
                    <div
                      v-if="
                        getIdentity(
                          candidate.pub_key_stash
                        ).identity.hasOwnProperty('email')
                      "
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>{{
                          $t("details.phragmen-candidate.email")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="
                            `mailto:${
                              getIdentity(candidate.pub_key_stash).identity
                                .email
                            }`
                          "
                          target="_blank"
                        >
                          {{
                            getIdentity(candidate.pub_key_stash).identity.email
                          }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="
                        getIdentity(
                          candidate.pub_key_stash
                        ).identity.hasOwnProperty('legal')
                      "
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>{{
                          $t("details.phragmen-candidate.legal")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        {{
                          getIdentity(candidate.pub_key_stash).identity.legal
                        }}
                      </div>
                    </div>
                    <div
                      v-if="
                        getIdentity(
                          candidate.pub_key_stash
                        ).identity.hasOwnProperty('riot')
                      "
                      class="row"
                    >
                      <div class="col-md-3 mb-2">
                        <strong>{{
                          $t("details.phragmen-candidate.riot")
                        }}</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        <a
                          :href="
                            `https://riot.im/app/#/user/${
                              getIdentity(candidate.pub_key_stash).identity.riot
                            }`
                          "
                          target="_blank"
                        >
                          {{
                            getIdentity(candidate.pub_key_stash).identity.riot
                          }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="
                        getIdentity(candidate.pub_key_stash).hasOwnProperty(
                          'twitter'
                        )
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
                              getIdentity(candidate.pub_key_stash).identity
                                .twitter
                            }`
                          "
                          target="_blank"
                        >
                          {{
                            getIdentity(candidate.pub_key_stash).identity
                              .twitter
                          }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="
                        getIdentity(
                          candidate.pub_key_stash
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
                            getIdentity(candidate.pub_key_stash).identity.web
                          "
                          target="_blank"
                        >
                          {{
                            getIdentity(candidate.pub_key_stash).identity.web
                          }}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="voters mt-2">
                    <template v-if="candidate.voters">
                      <template v-if="candidate.voters.length > 0">
                        <b-button
                          v-b-toggle="`accordion-${index}-candidate-voters`"
                          variant="link"
                          style="text-decoration: none; font-size: 1rem; padding: 0; border: 0; color: #670d35"
                        >
                          <h6 class="h6 candidates d-inline mr-4">
                            >
                            {{ $t("details.phragmen-candidate.voters") }} ({{
                              candidate.voters.length
                            }})
                          </h6>
                        </b-button>
                      </template>
                    </template>
                    <template v-if="candidate.voters">
                      <template v-if="candidate.voters.length > 0">
                        <b-collapse
                          :id="`accordion-${index}-candidate-voters`"
                          class="voters collapse pt-2 pb-3"
                          :data-parent="'#candidate-voters-' + index"
                        >
                          <div
                            v-for="voter in candidate.voters"
                            :key="voter.pub_key_nominator"
                            class="row"
                          >
                            <div class="col-8 mb-1 who">
                              <Identicon
                                :key="voter.pub_key_nominator"
                                :value="voter.pub_key_nominator"
                                :size="20"
                                :theme="'polkadot'"
                              />
                            </div>
                            <div class="col-4 text-right value">
                              {{ formatAmount(voter.stake_nominator) }}
                            </div>
                          </div>
                        </b-collapse>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </b-container>
  </section>
</template>
<script>
import { mapMutations } from "vuex";
import moment from "moment";
import Identicon from "../../components/identicon.vue";
import { isHex } from "@polkadot/util";
import BN from "bn.js";
import commonMixin from "../../mixins/commonMixin.js";

export default {
  components: {
    // Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      accountId: this.$route.query.accountId,
      polling: null
    };
  },
  computed: {
    candidates() {
      return this.$store.state.phragmen.info.candidates;
    },
    identities() {
      return this.$store.state.identities.list;
    }
  },
  watch: {
    $route() {
      this.accountId = this.$route.query.accountId;
    }
  },
  created: function() {
    var vm = this;

    // Force update of phragmen candidates list if empty
    if (this.$store.state.phragmen.info.candidates.length == 0) {
      vm.$store.dispatch("phragmen/update");
    }

    // Force update of staking_identity list if empty
    if (this.$store.state.stakingIdentities.list.length == 0) {
      vm.$store.dispatch("stakingIdentities/update");
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length == 0) {
      vm.$store.dispatch("identities/update");
    }

    // Update data every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("phragmen/update");
      vm.$store.dispatch("identities/update");
      vm.$store.dispatch("stakingIdentities/update");
    }, 10000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
  },
  methods: {
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
    getPolkStatsIdentity(stashId) {
      let filteredArray = this.$store.state.identities.list.filter(obj => {
        return obj.stashId === stashId;
      });
      return filteredArray[0];
    },
    hasPolkStatsIdentity(stashId) {
      return this.$store.state.identities.list.some(obj => {
        return obj.stashId === stashId;
      });
    }
  },
  head() {
    return {
      title:
        "PolkaStats - Polkadot phragmen candidate " +
        this.$route.query.accountId,
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Polkadot Polkadot phragmen candidate " +
            this.$route.query.accountId
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
.page-candidate .favorite {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  cursor: initial;
}
.page-candidate .clipboard {
  display: inline-block;
}
</style>

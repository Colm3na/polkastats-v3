<template>
  <div>
    <section>
      <b-container class="nominator-page main pt-3 pb-5">
        <template v-for="(nominator, index) in nominators">
          <template v-if="nominator.accountId === accountId">
            <div :key="nominator.accountId" class="row">
              <div class="col-2 col-lg-1">
                <template v-if="index > 0">
                  <nuxt-link
                    :to="{
                      name: 'nominator',
                      query: { accountId: nominators[index - 1].accountId }
                    }"
                    :title="
                      $t('details.nominator.previous_nominator').concat(
                        nominators[index - 1].accountId
                      )
                    "
                  >
                    <i class="fas fa-2x fa-chevron-left" />
                  </nuxt-link>
                </template>
              </div>
              <div class="col-8 col-lg-10 text-center">
                <h4 class="mb-1">
                  {{ $t("details.nominator.nominator") }} {{ accountId }}
                </h4>
              </div>
              <div class="col-2 col-lg-1 text-right">
                <template v-if="index < nominators.length - 1">
                  <nuxt-link
                    :to="{
                      name: 'nominator',
                      query: { accountId: nominators[index + 1].accountId }
                    }"
                    :title="
                      $t('details.nominator.next_nominator').concat(
                        nominators[index + 1].accountId
                      )
                    "
                  >
                    <i class="fas fa-2x fa-chevron-right" />
                  </nuxt-link>
                </template>
              </div>
            </div>
            <div :key="index" class="card mt-4 mb-3">
              <div class="card-body text-center">
                <Identicon
                  :key="nominator.accountId"
                  :value="nominator.accountId"
                  :size="80"
                  :theme="'polkadot'"
                />
                <a
                  :href="blockExplorer.account + nominator.accountId"
                  target="_blank"
                  class="d-block my-2"
                >
                  {{ $t("details.nominator.nominator") }}
                  <span
                    v-b-tooltip.hover
                    :title="$t('details.nominator.see_address_in_polkastats')"
                    >{{ shortAddress(nominator.accountId) }}</span
                  >
                </a>
                <p
                  v-b-tooltip.hover
                  class="amount"
                  :title="$t('details.nominator.total_bonded')"
                >
                  {{ formatAmount(getTotalStake(nominator.staking)) }}
                </p>
                <h5>
                  {{ nominator.staking.length }}
                  {{
                    nominator.staking.length > 1
                      ? $t("details.nominator.nominations")
                      : $t("details.nominator.nomination")
                  }}
                </h5>
                <hr />
                <!-- identity start -->
                <div v-if="hasIdentity(nominator.accountId)">
                  <div
                    v-if="
                      getIdentity(nominator.accountId).identity.hasOwnProperty(
                        'display'
                      )
                    "
                    class="row"
                  >
                    >
                    <div class="col-md-3 mb-1">
                      <strong>{{ $t("details.nominator.name") }}</strong>
                    </div>
                    <div class="col-md-9 mb-1 fee">
                      {{ getIdentity(nominator.accountId).identity.display }}
                    </div>
                  </div>
                  <div
                    v-if="
                      getIdentity(nominator.accountId).identity.hasOwnProperty(
                        'email'
                      )
                    "
                    class="row"
                  >
                    >
                    <div class="col-md-3 mb-2">
                      <strong>{{ $t("details.nominator.email") }}</strong>
                    </div>
                    <div class="col-md-9 mb-2 fee">
                      <a
                        :href="
                          `mailto:${
                            getIdentity(nominator.accountId).identity.email
                          }`
                        "
                        target="_blank"
                      >
                        {{ getIdentity(nominator.accountId).identity.email }}
                      </a>
                    </div>
                  </div>
                  <div
                    v-if="
                      getIdentity(nominator.accountId).identity.hasOwnProperty(
                        'legal'
                      )
                    "
                    class="row"
                  >
                    <div class="col-md-3 mb-2">
                      <strong>{{ $t("details.nominator.legal") }}</strong>
                    </div>
                    <div class="col-md-9 mb-2 fee">
                      {{ getIdentity(nominator.accountId).identity.legal }}
                    </div>
                  </div>
                  <div
                    v-if="
                      getIdentity(nominator.accountId).identity.hasOwnProperty(
                        'riot'
                      )
                    "
                    class="row"
                  >
                    <div class="col-md-3 mb-2">
                      <strong>{{ $t("details.nominator.riot") }}</strong>
                    </div>
                    <div class="col-md-9 mb-2 fee">
                      <a
                        :href="
                          `https://riot.im/app/#/user/${
                            getIdentity(nominator.accountId).identity.riot
                          }`
                        "
                        target="_blank"
                      >
                        >
                        {{ getIdentity(nominator.accountId).identity.riot }}
                      </a>
                    </div>
                  </div>
                  <div
                    v-if="
                      getIdentity(nominator.accountId).identity.hasOwnProperty(
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
                            getIdentity(nominator.accountId).identity.twitter
                          }`
                        "
                        target="_blank"
                      >
                        >
                        {{ getIdentity(nominator.accountId).identity.twitter }}
                      </a>
                    </div>
                  </div>
                  <div
                    v-if="
                      getIdentity(nominator.accountId).identity.hasOwnProperty(
                        'web'
                      )
                    "
                    class="row"
                  >
                    <div class="col-md-3 mb-2">
                      <strong>Web</strong>
                    </div>
                    <div class="col-md-9 mb-2 fee">
                      <a
                        :href="getIdentity(nominator.accountId).identity.web"
                        target="_blank"
                      >
                        {{ getIdentity(nominator.accountId).identity.web }}
                      </a>
                    </div>
                  </div>
                </div>
                <!-- identity end -->
                <div class="row">
                  <div
                    v-for="nomination in nominator.staking"
                    :key="nomination.validator"
                    class="col-6 col-md-4 col-lg-3 col-xl-2"
                  >
                    <Identicon
                      :key="nomination.validator"
                      :value="nomination.validator"
                      :size="40"
                      :theme="'polkadot'"
                    />
                    <nuxt-link
                      :to="{
                        name: 'validator',
                        query: { accountId: nomination.validator }
                      }"
                      :title="$t('details.nominator.validator_details')"
                      class="mt-2 mb-0 d-block"
                    >
                      <span v-b-tooltip.hover :title="nomination.validator">{{
                        shortAddress(nomination.validator)
                      }}</span>
                    </nuxt-link>
                    <p class="mt-0 mb-0">
                      rank #{{ getRank(nomination.validator) }}
                    </p>
                    <p class="mt-0 mb-2">
                      {{ $t("details.nominator.commission") }}
                      {{
                        (
                          validators[getIndex(nomination.validator)]
                            .validatorPrefs.commission / 10000000
                        ).toFixed(2)
                      }}%
                    </p>
                    <p class="amount">
                      {{ formatAmount(nomination.amount) }}
                      <small
                        >({{
                          (
                            getTotalStakePercen(
                              nominator.staking,
                              nomination.amount
                            ) / 100
                          ).toFixed(2)
                        }}%)</small
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import moment from "moment";
import Identicon from "../../components/identicon.vue";
import { formatBalance, isHex } from "@polkadot/util";
import BN from "bn.js";
import {
  decimals,
  unit,
  backendBaseURL,
  blockExplorer
} from "../../polkastats.config.js";
import commonMixin from "../../mixins/commonMixin.js";

formatBalance.setDefaults({ decimals, unit });

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      accountId: this.$route.query.accountId,
      blockExplorer,
      polling: null
    };
  },
  computed: {
    validators() {
      return this.$store.state.validators.list;
    },
    identities() {
      return this.$store.state.identities.list;
    },
    nominators() {
      let nominatorStaking = [];
      for (let i = 0; i < this.validators.length; i++) {
        let validator = this.validators[i];
        if (validator.exposure.others.length > 0) {
          for (let j = 0; j < validator.exposure.others.length; j++) {
            let nominator = validator.exposure.others[j];
            if (nominatorStaking.find(nom => nom.accountId === nominator.who)) {
              let nominatorTmp = nominatorStaking.filter(nom => {
                return nom.accountId === nominator.who;
              });
              let bn;
              if (isHex(nominator.value)) {
                bn = new BN(
                  nominator.value.substring(2, nominator.value.length),
                  16
                );
              } else {
                bn = new BN(nominator.value.toString(), 10);
              }
              nominatorTmp[0].totalStake = nominatorTmp[0].totalStake.add(bn);
              nominatorTmp[0].staking.push({
                validator: validator.accountId,
                amount: nominator.value
              });
            } else {
              let bn;
              if (isHex(nominator.value)) {
                bn = new BN(
                  nominator.value.substring(2, nominator.value.length),
                  16
                );
              } else {
                bn = new BN(nominator.value.toString(), 10);
              }
              nominatorStaking.push({
                accountId: nominator.who,
                totalStake: bn,
                staking: [
                  {
                    validator: validator.accountId,
                    amount: nominator.value
                  }
                ]
              });
            }
          }
        }
      }
      nominatorStaking.sort(function compare(a, b) {
        if (a.totalStake.lt(b.totalStake)) {
          return 1;
        }
        if (a.totalStake.gt(b.totalStake)) {
          return -1;
        }
        return 0;
      });
      nominatorStaking.map((nominator, index) => {
        nominator.rank = index + 1;
      });
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.totalRows = nominatorStaking.length;
      return nominatorStaking;
    }
  },
  watch: {
    $route() {
      this.accountId = this.$route.query.accountId;
    }
  },
  created: function() {
    var vm = this;

    // Force update of validators list if empty
    if (this.$store.state.validators.list.length === 0) {
      vm.$store.dispatch("validators/update");
    }

    // Force update of staking_identity list if empty
    if (this.$store.state.stakingIdentities.list.length == 0) {
      vm.$store.dispatch("stakingIdentities/update");
    }

    // Force update of indentities list if empty
    if (this.$store.state.identities.list.length === 0) {
      vm.$store.dispatch("identities/update");
    }

    // Update validators, identities every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("validators/update");
      vm.$store.dispatch("identities/update");
      vm.$store.dispatch("stakingIdentities/update");
    }, 10000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
  },
  methods: {
    getIndex(validator) {
      // Receives validator accountId
      for (var i = 0; i < this.validators.length; i++) {
        if (this.validators[i].accountId === validator) {
          return i;
        }
      }
      return false;
    },
    getRank(validator) {
      // Receives validator accountId
      for (var i = 0; i < this.validators.length; i++) {
        if (this.validators[i].accountId == validator) {
          return i + 1;
        }
      }
      return false;
    },
    makeToast(content = "", title = "", variant = null, solid = false) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: solid
      });
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
    getTotalStake(stake) {
      let totalStake = new BN("0", 10);
      if (stake.length > 0) {
        for (let i = 0; i < stake.length; i++) {
          let nomination = stake[i];
          let bn;
          if (isHex(nomination.amount)) {
            bn = new BN(
              nomination.amount.substring(2, nomination.amount.length),
              16
            );
          } else {
            bn = new BN(nomination.amount.toString(), 10);
          }
          totalStake = totalStake.add(bn);
        }
        return totalStake;
      } else {
        return 0;
      }
    },
    getTotalStakePercen(stake, amount) {
      let totalStake = this.getTotalStake(stake);

      if (totalStake && amount) {
        let bn;
        if (isHex(amount)) {
          bn = new BN(amount.substring(2, amount.length), 16);
        } else {
          bn = new BN(amount.toString(), 10);
        }
        bn = bn.mul(new BN("10000", 10));
        return bn.div(totalStake);
      } else {
        return 0;
      }
    }
  },
  head() {
    return {
      title: "PolkaStats - Kusama nominator " + this.$route.query.accountId,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Kusama nominator " + this.$route.query.accountId
        }
      ]
    };
  }
};
</script>
<style>
.amount {
  color: #ef1073;
  font-weight: 700;
  font-size: 1rem;
}
.identicon {
  cursor: pointer;
}
</style>

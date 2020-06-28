<template>
  <div>
    <section>
      <b-container class="page-nominator main pt-3 pb-5">
        <template v-if="nominator">
          <div :key="nominator.account_id" class="row">
            <div class="col-12 mt-4 text-center">
              <h4 class="mb-1">
                {{ $t("details.nominator.nominator") }}
                <span v-if="nominator.display_name">{{
                  nominator.display_name
                }}</span>
                <span v-else>{{ accountId }}</span>
              </h4>
            </div>
          </div>
          <div class="card mt-4 mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 text-center">
                  <Identicon
                    :key="nominator.account_id"
                    :value="nominator.account_id"
                    :size="80"
                    :theme="'polkadot'"
                  />
                  <nuxt-link
                    :to="{
                      name: 'account',
                      query: { accountId: nominator.account_id }
                    }"
                    class="d-block my-2"
                  >
                    {{ $t("details.nominator.nominator") }}
                    <span
                      v-b-tooltip.hover
                      :title="$t('details.nominator.account_details')"
                      >{{ shortAddress(nominator.account_id) }}</span
                    >
                  </nuxt-link>
                  <p class="mb-0 rank">rank #{{ nominator.rank }}</p>
                  <p
                    v-b-tooltip.hover
                    class="amount"
                    :title="$t('details.nominator.total_bonded')"
                  >
                    {{ formatAmount(nominator.total_staked) }}
                  </p>
                  <h5>
                    {{ nominator.num_targets }}
                    {{
                      nominator.num_targets > 1
                        ? $t("details.nominator.nominations")
                        : $t("details.nominator.nomination")
                    }}
                  </h5>
                </div>
                <div class="col-md-9">
                  <div v-if="nominator.stash_id" class="row">
                    <div class="col-md-2 mb-2">
                      <strong>Stash</strong>
                    </div>
                    <div class="col-md-10 mb-2">
                      <Identicon
                        :key="nominator.stash_id"
                        :value="nominator.stash_id"
                        :size="20"
                        :theme="'polkadot'"
                      />
                      <nuxt-link
                        :to="{
                          name: 'account',
                          query: { accountId: nominator.stash_id }
                        }"
                      >
                        <span
                          v-b-tooltip.hover
                          :title="$t('details.nominator.account_details')"
                          >{{ shortAddress(nominator.stash_id) }}
                        </span>
                      </nuxt-link>
                    </div>
                  </div>
                  <div v-if="nominator.controller_id" class="row">
                    <div class="col-md-2 mb-2">
                      <strong>Controller</strong>
                    </div>
                    <div class="col-md-10 mb-2">
                      <Identicon
                        :key="nominator.controller_id"
                        :value="nominator.controller_id"
                        :size="20"
                        :theme="'polkadot'"
                      />
                      <nuxt-link
                        :to="{
                          name: 'account',
                          query: { accountId: nominator.controller_id }
                        }"
                        title="Controller account details"
                      >
                        <span
                          v-b-tooltip.hover
                          :title="$t('details.nominator.account_details')"
                          >{{ shortAddress(nominator.controller_id) }}
                        </span>
                      </nuxt-link>
                    </div>
                  </div>
                </div>
              </div>

              <hr />
              <div class="row">
                <div
                  v-for="nomination in JSON.parse(nominator.targets)"
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
                  <p class="amount">
                    {{ formatAmount(nomination.amount) }}
                    <small
                      >({{
                        (
                          getTotalStakePercen(
                            nominator.total_staked,
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
import { decimals, unit, blockExplorer } from "../../polkastats.config.js";
import commonMixin from "../../mixins/commonMixin.js";
import gql from "graphql-tag";

formatBalance.setDefaults({ decimals, unit });

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      currentSessionIndex: 0,
      nominator: undefined,
      accountId: this.$route.query.accountId,
      blockExplorer,
      favorites: []
    };
  },
  created: function() {
    // Get favorites from cookie
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }
  },
  methods: {
    getTotalStakePercen(totalStake, amount) {
      if (totalStake && amount) {
        totalStake = new BN(totalStake.toString());
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
    },
    isFavorite(accountId) {
      return this.favorites.includes(accountId);
    }
  },
  apollo: {
    $subscribe: {
      validators: {
        query: gql`
          subscription nominator($session_index: Int!, $account_id: String!) {
            nominator(
              where: {
                session_index: { _eq: $session_index }
                account_id: { _eq: $account_id }
              }
            ) {
              account_id
              available_balance
              balances
              block_height
              controller_id
              display_name
              free_balance
              identity
              locked_balance
              nonce
              rank
              stash_id
              targets
              timestamp
              total_staked
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
          this.nominator = {
            ...data.nominator[0],
            num_targets: JSON.parse(data.nominator[0].targets).length,
            favorite: this.isFavorite(data.nominator[0].account_id)
          };
        }
      },
      sessionIndex: {
        query: gql`
          subscription nominator {
            nominator(order_by: { session_index: desc }, where: {}, limit: 1) {
              session_index
            }
          }
        `,
        result({ data }) {
          if (data.nominator[0].session_index > this.currentSessionIndex) {
            this.currentSessionIndex = data.nominator[0].session_index;
          }
        }
      }
    }
  },
  head() {
    return {
      title: "PolkaStats - Polkadot nominator " + this.$route.query.accountId,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Polkadot nominator " + this.$route.query.accountId
        }
      ]
    };
  }
};
</script>
<style>
.page-nominator .amount {
  color: #ef1073;
  font-weight: 700;
  font-size: 1rem;
}
.page-nominator .identicon {
  cursor: pointer;
  display: inline-block;
}
.page-nominator .rank {
  font-size: 1.4rem;
  color: #7d7378;
}
</style>

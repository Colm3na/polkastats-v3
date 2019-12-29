<template>
  <div>
    <section>
      <b-container class="account-page main pt-4 pb-5">
        <template v-for="(account, index) in accounts">
          <template v-if="account.accountId === accountId">
            <div class="row">
              <div class="col-2 col-lg-1">
                <template v-if="index > 0">
                  <nuxt-link :to="{name: 'account', query: { accountId: accounts[index-1].accountId } }" :title="'Previous account: ' + accounts[index-1].accountId">
                    <i class="fas fa-2x fa-chevron-left"></i>
                  </nuxt-link>
                </template>
              </div>
              <div class="col-8 col-lg-10 text-center">
                <h4 class="mb-1">Account {{ accountId }}</h4>
              </div>
              <div class="col-2 col-lg-1 text-right">
                <template v-if="index < accounts.length - 1">
                  <nuxt-link :to="{name: 'account', query: { accountId: accounts[index+1].accountId } }" :title="'Next validator: ' + accounts[index+1].accountId">
                    <i class="fas fa-2x fa-chevron-right"></i>
                  </nuxt-link>  
                </template>
              </div>
            </div>
            <div class="card mt-4 mb-3">
              <div class="card-body">
                <p class="text-center mb-4">
                  <Identicon :value="account.accountId" :size="80" :theme="'polkadot'" :key="account.accountId" />
                </p>
                <table class="table table-striped">
                  <tbody>
                    <tr>
                      <td>Account ID</td><td>{{ account.accountId }}</td>
                    </tr>
                    <tr>
                      <td>Account Index</td><td>{{ account.accountIndex }}</td>
                    </tr>
                    <tr>
                      <td>Nickname</td><td>{{ account.nickname }}</td>
                    </tr>
                    <tr>
                      <td>Identity::display</td><td>{{ account.identity.display }}</td>
                    </tr>
                    <tr>
                      <td>Identity::email</td><td><a :href="`mailto:${account.identity.email}`" target="_blank">{{ account.identity.email }}</a></td>
                    </tr>
                    <tr>
                      <td>Identity::legal</td><td>{{ account.identity.legal }}</td>
                    </tr>
                    <tr>
                      <td>Identity::riot</td><td>{{ account.identity.riot }}</td>
                    </tr>
                    <tr>
                      <td>Identity::web</td><td><a :href="account.identity.web" target="_blank">{{ account.identity.web }}</a></td>
                    </tr>
                    <tr>
                      <td>Identity::judgements</td><td>{{ account.identity.judgements }}</td>
                    </tr>
                    <tr>
                      <td>Account Nonce</td><td>{{ account.balances.accountNonce }}</td>
                    </tr>
                    <tr>
                      <td>Available Balance</td><td>{{ formatAmount(account.balances.availableBalance) }}</td>
                    </tr>
                    <tr>
                      <td>Free Balance</td><td>{{ formatAmount(account.balances.freeBalance) }}</td>
                    </tr>
                    <tr>
                      <td>Locked Balance</td><td>{{ formatAmount(account.balances.lockedBalance) }}</td>
                    </tr>
                    <tr>
                      <td>Locked Breakdown</td><td><pre>{{ JSON.stringify(account.balances.lockedBreakdown, null, 2) }}</pre></td>
                    </tr>
                    <tr>
                      <td>Reserved Balance</td><td>{{ formatAmount(account.balances.reservedBalance) }}</td>
                    </tr>
                    <tr>
                      <td>Is Vesting?</td><td>{{ account.balances.isVesting ? `Yes` : `No` }}</td>
                    </tr>
                    <tr>
                      <td>Vested Balance</td><td>{{ formatAmount(account.balances.vestedBalance) }}</td>
                    </tr>
                    <tr>
                      <td>Vesting Total</td><td>{{ formatAmount(account.balances.vestingTotal) }}</td>
                    </tr>
                    <tr>
                      <td>Voting Balance</td><td>{{ formatAmount(account.balances.votingBalance) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </template>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import Identicon from '../../components/identicon.vue';
import commonMixin from '../../mixins/commonMixin.js';

export default {
  head () {
    return {
      title: 'PolkaStats - Kusama account ' + this.$route.query.accountId,
      meta: [
        { hid: 'description', name: 'description', content: 'Kusama account ' + this.$route.query.accountId }
      ]
    }
  },
  mixins: [commonMixin],
  data: function() {
    return {
      accountId: this.$route.query.accountId,
      polling: null
    }
  },
  computed: {
    accounts() {
      return this.$store.state.accounts.list;
    }
  },
  created: function () {
    var vm = this;
    
    // Force update of account list if empty
    if (this.$store.state.accounts.list.length == 0) {
      vm.$store.dispatch('accounts/update');
    }
    this.totalRows = this.$store.state.accounts.list.length;

    // Update data every 5 minutes
    this.polling = setInterval(() => {
      vm.$store.dispatch('accounts/update');
      if (!this.filter) this.totalRows = this.$store.state.accounts.list.length;
    }, 300000);

  },
  beforeDestroy: function () {
    clearInterval(this.polling);
  },
  watch: {
    $route () {
      this.accountId = this.$route.query.accountId;
    }
  },
  components: {
    Identicon
  }
}
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
.account-page .table td:first-child {
  width: 30%;
  font-weight: bold;
}
</style>
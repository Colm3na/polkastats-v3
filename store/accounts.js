import axios from "axios"
import BN from "bn.js"
import { isHex } from "@polkadot/util"
import { backendBaseURL } from "../polkastats.config.js"

export const state = () => ({
  list: []
})

export const mutations = {
  update(state, accounts) {
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating intentions store, sending event to Google Analytics!`);
    // this.$ga.event('vuex-store', 'update-accounts');

    state.list = accounts
      .map(account => {
        return {
          accountId: account.accountId,
          accountIndex: account.accountIndex,
          identity: account.identity !== "" ? JSON.parse(account.identity) : "",
          nickname: account.nickname,
          availableBalance: JSON.parse(account.balances).availableBalance,
          freeBalance: JSON.parse(account.balances).freeBalance,
          lockedBalance: JSON.parse(account.balances).lockedBalance,
          balances: JSON.parse(account.balances)
        }
      })
      .sort(function compare(a, b) {
        let BNA, BNB
        if (isHex(a.freeBalance)) {
          BNA = new BN(a.freeBalance.substring(2, a.freeBalance.length), 16)
        } else {
          BNA = new BN(a.freeBalance, 10)
        }
        if (isHex(b.freeBalance)) {
          BNB = new BN(b.freeBalance.substring(2, b.freeBalance.length), 16)
        } else {
          BNB = new BN(b.freeBalance, 10)
        }

        if (BNA.lt(BNB)) {
          return 1
        }
        if (BNA.gt(BNB)) {
          return -1
        }
        return 0
      })
      .map((account, index) => {
        return {
          ...account,
          rank: index + 1
        }
      })
  },
  getters: function() {
    state => state.list
  }
}

export const actions = {
  update(context) {
    axios.get(`${backendBaseURL}/accounts`).then(function(response) {
      context.commit("update", response.data)
    })
  }
}

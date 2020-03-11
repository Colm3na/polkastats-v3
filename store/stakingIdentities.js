import axios from "axios";
import BN from "bn.js";
import { isHex } from "@polkadot/util";
import { backendBaseURL } from "../polkastats.config.js";

export const state = () => ({
  list: []
});

export const mutations = {
  update(state, accounts) {
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating intentions store, sending event to Google Analytics!`);
    // this.$ga.event('vuex-store', 'update-stakeIdentities');

    state.list = accounts.map(account => {
      return {
        accountId: account.accountId,
        identity: JSON.parse(account.identity)
      };
    });
  },
  getters: function() {
    state => state.list;
  }
};

export const actions = {
  update(context) {
    axios.get(`${backendBaseURL}/staking_identities`).then(function(response) {
      // console.log(response.data);
      context.commit("update", response.data);
    });
  }
};

import axios from "axios";
import BN from "bn.js";
import { isHex } from "@polkadot/util";
import { backendBaseURL } from "../polkastats.config.js";

export const state = () => ({
  list: []
});

export const mutations = {
  update(state, accounts) {
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
      context.commit("update", response.data);
    });
  }
};

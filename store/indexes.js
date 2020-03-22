import axios from "axios";
import { backendBaseURL } from "../polkastats.config.js";

export const state = () => ({
  list: []
});

export const mutations = {
  update(state, accounts) {
    let indexes = [];
    accounts.forEach(account => {
      indexes[account.accountId] = account.accountIndex;
    });
    state.list = indexes;
  },
  getters: function() {
    state => state.list;
  }
};

export const actions = {
  update(context) {
    axios.get(`${backendBaseURL}/indexes`).then(function(response) {
      context.commit("update", response.data);
    });
  }
};

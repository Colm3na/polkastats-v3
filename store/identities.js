import axios from "axios";
import { backendBaseURL } from "../polkastats.config.js";

export const state = () => ({
  list: []
});

export const mutations = {
  update(state, identities) {
    state.list = identities;
  },
  getters: function() {
    state => state.list;
  }
};

export const actions = {
  update(context) {
    axios.get(`${backendBaseURL}/identities`).then(function(response) {
      context.commit("update", response.data);
    });
  }
};

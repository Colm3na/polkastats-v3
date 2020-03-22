import axios from "axios";
import { backendBaseURL } from "../polkastats.config.js";

export const state = () => ({
  info: {
    chain: ``,
    client_name: ``,
    client_version: ``,
    timestamp: 0
  }
});

export const mutations = {
  update(state, system) {
    state.info = system;
  },
  getters: function() {
    state => state.info;
  }
};

export const actions = {
  update(context) {
    axios.get(`${backendBaseURL}/system`).then(function(response) {
      context.commit("update", response.data);
    });
  }
};

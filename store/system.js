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
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating system info store, sending event to Google Analytics!`);
    // this.$ga.event('vuex-store', 'update-system');

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

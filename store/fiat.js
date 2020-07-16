import axios from "axios";
import { network } from "../polkastats.config.js";

export const state = () => ({
  usd: undefined,
  usd_24h_change: undefined
});

export const mutations = {
  update(state, response) {
    state.usd = response.data[network.coinGeckoDenom].usd;
    state.usd_24h_change = response.data[network.coinGeckoDenom].usd_24h_change;
  },
  getters: function() {
    state => state;
  }
};

export const actions = {
  update({ commit }) {
    if (network.coinGeckoDenom) {
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${network.coinGeckoDenom}&vs_currencies=usd&include_24hr_change=true`
        )
        .then(response => {
          commit("update", response);
        })
        .catch(error => {
          console.log("Error fetching fiat values: ", error);
        });
    }
  }
};

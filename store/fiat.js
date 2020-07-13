import axios from "axios";

export const state = () => ({
  usd: undefined,
  usd_24h_change: undefined
});

export const mutations = {
  update(state, response) {
    state.usd = response.data["polkadot-iou"].usd;
    state.usd_24h_change = response.data["polkadot-iou"].usd_24h_change;
  },
  getters: function() {
    state => state;
  }
};

export const actions = {
  update({ commit }) {
    axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=polkadot-iou&vs_currencies=usd&include_24hr_change=true"
      )
      .then(response => {
        commit("update", response);
      })
      .catch(error => {
        console.log("Error fetching fiat values: ", error);
      });
  }
};

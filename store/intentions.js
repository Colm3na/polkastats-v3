import axios from 'axios';
import { backendBaseURL } from '../polkastats.config.js';

export const state = () => ({
  list: []
})
  
export const mutations = {
  update (state, intentions) {
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating intentions store, sending event to Google Analytics!`);
    // this.$ga.event('vuex-store', 'update-intentions');

    // Sort intentions by total bonded desc
    intentions.sort((a, b) => (a.stakingLedger.total < b.stakingLedger.total) ? 1 : -1)
    state.list = intentions;
  },
  getters: function() {
    list: state => state.list
  }
}

export const actions = {
  update (context) {
    axios.get(`${backendBaseURL}/intentions`)
      .then(function (response) {
        context.commit('update', response.data);
      })
  }
}
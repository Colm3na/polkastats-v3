import axios from 'axios';
import { backendBaseURL } from '../polkastats.config.js';

export const state = () => ({
  info: {
    bestblocknumber: 0,
    bestBlockFinalized: 0,
    session: {  
      currentEra: 0,
      currentIndex: 0,
      eraLength: 0,
      eraProgress: 0,
      lastEraLengthChange: 0,
      lastLengthChange: 0,
      sessionLength: 0,
      sessionsPerEra: 0,
      sessionProgress: 0,
      validatorCount: 0
    },
    totalIssuance: ""
  }
})
  
export const mutations = {
  update (state, network) {
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating network store, sending event to Google Analytics!`);
    // this.$ga.event('vuex-store', 'update-network');

    state.info.bestblocknumber = network.block_height;
    state.info.bestBlockFinalized = network.block_height_finalized;
    state.info.session = network.session;
    state.info.totalIssuance = network.total_issuance;

  },
  getters: function() {
    info: state => state.info
  }
}

export const actions = {
  update (context) {
    axios.get(`${backendBaseURL}/chain`)
      .then(function (response) {
        context.commit('update', response.data);
      })
  }
}
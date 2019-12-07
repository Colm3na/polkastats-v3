import axios from 'axios';

export const state = () => ({
  candidates: []
})
  
export const mutations = {
  update (state, candidates) {
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating validators store, sending event to Google Analytics!`);
    // this.$ga.event('vuex-store', 'update-phragmen');

    // Update phragmen list
    state.candidates = candidates;
  },
  getters: function() {
    candidates: state => state.candidates
  }
}

export const actions = {
  update (context) {
    axios.get('https://polkastats.io:8443/phragmen')
      .then(function (response) {
        context.commit('update', response.data.candidates);
      })
  }
}
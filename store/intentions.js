import axios from 'axios';

export const state = () => ({
  list: []
})
  
export const mutations = {
  update (state, validators) {
    // Sort validators by active bonded desc
    validators.sort((a, b) => (a.stakingLedger.active < b.stakingLedger.active) ? 1 : -1)
    state.list = validators;
  },
  getters: function() {
    list: state => state.list
  }
}

export const actions = {
  update (context) {
    axios.get('https://polkastats.io:8443/intentions')
      .then(function (response) {
        context.commit('update', response.data);
      })
  }
}
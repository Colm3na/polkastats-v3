import axios from 'axios';

export const state = () => ({
  list: []
})
  
export const mutations = {
  update (state, validators) {
    // Sort validators by total bonded desc
    validators.sort((a, b) => (a.stakingLedger.total < b.stakingLedger.total) ? 1 : -1)
    state.list = validators;
  },
  getters: function() {
    list: state => state.list
  }
}

export const actions = {
  update (context) {
    // axios.get('https://polkastats.io:8443/validators')
    axios.get('https://polkastats.io:8443/intentions')
      .then(function (response) {
        context.commit('update', response.data);
      })
  }
}
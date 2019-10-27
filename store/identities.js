import axios from 'axios';

export const state = () => ({
  list: []
})
  
export const mutations = {
  update (state, identities) {
    state.list = identities;
  },
  getters: function() {
    list: state => state.list
  }
}

export const actions = {
  update (context) {
    axios.get('https://polkastats.io:8443/identities')
      .then(function (response) {
        context.commit('update', response.data);
      })
  }
}
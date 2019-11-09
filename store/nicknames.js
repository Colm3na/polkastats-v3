import axios from 'axios';

export const state = () => ({
  list: []
})
  
export const mutations = {
  update (state, nicknames) {
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating nicknames store, sending event to Google Analytics!`);
    // this.$ga.event('vuex-store', 'update-nicknames');

    state.list = nicknames;
  },
  getters: function() {
    list: state => state.list
  }
}

export const actions = {
  update (context) {
    axios.get('https://polkastats.io:8443/nicknames')
      .then(function (response) {
        context.commit('update', response.data);
      })
  }
}
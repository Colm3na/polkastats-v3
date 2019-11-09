import axios from 'axios';

export const state = () => ({
  list: []
})
  
export const mutations = {
  update (state, validators) {
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating validators store, sending event to Google Analytics!`);
    this.$ga.event('vuex-store', 'update-validators');

    // Sort validators by total bonded desc
    validators.sort((a, b) => (a.stakers.total < b.stakers.total) ? 1 : -1)

    state.list = validators;
  },
  getters: function() {
    list: state => state.list
  }
}

export const actions = {
  update (context) {
    axios.get('https://polkastats.io:8443/validators')
      .then(function (response) {
        context.commit('update', response.data);
      })
  }
}
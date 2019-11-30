import axios from 'axios';
import BN from 'bn.js';
import { isHex } from '@polkadot/util';

export const state = () => ({
  list: [],
  totalStakeBonded: 0
})
  
export const mutations = {
  update (state, validators) {
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating validators store, sending event to Google Analytics!`);
    this.$ga.event('vuex-store', 'update-validators');

    // Sort validators by total bonded desc
    validators.sort((a, b) => {
      let stakeA = 0;
      let stakeB = 0;

      if (a.stakers && b.stakers) {

        if (a.stakers.total > 0) {
          stakeA = a.stakers.total;
        } else {
          stakeA = a.stakingLedger.total
        }
        if (b.stakers.total > 0) {
          stakeB = b.stakers.total;
        } else {
          stakeB = b.stakingLedger.total
        }
        return (stakeA < stakeB) ? 1 : -1;
      } else {
        return 1;
      }
    });

    // Update validator list
    state.list = validators;
    // Calculate and update active total bonded funds
    let accum = new BN('0', 10);
    for (let i = 0; i < validators.length; i++) {
      let validator = validators[i];
      let bn;
      if (validator.stakers) {
        if (isHex(validator.stakers.total)) {
          bn = new BN(validator.stakers.total.substring(2, validator.stakers.total.length), 16);
        } else {
          bn = new BN(validator.stakers.total.toString(), 10);
        }
        accum = accum.add(bn);
      }
    }
    state.totalStakeBonded = accum;
    
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
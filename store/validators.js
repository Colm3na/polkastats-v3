import BN from "bn.js";
import { isHex } from "@polkadot/util";
import gql from "graphql-tag";

export const state = () => ({
  list: [],
  totalStakeBonded: 0
});

export const mutations = {
  update(state, validators) {
    // Send Google Analytics event: Category, action, label, value
    this.$ga.event("vuex-store", "update-validators");

    // Sort validators by total bonded desc
    validators.sort((a, b) => {
      let stakeA = 0;
      let stakeB = 0;

      if (a.stakers && b.stakers) {
        if (a.stakers.total > 0) {
          stakeA = a.stakers.total;
        } else {
          stakeA = a.stakingLedger.total;
        }
        if (b.stakers.total > 0) {
          stakeB = b.stakers.total;
        } else {
          stakeB = b.stakingLedger.total;
        }
        return stakeA < stakeB ? 1 : -1;
      } else {
        return 1;
      }
    });

    // Update validator list
    state.list = validators;
    // Calculate and update active total bonded funds
    let accum = new BN("0", 10);
    for (let i = 0; i < validators.length; i++) {
      let validator = validators[i];
      let bn;
      if (validator.exposure) {
        if (isHex(validator.exposure.total)) {
          bn = new BN(
            validator.exposure.total.substring(
              2,
              validator.exposure.total.length
            ),
            16
          );
        } else {
          bn = new BN(validator.exposure.total.toString(), 10);
        }
        accum = accum.add(bn);
      }
    }
    state.totalStakeBonded = accum;
  },
  getters: function() {
    state => state.list;
  }
};

const GET_VALIDATORS = gql`
  query validator_staking {
    validator_staking(limit: 1, order_by: { timestamp: desc }) {
      json
    }
  }
`;

export const actions = {
  update({ commit }) {
    const client = this.app.apolloProvider.defaultClient;
    client
      .query({
        query: GET_VALIDATORS
      })
      .then(({ data }) => {
        const validators = JSON.parse(data.validator_staking[0].json);
        commit("update", validators);
      })
      .catch(error => {
        console.log("Error fetching Validator table: ", error);
      });
  }
};

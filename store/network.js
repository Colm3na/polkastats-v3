import gql from "graphql-tag";

export const state = () => ({
  info: {
    session: {
      currentEra: 0,
      currentIndex: 0,
      eraLength: 0,
      eraProgress: 0,
      sessionLength: 0,
      sessionsPerEra: 0,
      sessionProgress: 0,
      validatorCount: 0
    },
    totalIssuance: 0
  }
});

export const mutations = {
  update(state, network) {
    state.info.session.currentEra = network.current_era;
    state.info.session.currentIndex = network.current_index;
    state.info.session.eraLength = network.era_length;
    state.info.session.eraProgress = network.era_progress;
    state.info.session.sessionLength = network.session_length;
    state.info.session.sessionsPerEra = network.session_per_era;
    state.info.session.sessionProgress = network.session_progress;
    state.info.session.validatorCount = network.validator_count;

    // state.info.totalIssuance = network.total_issuance;
  },
  getters: function() {
    state => state.info;
  }
};

const GET_BLOCK = gql`
  query block {
    block(limit: 1, order_by: { timestamp: desc }) {
      block_author
      block_author_name
      block_hash
      block_number
      current_era
      current_index
      era_length
      era_progress
      extrinsics_root
      is_epoch
      new_accounts
      num_transfers
      parent_hash
      session_length
      session_per_era
      session_progress
      spec_name
      spec_version
      state_root
      timestamp
      total_events
      validator_count
    }
  }
`;

export const actions = {
  update({ commit }) {
    const client = this.app.apolloProvider.defaultClient;
    client
      .query({
        query: GET_BLOCK
      })
      .then(({ data }) => {
        commit("update", data.block[0]);
      })
      .catch(error => {
        console.log("Error fetching Block table: ", error);
      });
  }
};

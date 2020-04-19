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
    const { block, chain } = network;
    const {
      current_era,
      current_index,
      era_length,
      era_progress,
      session_length,
      session_per_era,
      session_progress,
      validator_count
    } = block[0];

    state.info = {
      session: {
        currentEra: current_era,
        currentIndex: current_index,
        eraLength: era_length,
        eraProgress: era_progress,
        sessionLength: session_length,
        sessionsPerEra: session_per_era,
        sessionProgress: session_progress,
        validatorCount: validator_count
      },
      totalIssuance: chain[0].total_issuance.toString()
    };
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
      block_number_finalized
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
    chain(limit: 1, order_by: { timestamp: desc }) {
      total_issuance
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
        commit("update", data);
      })
      .catch(error => {
        console.log("Error fetching Block table: ", error);
      });
  }
};

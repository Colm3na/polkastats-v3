import gql from "graphql-tag";

export const state = () => ({
  info: {
    validator_count: 0,
    nominator_count: 0,
    total_issuance: "",
    candidates: []
  }
});

export const mutations = {
  update(state, phragmen) {
    state.info.validator_count = phragmen.validator_count;
    state.info.nominator_count = phragmen.nominator_count;
    state.info.total_issuance = phragmen.total_issuance;
    state.info.candidates = phragmen.candidates;
  },
  getters: function() {
    state => state.info;
  }
};

const GET_PHRAGMEN = gql`
  query phragmen {
    phragmen {
      timestamp
      phragmen_json
      block_height
    }
  }
`;

export const actions = {
  update({ commit }) {
    const client = this.app.apolloProvider.defaultClient;
    client
      .query({
        query: GET_PHRAGMEN
      })
      .then(({ data }) => {
        commit("update", data.phragmen);
      })
      .catch(error => {
        console.log("Error fetching Phragmen table: ", error);
      });
  }
};

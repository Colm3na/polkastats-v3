import gql from "graphql-tag";

export const state = () => ({
  info: {
    chain: ``,
    client_name: ``,
    client_version: ``,
    timestamp: 0
  }
});

export const mutations = {
  update(state, system) {
    const { chain, node_name, node_version, timestamp } = system;

    state.info = {
      chain: chain,
      client_name: node_name,
      client_version: node_version,
      timestamp: timestamp
    };
  },
  getters: function() {
    state => state.info;
  }
};

const GET_SYSTEM = gql`
  query system {
    system(order_by: { timestamp: desc }, limit: 1) {
      block_height
      chain
      node_name
      node_version
      timestamp
    }
  }
`;

export const actions = {
  update({ commit }) {
    const client = this.app.apolloProvider.defaultClient;
    client
      .query({
        query: GET_SYSTEM
      })
      .then(({ data }) => {
        commit("update", data.system[0]);
      })
      .catch(error => {
        console.log("Error fetching system info: ", error);
      });
  }
};

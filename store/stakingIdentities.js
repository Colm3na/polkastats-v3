import gql from "graphql-tag";

export const state = () => ({
  list: []
});

export const mutations = {
  update(state, accounts) {
    state.list = accounts.map(account => {
      return {
        accountId: account.account_id,
        identity: JSON.parse(account.identity)
      };
    });
  },
  getters: function() {
    state => state.list;
  }
};

const GET_STAKING_IDENTITIES = gql`
  query account {
    account(order_by: {}, where: { identity: { _neq: "" } }) {
      identity
      account_id
    }
  }
`;

export const actions = {
  update({ commit }) {
    const client = this.app.apolloProvider.defaultClient;
    client
      .query({
        query: GET_STAKING_IDENTITIES
      })
      .then(({ data }) => {
        commit("update", data.account);
      })
      .catch(error => {
        console.log("Error fetching Block table: ", error);
      });
  }
};

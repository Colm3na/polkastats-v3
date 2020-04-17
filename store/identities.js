import gql from "graphql-tag";

export const state = () => ({
  list: []
});

export const mutations = {
  update(state, identities) {
    state.list = identities;
  },
  getters: function() {
    state => state.list;
  }
};

const GET_IDENTITIES = gql`
  query account {
    account(where: { identity: { _neq: "" } }) {
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
        query: GET_IDENTITIES
      })
      .then(({ data }) => {
        let identities = [];
        data.account.forEach(identity => {
          const ident = JSON.parse(identity.identity);
          ident.stashId = identity.account_id;
          identities.push(ident);
        });
        commit("update", identities);
      })
      .catch(error => {
        console.log("Error fetching Validator table: ", error);
      });
  }
};

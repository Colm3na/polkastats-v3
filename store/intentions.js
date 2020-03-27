import gql from "graphql-tag";

export const state = () => ({
  list: []
});

export const mutations = {
  update(state, intentions) {
    // Sort intentions by total bonded desc
    intentions.sort((a, b) =>
      a.stakingLedger.total < b.stakingLedger.total ? 1 : -1
    );
    state.list = intentions;
  },
  getters: function() {
    state => state.list;
  }
};

const GET_INTENTIONS = gql`
  query intention_staking {
    intention_staking(limit: 1, order_by: { timestamp: desc }) {
      json
    }
  }
`;

export const actions = {
  update(context) {
    const client = this.app.apolloProvider.defaultClient;
    client
      .query({
        query: GET_INTENTIONS
      })
      .then(({ data }) => {
        const intentions = JSON.parse(data.intention_staking[0].json);
        context.commit("update", intentions);
      })
      .catch(error => {
        console.log("Error fetching Intention table: ", error);
      });
  }
};

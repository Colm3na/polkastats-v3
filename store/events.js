import gql from "graphql-tag";

export const state = () => ({
  list: []
});

export const mutations = {
  update(state, events) {
    state.list = events;
  },
  getters: function() {
    state => state.list;
  }
};

const GET_EVENTS = gql`
  query intention_staking {
    event(limit: 5000, order_by: { event_index: desc }) {
      block_number
      data
      event_index
      method
      phase
      section
    }
  }
`;

export const actions = {
  update(context) {
    const client = this.app.apolloProvider.defaultClient;
    client
      .query({
        query: GET_EVENTS
      })
      .then(({ data }) => {
        context.commit("update", data.event);
      })
      .catch(error => {
        console.log("Error fetching Intention table: ", error);
      });
  }
};

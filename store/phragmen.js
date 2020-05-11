import gql from "graphql-tag";
import BN from "bn.js";

export const state = () => ({
  info: {
    timestamp: undefined,
    block_height: undefined,
    candidates: []
  }
});

export const mutations = {
  update(state, phragmen) {
    let candidates = [];
    Object.entries(phragmen.supports).forEach(([pub_key_stash, candidate]) => {
      candidates.push({
        pub_key_stash,
        other_stake_count: candidate.voters.length,
        stake_total: candidate.total
      });
    });
    candidates = candidates.sort((a, b) => {
      return new BN(a.stake_total.toString(), 10).lt(
        new BN(b.stake_total.toString(), 10)
      )
        ? 1
        : -1;
    });

    candidates = candidates.map((candidate, rank) => {
      return {
        rank: rank + 1,
        ...candidate
      };
    });

    state.info.timestamp = phragmen.timestamp;
    state.info.block_height = phragmen.block_height;
    state.info.candidates = candidates;
  },
  getters: function() {
    state => state.info;
  },
  toogleFavorite: function(state, id) {
    console.log("ID: ", id);
    state.info.candidates.map(candidate => {
      if (candidate.pub_key_stash === id) {
        candidate.favorite = !candidate.favorite;
      }
      return candidate;
    });
  }
};

const GET_PHRAGMEN = gql`
  query phragmen {
    phragmen(limit: 1, order_by: { timestamp: desc }) {
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
        // console.log(JSON.stringify(data.phragmen[0].phragmen_json, null, 2));
        commit("update", JSON.parse(data.phragmen[0].phragmen_json));
      })
      .catch(error => {
        console.log("Error fetching Phragmen table: ", error);
      });
  },
  toogleFavorite(context, id) {
    context.commit("toogleFavorite", id);
  }
};

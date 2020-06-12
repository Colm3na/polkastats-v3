import BN from "bn.js";
import { isHex } from "@polkadot/util";
import gql from "graphql-tag";

export const state = () => ({
  list: [],
  dataLoaded: false
});

export const mutations = {
  update(state, accounts) {
    state.list = accounts.map((account, index) => {
      return {
        rank: index + 1,
        accountId: account.account_id,
        identity: account.identity_display,
        parentIdentity: account.identity_display_parent,
        availableBalance: account.available_balance,
        freeBalance: account.free_balance,
        lockedBalance: account.locked_balance
      };
    });
    state.dataLoaded = true;
  },
  getters: function() {
    state => state.list;
  }
};

export const actions = {
  async update(context) {
    const client = this.app.apolloProvider.defaultClient;
    const query = gql`
      query account {
        account(order_by: { free_balance: desc }, where: {}) {
          account_id
          identity_display
          identity_display_parent
          available_balance
          free_balance
          locked_balance
        }
      }
    `;
    const response = await client.query({ query });
    context.commit("update", response.data.account);
  }
};

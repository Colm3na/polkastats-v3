<template>
  <div class="top-10-rich">
    <div class="table-responsive">
      <b-table striped hover :fields="fields" :items="richList">
        <template slot="account_id" slot-scope="data">
          <p class="mb-0 d-inline-block">
            <nuxt-link
              v-b-tooltip.hover
              :to="`/account?accountId=${data.item.account_id}`"
              title="Check account information"
            >
              <Identicon
                :key="data.item.account_id"
                :value="data.item.account_id"
                :size="20"
                :theme="'polkadot'"
              />
              {{ shortAddress(data.item.account_id) }}
            </nuxt-link>
          </p>
        </template>
        <template slot="balances" slot-scope="data">
          <p class="mb-0">
            {{ formatAmount(JSON.parse(data.item.balances).freeBalance) }} KSM
          </p>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import commonMixin from "../mixins/commonMixin.js";
import Identicon from "../components/identicon.vue";
import gql from "graphql-tag";

export default {
  components: {
    Identicon
  },
  mixins: [commonMixin],
  data: function() {
    return {
      richList: [],
      fields: [
        {
          key: "account_id",
          label: "Account",
          sortable: true
        },
        {
          key: "balances",
          label: "Balances",
          sortable: true
        }
      ]
    };
  },
  apollo: {
    $subscribe: {
      account: {
        query: gql`
          subscription accounts {
            account(order_by: { account_id: desc }, where: {}, limit: 10) {
              account_id
              identity
              balances
            }
          }
        `,
        result({ data }) {
          this.richList = data.account;
        }
      }
    }
  }
};
</script>

<style>
.top-10-rich .identicon {
  display: inline-block;
  margin: 0 0.2rem 0 0;
  cursor: copy;
}
</style>

<template>
  <div class="last-blocks">
    <div class="table-responsive">
      <b-table striped hover :fields="fields" :items="blocks">
        <template v-slot:cell(block_number)="data">
          <p class="mb-0">
            <nuxt-link
              v-b-tooltip.hover
              :to="`/block?blockNumber=${data.item.block_number}`"
              title="Check block information"
            >
              #{{ formatNumber(data.item.block_number) }}
            </nuxt-link>
          </p>
        </template>
        <template v-slot:cell(block_hash)="data">
          <p class="mb-0">
            {{ shortHash(data.item.block_hash) }}
          </p>
        </template>
        <template v-slot:cell(block_author)="data">
          <p class="mb-0 d-inline-block">
            <Identicon
              :key="data.item.block_author"
              :value="data.item.block_author"
              :size="20"
              :theme="'polkadot'"
            />
            <nuxt-link
              v-b-tooltip.hover
              :to="`/validator?accountId=${data.item.block_author}`"
              title="Check validator information"
            >
              <span v-if="data.item.block_author_name">
                {{ data.item.block_author_name }}
              </span>
              <span v-else>
                {{ shortAddress(data.item.block_author) }}
              </span>
            </nuxt-link>
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
      blocks: [],
      fields: [
        {
          key: "block_number",
          label: "Block",
          sortable: true
        },
        {
          key: "block_hash",
          label: "Hash",
          class: "d-none d-sm-none d-md-none d-lg-block d-xl-block",
          sortable: true
        },
        {
          key: "block_author",
          label: "Author",
          sortable: true
        }
      ]
    };
  },
  apollo: {
    $subscribe: {
      block: {
        query: gql`
          subscription blocks {
            block(order_by: { block_number: desc }, where: {}, limit: 10) {
              block_number
              block_hash
              block_author
              block_author_name
            }
          }
        `,
        result({ data }) {
          this.blocks = data.block;
        }
      }
    }
  }
};
</script>

<style>
.last-blocks .table thead th {
  border-bottom: 0;
}
.last-blocks .table td,
.last-blocks .table th {
  padding: 0.45rem;
}
.last-blocks .identicon {
  display: inline-block;
  margin: 0 0.2rem 0 0;
  cursor: copy;
}
</style>

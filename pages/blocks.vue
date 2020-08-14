<template>
  <div>
    <section>
      <b-container class="main py-5">
        <h1 class="mb-4">
          {{ $t("pages.blocks.title") }}
        </h1>
        <div class="last-blocks">
          <div v-if="loading" class="text-center py-4">
            <Loading />
          </div>
          <template v-else>
            <!-- Filter -->
            <b-row style="margin-bottom: 1rem">
              <b-col cols="12">
                <b-form-input
                  id="filterInput"
                  v-model="filter"
                  type="search"
                  :placeholder="$t('pages.blocks.search_placeholder')"
                />
              </b-col>
            </b-row>
            <div class="table-responsive">
              <b-table striped hover :fields="fields" :items="blocks">
                <template v-slot:cell(block_number)="data">
                  <p class="mb-0">
                    <nuxt-link
                      v-b-tooltip.hover
                      :to="`/block/${data.item.block_hash}`"
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
              <div class="mt-2" style="display: flex">
                <b-pagination
                  v-model="page"
                  :total-rows="totalRows"
                  :per-page="perPage"
                />
                <b-button-group class="mx-4">
                  <b-button
                    v-for="(item, index) in tableOptions"
                    :key="index"
                    @click="handleNumFields(item)"
                  >
                    {{ item }}
                  </b-button>
                </b-button-group>
              </div>
            </div>
          </template>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
import commonMixin from "../mixins/commonMixin.js";
import Identicon from "../components/identicon.vue";
import Loading from "../components/Loading.vue";
import gql from "graphql-tag";
import { network, paginationOptions } from "../polkastats.config.js";

export default {
  components: {
    Identicon,
    Loading
  },
  mixins: [commonMixin],
  data: function() {
    return {
      loading: true,
      filter: "",
      blocks: [],
      tableOptions: paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
        : 10,
      page: 1,
      totalRows: 1,
      fields: [
        {
          key: "block_number",
          label: "Block",
          sortable: true
        },
        {
          key: "block_hash",
          label: "Hash",
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
  methods: {
    handleNumFields(num) {
      localStorage.paginationOptions = num;
      this.perPage = parseInt(num);
    }
  },
  apollo: {
    $subscribe: {
      block: {
        query: gql`
          subscription blocks(
            $blockNumber: bigint
            $perPage: Int!
            $offset: Int!
          ) {
            block(
              limit: $perPage
              offset: $offset
              where: { block_number: { _eq: $blockNumber } }
              order_by: { block_number: desc }
            ) {
              block_number
              block_hash
              block_author
              block_author_name
            }
          }
        `,
        variables() {
          return {
            blockNumber: this.filter ? parseInt(this.filter) : undefined,
            perPage: this.perPage,
            offset: (this.page - 1) * this.perPage
          };
        },
        result({ data }) {
          this.blocks = data.block;
          if (this.filter) {
            this.totalRows = this.blocks.length;
          }
          this.loading = false;
        }
      },
      totalBlocks: {
        query: gql`
          subscription total {
            total(where: { name: { _eq: "blocks" } }, limit: 1) {
              count
            }
          }
        `,
        result({ data }) {
          if (!this.filter) {
            this.totalRows = data.total[0].count;
          }
        }
      }
    }
  },
  head() {
    return {
      title: this.$t("pages.blocks.head_title", {
        networkName: network.name
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.blocks.head_content", {
            networkName: network.name
          })
        }
      ]
    };
  }
};
</script>

<style>
.last-blocks .identicon {
  display: inline-block;
  margin: 0 0.2rem 0 0;
  cursor: copy;
}
</style>

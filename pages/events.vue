<template>
  <div>
    <section>
      <b-container class="page-events main pt-4">
        <h1 class="text-center mb-4">
          {{ $t("pages.events.latest_5000_kusama_events") }}
        </h1>

        <!-- Filter -->
        <b-row>
          <b-col lg="12" class="mb-4">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              :placeholder="$t('pages.accounts.search_placeholder')"
            />
          </b-col>
        </b-row>
        <!-- Mobile sorting -->
        <div class="row d-block d-sm-block d-md-block d-lg-none d-xl-none">
          <b-col lg="6" class="my-1">
            <b-form-group
              :label="$t('pages.accounts.sort')"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-4"
            >
              <b-input-group size="sm">
                <b-form-select
                  id="sortBySelect"
                  v-model="sortBy"
                  :options="sortOptions"
                  class="w-75"
                >
                  <template v-slot:first>
                    <option value="">
                      -- none --
                    </option>
                  </template>
                </b-form-select>
                <b-form-select
                  v-model="sortDesc"
                  size="sm"
                  :disabled="!sortBy"
                  class="w-25"
                >
                  <option :value="false">
                    Asc
                  </option>
                  <option :value="true">
                    Desc
                  </option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
        </div>
        <!-- Table with sorting and pagination-->
        <div>
          <b-table
            id="events-table"
            stacked="md"
            head-variant="dark"
            :fields="fields"
            :items="events"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered"
          >
            <template slot="block_number" slot-scope="data">
              <p class="text-right mb-0">
                {{ formatNumber(data.item.block_number) }}
              </p>
            </template>
            <template slot="event_index" slot-scope="data">
              <p class="text-right mb-0">
                {{ data.item.event_index }}
              </p>
            </template>
            <template slot="section" slot-scope="data">
              <p class="mb-0">
                {{ data.item.section }}
              </p>
            </template>
            <template slot="method" slot-scope="data">
              <p class="mb-0">
                {{ data.item.method }}
              </p>
            </template>
            <template slot="phase" slot-scope="data">
              <p class="mb-0">
                {{ data.item.phase }}
              </p>
            </template>
            <template slot="data" slot-scope="data">
              <p class="mb-0">
                {{ data.item.data }}
              </p>
            </template>
          </b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="events-table"
          />
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import bootstrap from "bootstrap";
import commonMixin from "../mixins/commonMixin.js";

export default {
  mixins: [commonMixin],
  data: function() {
    return {
      perPage: 10,
      currentPage: 1,
      sortBy: `block_number`,
      sortDesc: true,
      filter: null,
      filterOn: [],
      totalRows: 1,
      fields: [
        {
          key: "block_number",
          label: this.$t("pages.events.block"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "event_index",
          label: this.$t("pages.events.index"),
          sortable: true,
          filterByFormatted: true
        },
        {
          key: "section",
          label: this.$t("pages.events.section"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "method",
          label: this.$t("pages.events.method"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "phase",
          label: this.$t("pages.events.phase"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        },
        {
          key: "data",
          label: this.$t("pages.events.data"),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        }
      ],
      polling: null
    };
  },
  computed: {
    events() {
      return this.$store.state.events.list;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  created: function() {
    var vm = this;

    // Force update of events list if empty
    if (this.$store.state.events.list.length == 0) {
      vm.$store.dispatch("events/update");
    }
    this.totalRows = this.$store.state.events.list.length;

    // Update data every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch("network/update");
      vm.$store.dispatch("events/update");
      if (!this.filter) this.totalRows = this.$store.state.events.list.length;
    }, 10000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  head() {
    return {
      title: this.$t("pages.events.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Polkadot Kusama chain events"
        }
      ]
    };
  }
};
</script>
<style>
#events-table th {
  text-align: center;
}
#events-table th:first-child {
  width: 8%;
}
#events-table th:nth-child(2) {
  width: 8%;
}
#events-table th:nth-child(3) {
  width: 10%;
}
#events-table th:nth-child(4) {
  width: 14%;
}
#events-table th:nth-child(5) {
  width: 14%;
}
#events-table th:nth-child(6) {
  width: 46%;
}
</style>

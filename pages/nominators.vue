<template>
  <div>
    <section>
      <b-container class="main pt-4">
        <!-- Filter -->
        <b-row>
          <b-col lg="12" class="mb-4">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Search nominator by account or account index"
            ></b-form-input>
          </b-col>
        </b-row>
        <!-- Mobile sorting -->
        <div class="row d-block d-sm-block d-md-block d-lg-none d-xl-none">
          <b-col lg="6" class="my-1">
            <b-form-group
              label="Sort"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-4"
            >
              <b-input-group size="sm">
                <b-form-select v-model="sortBy" id="sortBySelect" :options="sortOptions" class="w-75">
                  <template v-slot:first>
                    <option value="">-- none --</option>
                  </template>
                </b-form-select>
                <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
                  <option :value="false">Asc</option>
                  <option :value="true">Desc</option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
        </div>
        <!-- Table with sorting and pagination-->
        <div class="table-responsive">
          <b-table
            stacked="md"
            id="nominators-table"
            head-variant="dark"
            :fields="fields"
            :items="nominators"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filterIncludedFields="filterOn"
            @filtered="onFiltered"
          >
            <template slot="rank" slot-scope="data">
              {{ data.item.rank }}
            </template>
            <template slot="accountId" slot-scope="data">
              <Identicon :value="data.item.accountId" :size="20" :theme="'polkadot'" :key="data.item.accountId" />
              <nuxt-link :to="{name: 'nominator', query: { accountId: data.item.accountId } }" title="Nominator details">
                <span class="d-inline d-sm-inline d-md-inline d-lg-inline d-xl-none">{{ indexes[data.item.accountId] }}</span>
                <span class="d-none d-sm-none d-md-none d-lg-none d-xl-inline">{{ indexes[data.item.accountId] }}</span>
              </nuxt-link>
            </template>
            <template slot="totalStake" slot-scope="data">
              <p class="text-right mb-0">
                {{ formatAmount(data.item.totalStake) }}
              </p>
            </template>
          </b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="validators-table"
          ></b-pagination>
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import axios from 'axios';
import bootstrap from 'bootstrap';
import Identicon from '../components/identicon.vue';
import Network from '../components/network.vue';
import { isHex } from '@polkadot/util';
import BN from 'bn.js';
import { blockExplorer } from '../polkastats.config.js';
import commonMixin from '../mixins/commonMixin.js';

export default {
  head () {
    return {
      title: 'PolkaStats - Polkadot Kusama nominators',
      meta: [
        { hid: 'description', name: 'description', content: 'Polkadot Kusama nominators' }
      ]
    }
  },
  mixins: [commonMixin],
  data: function() {
    return {
      blockExplorer,
      polling: null,
      perPage: 10,
      currentPage: 1,
      sortBy: ``,
      sortDesc: false,
      filter: null,
      filterOn: [],
      totalRows: 1,
      fields: [
        { key: 'rank', label: 'Rank', sortable: true},
        { key: 'accountId', label: 'Nominator', sortable: true },
        { key: 'totalStake', label: 'Total stake', sortable: true }
      ],
    }
  },
  computed: {
    validators () {
      return this.$store.state.validators.list;
    },
    identities() {
      return this.$store.state.identities.list;
    },
    nicknames() {
      return this.$store.state.nicknames.list;
    },
    indexes() {
      return this.$store.state.indexes.list
    },
    nominators () {
      let nominatorStaking = [];
      for(let i = 0; i < this.validators.length; i++) {
        let validator = this.validators[i];
        if (validator.stakers.others.length > 0) {
          for (let j = 0; j < validator.stakers.others.length; j++) {
            let nominator = validator.stakers.others[j];
            if (nominatorStaking.find(nom => nom.accountId === nominator.who)) {
              let nominatorTmp = nominatorStaking.filter(nom => {
                return nom.accountId === nominator.who
              })
              let bn;
              if (isHex(nominator.value)) {
                bn = new BN(nominator.value.substring(2, nominator.value.length), 16);
              } else {
                bn = new BN(nominator.value.toString(), 10);
              }
              nominatorTmp[0].totalStake = nominatorTmp[0].totalStake.add(bn);
              nominatorTmp[0].staking.push({
                validator: validator.accountId,
                amount: nominator.value
              });
            } else {
              let bn;
              if (isHex(nominator.value)) {
                bn = new BN(nominator.value.substring(2, nominator.value.length), 16);
              } else {
                bn = new BN(nominator.value.toString(), 10);
              }
              nominatorStaking.push({
                accountId: nominator.who,
                accountIndex: this.indexes[nominator.who],
                totalStake: bn,
                staking: [{
                  validator: validator.accountId,
                  amount: nominator.value
                }]
              })
            }
          }
        }
      }
      nominatorStaking.sort(function compare( a, b ) {
        if ( a.totalStake.lt(b.totalStake) ){
          return 1;
        }
        if ( a.totalStake.gt(b.totalStake) ){
          return -1;
        }
        return 0;
      });
      nominatorStaking.map((nominator, index) => {
        nominator.rank = index+1;
      });
      this.totalRows = nominatorStaking.length;
      return nominatorStaking;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  created: function () {
    var vm = this;
    
    // Force update of validators list if empty
    if (this.$store.state.validators.list.length === 0) {
      vm.$store.dispatch('validators/update');
    }

    // Force update of indentities list if empty
    if (this.$store.state.identities.list.length === 0) {
      vm.$store.dispatch('identities/update');
    }

    // Force update of nicknames list if empty
    if (this.$store.state.nicknames.list.length === 0) {
      vm.$store.dispatch('nicknames/update');
    }

    // Force update of account indexes list if empty
    if (this.$store.state.indexes.list.length == 0) {
      vm.$store.dispatch('indexes/update');
    }

    // Update network info validators and intentions every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch('validators/update');
      vm.$store.dispatch('identities/update');
      vm.$store.dispatch('nicknames/update');
    }, 10000);

  },
  beforeDestroy: function () {
    clearInterval(this.polling);
  },
  methods: {
    getIndex(validator) {
      // Receives validator accountId
      for (var i=0; i < this.validators.length; i++) {
        if (this.validators[i].accountId === validator) {
          return i;
        }
      }
      return false;
    },
    getRank(validator) {
      // Receives validator accountId
      for (var i=0; i < this.validators.length; i++) {
        if (this.validators[i].accountId == validator) {
          return i + 1;
        }
      }
      return false;
    },
    hasIdentity(stashId) {
      return this.$store.state.identities.list.some(obj => {
        return obj.stashId === stashId;
      });
    },
    getIdentity(stashId) {
      let filteredArray =  this.$store.state.identities.list.filter(obj => {
        return obj.stashId === stashId
      });
      return filteredArray[0];
    },
    hasNickname(accountId) {
      return this.$store.state.nicknames.list.some(obj => {
        return obj.accountId === accountId;
      });
    },
    getNickname(accountId) {
      let filteredArray =  this.$store.state.nicknames.list.filter(obj => {
        return obj.accountId === accountId
      });
      return filteredArray[0].nickname;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },
  components: {
    Identicon,
    Network
  }
}
</script>
<style>
#nominators-table .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
#nominators-table .identicon div {
  display: inline;
}
</style>

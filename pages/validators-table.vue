<template>
  <div>
    <section>
      <b-container class="main pt-4">
        <b-alert show dismissible variant="success" class="text-center">
          Connected to chain <strong>{{system.chain}}</strong> using <strong>{{ system.client_name}}</strong> client version <strong>{{system.client_version}}</strong>
        </b-alert>
        <p class="session text-right">Last block: <strong>#{{ formatNumber(bestblocknumber) }}</strong> | Session: <strong>{{ formatNumber(session.sessionProgress) }}/{{ formatNumber(session.sessionLength) }}</strong> | Era: <strong>{{ formatNumber(session.eraProgress) }}/{{ formatNumber(session.eraLength) }}</strong></p>
        
        <!-- Table with sorting and pagination-->
        <div class="table-responsive">
          <b-table
            id="validators-table"
            head-variant="dark"
            :fields="validatorsTableFields"
            :items="validators"
            :per-page="perPage"
            :current-page="validatorsTableCurrentPage"
            :sort-by.sync="validatorsTableSortBy"
            :sort-desc.sync="validatorsTableSortDesc"
          >
            
            <template slot="rank" slot-scope="data">
              {{ getRank(data.item.accountId) }}
            </template>
            <template slot="accountId" slot-scope="data">
              <Identicon :value="data.item.accountId" :size="20" :theme="'polkadot'" />
              <nuxt-link :to="{name: 'validator', query: { accountId: data.item.accountId } }" title="Validator details">
                <span v-if="hasNickname(data.item.accountId)">
                  {{ getNickname(data.item.accountId) }}
                </span>
                <span v-else>
                  {{ data.item.accountId }}
                </span>
              </nuxt-link>
            </template>
            <template slot="stake" slot-scope="data">
              <p class="text-right mb-0" v-if="data.item.stakers.total > 0" v-b-tooltip.hover title="Total bonded">{{ formatDot(data.item.stakers.total) }}</p>
              <p class="text-right mb-0" v-else v-b-tooltip.hover title="Total bonded">{{ formatDot(data.item.stakingLedger.total) }}</p>
            </template> 
            <template slot="comission" slot-scope="data">
              <p class="text-right mb-0">
                {{ formatDot(data.item.validatorPrefs.validatorPayment) }}
              </p>
            </template>
            <template slot="reward" slot-scope="data">
              {{ formatRewardDest(data.item.rewardDestination) }}
            </template>
            <!-- <template slot="data" slot-scope="data">
              <pre>{{ JSON.stringify(data.item, null, 2) }}</pre>
            </template> -->

          </b-table>
          <b-pagination
            v-model="validatorsTableCurrentPage"
            :total-rows="validatorsTableRows"
            :per-page="perPage"
            aria-controls="validators-table"
          ></b-pagination>
        </div>
        
        <p>&nbsp;</p>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import axios from 'axios';
import bootstrap from 'bootstrap';
import Identicon from '../components/identicon.vue';
import editable from '../components/editable.vue';
import { formatBalance, isHex } from '@polkadot/util';
import BN from 'bn.js';
import { decimals, unit, backendBaseURL, blockExplorer} from '../polkastats.config.js';

formatBalance.setDefaults({ decimals, unit });

export default {
  head () {
    return {
      title: 'PolkaStats - Polkadot network statistics',
      meta: [
        { hid: 'description', name: 'description', content: 'Polkadot network statistics' }
      ]
    }
  },
  data: function() {
    return {

      // Data table pagination
      perPage: 10,
      validatorsTableCurrentPage: 1,
      validatorsTableSortBy: 'height',
      validatorsTableSortDesc: true,
      validatorsTableFields: [
        { key: 'rank', label: 'Rank', sortable: true },
        { key: 'accountId', label: 'Account ID', sortable: true },
        { key: 'stake', label: 'Total Stake', sortable: true },
        { key: 'comission', label: 'Comission', sortable: true },
        { key: 'reward', label: 'Reward destination', sortable: true },
        // { key: 'data', label: 'JSON data', sortable: true }
      ],
      // End data table pagination

      system: {
        chain: "",
        client_name: "",
        client_version: "",
        timestamp: 0
      },
      blockExplorer,
      backendBaseURL,
      favorites: [],
      polling: null,
      bestblocknumber: 0,
      session: {  
        currentEra: 0,
        currentIndex: 0,
        eraLength: 0,
        eraProgress: 0,
        lastEraLengthChange: 0,
        lastLengthChange: 0,
        sessionLength: 0,
        sessionsPerEra: 0,
        sessionProgress: 0
      }
    }
  },
  computed: {
    validators () {
      return this.$store.state.validators.list
    },
    intentions () {
      return this.$store.state.intentions.list
    },
    identities() {
      return this.$store.state.identities.list
    },
    nicknames() {
      return this.$store.state.nicknames.list
    },
    validatorsTableRows() {
      return this.$store.state.validators.list.length
    }
  },
  created: function () {
    var vm = this;

    // Get favorites from cookie
    if (this.$cookies.get('favorites')) {
      this.favorites = this.$cookies.get('favorites');
    }

    // First time
    this.getSystemData();
    this.getChainData();
    
    // Force update of validators list if empty
    if (this.$store.state.validators.list.length == 0) {
      vm.$store.dispatch('validators/update');
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length == 0) {
      vm.$store.dispatch('identities/update');
    }

    // Force update of nicknames list if empty
    if (this.$store.state.nicknames.list.length == 0) {
      vm.$store.dispatch('nicknames/update');
    }

    // Force update of intention validators list if empty
    if (this.$store.state.intentions.list.length == 0) {
      vm.$store.dispatch('intentions/update');
    }

    /* Update validators, intention validators, best block and session info every 10 seconds */
    this.polling = setInterval(() => {
      vm.$store.dispatch('validators/update');
      vm.$store.dispatch('intentions/update');
      this.getChainData();
    }, 10000);

  },
  beforeDestroy: function () {
    clearInterval(this.polling);
    clearInterval(this.sessionPolling);
  },
  methods: {
    getSystemData: function () {
      var vm = this;
      axios.get(`${backendBaseURL}/system`)
        .then(function (response) {
          vm.system = response.data;
        })
    },
    getChainData: function () {
      var vm = this;
      axios.get(`${backendBaseURL}/chain`)
        .then(function (response) {
          vm.bestblocknumber = response.data.block_height;
          vm.session = response.data.session;
        });
    },
    formatNumber(n) {
      if (isHex(n)) {
        return (parseInt(n, 16).toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      } else {
        return (n.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }
    },
    formatDot(amount) {
      let bn;
      if (isHex(amount)) {
        bn = new BN(amount.substring(2, amount.length), 16);
      } else {
        bn = new BN(amount.toString());
      }
      return formatBalance(bn.toString(10));
    },  
    shortAddress(address) {
      return (address).substring(0,5) + ' .... ' + (address).substring(address.length - 5);
    },
    thousandsSeparator(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    toggleFavorite(validator) {
      // Receives validator accountId
      if (this.isFavorite(validator)) {
        this.favorites.splice(this.getIndex(validator), 1);
      } else {
        this.favorites.push({ accountId: validator, name: 'Edit validator name...'});
      }
      return true;
    },
    isFavorite(validator) {
      // Receives validator accountId
      for (var i=0; i < this.favorites.length; i++) {
        if (this.favorites[i].accountId == validator) {
          return true;
        }
      }
      return false;
    },
    getIndex(validator) {
      // Receives validator accountId
      for (var i=0; i < this.favorites.length; i++) {
        if (this.favorites[i].accountId == validator) {
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
    makeToast(content = '', title = '', variant = null, solid = false) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: solid
      })
    },
    formatRewardDest(rewardDestination) {
      if (rewardDestination === 0) {
        return `Stash account (increase stake)`;
      }
      if (rewardDestination === 1) {
        return `Stash account (do not increase stake)`;
      }
      if (rewardDestination === 2) {
        return `Controller account`;
      }
      return rewardDestination;
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
    }
  },
  watch: {
    favorites: function (val) {
      //console.log(val);
      this.$cookies.set('favorites', val, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
    }
  },
  components: {
    editable,
    Identicon
  }
}
</script>
<style>
body {
  font-size: 0.9rem;
}
.favorite {
  cursor: pointer;
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  z-index: 10;
  font-size: 1.1rem;
}
.validator .bg-offline {
  background-color: rgba(239, 57, 74, 0.12) !important;
}
.validator .bg-candidate {
  background-color: rgba(21, 240, 86, 0.12) !important;
}
.rank {
  font-size: 1.6rem;
  color: #7d7378;
}
.account {
  color: #670d35;
}
.bonded {
  color: #d75ea1;
  font-weight: 700;
  font-size: 1.3rem;
}
[data-toggle="collapse"] .fas:before {   
  content: "\f078";
}
[data-toggle="collapse"][aria-expanded="false"] .fas:before {
  content: "\f054";
}
.nominators {
  color: #670d35;
}
.nominator {
  font-size: 0.9rem;
}
.nominator .value {
  color: #d75ea1;
  font-weight: 700;
}
.fee, .unstake {
  color: #d75ea1;
  font-weight: 700;
}
.block {
  color: #d75ea1;
  font-weight: bold;
}
.block:hover {
  color: #d75ea1;
}
.tab-content .validator:nth-child(1) {
  border-top: 0;
}
.fas.fa-copy {
  cursor: pointer;
  color: #d75ea1;
  font-size: 0.9rem;
  margin-left: 0.1rem;
}
.identity {
  max-width: 80px;
}
#validators-table .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
#validators-table .identicon div {
  display: inline;
}
</style>
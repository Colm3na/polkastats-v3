<template>
  <div>
    <v-app>
      <b-container class="main pt-4">
        <b-alert show dismissible variant="success" class="text-center">
          Connected to chain <strong>{{system.chain}}</strong> using <strong>{{ system.client_name}}</strong> client version <strong>{{system.client_version}}</strong>
        </b-alert>
        <v-data-table
          :headers="headers"
          :items="validators"
          :sort-by="['accountId', 'controllerId', 'nextSessionId', 'stakers.total']"
          :sort-desc="[true, true]"
          multi-sort
        ></v-data-table>
      </b-container>
    </v-app>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import axios from 'axios';
import bootstrap from 'bootstrap';
import Identicon from "../components/identicon.vue";
import editable from "../components/editable.vue";
import { formatBalance, isHex } from '@polkadot/util';
import BN from "bn.js"

formatBalance.setDefaults({ decimals: 12, unit: 'KSM' });

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
    console.log('STORE is', this.$store)
    return {
      headers: [
        {
          text: 'Account ID',
          align: 'left',
          value: 'accountId',
        },
        {
          text: 'Controller ID',
          align: 'left',
          value: 'controllerId',
        },
        {
          text: 'Next Session ID',
          align: 'left',
          value: 'nextSessionId',
        },
        {
          text: 'Stake',
          align: 'left',
          value: 'stakers.total',
        }
      ],
      system: {
        chain: "",
        client_name: "",
        client_version: "",
        timestamp: 0
      },
      blockExplorer: {
        block: 'https://polkascan.io/pre/kusama-cc2/block/',
        account: 'https://polkascan.io/pre/kusama-cc2/account/'
      },
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
    async getRowsHandler () {
      try {
        const {total} = await this.$store.dispatch('getRows', {
          tableIdentifier: this.$route.params.tableIdentifier,
          page: this.options.page,
          size: this.options.rowsPerPage
        })

        this.options.totalItems = total
      } catch (error) {
        // Error
      }
    },
    getSystemData: function () {
      var vm = this;
      axios.get('https://polkastats.io:8443/system')
        .then(function (response) {
          vm.system = response.data;
        })
    },
    getChainData: function () {
      var vm = this;
      axios.get('https://polkastats.io:8443/chain')
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
      formatBalance.setDefaults({ decimals: 12, unit: 'KSM' });
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
    makeToast(content = '', title = '', variant = null, solid = false) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: solid
      })
    },
    formatRewardDest(rewardDestination) {
      if (rewardDestination === 0) {
        return `Stash account (increase the amount at stake)`;
      }
      if (rewardDestination === 1) {
        return `Stash account (do not increase the amount at stake)`;
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
    }
  },
  watch: {
    favorites: function (val) {
      //console.log(val);
      this.$cookies.set('favorites', val, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    });
  },
  components: {
      editable,
      Identicon
    }
  },
}
</script>
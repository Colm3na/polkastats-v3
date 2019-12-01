<template>
  <div>
    <section>
      <b-container class="main pt-4">
        <div v-for="nominator in nominators" :key="nominator.accountId">
          <div class="card mb-3">
            <div class="card-body text-center">
              <Identicon :value="nominator.accountId" :size="80" :theme="'polkadot'" :key="nominator.accountId" />
              <a v-bind:href="blockExplorer.account + nominator.accountId" target="_blank" class="d-block my-2">
                <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="nominator.accountId">{{ shortAddress(nominator.accountId) }} </span>
                <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ nominator.accountId }}</span>
              </a>
              <h5>{{ nominator.staking.length }} nominations</h5>
              <hr>
              <div class="row">
                <div class="col-2" v-for="nomination in nominator.staking" :key="nomination.validator">
                  <Identicon :value="nomination.validator" :size="50" :theme="'polkadot'" :key="nomination.validator" />
                  <p class="my-2">{{ nomination.validator }}</p>
                  <p>{{ formatDot(nomination.amount) }}</p>
                </div>
              </div>
            </div>
          </div>
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
import { formatBalance, isHex } from '@polkadot/util';
import BN from 'bn.js';
import { decimals, unit, backendBaseURL, blockExplorer} from '../polkastats.config.js';

formatBalance.setDefaults({ decimals, unit });

export default {
  head () {
    return {
      title: 'PolkaStats - Kusama nominators',
      meta: [
        { hid: 'description', name: 'description', content: 'Kusama nominators' }
      ]
    }
  },
  data: function() {
    return {
      blockExplorer,
      polling: null
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
    nominators () {
      let nominatorStaking = [];
      for(let i = 0; i < this.validators.length; i++) {
        let validator = this.validators[i];
        // console.log(validator);
        if (validator.stakers.others.length > 0) {
          for (let j = 0; j < validator.stakers.others.length; j++) {
            let nominator = validator.stakers.others[j];
            if (nominatorStaking.find(nom => nom.accountId === nominator.who)) {
              let nominatorTmp = nominatorStaking.filter(nom => {
                return nom.accountId === nominator.who
              })
              nominatorTmp[0].staking.push({
                validator: validator.accountId,
                amount: nominator.value
              });
            } else {
              nominatorStaking.push({
                accountId: nominator.who,
                staking: [{
                  validator: validator.accountId,
                  amount: nominator.value
                }]
              })
            }
          }
        }
      }
      // console.log(nominatorStaking);
      return nominatorStaking;
    }
  },
  created: function () {
    var vm = this;
    
    // Force update of validators list if empty
    if (this.$store.state.validators.list.length === 0) {
      vm.$store.dispatch('validators/update');
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length === 0) {
      vm.$store.dispatch('identities/update');
    }

    // Force update of nicknames list if empty
    if (this.$store.state.nicknames.list.length === 0) {
      vm.$store.dispatch('nicknames/update');
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
    },
    getStakePercent(amount) {
      let amountBN;
      if (isHex(amount)) {
        amountBN = new BN(amount.substring(2, amount.length), 16);
      } else {
        amountBN = new BN(amount.toString(), 10);
      }
      amountBN = amountBN.mul(new BN('100000', 10));
      let result = amountBN.div(this.totalStakeBonded);
      return this.formatNumber(parseInt(result.toString(10), 10) / 1000);
    },
    getImOnlineMessage(validator) {
      let message = "";
      if (validator.imOnline.isOnline) {
        message = "Active with ";
      } else {
        message = "Inactive with ";
      }
      message = `${message} ${validator.imOnline.blockCount} blocks authored, `;
      if (validator.imOnline.hasMessage) {
        message = message + "has heartbeat message!";
      } else {
        message = message + "no heartbeat message";
      }
      return message;
    },
  },
  components: {
    Identicon,
    Network
  }
}
</script>
<style>
body {
  font-size: 0.9rem;
}
.favorite {
  cursor: pointer;
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
.identity-small {
  max-width: 25px;
  margin-right: 0.2rem;
}
#validators-table th {
  text-align: center;
}
#validators-table th:first-child {
  width: 7%;
}
#validators-table th:nth-child(2) {
  width: 7%;
}
#validators-table th:nth-child(3) {
  width: 42%;
}
#validators-table th:nth-child(4) {
  width: 16%;
}
#validators-table th:nth-child(5) {
  width: 13%;
}
#validators-table th:nth-child(6) {
  width: 8%;
}
#validators-table th:nth-child(7) {
  width: 10%;
}

#validators-table .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
#validators-table .identicon div {
  display: inline;
}

.page-item.active .page-link {
    z-index: 1;
    color: #fff;
    background-color: #343a40;
    border-color: #343a40;
}
.page-link {
    position: relative;
    display: block;
    padding: 0.5rem 0.75rem;
    margin-left: -1px;
    line-height: 1.25;
    color: #343a40;
    background-color: #fff;
    border: 1px solid #dee2e6;
}
.imOnline {
  font-size: 1.1rem;
  color: green;
}
.imOffline {
  font-size: 1.1rem;
  color: red;
}
.table.b-table > thead > tr > th[aria-sort]::before, .table.b-table > tfoot > tr > th[aria-sort]::before {
  margin-left: -0.5em;
}
@media (max-width:767px){
  #validators-table td[data-label="Validator"] {
    background-color: white;
    border-left: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;
    padding: 1rem 0 1rem 0;
  }
  #validators-table tr td:nth-child(3) div {
    padding: 0 1rem;
  }
  #validators-table tr td:nth-child(3) div .d-block {
    position: relative;
  }
  #validators-table tr td:nth-child(3) div .d-block .favorite {
    position: absolute;
    top: 0rem;
    right: 0rem;
  }
  #validators-table .elected {
    position: absolute;
    top: 0rem;
    left: 1.8rem;
    font-size: 1.1rem;
    color: #2697e2;
  }
  #validators-table .notElected {
    position: absolute;
    top: 0rem;
    left: 1.8rem;
    font-size: 1.1rem;
    color: red;
  }
  #validators-table .imOnline {
    position: absolute;
    top: 0rem;
    left: 0rem;
  }
  #validators-table .imOffline {
    position: absolute;
    top: 0rem;
    left: 0rem;
  }
}
</style>

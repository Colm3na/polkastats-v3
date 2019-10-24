<template>
  <div>
    <section>
      <b-container class="main pt-4">
        <b-alert show dismissible variant="success" class="text-center">
          Connected to chain {{system.chain}} using {{ system.nodeName}} client version {{system.nodeVersion}}
        </b-alert>
        <p class="session text-right">Last block: <strong>#{{ formatNumber(bestblocknumber) }}</strong> | Session: <strong>{{ formatNumber(session.sessionProgress) }}/{{ formatNumber(session.sessionLength) }}</strong> | Era: <strong>{{ formatNumber(session.eraProgress) }}/{{ formatNumber(session.eraLength) }}</strong></p>
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="nav-active-validators" data-toggle="tab" href="#active-validators" role="tab" aria-controls="nav-active-validators" aria-selected="true">VALIDATORS ({{ validators.length }})</a>
            <a class="nav-item nav-link" id="nav-favorites" data-toggle="tab" href="#favorites" role="tab" aria-controls="nav-favorites" aria-selected="false"> <i class="far fa-star" style="color: rgb(241, 189, 35);"></i> FAVORITES ({{ favorites.length }})</a>
            </div>
        </nav>
        <div class="tab-content mb-2" id="nav-tabContent">
          <div class="tab-pane fade show active" id="active-validators" role="tabpanel" aria-labelledby="nav-active-validators">
            <div class="validator card mb-3" v-for="(validator, index) in validators">
              <div v-bind:class="{ 'card-body': 'card-body', 'bg-offline': validator.isOffline }">
                <p class="text-right mb-0">
                  <a class="favorite" v-on:click="toggleFavorite(validator.accountId)" title="Mark as Favorite">
                    <i v-if="isFavorite(validator.accountId)" class="fas fa-star" style="color: #f1bd23" title="Unset as Favorite"></i>
                    <i v-else class="fas fa-star" style="color: #e6dfdf;" title="Set as Favorite"></i>
                  </a>
                </p>
                <div class="row">
                  <div class="col-md-3 mb-2 text-center">
                    <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" />
                    <p class="mb-0 rank">rank #{{ index+1 }}</p>
                    <p class="bonded mb-0" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakers.total) }}</p>
                    <p class="mb-0"><small><span v-b-tooltip.hover title="Self bonded">{{ formatDot(validator.stakers.own) }}</span> (+<span v-b-tooltip.hover title="Bonded by nominators">{{ formatDot(validator.stakers.total - validator.stakers.own) }})</span></small></p>
                  </div>
                  <div class="col-md-9">
                    <h4 class="card-title mb-4 account mt-4 mt-sm-1 mt-md-1 mt-lg-1 mt-xl-1">
                      <nuxt-link :to="{name: 'validator', query: { accountId: validator.accountId } }" title="Validator details">
                        {{ validator.accountId }}
                      </nuxt-link>
                    </h4>
                    <div v-if="validator.controllerId != validator.nextSessionId">
                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <strong>Controller</strong>
                        </div>
                        <div class="col-md-9 mb-2">
                          <Identicon :value="validator.controllerId" :size="20" :theme="'polkadot'" />
                          <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                            <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddess(validator.controllerId) }}</span>
                            <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.controllerId }}</span>
                          </a>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <strong>Session</strong>
                        </div>
                        <div class="col-md-9 mb-2">
                          <Identicon :value="validator.nextSessionId" :size="20" :theme="'polkadot'" />              
                          <a v-bind:href="blockExplorer.account + validator.nextSessionId" target="_blank">
                            <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                            <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.nextSessionId }}</span>     
                          </a>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <strong>Controller/Session</strong>
                        </div>
                        <div class="col-md-9 mb-2">
                          <Identicon :value="validator.nextSessionId" :size="20" :theme="'polkadot'" />
                          <a v-bind:href="blockExplorer.account + validator.nextSessionId" target="_blank">
                            <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                            <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.nextSessionId }}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Stash</strong>
                      </div>
                      <div class="col-md-9 mb-2">
                        <Identicon :value="validator.stashId" :size="20" :theme="'polkadot'" />
                        <a v-bind:href="blockExplorer.account + validator.stashId" target="_blank">
                          <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.stashId">{{ shortAddess(validator.stashId) }}</span>
                          <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.stashId }}</span>
                        </a>
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-3 mb-2">
                        <strong>Comission</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        {{ formatDot(validator.validatorPrefs.validatorPayment) }}
                      </div>
                    </div>
                    <template v-if="validator.stakers.others.length > 0">
                      <a class="" data-toggle="collapse" v-bind:href="'#staker' + index" role="button" aria-expanded="false" v-bind:aria-controls="'staker' + index">
                        <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Nominators ({{ validator.stakers.others.length }})</h6>
                      </a>
                    </template>
                    <template v-if="validator.offline.length > 0">
                      <a data-toggle="collapse" v-bind:href="'#offline' + index" role="button" aria-expanded="false" v-bind:aria-controls="'offline' + index">
                        <h6 class="h6 offline d-inline"><i class="fas"></i> Reported offline ({{ validator.offline.length }})</h6>
                      </a>
                    </template>
                    <template v-if="validator.stakers.others.length > 0">
                      <div class="nominator collapse pt-2 pb-3"  v-bind:id="'staker' + index">
                        <div v-for="staker in validator.stakers.others" class="row">
                          <div class="col-8 who">                      
                            <a v-bind:href="blockExplorer.account + staker.who" target="_blank">
                              <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="staker.who">{{ shortAddess(staker.who) }}</span>
                              <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ staker.who }}</span>                        
                            </a>
                          </div>
                          <div class="col-4 text-right value">
                            {{ formatDot(staker.value) }}
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-if="validator.offline.length > 0">
                      <div class="offlineEvent collapse pt-2 pb-3"  v-bind:id="'offline' + index">
                        <div v-for="offlineEvent in validator.offline" class="row">
                          <div class="col-12" style="color: #d75ea1;">                      
                            <i class="far fa-angry"></i> Reported offline {{ offlineEvent.number }} time/s at block <a class="block" v-bind:href="blockExplorer.block + offlineEvent.block" target="_blank">#{{ thousandsSeparator(offlineEvent.block) }}</a>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade show" id="favorites" role="tabpanel" aria-labelledby="nav-favorites">
            <template v-if="favorites.length == 0">
              <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
                <strong>Hi there!</strong> You can click in the star icon <i class="fas fa-star" style="color: #e6dfdf;"></i> of a validator to track it on this tab.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </template>
            <template  v-for="(validator, index) in validators">
              <template v-if="isFavorite(validator.accountId)">
                <div class="validator card mb-3">
                  <p class="text-right mb-0">
                    <a class="favorite" v-on:click="toggleFavorite(validator.accountId)" title="Mark as Favorite">
                      <i v-if="isFavorite(validator.accountId)" class="fas fa-star" style="color: #f1bd23" title="Unset as Favorite"></i>
                      <i v-else class="fas fa-star" style="color: #e6dfdf;" title="Set as Favorite"></i>
                    </a>
                  </p>                 
                  <div v-bind:class="{ 'card-body': 'card-body', 'bg-offline': validator.isOffline }">
                    <div class="row">
                      <div class="col-md-3 mb-2 text-center">
                        <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" />
                        <p class="mb-0 rank">rank #{{ index+1 }}</p>
                        <p class="bonded mb-0" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakers.total) }}</p>
                        <p class="mb-0"><small><span v-b-tooltip.hover title="Self bonded">{{ formatDot(validator.stakers.own) }}</span> (+<span v-b-tooltip.hover title="Bonded by nominators">{{ formatDot(validator.stakers.total - validator.stakers.own) }})</span></small></p>
                        <editable v-bind:favorites="favorites" v-model="favorites[getIndex(validator.accountId)].name"></editable>
                      </div>
                      <div class="col-md-9">
                        <h4 class="card-title mb-4 account mt-4 mt-sm-1 mt-md-1 mt-lg-1 mt-xl-1">
                          <nuxt-link :to="{name: 'validator', query: { accountId: validator.accountId } }" title="Validator details">
                            {{ validator.accountId }}
                          </nuxt-link>
                        </h4>                        
                        <div v-if="validator.controllerId != validator.nextSessionId">
                          <div class="row">
                            <div class="col-md-3 mb-2">
                              <strong>Controller</strong>
                            </div>
                            <div class="col-md-9 mb-2">
                              <Identicon :value="validator.controllerId" :size="20" :theme="'polkadot'" />
                              <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                                <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddess(validator.controllerId) }}</span>
                                <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.controllerId }}</span>
                              </a>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-3 mb-2">
                              <strong>Session</strong>
                            </div>
                            <div class="col-md-9 mb-2">
                              <Identicon :value="validator.nextSessionId" :size="20" :theme="'polkadot'" />            
                              <a v-bind:href="blockExplorer.account + validator.nextSessionId" target="_blank">
                                <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                                <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.nextSessionId }}</span>     
                              </a>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <div class="row">
                            <div class="col-md-3 mb-2">
                              <strong>Controller/Session</strong>
                            </div>
                            <div class="col-md-9 mb-2">
                              <Identicon :value="validator.nextSessionId" :size="20" :theme="'polkadot'" />
                              <a v-bind:href="blockExplorer.account + validator.nextSessionId" target="_blank">
                                <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                                <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.nextSessionId }}</span>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-3 mb-2">
                            <strong>Stash</strong>
                          </div>
                          <div class="col-md-9 mb-2">
                            <Identicon :value="validator.nextSessionId" :size="20" :theme="'polkadot'" />
                            <a v-bind:href="blockExplorer.account + validator.stashId" target="_blank">
                              <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.stashId">{{ shortAddess(validator.stashId) }}</span>
                              <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.stashId }}</span>
                            </a>
                          </div>
                        </div>
                        <div class="row mb-2">
                          <div class="col-md-3 mb-2">
                            <strong>Comission</strong>
                          </div>
                          <div class="col-md-9 mb-2 fee">
                            {{ formatDot(validator.validatorPrefs.validatorPayment) }}
                          </div>
                        </div>
                        <template v-if="validator.stakers.others.length > 0">
                          <a class="" data-toggle="collapse" v-bind:href="'#staker' + index" role="button" aria-expanded="false" v-bind:aria-controls="'staker' + index">
                            <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Nominators ({{ validator.stakers.others.length }})</h6>
                          </a>
                        </template>
                        <template v-if="validator.offline.length > 0">
                          <a data-toggle="collapse" v-bind:href="'#offline' + index" role="button" aria-expanded="false" v-bind:aria-controls="'offline' + index">
                            <h6 class="h6 offline d-inline"><i class="fas"></i> Reported offline ({{ validator.offline.length }})</h6>
                          </a>
                        </template>
                        <template v-if="validator.stakers.others.length > 0">
                          <div class="nominator collapse pt-2 pb-3"  v-bind:id="'staker' + index">
                            <div v-for="staker in validator.stakers.others" class="row">
                              <div class="col-8 who">                      
                                <a v-bind:href="blockExplorer.account + staker.who" target="_blank">
                                  <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="staker.who">{{ shortAddess(staker.who) }}</span>
                                  <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ staker.who }}</span>                        
                                </a>
                              </div>
                              <div class="col-4 text-right value">
                                {{ formatDot(staker.value) }}
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-if="validator.offline.length > 0">
                          <div class="offlineEvent collapse pt-2 pb-3"  v-bind:id="'offline' + index">
                            <div v-for="offlineEvent in validator.offline" class="row">
                              <div class="col-12" style="color: #d75ea1;">                      
                                <i class="far fa-angry"></i> Reported offline {{ offlineEvent.number }} time/s at block <a class="block" v-bind:href="blockExplorer.block + offlineEvent.block" target="_blank">#{{ thousandsSeparator(offlineEvent.block) }}</a>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <p>&nbsp;</p>
          </div>
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
import Identicon from "../components/identicon.vue";
import editable from "../components/editable.vue";
import { formatBalance, isHex } from '@polkadot/util';
formatBalance.setDefaults({ decimals: 15, unit: 'DOT' });
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
      system: {
        chain: "",
        nodeName: "",
        nodeVersion: ""
      },
      blockExplorer: {
        block: 'https://polkascan.io/pre/alexander/block/',
        account: 'https://polkascan.io/pre/alexander/account/'
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
    this.getSession();
    this.getBestBlockNumber();
    
    // Force update of validators list if empty
    if (this.$store.state.validators.list.length == 0) {
      vm.$store.dispatch('validators/update');
    }

    /* Update validators list, best block and session info every 10 seconds */
    this.polling = setInterval(() => {
      vm.$store.dispatch('validators/update');
      this.getSession();
      this.getBestBlockNumber();
    }, 10000);

  },
  beforeDestroy: function () {
    clearInterval(this.polling);
    clearInterval(this.sessionPolling);
  },
  methods: {
    getSystemData: function () {
      var vm = this;
      axios.get('https://polkastats.io:8443/system')
        .then(function (response) {
          vm.system = response.data;
        })
    },
    getSession: function () {
      var vm = this;
      axios.get('https://polkastats.io:8443/session')
        .then(function (response) {
          vm.session = response.data;
        });
    },
    getBestBlockNumber: function () {
      var vm = this;
      axios.get('https://polkastats.io:8443/bestblocknumber')
        .then(function (response) {
          vm.bestblocknumber = response.data;
        });
    }, 
    isHex(n) {
      var a = parseInt(n,16);
      return (a.toString(16) === n)
    },
    // Use here this.isHex function
    formatNumber(n) {
      if (this.isHex(n)) {
        //console.log(n + ' is HEX');
        return (parseInt(n, 16).toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      } else {
        //console.log(n + ' is NOT HEX');
        return (n.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }
    },
    // Use here isHex function bundled in @polkadot/util
    formatDot(amount) {
      if (isHex(amount)) {
        return formatBalance(parseInt(amount, 16));
      } else {
        return formatBalance(amount);
      }
    },  
    shortAddess(address) {
      return (address).substring(0,10) + ' .... ' + (address).substring(address.length - 10);
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
.validator .col-md-9 .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
.validator .col-md-9 .identicon div {
  display: inline;
}
</style>
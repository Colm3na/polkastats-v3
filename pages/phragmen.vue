<template>
  <div>
    <section>
      <b-container class="page-phragmen main pt-4">

        <h1 class="text-center mb-4">Predicted candidates by phragmen election algorithm</h1>
        <p class="text-center">We get validador slots and minimum validator count from the local kusama node using @polkadot/api and then run offline-phragmen with that params every 10 seconds. Output is stored in a MySQL database and served by PolkaStats backend (<a href="https://polkastats.io:8443/phragmen" target="_blank">see raw json</a>).</p>
        <p class="text-center">We use a modified version of offline-phragmen by <a href="https://github.com/kianenigma" target="_blank">kianenigma</a> (<a href="https://github.com/kianenigma/offline-phragmen" target="_blank">https://github.com/kianenigma/offline-phragmen</a>)</p>
        <p class="text-center">The modification was just change the output to json, taking most of the code from <a href="https://github.com/soc1c/offline-phragmen" target="_blank">https://github.com/soc1c/offline-phragmen</a> by <a href="https://github.com/soc1c" target="_blank">soc1c</a>.</p>
        <p class="text-center">Modified offline-phragmen source: <a href="https://github.com/mariopino/offline-phragmen" target="_blank">https://github.com/mariopino/offline-phragmen</a></p>
        
        <!-- START PHRAGMEN CANDIDATES -->
        <template  v-for="(candidate, index) in candidates">
          <div class="candidate card mt-4 mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-2 text-center">
                  <div v-if="hasIdentity(candidate.pub_key_stash)">
                    <div v-if="getIdentity(candidate.pub_key_stash).logo !== ''">
                      <img v-bind:src="getIdentity(candidate.pub_key_stash).logo" class="identity mt-2" />
                      <h4 class="mt-2 mb-2" v-if="getIdentity(candidate.pub_key_stash).full_name !== ''">{{ getIdentity(candidate.pub_key_stash).full_name }}</h4>
                    </div>
                    <div v-else>
                      <Identicon :value="candidate.pub_key_stash" :size="80" :theme="'polkadot'" :key="candidate.pub_key_stashd" />
                    </div>
                  </div>
                  <div v-else>
                    <Identicon :value="candidate.pub_key_stash" :size="80" :theme="'polkadot'" :key="candidate.pub_key_stash" />
                  </div>
                  <p class="mt-3 mb-0 rank">
                    rank #{{ candidate.rank }}
                  </p>
                  <p class="bonded mb-0" v-b-tooltip.hover title="Total stake">{{ formatAmount(candidate.stake_total) }}</p>

                  <p class="mb-0">
                    <small>
                      <span v-b-tooltip.hover title="Self bonded">{{ formatAmount(candidate.stake_validator) }}</span>
                      <span v-b-tooltip.hover title="Bonded by nominators">(+{{ formatAmount(candidate.other_stake_sum) }})</span>
                    </small>
                  </p>

                  
                </div>
                <div class="col-md-9">
                  <h4 class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                    {{ candidate.pub_key_stash }}
                  </h4>
                  <div class="row" v-if="candidate.pub_key_stash">
                    <div class="col-md-3 mb-1">
                      <strong>Stash</strong>
                    </div>
                    <div class="col-md-9 mb-1">
                      <Identicon :value="candidate.pub_key_stash" :size="20" :theme="'polkadot'" :key="candidate.pub_key_stash" />
                      <a v-bind:href="blockExplorer.account + candidate.pub_key_stash" target="_blank">
                        <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="candidate.pub_key_stash">{{ shortAddress(candidate.pub_key_stash) }}</span>
                        <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ candidate.pub_key_stash }}</span>
                      </a>
                    </div>
                  </div>
                  <div class="row" v-if="candidate.pub_key_controller">
                    <div class="col-md-3 mb-1">
                      <strong>Controller</strong>
                    </div>
                    <div class="col-md-9 mb-1">
                      <Identicon :value="candidate.pub_key_controller" :size="20" :theme="'polkadot'" :key="candidate.pub_key_controller" />
                      <a v-bind:href="blockExplorer.account + candidate.pub_key_controller" target="_blank">
                        <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="candidate.pub_key_controller">{{ shortAddress(candidate.pub_key_controller) }}</span>
                        <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ candidate.pub_key_controller }}</span>
                      </a>
                    </div>
                  </div>
                  <div class="voters mt-4">
                    <template v-if="candidate.voters">
                      <template v-if="candidate.voters.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#candidate-voters-' + index" role="button" aria-expanded="false" v-bind:aria-controls="'candidate-voters-' + index">
                          <h6 class="h6 candidates d-inline mr-4"><i class="fas"></i> Voters ({{ candidate.voters.length }})</h6>
                        </a>
                      </template>
                    </template>
                    <template v-if="candidate.voters">
                      <template v-if="candidate.voters.length > 0">
                        <div class="voters collapse pt-2 pb-3"  v-bind:id="'candidate-voters-' + index" v-bind:data-parent="'#candidate-voters-' + index">
                          <div v-for="(voter, index) in candidate.voters" class="row" v-bind:key="voter.pub_key_nominator">
                            <div class="col-8 mb-1 who">
                              <Identicon :value="voter.pub_key_nominator" :size="20" :theme="'polkadot'" :key="voter.pub_key_nominator" />                      
                              <a v-bind:href="blockExplorer.account + voter.pub_key_nominator" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="voter.pub_key_nominator">{{ shortAddress(voter.pub_key_nominator) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ voter.pub_key_nominator }}</span>                        
                              </a>
                            </div>
                            <div class="col-4 text-right value">
                              {{ formatAmount(voter.stake_nominator) }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- END PHRAGMEN CANDIDATES -->
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
      title: 'PolkaStats - Polkadot Kusama phragmen candidates',
      meta: [
        { hid: 'description', name: 'description', content: 'Polkadot Kusama phragmen candidates' }
      ]
    }
  },
  mixins: [commonMixin],
  data: function() {
    return {
      blockExplorer,
      polling: null
    }
  },
  computed: {
    network () {
      return this.$store.state.network.info;
    },
    candidates () {
      return this.$store.state.phragmen.candidates
    },
    identities() {
      return this.$store.state.identities.list
    },
    nicknames() {
      return this.$store.state.nicknames.list
    }
  },
  created: function () {
    var vm = this;

    // Force update of network info
    vm.$store.dispatch('network/update');
    
    // Force update of phragmen candidates list if empty
    if (this.$store.state.phragmen.candidates.length == 0) {
      vm.$store.dispatch('phragmen/update');
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length == 0) {
      vm.$store.dispatch('identities/update');
    }

    // Force update of nicknames list if empty
    if (this.$store.state.nicknames.list.length == 0) {
      vm.$store.dispatch('nicknames/update');
    }

    // Update data every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch('network/update');
      vm.$store.dispatch('phragmen/update');
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
      for (var i=0; i < this.favorites.length; i++) {
        if (this.favorites[i].accountId == validator) {
          return i;
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
    Identicon,
    Network
  }
}
</script>
<style>
body {
  font-size: 0.9rem;
}
.page-phragmen .favorite {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  z-index: 10;
  font-size: 1.1rem;
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
.candidates {
  color: #670d35;
}
.candidate {
  font-size: 0.9rem;
}
.candidate .value {
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
.candidate .col-md-9 .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
.candidate .col-md-9 .identicon div {
  display: inline;
}
.identity {
  max-width: 80px;
}
</style>
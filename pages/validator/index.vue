<template>
  <div>
    <section>
      <b-container class="validator-page main pt-3 pb-5">
        <template v-for="(validator, index) in validators">
          <template v-if="validator.accountId === accountId">
            <div class="row">
              <div class="col-2 col-lg-1">
                <template v-if="index > 0">
                  <nuxt-link :to="{name: 'validator', query: { accountId: validators[index-1].accountId } }" :title="'Previous validator: ' + validators[index-1].accountId">
                    <i class="fas fa-2x fa-chevron-left"></i>
                  </nuxt-link>
                </template>
              </div>
              <div class="col-8 col-lg-10 text-center">
                <h4 class="mb-1">Validator {{ accountId }}</h4>
              </div>
              <div class="col-2 col-lg-1 text-right">
                <template v-if="index < validators.length - 1">
                  <nuxt-link :to="{name: 'validator', query: { accountId: validators[index+1].accountId } }" :title="'Next validator: ' + validators[index+1].accountId">
                    <i class="fas fa-2x fa-chevron-right"></i>
                  </nuxt-link>  
                </template>
              </div>
            </div>
            <div class="validator-detail card mt-4 mb-3">
              <div class="card-body">
                <i v-if="validator.imOnline.isOnline" class="imOnline fas fa-check-circle" v-b-tooltip.hover v-bind:title="getImOnlineMessage(validator)"></i>
                <i v-else class="imOffline fas fa-times-circle" v-b-tooltip.hover v-bind:title="getImOnlineMessage(validator)"></i>
                <i v-if="validator.currentElected" class="elected fas fa-chevron-circle-right" v-b-tooltip.hover title="Elected for next session"></i>
                <i v-else class="notElected fas fa-times-circle" v-b-tooltip.hover title="Not elected for next session"></i>
                <i v-if="isFavorite(validator.accountId)" class="favorite fas fa-star" style="color: #f1bd23" v-b-tooltip.hover title="In Favorites"></i>
                <i v-else class="favorite fas fa-star" style="color: #e6dfdf;" v-b-tooltip.hover title="Not in Favorites"></i>
                <div class="row">
                  <div class="col-md-3 mb-2 text-center">
                    <div v-if="hasIdentity(validator.stashId)">
                      <div v-if="getIdentity(validator.stashId).logo">
                        <img v-bind:src="getIdentity(validator.stashId).logo" class="img-fluid" style="max-width: 150px;" />
                        <h3 class="mt-2 mb-2" v-if="getIdentity(validator.stashId).full_name">{{ getIdentity(validator.stashId).full_name }}</h3>
                      </div>
                      <div v-else>
                        <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" :key="validator.accountId" />
                      </div>
                    </div>
                    <div v-else>
                      <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" :key="validator.accountId" />
                    </div>
                    <p class="mt-3 mb-0 rank">
                      rank #{{ index+1 }}
                    </p>
                    <p v-if="validator.stakers.total > 0" class="bonded mb-0" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakers.total) }}</p>
                    <p v-else class="bonded mb-0" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakingLedger.total) }}</p>
                    <p class="mb-0" v-if="validator.stakers.own !== validator.stakers.total">
                      <small>
                        <span v-b-tooltip.hover title="Self bonded" v-if="validator.stakers.own > 0">{{ formatDot(validator.stakers.own) }}</span>
                        <span v-b-tooltip.hover title="Bonded by nominators" v-if="(validator.stakers.total - validator.stakers.own) > 0">(+{{ formatDot(validator.stakers.total - validator.stakers.own) }})</span>
                      </small>
                    </p>
                    <p class="mb-0" v-b-tooltip.hover title="Percentage over total bonded stake">{{ getStakePercent(validator.stakers.total) }}% of total stake</p>
                    <p class="mb-0">{{ validator.currentEraPointsEarned }} era points</p>
                  </div>
                  <div class="col-md-9">
                    <div class="row" v-if="hasNickname(validator.accountId)">
                      <div class="col-md-12">
                        <h4 class="card-title mb-4 account mt-4 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                          {{ getNickname(validator.accountId) }}
                        </h4>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Stash</strong>
                      </div>
                      <div class="col-md-9 mb-2">
                        <Identicon :value="validator.stashId" :size="20" :theme="'polkadot'" :key="validator.stashId" />
                        <a v-bind:href="blockExplorer.account + validator.stashId" target="_blank">
                          <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.stashId">{{ shortAddress(validator.stashId) }}</span>
                          <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.stashId }}</span>
                        </a>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Controller</strong>
                      </div>
                      <div class="col-md-9 mb-2">
                        <Identicon :value="validator.controllerId" :size="20" :theme="'polkadot'" :key="validator.controllerId" />
                        <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                          <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddress(validator.controllerId) }} </span>
                          <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.controllerId }}</span>
                        </a>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Comission</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        {{ formatDot(validator.validatorPrefs.validatorPayment, 6) }}
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-3 mb-2">
                        <strong>Reward destination</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        {{ formatRewardDest(validator.rewardDestination) }}
                      </div>
                    </div>
                    <!-- Identity -->
                    <div v-if="hasIdentity(validator.stashId)" class="mb-2">
                      <div class="row" v-if="getIdentity(validator.stashId).full_name !== `` && getIdentity(validator.stashId).full_name !== `null`">
                        <div class="col-md-3 mb-2">
                          <strong>Name</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          {{ getIdentity(validator.stashId).full_name }}
                        </div>
                      </div>
                      <div class="row" v-if="getIdentity(validator.stashId).bio !== `` && getIdentity(validator.stashId).bio !== `null`">
                        <div class="col-md-3 mb-2">
                          <strong>Bio</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          {{ getIdentity(validator.stashId).bio }}
                        </div>
                      </div>
                      <div class="row" v-if="getIdentity(validator.stashId).location !== `` && getIdentity(validator.stashId).location !== `null`">
                        <div class="col-md-3 mb-2">
                          <strong>Location</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          {{ getIdentity(validator.stashId).location }}
                        </div>
                      </div>
                      <div class="row" v-if="getIdentity(validator.stashId).website !== `` && getIdentity(validator.stashId).website !== `null`">
                        <div class="col-md-3 mb-2">
                          <strong>Website</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          <a v-bind:href="getIdentity(validator.stashId).website" target="_blank">
                            {{ getIdentity(validator.stashId).website }}
                          </a>
                        </div>
                      </div>
                      <div class="row" v-if="getIdentity(validator.stashId).twitter !== `` && getIdentity(validator.stashId).twitter  !== `null`">
                        <div class="col-md-3 mb-2">
                          <strong>Twitter</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          <a v-bind:href="getIdentity(validator.stashId).twitter" target="_blank">
                            {{ getIdentity(validator.stashId).twitter }}
                          </a>
                        </div>
                      </div>
                      <div class="row" v-if="getIdentity(validator.stashId).github !== `` && getIdentity(validator.stashId).github  !== `null`">
                        <div class="col-md-3 mb-2">
                          <strong>Github</strong>
                        </div>
                        <div class="col-md-9 mb-2 fee">
                          <a v-bind:href="getIdentity(validator.stashId).github" target="_blank">
                            {{ getIdentity(validator.stashId).github }}
                          </a>
                        </div>
                      </div>
                    </div>
                    <!-- Identity End -->
                    <div v-bind:id="'validator-info-' + index">
                      <template v-if="validator.stakers.others.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#staker' + index" role="button" aria-expanded="false" v-bind:aria-controls="'staker' + index">
                          <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Stakers ({{ validator.stakers.others.length }})</h6>
                        </a>
                      </template>
                      <template v-if="validator.sessionIds.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#current-session-id-' + index" role="button" aria-expanded="false" v-bind:aria-controls="'current-session-id-' + index">
                          <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Current session ids ({{ validator.sessionIds.length }})</h6>
                        </a>
                      </template>
                      <template v-if="validator.nextSessionIds.length > 0">
                        <a class="" data-toggle="collapse" v-bind:href="'#session-id-' + index" role="button" aria-expanded="false" v-bind:aria-controls="'session-id-' + index">
                          <h6 class="h6 nominators d-inline mr-4"><i class="fas"></i> Next session ids ({{ validator.nextSessionIds.length }})</h6>
                        </a>
                      </template>
                      <template v-if="validator.sessionIds.length > 0">
                        <div class="nominator collapse pt-2 pb-3"  v-bind:id="'current-session-id-' + index" v-bind:data-parent="'#validator-info-' + index">
                          <div v-for="(sessionId, index) in validator.sessionIds" class="row" v-bind:key="index">
                            <div class="col-12 mb-1 who">
                              {{ index+1 }}.
                              <Identicon :value="sessionId" :size="20" :theme="'polkadot'" :key="sessionId" />                      
                              <a v-bind:href="blockExplorer.account + sessionId" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="sessionId">{{ shortAddress(sessionId) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ sessionId }}</span>                        
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="validator.nextSessionIds.length > 0">
                        <div class="nominator collapse pt-2 pb-3"  v-bind:id="'session-id-' + index" v-bind:data-parent="'#validator-info-' + index">
                          <div v-for="(sessionId, index) in validator.nextSessionIds" class="row" v-bind:key="index">
                            <div class="col-12 mb-1 who">
                              {{ index+1 }}.
                              <Identicon :value="sessionId" :size="20" :theme="'polkadot'" :key="sessionId" />                      
                              <a v-bind:href="blockExplorer.account + sessionId" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="sessionId">{{ shortAddress(sessionId) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ sessionId }}</span>                        
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="validator.stakers.others.length > 0">
                        <div class="nominator collapse pt-2 pb-3"  v-bind:id="'staker' + index" v-bind:data-parent="'#validator-info-' + index">
                          <div v-for="(staker, index) in validator.stakers.others" class="row" v-bind:key="index">
                            <div class="col-8 mb-1 who">
                              <Identicon :value="staker.who" :size="20" :theme="'polkadot'" :key="staker.who" />                      
                              <a v-bind:href="blockExplorer.account + staker.who" target="_blank">
                                <span class="d-inline-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="staker.who">{{ shortAddress(staker.who) }}</span>
                                <span class="d-none d-sm-inline-block d-md-inline-block d-lg-inline-block d-xl-inline-block">{{ staker.who }}</span>                        
                              </a>
                            </div>
                            <div class="col-4 text-right value">
                              {{ formatDot(staker.value) }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <div class="mt-5 text-center" id="stake-evolution-monthly-chart">
          <h3>Total bonded - Monthly chart <small class="change text-success ml-3" v-if="monthly.last - monthly.first > 0"><i class="far fa-thumbs-up"></i> +{{ formatDot(monthly.last - monthly.first) }}</small><small class="change text-danger ml-3" v-if="monthly.last - monthly.first < 0"><i class="far fa-thumbs-down"></i> {{ formatDot(monthly.last - monthly.first) }}</small></h3>
          <apexchart type=line height=350 :options="StakeEvolutionMonthlyChartOptions" :series="StakeEvolutionMonthlySeries" />
        </div>
        <div class="mt-5 mb-5 text-center" id="stake-evolution-weekly-chart">
          <h3>Total bonded - Weekly chart <small class="change text-success ml-3" v-if="weekly.last - weekly.first > 0"><i class="far fa-thumbs-up"></i> +{{ formatDot(weekly.last - weekly.first) }}</small><small class="change text-danger ml-3" v-if="weekly.last - weekly.first < 0"><i class="far fa-thumbs-down"></i> {{ formatDot(weekly.last - weekly.first) }}</small></h3>
          <apexchart type=line height=350 :options="StakeEvolutionWeeklyChartOptions" :series="StakeEvolutionWeeklySeries" />
        </div>
        <div class="mb-5 text-center" id="stake-evolution-daily-chart">
          <h3>Total bonded - Daily chart <small class="change text-success ml-3" v-if="daily.last - daily.first > 0"><i class="far fa-thumbs-up"></i> +{{ formatDot(daily.last - daily.first) }}</small><small class="change text-danger ml-3" v-if="daily.last - daily.first < 0"><i class="far fa-thumbs-down"></i> {{ formatDot(daily.last - daily.first) }}</small></h3>
          <apexchart type=line height=350 :options="StakeEvolutionDailyChartOptions" :series="StakeEvolutionDailySeries" />
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import axios from 'axios';
import moment from 'moment';
import VueApexCharts from 'vue-apexcharts';
import Identicon from '../../components/identicon.vue';
import { formatBalance, isHex } from '@polkadot/util';
import BN from 'bn.js';
import { decimals, unit, backendBaseURL, blockExplorer} from '../../polkastats.config.js';

formatBalance.setDefaults({ decimals, unit });

export default {
  head () {
    return {
      title: 'PolkaStats - Kusama validator ' + this.$route.query.accountId,
      meta: [
        { hid: 'description', name: 'description', content: 'Kusama validator ' + this.$route.query.accountId }
      ]
    }
  },
  data: function() {
    return {
      accountId: this.$route.query.accountId,
      blockExplorer,
      backendBaseURL,
      polling: null,
      graphPolling: null,
      favorites: [],
      daily:{
        last: 0,
        first: 0
      },
      weekly:{
        last: 0,
        first: 0
      },
      monthly:{
        last: 0,
        first: 0
      },
      StakeEvolutionDailySeries: [{
          name: "Total bonded (KSM)",
          data: []
      }],
       StakeEvolutionWeeklySeries: [{
          name: "Total bonded (KSM)",
          data: []
      }],
       StakeEvolutionMonthlySeries: [{
          name: "Total bonded (KSM)",
          data: []
      }],
      StakeEvolutionDailyChartOptions: {
        chart: {
          height: 500,
          stacked: false,
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        markers: {
          size: 6
        },
        colors: ['#d75ea1'],
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
          type: 'datetime',
          title: {
            text: 'Date / time (UTC)'
          },          
          labels: {
            formatter: function (val) {
              return moment.unix(val).format('MM/DD/YYYY HH:mm');
            }
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          title: {
            text: 'Total bonded (KSM)'
          },
          labels: {
            formatter: function (val) {
              return val;
            }
          }       
        }
      },
      StakeEvolutionWeeklyChartOptions: {
        chart: {
          height: 500,
          stacked: false,
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        markers: {
          size: 6
        },
        colors: ['#d75ea1'],
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
          type: 'datetime',
          title: {
            text: 'Date / time (UTC)'
          },          
          labels: {
            formatter: function (val) {
              return moment.unix(val).format('MM/DD/YYYY HH:mm');
            }
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          title: {
            text: 'Total bonded (KSM)'
          },
          labels: {
            formatter: function (val) {
              return val;
            }
          }       
        }
      },
      StakeEvolutionMonthlyChartOptions: {
        chart: {
          height: 500,
          stacked: false,
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        markers: {
          size: 6
        },
        colors: ['#d75ea1'],
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
          type: 'datetime',
          title: {
            text: 'Date / time (UTC)'
          },          
          labels: {
            formatter: function (val) {
              return moment.unix(val).format('MM/DD/YYYY HH:mm');
            }
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          title: {
            text: 'Total bonded (KSM)'
          },
          labels: {
            formatter: function (val) {
              return val;
            }
          }       
        }
      },
      totalIssuance: ""
    }
  },
  computed: {
    validators() {
      return this.$store.state.validators.list
    },
    identities() {
      return this.$store.state.identities.list
    },
    nicknames() {
      return this.$store.state.nicknames.list
    },
    totalStakeBonded () {
      return this.$store.state.validators.totalStakeBonded
    },
    totalStakeBondedPercen() {
      if (this.totalStakeBonded !== 0 && this.totalIssuance !== "") {
        let totalIssuance = new BN(this.totalIssuance, 10);
        let totalStakeBonded = this.totalStakeBonded.mul(new BN('100000', 10));
        return totalStakeBonded.div(totalIssuance);
      } else {
        return 0;
      }
    }
  },
  created: function () {
    var vm = this;

    // Get favorites from cookie
    if (this.$cookies.get('favorites')) {
      this.favorites = this.$cookies.get('favorites');
    }

    // Load graph data first time
    this.getValidatorDailyGraphData();
    this.getValidatorWeeklyGraphData();
    this.getValidatorMonthlyGraphData();

    // Force update of validators list if empty
    if (this.$store.state.validators.list.length == 0) {
      vm.$store.dispatch('validators/update');
    }

    // Force update of indentity list if empty
    if (this.$store.state.identities.list.length == 0) {
      vm.$store.dispatch('identities/update');
    }

    // Update validators every 30 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch('validators/update');
    }, 30000);
    
    // Refresh graph data every minute
    this.graphPolling = setInterval(() => {
      this.getValidatorDailyGraphData();
      this.getValidatorWeeklyGraphData();
      this.getValidatorMonthlyGraphData();
    }, 60000);
    
  },
  beforeDestroy: function () {
    clearInterval(this.polling);
    clearInterval(this.graphPolling);
  },
  methods: {
    getValidatorDailyGraphData: function () {
      var vm = this;
      axios.get(`${this.backendBaseURL}/validator/graph/daily/${this.accountId}`)
        .then(function (response) {

          // Update chart data
          var newCategories = [];
          var newData = [];
      
          //console.log(response.data);

          for (var i = 0; i < response.data.length; i++) {
            // Insert firt point, last point and points with different values
            if (i == 0 || (i == response.data.length -1 ) || (i > 0 && response.data[i].amount != response.data[i-1].amount)) {

              // Save first and last point
              if (i == 0) vm.daily.last = response.data[i].amount;
              if (i == response.data.length -1) vm.daily.first = response.data[i].amount;

              newCategories.push(moment.unix(response.data[i].timestamp, 'YYYY-MM-DD HH:mm:ss.SSSSSS Z').format('YYYY-MM-DD HH:mm:ss'));
              newData.push(response.data[i].amount);
            }
          }
          
          newCategories.reverse();
          newData.reverse();
          
          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          vm.StakeEvolutionDailyChartOptions = {
            ...vm.StakeEvolutionDailyChartOptions,
            ...{
              xaxis: {
                categories: newCategories,
                type: 'datetime',
                title: {
                  text: 'Date time (UTC)'
                },        
                labels: {
                  formatter: function (val) {
                    return moment.unix(val/1000).format('MM/DD/YYYY HH:mm');
                  }
                }
              },
              yaxis: {
                /*
                min: 0,
                max: 0,
                */
                title: {
                  text: 'Total bonded (KSM)'
                },
                labels: {
                  formatter: function (val) {
                    return (val / 1000000000000).toFixed(6);
                  }
                }         
              }
            }
          };
          
          // In the same way, update the series option
          vm.StakeEvolutionDailySeries = [{
            data: newData
          }];
          
        })
    },
    getValidatorWeeklyGraphData: function () {
      var vm = this;
      axios.get(`${this.backendBaseURL}/validator/graph/weekly/${this.accountId}`)
        .then(function (response) {

          // Update chart data
          var newCategories = [];
          var newData = [];
      
          //console.log(response.data);

          for (var i = 0; i < response.data.length; i++) {
            // Save first and last point
            if (i == 0) vm.weekly.last = response.data[i].amount;
            if (i == response.data.length -1) vm.weekly.first = response.data[i].amount;

            newCategories.push(moment.unix(response.data[i].timestamp, 'YYYY-MM-DD HH:mm:ss.SSSSSS Z').format('YYYY-MM-DD HH:mm:ss'));
            newData.push(response.data[i].amount);
          }
          
          newCategories.reverse();
          newData.reverse();
          
          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          vm.StakeEvolutionWeeklyChartOptions = {
            ...vm.StakeEvolutionWeeklyChartOptions,
            ...{
              xaxis: {
                categories: newCategories,
                type: 'datetime',
                title: {
                  text: 'Date time (UTC)'
                },        
                labels: {
                  formatter: function (val) {
                    return moment.unix(val/1000).format('MM/DD/YYYY HH:mm');
                  }
                }
              },
              yaxis: {
                /*
                min: 0,
                max: 0,
                */
                title: {
                  text: 'Total bonded (KSM)'
                },
                labels: {
                  formatter: function (val) {
                    return (val / 1000000000000).toFixed(6);
                  }
                }         
              }
            }
          };
          
          // In the same way, update the series option
          vm.StakeEvolutionWeeklySeries = [{
            data: newData
          }];
          
        })
    },
    getValidatorMonthlyGraphData: function () {
      var vm = this;
      axios.get(`${this.backendBaseURL}/validator/graph/monthly/${this.accountId}`)
        .then(function (response) {

          // Update chart data
          var newCategories = [];
          var newData = [];
      
          //console.log(response.data);

          for (var i = 0; i < response.data.length; i++) {
            // Save first and last point
            if (i == 0) vm.monthly.last = response.data[i].amount;
            if (i == response.data.length -1) vm.monthly.first = response.data[i].amount;

            newCategories.push(moment.unix(response.data[i].timestamp, 'YYYY-MM-DD HH:mm:ss.SSSSSS Z').format('YYYY-MM-DD HH:mm:ss'));
            newData.push(response.data[i].amount);
          }
          
          newCategories.reverse();
          newData.reverse();
          
          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          vm.StakeEvolutionMonthlyChartOptions = {
            ...vm.StakeEvolutionMonthlyChartOptions,
            ...{
              xaxis: {
                categories: newCategories,
                type: 'datetime',
                title: {
                  text: 'Date time (UTC)'
                },        
                labels: {
                  formatter: function (val) {
                    return moment.unix(val/1000).format('MM/DD/YYYY HH:mm');
                  }
                }
              },
              yaxis: {
                /*
                min: 0,
                max: 0,
                */
                title: {
                  text: 'Total bonded (KSM)'
                },
                labels: {
                  formatter: function (val) {
                    return (val / 1000000000000).toFixed(6);
                  }
                }         
              }
            }
          };
          
          // In the same way, update the series option
          vm.StakeEvolutionMonthlySeries = [{
            data: newData
          }];
          
        })
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
      return (address).substring(0,5) + ' .... ' + (address).substring(address.length - 5)
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
    formatNumber(n) {
      if (isHex(n)) {
        return (parseInt(n, 16).toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      } else {
        return (n.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }
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
    }
  },
  watch: {
    $route () {
      //console.log('Route change!');
      this.accountId = this.$route.query.accountId;

      // Update graph data
      this.getValidatorDailyGraphData();
      this.getValidatorWeeklyGraphData();
      this.getValidatorMonthlyGraphData();
      
      // Restart graph data polling
      clearInterval(this.graphPolling);
      this.graphPolling = setInterval(() => {
        this.getValidatorDailyGraphData();
        this.getValidatorWeeklyGraphData();
        this.getValidatorMonthlyGraphData();
      }, 60000);
    }
  },
  components: {
    apexchart: VueApexCharts,
    Identicon
  }
}
</script>
<style>
.fas.fa-copy {
  cursor: pointer;
  color: #d75ea1;
  font-size: 0.9rem;
  margin-left: 0.1rem;
}
.rank {
  font-size: 1.4rem;
  color: #7d7378;
}
.validator-detail .favorite {
  cursor: initial;
}
.change {
  vertical-align: middle;
}
.validator-detail .col-md-9 .identicon {
  display: inline;
  margin-right: 0.2rem;
  cursor: copy;
}
.validator-detail .col-md-9 .identicon div {
  display: inline;
}
.validator-page .imOnline {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  font-size: 1.1rem;
  color: green;
}
.validator-page .imOffline {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  font-size: 1.1rem;
  color: red;
}
.validator-page .elected {
  position: absolute;
  top: 0.4rem;
  left: 2rem;
  font-size: 1.1rem;
  color: #2697e2;
}
.validator-page .notElected {
  position: absolute;
  top: 0.4rem;
  left: 2rem;
  font-size: 1.1rem;
  color: red;
}
.validator-page .favorite {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
}
</style>
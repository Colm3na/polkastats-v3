<template>
  <div>
    <section>
      <b-container class="main pt-3 pb-5">
        <template v-for="(validator, index) in validators">
          <template v-if="validator.accountId == accountId">
            <div class="row">
              <div class="col-2 col-lg-1">
                <template v-if="index > 0">
                  <nuxt-link :to="{name: 'validator', query: { accountId: validators[index-1].accountId } }" :title="'Previous validator: ' + validators[index-1].accountId">
                    <i class="fas fa-2x fa-chevron-left"></i>
                  </nuxt-link>
                </template>
              </div>
              <div class="col-8 col-lg-10 text-center">
                <h4 class="mb-1">Validator <span v-if="favorites[getIndex(validator.accountId)] !== undefined"><span v-if="favorites[getIndex(validator.accountId)].name != 'Edit validator name...'">{{ favorites[getIndex(validator.accountId)].name }}</span><span v-else>{{ accountId }}</span></span><span v-else>{{ accountId }}</span></a></h4>
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
              <div class="card-body" v-bind:class="{ 'card-body': 'card-body', 'bg-offline': validator.isOffline }">
                <p class="text-right">
                  <i v-if="isFavorite(validator.accountId)" class="favorite fas fa-star" style="color: #f1bd23" title="In Favorites"></i>
                  <i v-else class="favorite fas fa-star" style="color: #e6dfdf;" title="Not in Favorites"></i>
                </a>
                <div class="row">
                  <div class="col-md-3 mb-2 text-center">
                    <Identicon :value="validator.accountId" :size="80" :theme="'polkadot'" />
                    <p class="mb-0 rank">rank #{{ index+1 }}</p>
                    <p class="bonded mb-0" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakers.total) }}</p>
                    <p class="mb-0"><small><span v-b-tooltip.hover title="Self bonded">{{ formatDot(validator.stakers.own) }}</span> (+<span v-b-tooltip.hover title="Bonded by nominators">{{ formatDot(validator.stakers.total - validator.stakers.own) }})</span></small></p>
                  </div>
                  <div class="col-md-9">
                    <div v-if="validator.controllerId != validator.nextSessionId">
                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <strong>Controller</strong>
                        </div>
                        <div class="col-md-9 mb-2">
                          <Identicon :value="validator.controllerId" :size="20" :theme="'polkadot'" />
                          <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                            <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddess(validator.controllerId) }} </span>
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
                        <strong>Unstake threshold</strong>
                      </div>
                      <div class="col-md-9 mb-2 unstake">
                        {{ validator.validatorPrefs.unstakeThreshold}}
                      </div>
                    </div>
                    <template v-if="validator.stakers.others.length > 0">
                      <a class="" data-toggle="collapse" v-bind:href="'#staker' + index" role="button" aria-expanded="false" v-bind:aria-controls="'staker' + index">
                        <h6 class="h6 nominators"><i class="fas"></i> Nominators ({{ validator.stakers.others.length }})</h6>
                      </a>
                    </template>
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
                    <div v-if="validator.offline.length > 0">
                      <a data-toggle="collapse" v-bind:href="'#offline' + index" role="button" aria-expanded="false" v-bind:aria-controls="'offline' + index">
                        <h6 class="h6 offline"><i class="fas"></i> Reported offline ({{ validator.offline.length }})</h6>
                      </a>
                      <div class="offlineEvent collapse pt-2 pb-3"  v-bind:id="'offline' + index">
                        <div v-for="offlineEvent in validator.offline" class="row">
                          <div class="col-12" style="color: #d75ea1;">                      
                            <i class="far fa-angry"></i> Reported offline {{ offlineEvent.number }} time/s at block <a class="block" v-bind:href="blockExplorer.block + offlineEvent.block" target="_blank">#{{ thousandsSeparator(offlineEvent.block) }}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <div class="mt-5 text-center" id="stake-evolution-daily-chart">
          <h3>Total bonded - Daily chart <small class="change text-success ml-3" v-if="daily.last - daily.first > 0"><i class="far fa-thumbs-up"></i> +{{ formatDot(daily.last - daily.first) }}</small><small class="change text-danger ml-3" v-if="daily.last - daily.first < 0"><i class="far fa-thumbs-down"></i> {{ formatDot(daily.last - daily.first) }}</small></h3>
          <apexchart type=line height=350 :options="StakeEvolutionDailyChartOptions" :series="StakeEvolutionDailySeries" />
        </div>
        <div class="mt-5 mb-5 text-center" id="stake-evolution-weekly-chart">
          <h3>Total bonded - Weekly chart <small class="change text-success ml-3" v-if="weekly.last - weekly.first > 0"><i class="far fa-thumbs-up"></i> +{{ formatDot(weekly.last - weekly.first) }}</small><small class="change text-danger ml-3" v-if="weekly.last - weekly.first < 0"><i class="far fa-thumbs-down"></i> {{ formatDot(weekly.last - weekly.first) }}</small></h3>
          <apexchart type=line height=350 :options="StakeEvolutionWeeklyChartOptions" :series="StakeEvolutionWeeklySeries" />
        </div>
        <div class="mb-5 text-center" id="stake-evolution-monthly-chart">
          <h3>Total bonded - Monthly chart <small class="change text-success ml-3" v-if="monthly.last - monthly.first > 0"><i class="far fa-thumbs-up"></i> +{{ formatDot(monthly.last - monthly.first) }}</small><small class="change text-danger ml-3" v-if="monthly.last - monthly.first < 0"><i class="far fa-thumbs-down"></i> {{ formatDot(monthly.last - monthly.first) }}</small></h3>
          <apexchart type=line height=350 :options="StakeEvolutionMonthlyChartOptions" :series="StakeEvolutionMonthlySeries" />
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
import Identicon from "../../components/identicon.vue";
import { formatBalance, isHex } from '@polkadot/util';
formatBalance.setDefaults({ decimals: 15, unit: 'DOT' });
export default {
  head () {
    return {
      title: 'PolkaStats - Validator ' + this.$route.query.accountId,
      meta: [
        { hid: 'description', name: 'description', content: 'Validator ' + this.$route.query.accountId }
      ]
    }
  },
  data: function() {
    return {
      accountId: this.$route.query.accountId,
      blockExplorer: {
        block: 'https://polkascan.io/pre/alexander/block/',
        account: 'https://polkascan.io/pre/alexander/account/'
      },
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
          name: "Total bonded (DOT)",
          data: []
      }],
       StakeEvolutionWeeklySeries: [{
          name: "Total bonded (DOT)",
          data: []
      }],
       StakeEvolutionMonthlySeries: [{
          name: "Total bonded (DOT)",
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
            text: 'Total bonded (DOT)'
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
            text: 'Total bonded (DOT)'
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
            text: 'Total bonded (DOT)'
          },
          labels: {
            formatter: function (val) {
              return val;
            }
          }       
        }
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

    // Load graph data first time
    this.getValidatorDailyGraphData();
    this.getValidatorWeeklyGraphData();
    this.getValidatorMonthlyGraphData();

    // Force update of validators list if empty
    if (this.$store.state.validators.list.length == 0) {
      vm.$store.dispatch('validators/update');
    }

    // Update validators list every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch('validators/update')
    }, 10000);
    
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
      axios.get('https://polkastats.io:8443/validator/graph/daily/' + this.accountId)
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
                  text: 'Total bonded (DOT)'
                },
                labels: {
                  formatter: function (val) {
                    return (val / 1000000000000000).toFixed(6);
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
      axios.get('https://polkastats.io:8443/validator/graph/weekly/' + this.accountId)
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
                  text: 'Total bonded (DOT)'
                },
                labels: {
                  formatter: function (val) {
                    return (val / 1000000000000000).toFixed(6);
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
      axios.get('https://polkastats.io:8443/validator/graph/monthly/' + this.accountId)
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
                  text: 'Total bonded (DOT)'
                },
                labels: {
                  formatter: function (val) {
                    return (val / 1000000000000000).toFixed(6);
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
      if (isHex(amount)) {
        return formatBalance(parseInt(amount, 16));
      } else {
        return formatBalance(amount);
      }
    },
    shortAddess(address) {
      return (address).substring(0,10) + ' .... ' + (address).substring(address.length - 10)
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
.validator-detail .bg-offline {
  background-color: rgba(239, 57, 74, 0.12) !important;
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
</style>
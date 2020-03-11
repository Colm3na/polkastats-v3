<template>
  <div v-if="showNetworkStats" class="network row text-center mt-4">
    <div class="col-12 text-right">
      <button type="button" class="close" @click="showNetworkStats = false">
        ×
      </button>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card">
        <div class="card-body">
          <p>Last block</p>
          <h5>{{ formatNumber(network.bestblocknumber) }}</h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card">
        <div class="card-body">
          <p>Last finalized</p>
          <h5>{{ formatNumber(network.bestBlockFinalized) }}</h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card">
        <div class="card-body">
          <p>Current session</p>
          <h5>{{ formatNumber(network.session.currentIndex) }}</h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card">
        <div class="card-body">
          <p>Epoch</p>
          <h5>
            {{ formatNumber(network.session.sessionProgress) }}/{{
              formatNumber(network.session.sessionLength)
            }}
          </h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card">
        <div class="card-body">
          <p>Current era</p>
          <h5>{{ formatNumber(network.session.currentEra) }}</h5>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 col-xl-2 mb-4">
      <div class="card">
        <div class="card-body">
          <p>Era</p>
          <h5>
            {{ formatNumber(network.session.eraProgress) }}/{{
              formatNumber(network.session.eraLength)
            }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isHex } from "@polkadot/util"
export default {
  props: ["network"],
  data: function() {
    return {
      showNetworkStats: true
    }
  },
  methods: {
    formatNumber(n) {
      if (isHex(n)) {
        return parseInt(n, 16)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      } else {
        return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      }
    }
  }
}
</script>

<style>
.network .card h5 {
  color: #670d35;
}
.network .card .card-body {
  padding: 1rem;
}
</style>

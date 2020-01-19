<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5 support-us">
        <h1 class="mb-4">SUPPORT POLKASTATS</h1>

        <p>PolkaStats software is open source and the services hosted at https://polkastats.io are provided for free (as in free beer).</p>
        
        <p>I enjoy developing PolkaStats and providing the services without annoying ads and I plan to continue doing it in that way :-).</p>

        <p>If you like my work and want to support the hosting payments or the time I spend developing and maintaining the server, you can do it in several ways.</p>

        <h2 class="mt-5 mb-4">Feedback!</h2>

        <p>We love getting feedback from the community, if you find a bug, want to comment some behaviour or want a feature being added please place an Issue in our <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">GitHub repository</a>.</p>

        <h2 class="mt-5 mb-4">Stake in our validators</h2>

        <p>This is an easy way you can support me and the Polkadot folks at <a href="https://www.colmenalabs.org/" target="_blank">La Colmena Labs</a> blockchain colective.</p>

        <b-card class="mb-3">
          <div class="row">
            <div class="col-md-2 text-center">
              <img src="https://s3.amazonaws.com/keybase_processed_uploads/ceb4f17440dc978fa4faa64814290005_360_360.jpg" class="img-fluid" style="max-width: 80px;" v-b-tooltip.hover title="PolkaStats">
            </div>
            <div class="col-md-10">
              <h3 class="mt-1 mb-2">PolkaStats validator</h3>
              <Identicon value="GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY" size="20" theme="polkadot" />
              <a v-bind:href="blockExplorer.account + `GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY`" target="_blank">
                <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover title="GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY">GTzRQPzkcu .... vYfPpTMeEY</span>
                <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY</span>
              </a>
            </div>
          </div>
        </b-card>
        <b-card class="mb-3">
          <div class="row">
            <div class="col-md-2 text-center">
              <img src="https://s3.amazonaws.com/keybase_processed_uploads/c62c205359734ddf9af1b03777703505_360_360.jpg" class="img-fluid" style="max-width: 80px;" v-b-tooltip.hover title="DragonStake">
            </div>
            <div class="col-md-10">
              <h3 class="mt-1 mb-2">DragonStake validator</h3>
              <Identicon value="DSpbbk6HKKyS78c4KDLSxCetqbwnsemv2iocVXwNe2FAvWC" size="20" theme="polkadot" />
              <a v-bind:href="blockExplorer.account + `DSpbbk6HKKyS78c4KDLSxCetqbwnsemv2iocVXwNe2FAvWC`" target="_blank">
                <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover title="DSpbbk6HKKyS78c4KDLSxCetqbwnsemv2iocVXwNe2FAvWC">DSpbbk6HKK .... XwNe2FAvWC</span>
                <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">DSpbbk6HKKyS78c4KDLSxCetqbwnsemv2iocVXwNe2FAvWC</span>
              </a>
            </div>
          </div>
        </b-card>
        <b-card class="mb-3">
          <div class="row">
            <div class="col-md-2 text-center">
              <img src="https://s3.amazonaws.com/keybase_processed_uploads/9769abccf1bee6c032fb5be50d6c3c05_360_360.jpg" class="img-fluid" style="max-width: 80px;" v-b-tooltip.hover title="DelegaNetworks">
            </div>
            <div class="col-md-10">
              <h3 class="mt-1 mb-2">DelegaNetworks validator</h3>
              <Identicon value="CoqysGbay3t3Q7hXgEmGJJquhYYpo8PqLwvW1WsUwR7KvXm" size="20" theme="polkadot" />
              <a v-bind:href="blockExplorer.account + `CoqysGbay3t3Q7hXgEmGJJquhYYpo8PqLwvW1WsUwR7KvXm`" target="_blank">
                <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover title="CoqysGbay3t3Q7hXgEmGJJquhYYpo8PqLwvW1WsUwR7KvXm">CoqysGbay3 .... WsUwR7KvXm</span>
                <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">CoqysGbay3t3Q7hXgEmGJJquhYYpo8PqLwvW1WsUwR7KvXm</span>
              </a>
            </div>
          </div>
        </b-card>
        <h2 class="mt-5 mb-4">Follow @PolkaStats on Twitter</h2>
        <p>Are you a happy PolkaStats user? Make sure you follow <a target="_blank" href="https://twitter.com/polkastats"><i class="fab fa-twitter"></i> @PolkaStats</a> on Twitter to get the last platform updates.</p>
      </b-container>
    </section>
  </div>
</template>
<script>
import Identicon from "../components/identicon.vue";
import { blockExplorer } from '../polkastats.config.js';

export default {
  head () {
    return {
      title: 'PolkaStats - Support us',
      meta: [
        { hid: 'description', name: 'description', content: 'Support us' }
      ]
    }
  },
  data: function() {
    return {
      blockExplorer
    }
  },
  components: {
    Identicon
  }
}
</script>
<style>
.support-us .clipboard {
  display: inline-block;
}
.support-us .identicon {
  margin-right: .2rem;
  cursor: copy;
}
</style>
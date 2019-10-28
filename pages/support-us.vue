<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5">
        <h1 class="mb-4">SUPPORT POLKASTATS</h1>

        <p>PolkaStats software is open source and the service hosted at https://polkastats.io is provided for free (as in free beer :-), without annoying ads and I enjoy doing it in that way :-)).</p>

        <p>If you like my work and want to help me to pay the hosting or the time I spent developing and maintaining the server, you can do it in several ways.</p>

        <h2>Stake in our validators</h2>

        <p>This is an easy way you can support me and the polkadot folks at La Colmena, a Seville blockchain colective I belong.</p>

        <b-card title="PolkaStats validator">
          <div class="row">
            <div class="col-md-3">
              <img src="https://s3.amazonaws.com/keybase_processed_uploads/bd6bb92e0fa85197a2a0cf25d1a11f05_360_360.jpg" class="img-fluid" style="max-width: 150px;">
              <h3 class="mt-2 mb-2">PolkaStats</h3>
            </div>
            <div class="col-md-6">
                <Identicon value="GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY" size="20" theme="polkadot" />
                <a v-bind:href="blockExplorer.account + `GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY`" target="_blank">
                  <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover title="GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY">GTzRQPzkcu .... vYfPpTMeEY</span>
                  <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY</span>
                </a>
            </div>
          </div>
        </b-card>

        <h2>Tip me on Brave</h2>

        <p>Visit the site with Brave browser and send me a tip.</p>
        
      </b-container>
    </section>
  </div>
</template>
<script>
import Identicon from "../../components/identicon.vue";

export default {
  head () {
    return {
      title: 'PolkaStats - Support us',
      meta: [
        { hid: 'description', name: 'description', content: 'Support us' }
      ]
    }
  }
}
</script>
<style>
</style>
<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5 text-center">
        <h1 class="mb-4">VALIDATORS</h1>

        <p>Own a kusama validator and want to have your name, logo, website url and social links included in PolkaStats? Now you can do it!</p>

        <h2 class="mt-4 mb-4">Include your validator info in PolkaStats</h2>

        <b-alert variant="success" show>You will need both <a href="https://keybase.io/" target="_blank">Keybase/</a> and <a href="https://github.com" target="_blank">GitHub</a> accounts in order to continue.</b-alert>

        <div class="row mt-4">
          <div class="col-md-4">
            <h3>1</h3>
            <p>Go to PolkaStats v2 GitHub repo at <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a></p>
          </div>
          <div class="col-md-4">
            <h3>2</h3>
            <p>Login with your GitHub user and make a Fork of PolkaStats v2.</p>
          </div>
          <div class="col-md-4">
            <h3>3</h3>
            <p>In your fork, create a new file in identities folder named "stash_account_of_your_validator.json". Example: <a href="https://raw.githubusercontent.com/Colm3na/polkastats-v2/master/identities/GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY.json" target="_blank">GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY.json</a></p>
          </div>
          <div class="col-md-4">
            <h3>4</h3>
            <p>The content of the file should be your username in <a href="https://keybase.io" target="_blank">Keybase</a>. Open in your browser <a href="https://keybase.io/_/api/1.0/user/lookup.json?username=polkastats" target="_blank">https://keybase.io/_/api/1.0/user/lookup.json?username=polkastats</a> (replacing <i>polkastats</i> by your Keybase username) and make sure it shows the information you want to include.</p>
          </div>
          <div class="col-md-4">
            <h3>5</h3>
            <p>Make a Pull Request to the master branch of the original repo: <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a>.</p>
          </div>
          <div class="col-md-4">
            <h3>6</h3>
            <p>That's it! If all looks good I will merge your Pull Request and, in our next release, your validator information shoud appears in PolkaStats :-).</p>
          </div>
        </div>

        <h4 class="mt-4">Need help? Send me a message at <a target="_blank" href="mailto:polkastats@protonmail.com">polkastats@protonmail.com</a>.</h4>

      </b-container>
    </section>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  head () {
    return {
      title: 'PolkaStats - About PolkaStats',
      meta: [
        { hid: 'description', name: 'description', content: 'About PolkaStats' }
      ]
    }
  }
}
</script>
<style>
</style>
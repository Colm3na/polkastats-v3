<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5 text-center">
        <h1 class="mb-4">VALIDATORS</h1>

        <p>You own a validator and want to have your name, logo, website url and social links included in PolkaStats?</p>

        <p>Now you can do it!</p>

        <h2>Include your validator info in PolkaStats</h2>

        <p>NOTE: You will need to register in <a href="https://keybase.io/" target="_blank">https://keybase.io/</a> and fill all your data in order to continue.</p>

        <div class="row">
          <div class="col-md-4">
            <h3>1</h3>
            <p>Go to PolkaStats v2 GitHub repo at <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a></p>
          </div>
          <div class="col-md-4">
            <h3>2</h3>
            <p>Make a Fork of PolkaStats v2.</p>
          </div>
          <div class="col-md-4">
            <h3>3</h3>
            <p>Create on it a new file in identities folder named like stash_account_of_your_validator.json. Example: <a href="https://raw.githubusercontent.com/Colm3na/polkastats-v2/master/identities/GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY.json" target="_blank">GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY.json</a></p>
          </div>
          <div class="col-md-4">
            <h3>4</h3>
            <p>The content of the file should be your username in <a href="https://keybase.io/" target="_blank">https://keybase.io/</a>. Make sure that a query like <a href="https://keybase.io/_/api/1.0/user/lookup.json?username=polkastats" target="_blank">https://keybase.io/_/api/1.0/user/lookup.json?username=polkastats</a> should return the information you want to include.</p>
          </div>
          <div class="col-md-4">
            <h3>5</h3>
            <p>Make a Pull Request to master branch of the original repo: <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a>.</p>
          </div>
          <div class="col-md-4">
            <h3>6</h3>
            <p>That's it! In our next release your validator information shoud appears in PolkaStats :-).</p>
          </div>
        </div>

        <h3>Need help? Send me a message at <a target="_blank" href="mailto:polkastats@protonmail.com">polkastats@protonmail.com</a>.</h3>

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
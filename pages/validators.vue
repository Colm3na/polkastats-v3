<template>
  <div>
    <section class="cta pt-4">
      <b-container>
        <div class="row text-center">
          <div class="col-md-12 pt-5 pb-4">
            <h3>Own a kusama validator and want to have your name, logo, website url and social links included in PolkaStats?</h3>
          </div>
        </div>
      </b-container>
    </section>
    <section>
      <b-containe class="main pb-5 text-center">
        <h2 class="mt-4 mb-4">How to include your validator information in PolkaStats</h2>
        <b-alert variant="success" show>
          You will need both <a href="https://keybase.io" target="_blank">Keybase</a> and <a href="https://github.com" target="_blank">GitHub</a> accounts in order to continue.<br />
          Make sure you have properly filled your full name, website, social links and have uploaded a profile picture in your Keybase profile.
        </b-alert>
        <b-card-group deck class="mt-4 mb-4">
          <b-card title="Step 1">
            <b-card-text>
              Login with your GitHub user and make a Fork of PolkaStats v2 repo: <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a>.
            </b-card-text>
          </b-card>
          <b-card title="Step 2">
            <b-card-text>
              In your fork, create a new folder named "stash_address_of_your_validator" in <a href="https://github.com/Colm3na/polkastats-v2/tree/master/identities" target="_blank">identities folder</a>.
              In that folder create a new file named keybase_username with your <a href="https://keybase.io" target="_blank">Keybase</a> username on it. 
            </b-card-text>
          </b-card>
          <b-card title="Step 3">
            <b-card-text>
              Make a Pull Request to the master branch of the original repo: <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a>.
            </b-card-text>
          </b-card>
        </b-card-group>
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
      title: 'PolkaStats - For Kusama validators',
      meta: [
        { hid: 'description', name: 'description', content: 'Include your kusama validator info in PolkaStats' }
      ]
    }
  }
}
</script>
<style scoped>
.card-title {
  color: #ef1073;
}
</style>>
</style>
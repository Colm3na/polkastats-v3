<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5 text-center">
        <h1 class="mb-4">VALIDATORS</h1>

        <p>Own a kusama validator and want to have your name, logo, website url and social links included in PolkaStats? Now you can do it!</p>

        <h2 class="mt-4 mb-4">Include your validator info in PolkaStats</h2>

        <b-alert variant="success" show>
          You will need both <a href="https://keybase.io" target="_blank">Keybase</a> and <a href="https://github.com" target="_blank">GitHub</a> accounts in order to continue.<br />
          Make sure you have properly filled your full name, website, social links and have uploaded a profile picture in your Keybase profile.
        </b-alert>

        <b-card-group deck class="mt-4 mb-4">
          <b-card title="Step 1">
            <b-card-text>
              Go to PolkaStats v2 GitHub repo at <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a>.
            </b-card-text>
          </b-card>
          <b-card title="Step 2">
            <b-card-text>
              Login with your GitHub user and make a Fork of PolkaStats v2 repo: <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a>.
            </b-card-text>
          </b-card>
          <b-card title="Step 3">
            <b-card-text>
              In your fork, create a new file named "stash_address_of_your_validator.json" in <a href="https://github.com/Colm3na/polkastats-v2/tree/master/identities" target="_blank">identities folder</a>. Example: <a href="https://raw.githubusercontent.com/Colm3na/polkastats-v2/master/identities/GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY.json" target="_blank">GTzRQPzkcuynHgkEHhsPBFpKdh4sAacVRsnd8vYfPpTMeEY.json</a>
            </b-card-text>
          </b-card>
        </b-card-group>
        <b-card-group deck>
          <b-card title="Step 4">
            <b-card-text>
              The content of the file should be your username in <a href="https://keybase.io" target="_blank">Keybase</a>. Open in your browser <a href="https://keybase.io/_/api/1.0/user/lookup.json?username=polkastats" target="_blank">https://keybase.io/_/api/1.0/user/lookup.json?username=polkastats</a> (replacing <i>polkastats</i> by your Keybase username) and make sure it shows the information you want to include.
            </b-card-text>
          </b-card>
          <b-card title="Step 5">
            <b-card-text>
              Make a Pull Request to the master branch of the original repo: <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a>.
            </b-card-text>
          </b-card>
          <b-card title="Step 6">
            <b-card-text>
              That's it! If all looks good I will merge your Pull Request and, in our next release, your validator information shoud appears in PolkaStats :-).
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
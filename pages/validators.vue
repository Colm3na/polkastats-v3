<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5">
        <h1 class="mb-4">VALIDATORS</h1>

        <p>You own a validator and want to have your name, logo, website url and social links included in PolkaStats?</p>

        <p>Now you can do it!</p>

        <h2>Include your validator info in PolkaStats</h2>

        <p>NOTE: You will need to register in https://keybase.io/ and fill all your data in order to continue.</p>

        <ul>
          <li>1. Go to PolkaStats v2 GitHub repo at <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a></li>
          <li>2. Make a Fork of PolkaStats v2.</li>
          <li>3. Create on it a new file in identities folder named like stash_account_of_your_validator.json. Example: ET9SkhNZhY7KT474vkCEJtAjbgJdaqAGW4beeeUJyDQ3SnA.json</li>
          <li>4. The content of the file should be your username in https://keybase.io/. Make sure that a query like https://keybase.io/_/api/1.0/user/lookup.json?username=polkastats returns your information.</li>
          <li>5. Make a Pull Request to master branch of the original repo: <a href="https://github.com/Colm3na/polkastats-v2" target="_blank">https://github.com/Colm3na/polkastats-v2</a>.</li>
          <li>6. That's it! In our next release your validator information shoud appears in PolkaStats :-).</li>
        </ul>

        <p>Need help? You can send me a message at <a target="_blank" href="mailto:polkastats@protonmail.com">polkastats@protonmail.com</a>.</p>

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
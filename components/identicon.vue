<template>
  <a class="clipboard" v-clipboard:copy="value" v-on:click="makeToast('Address ' + value + ' copied to the clipboard', 'Notification', 'success', true)" v-bind:title="'Copy address ' + value + ' to clipboard'">             
    <Identicon
      :value="value"
      :size="size"
      :theme="theme"
      class="identicon"
    />
  </a>
</template>

<script>
import Identicon from '@polkadot/vue-identicon';
export default {
  props: ["value", "size", "theme"],
  methods: {
    makeToast(content = '', title = '', variant = null, solid = false) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: solid
      })
    }
  },
  components: {
    'Identicon': Identicon
  }
}
</script>

<style>
.identicon .container {
  margin: 0;
  padding: 0;
}
</style>

<template>
  <a
    v-clipboard:copy="value"
    class="clipboard"
    :title="'Copy address ' + value + ' to clipboard'"
    @click="
      makeToast(
        'Address ' + value + ' copied to the clipboard',
        'Notification',
        'success',
        true
      )
    "
  >
    <Identicon :value="value" :size="size" :theme="theme" class="identicon" />
  </a>
</template>

<script>
import Identicon from "@polkadot/vue-identicon";
export default {
  components: {
    Identicon: Identicon
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["value", "size", "theme"],
  methods: {
    makeToast(content = "", title = "", variant = null, solid = false) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: solid
      });
    }
  }
};
</script>

<style>
.identicon .container {
  margin: 0;
  padding: 0;
}
</style>

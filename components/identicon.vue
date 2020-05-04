<template>
  <a
    v-clipboard:copy="value"
    class="clipboard"
    :title="title"
    @click="showToast"
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
  data: function() {
    return {
      title:
        this.$t("components.identicon.copy_address") +
        this.value +
        this.$t("components.identicon.to_clipboard"),
      toastText:
        this.$t("components.identicon.address") +
        this.value +
        this.$t("components.identicon.copied_to_the_clipboard")
    };
  },
  methods: {
    showToast() {
      this.$toast.success(this.title, {
        action: {
          icon: "X",
          onClick: (e, toastObject) => {
            toastObject.goAway(0);
          }
        }
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

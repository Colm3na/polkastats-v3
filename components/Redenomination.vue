<template>
  <b-alert show dismissible variant="warning" class="text-center">
    <div>
      <h3>
        {{ $t("components.redenomination.title", { blocksLeft }) }}
      </h3>
      <p>
        {{ $t("components.redenomination.message") }}
      </p>
    </div>
  </b-alert>
</template>
<script>
import commonMixin from "../mixins/commonMixin.js";
export default {
  mixins: [commonMixin],
  props: {
    blockHeight: {
      type: Number,
      default: 0,
      required: false
    }
  },
  computed: {
    blocksLeft() {
      return this.formatNumber(1248328 - this.blockHeight);
    }
  }
};
</script>

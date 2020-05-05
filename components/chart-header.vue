<template>
  <h3>
    <small :class="textClass">
      <i :class="iconDirection" /> {{ difference > 0 ? "+" : ""
      }}{{ formated ? formatAmount(difference) : difference }}
    </small>
  </h3>
</template>

<script>
import commonMixin from "../mixins/commonMixin.js";

export default {
  mixins: [commonMixin],
  props: {
    first: {
      type: Number,
      default: 0,
      required: true
    },
    last: {
      type: Number,
      default: 0,
      required: true
    },
    formated: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data: function() {
    return {};
  },
  computed: {
    difference: function() {
      return this.last - this.first;
    },
    iconDirection: function() {
      if (this.last - this.first === 0) return "";
      return this.last - this.first >= 0
        ? "far fa-thumbs-up"
        : "far fa-thumbs-down";
    },
    textClass: function() {
      return this.last - this.first >= 0
        ? "change text-success ml-3"
        : "change text-danger ml-3";
    }
  }
};
</script>

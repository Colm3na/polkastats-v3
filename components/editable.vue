<template>
  <div>
    <h5
      v-show="!editing"
      v-b-tooltip.hover
      class="mt-1"
      title="Click to edit name"
      @click="editing = true"
    >
      {{ value }}<span v-if="value.length == 0">Edit validator name...</span>
    </h5>
    <span v-show="editing">
      <input
        v-b-tooltip.hover
        :value="value"
        type="text"
        class="form-control mt-1"
        title="Press Enter key to save"
        @input="$emit('input', $event.target.value)"
        @keydown.enter="updateFavoritesCookie()"
      >
    </span>
  </div>
</template>
<script>
export default {
  props: ["value", "favorites"],
  data: function() {
    return {
      editing: false
    }
  },
  methods: {
    updateFavoritesCookie: function() {
      this.editing = false
      this.$cookies.set("favorites", this.favorites, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      })
      console.log(this.favorites)
    }
  }
}
</script>
<style>
h5 {
  cursor: pointer;
}
</style>

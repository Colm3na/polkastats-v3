<template>
  <section>
    <b-container class="main text-center">
      <h1 class="display-1 pt-4">ERROR {{ error.statusCode }}</h1>
      <h3 v-if="error.statusCode === 404">
        {{ $t("layout.error.page_not_found") }}
      </h3>
      <h3 v-else>
        {{ $t("layout.error.an_error_occurred") }}
      </h3>
    </b-container>
  </section>
</template>
<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["error"]
};
</script>
<style scoped>
.main {
  padding-top: 5rem;
  padding-bottom: 6rem;
}
</style>

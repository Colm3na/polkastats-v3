<template>
  <section>
    <b-container class="main text-center">
      <h1 class="display-1 pt-4">ERROR {{ error.statusCode }}</h1>
      <h3 v-if="error.statusCode === 404">Page not found!</h3>
      <h3 v-else>An error occurred</h3>
    </b-container>
  </section>
</template>
<script>
export default {
  props: ['error']
}
</script>
<style scoped>
.main {
  padding-top: 5rem;
  padding-bottom: 6rem;
}
</style>
<template>
  <div role="tablist" class="pt-2">
    <b-card no-body class="mb-2 info">
      <b-button
        :class="visible ? null : 'collapsed'"
        :aria-expanded="visible ? 'true' : 'false'"
        :aria-controls="id"
        variant="info"
        @click="visible = !visible"
      >
        {{ button }}
      </b-button>
      <b-collapse :id="id" v-model="visible" role="tabpanel">
        <b-card-body class="pt-3 pb-3">
          <div v-if="text">
            {{ text }}
          </div>
          <div v-if="list">
            <ul>
              <li v-for="item in list" :key="item.id">
                {{ item.text }}
              </li>
            </ul>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "ID",
      requires: true
    },
    button: {
      type: String,
      default: "",
      required: true
    },
    list: {
      type: Array,
      default: null,
      required: false
    },
    text: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    return {
      visible: false
    };
  }
};
</script>

<style scoped>
.info {
  border-radius: 0.6rem;
}
</style>

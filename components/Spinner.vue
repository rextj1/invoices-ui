<template>
  <div class="text-center">
    <v-progress-circular
      :size="size"
      :color="color"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 20,
    },
    color: {
      type: String,
      reqired: true,
    },
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>

<template>
  <v-toolbar flat>
    <v-btn
      color="primary"
      class="pa-3"
      :disabled="selected.length == 0"
      @click="updateDeleteAll"
      >seleted Delete</v-btn
    >
    <v-toolbar-title>All Customers</v-toolbar-title>
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>
    <v-text-field
      v-model="localSearch"
      label="Search..."
      append-icon="mdi-magnify"
      single-line
      hide-details
      class="mx-4"
      @input="updateSearch"
    ></v-text-field>
    <v-btn color="primary" dark class="mb-2" @click="$emit('openDialog')">
      New Item
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    search: {
      type: String,
      required: "",
    },
    selected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localSearch: this.search,
    };
  },
  watch: {
    search(newVal) {
      this.localSearch = newVal;
    },
  },
  methods: {
    updateSearch() {
      this.$emit("updateSearch", this.localSearch);
    },
    updateDeleteAll() {
      this.$emit("updateDeleteAll");
    },
  },
};
</script>

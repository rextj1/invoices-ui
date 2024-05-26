<template>
    <v-toolbar flat>
      <v-switch
        v-model="localSingleSelect"
        label="Single select"
        class="pa-3"
        @change="toggleSingleSelect"
      ></v-switch>
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
      singleSelect: Boolean,
      search: String,
    },
    data() {
      return {
        localSingleSelect: this.singleSelect,
        localSearch: this.search,
      };
    },
    watch: {
      search(newVal) {
        this.localSearch = newVal;
      },
    },
    methods: {
      toggleSingleSelect() {
        this.$emit('toggleSingleSelect', this.localSingleSelect);
      },
      updateSearch() {
        this.$emit('updateSearch', this.localSearch);
      },
    },
  };
  </script>
  
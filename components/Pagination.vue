<template>
    <div>
      <v-pagination
        v-model="localPage"
        :length="pagination.total"
        :total-visible="pageVisibility"
        :disabled="disabled"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        @input="updatePage"
        circle
      ></v-pagination>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      pagination: {
        type: Object,
        required: true,
      },
      pageVisibility: {
        type: Number,
        requred: true,
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        localPage: this.pagination.current,
      };
    },
    watch: {
      pagination: {
        deep: true,
        handler(newVal) {
          this.localPage = newVal.current;
        },
      },
    },
    methods: {
      updatePage(page) {
        this.localPage = page;
        this.$emit("onPageChange", page);
      },
    },
  };
  </script>
  
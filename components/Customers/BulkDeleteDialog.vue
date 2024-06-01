<template>
  <v-dialog v-model="dialogBulkDelete" max-width="600px">
    <v-card>
      <v-card-title class="text-h5" v-if="!isBusy"
        >Are you sure you want to delete this item(s)?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-show="!isBusy"
          color="blue darken-1"
          text
          @click="$emit('closeBulkDelete')"
          >Cancel</v-btn
        >
        <Spinner v-if="isBusy" :size="50" :color="'red'" />
        <v-btn v-else color="blue darken-1" text @click="bulkBeleteItemConfirm"
          >Delete</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Spinner from "../Spinner.vue";

export default {
  props: {
    dialogBulkDelete: {
      type: Boolean,
      default: false,
    },
    customersId: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isBusy: false,
    };
  },

  methods: {
    async bulkBeleteItemConfirm() {
      this.isBusy = true;
      try {
        await this.$axios.$post(
          "/api/v1/customers/bulkDelete",
          this.customersId
        );
        this.$emit("bulkBeleteItemConfirm");
        this.isBusy = false;
      } catch (error) {
        this.error = "Failed to delete customer.";
        this.isBusy = false;
      }
    },
  },
};
</script>

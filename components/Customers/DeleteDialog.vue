<template>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title v-if="!isBusy" class="text-h5"
        >Are you sure you want to delete this item?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-show="!isBusy"
          color="blue darken-1"
          text
          @click="$emit('closeDelete')"
          >Cancel</v-btn
        >
        <Spinner v-if="isBusy" :size="50" :color="'red'" />
        <v-btn v-else color="blue darken-1" text @click="deleteItemConfirm"
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
    dialogDelete: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isBusy: false,
    };
  },
  methods: {
    async deleteItemConfirm() {
      this.isBusy = true;
      const { id } = this.item;
      try {
        await this.$axios.$delete(`/api/v1/customers/${id}`, this.item);
        this.$emit("deleteItemConfirm");
        this.isBusy = false;
      } catch (error) {
        this.error = "Failed to delete customer.";
        this.isBusy = false;
      }
    },
  },
};
</script>

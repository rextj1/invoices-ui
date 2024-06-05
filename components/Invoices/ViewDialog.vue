<template>
  <v-row justify="center">
    <v-dialog
      v-model="viewDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="$emit('closeViewDialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
       
        <v-divider></v-divider>
        <v-card lass="mx-auto my-12">
          <template>
            <div class="text-center">Customer Invoices</div>
           {{ item.customer.name }}
          </template>
        </v-card>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    viewDialog: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: {},
    },
  },
 
};
</script>

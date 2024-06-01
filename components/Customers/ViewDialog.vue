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
        <div class="mx-auto my-12">
          <span style="color: blueviolet">Name:</span>
          {{ item.name }}

          <span style="color: blueviolet">Email </span>:
          {{ item.email }}
          <span style="color: blueviolet"> State </span>:
          {{ item.state }}
          <span style="color: blueviolet"> City</span>:{{ item.city }}

          <span style="color: blueviolet"> Postal Code </span>:
          {{ item.postalCode }}
        </div>
        <v-divider></v-divider>
        <v-card lass="mx-auto my-12">
          <template>
            <div class="text-center">Customer Invoices</div>
            <v-data-table
              :headers="headers"
              :hide-default-footer="true"
              :items="item.invoices"
              class="elevation-1"
            ></v-data-table>
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
  data() {
    return {
      headers: [
        { text: "Amount", value: "amount" },
        { text: "Status", value: "status" },
        { text: "Billed Date", value: "billedDate" },
        { text: "Paid", value: "paidDate" },
      ],
    };
  },
};
</script>

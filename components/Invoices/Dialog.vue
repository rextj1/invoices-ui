<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.amount"
                label="amount"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.billedDate"
                label="Billed Date"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.paidDate"
                label="Paid Date"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <Spinner v-if="isBusy" :size="20" :color="'green'" />
        <v-btn
          v-else
          disabled
          color="blue darken-1"
          text
          @click="save"
        >
          {{ editedIndex == -1 ? "Save" : "Edit" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Spinner from "../Spinner.vue";

export default {
  props: {
    formTitle: {
      type: String,
      required: true,
    },
    dialog: {
      type: Boolean,
      required: true,
    },

    editedItem: {
      type: Object,
      required: true,
    },
    editedIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      errors: {},
      isBusy: false,
      nameRules: [(v) => !!v || "This field is required"],
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },

    async save() {
      // if (Object.keys(this.editedItem).length === 0) return;
      if (this.$refs.form.validate() == false) return;
      try {
        this.isBusy = true;
        // to save new customer object

        this.$emit("save", response.data);
      } catch (error) {}
    },
  },
};
</script>

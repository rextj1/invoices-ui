<template>
  <v-dialog v-model="dialog" persistent max-width="1000px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col
                v-for="field in formFields"
                :key="field.model"
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="editedItem[field.model]"
                  :label="field.label"
                  :rules="nameRules"
                  required
                ></v-text-field>
                <span
                  v-if="Object.keys(errors).length != 0"
                  style="color: red"
                  >{{ field.model == "type" ? errors.type[0] : "" }}</span
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <Spinner v-if="isBusy" :size="20" :color="'green'" />
        <v-btn
          v-else
          :disabled="!valid"
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
    formFields: {
      type: Array,
      default: () => [],
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
        if (this.editedIndex == -1) {
          const response = await this.$axios.$post(
            `/api/v1/customers`,
            this.editedItem
          );
          this.errors = {};
          this.$emit("save", response.data);
          this.$emit("close");
        } else {
          // to update customer object
          delete this.editedItem.invoices;

          const { id } = this.editedItem;
          const response = await this.$axios.$put(
            `/api/v1/customers/${id}`,
            this.editedItem
          );
          this.errors = {};
          this.$emit("save", response.data);
          this.$emit("close");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          this.errors = error.response.data.errors;
        } else {
          this.errors.general =
            "An error occurred while saving. Please try again.";
        }
      } finally {
        // Ensure isBusy is reset to false in both success and error cases
        this.isBusy = false;
      }
    },
  },
};
</script>

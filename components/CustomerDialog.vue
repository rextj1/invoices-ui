<template>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-for="field in formFields" :key="field.model" cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem[field.model]"
                  :label="field.label"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('close')">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="$emit('save')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      dialog: Boolean,
      formTitle: String,
      editedItem: Object,
      formFields: Array,
    },
  };
  </script>
  
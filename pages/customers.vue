<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="customers"
      :hide-default-footer="true"
      :options.sync="options"
      :server-items-length="12"
      sort-by="customers"
      class="elevation-1"
      :loading="loading"
      :search="search"
      :custom-filter="filterOnlyCapsText"
      :single-select="singleSelect"
      item-key="name"
      show-select
    >
      <template v-slot:top>
        <v-toolbar flat>
          <template>
            <v-switch
              v-model="singleSelect"
              label="Single select"
              class="pa-3"
            ></v-switch>
          </template>
          <v-toolbar-title>All Customers </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <template>
            <v-text-field
              v-model="search"
              label="Search..."
              append-icon="mdi-magnify"
              single-line
              hide-details
              class="mx-4"
            ></v-text-field>
          </template>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Customers Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                      ></v-text-field>
                      <template v-slot:item.email="{ item }">
                        <v-chip :color="getColor(item.calories)" dark>
                          {{ item.calories }}
                        </v-chip>
                      </template>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.state"
                        label="State"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.city"
                        label="City"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.postalCode"
                        label="Postal Code"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.type"
                        label="Type"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="viewItem(item)"> mdi-eye </v-icon>
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:item.type="{ item }">
        <v-chip :color="getColor(item.type)" dark>
          {{ item.type }}
        </v-chip>
      </template>
      <!-- <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template> -->
    </v-data-table>
    <div class="text-center">
      <v-pagination
        v-if="pagination.total > 1"
        v-model="pagination.current"
        :length="pagination.total"
        :total-visible="10"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        @input="onPageChange"
        circle
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
export default {
  middleware: "auth",
  name: "customers",
  data: () => ({
    singleSelect: false,
    selected: [],
    options: {},
    page: 1,
    dialog: false,
    loading: false,
    search: "",
    dialogDelete: false,
    customers: [],
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Email", value: "email" },
      { text: "Address", value: "address" },
      { text: "State", value: "state" },
      { text: "City", value: "city" },
      { text: "Postal Code", value: "postalCode" },
      { text: "Type", value: "type" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    editedIndex: -1,
    editedItem: {
      // name: "",
      // email: "",
      // state: "",
      // city: "",
      // postalCode: "",
      // type: "",
    },
    defaultItem: {
      name: "",
      email: "",
      state: "",
      city: "",
      postalCode: "",
      type: "",
    },
    pagination: {
      current: 1,
      total: 0,
    },
  }),
  mounted() {
    this.setPageFromQuery();
    this.getCustomers();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  // created() {
  //   this.initialize();
  // },

  methods: {
    // initialize() {
    //   this.customers = [];
    // },
    getColor(type) {
      if (type == "I" || type == "i") return "red";
      else return "green";
    },
    filterOnlyCapsText(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
      // new RegExp(search, 'i').test(value.toString());
    },

    setPageFromQuery() {
      const page = this.$route.query.page;
      this.pagination.current = page ? parseInt(page, 13) : 1;
    },

    getCustomers() {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/customers`, {
          params: {
            page: this.pagination.current,
          },
        })
        .then((response) => {
          this.customers = response.data;
          this.pagination.current = response.meta.current_page;
          this.pagination.total = response.meta.last_page;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    onPageChange(page) {
      this.$router.push({ path: this.$route.path, query: { page } });
      this.getCustomers();
    },

    viewItem(item){
      this.editedIndex = this.customers.indexOf(item);
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.customers.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.customers[this.editedIndex], this.editedItem);
      } else {
        this.customers.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

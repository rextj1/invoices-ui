<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :fixed-header="true"
      :items="customers"
      :hide-default-footer="true"
      :options.sync="options"
      sort-by="customers"
      class="elevation-1"
      :loading="loading"
      :search="search"
      :custom-filter="filterOnlyCapsText"
      v-model="selected"
      show-select
      :single-select="false"
    >
      <template v-slot:top>
        <CustomersTableTool
          :selected="selected"
          @updateSearch="updateSearch"
          @updateDeleteAll="updateDeleteAll"
          @openDialog="openDialog"
        />
      </template>

      <template v-slot:item.actions="{ item }">
        <CustomersTableActions
          :item="item"
          @viewItem="viewItem"
          @editItem="editItem"
          @deleteItem="deleteItem"
        />
      </template>

      <template v-slot:item.type="{ item }">
        <v-chip :color="getColor(item.type)" dark>
          {{ item.type }}
        </v-chip>
      </template>
    </v-data-table>

    <CustomersDialog
      :formTitle="formTitle"
      :dialog="dialog"
      :formFields="formFields"
      :editedIndex="editedIndex"
      :editedItem="editedItem"
      @save="onCustomerSaved"
      @close="close"
    />
    <CustomersDeleteDialog
      :dialogDelete="dialogDelete"
      :item="item"
      @closeDelete="closeDelete"
      @deleteItemConfirm="deleteItemConfirm"
    />

    <CustomersBulkDeleteDialog
      :dialogBulkDelete="dialogBulkDelete"
      :customersId="customersId"
      @closeBulkDelete="closeBulkDelete"
      @bulkBeleteItemConfirm="bulkBeleteItemConfirm"
    />

    <div class="text-center">
      <Pagination
        v-if="pagination.total > 1"
        :pagination="pagination"
        :pageVisibility="pageVisibility"
        :disabled="loading"
        @onPageChange="onPageChange"
      />
    </div>
    <CustomersViewDialog
      :viewDialog="viewDialog"
      :item="item"
      @closeViewDialog="closeViewDialog"
    />
  </v-container>
</template>

<script>
import CustomersDialog from "@/components/Customers/Dialog";
import CustomersDeleteDialog from "@/components/Customers/DeleteDialog";
import CustomersBulkDeleteDialog from "@/components/Customers/BulkDeleteDialog";
import CustomersTableActions from "@/components/Customers/TableActions";
import CustomersTableTool from "@/components/Customers/TableTool";
import CustomersViewDialog from "@/components/Customers/ViewDialog";
import Pagination from "@/components/Pagination";

export default {
  middleware: "auth",
  name: "customers",
  components: {
    CustomersDialog,
    CustomersDeleteDialog,
    CustomersBulkDeleteDialog,
    CustomersTableActions,
    CustomersTableTool,
    CustomersViewDialog,
    Pagination,
  },
  data() {
    return {
      selected: [],
      options: {},
      dialog: false,
      viewDialog: false,
      dialogDelete: false,
      dialogBulkDelete: false,
      customersId: [],
      loading: false,
      search: "",
      item: {},
      customers: [],
      headers: [
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Email", value: "email" },
        { text: "Address", value: "address" },
        { text: "State", value: "state" },
        { text: "City", value: "city" },
        { text: "Postal Code", value: "postalCode" },
        { text: "Type", value: "type" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {
        name: "",
        email: "",
        state: "",
        city: "",
        postalCode: "",
        type: "",
      },
      pageVisibility: 10,
      pagination: {
        current: 1,
        total: 0,
      },
    };
  },
  mounted() {
    this.setPageFromQuery();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    formFields() {
      return [
        { model: "name", label: "Customer Name" },
        { model: "address", label: "Address" },
        { model: "email", label: "Email" },
        { model: "state", label: "State" },
        { model: "city", label: "City" },
        { model: "postalCode", label: "Postal Code" },
        { model: "type", label: "Type" },
      ];
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    "$route.query.page": "setPageFromQuery",
  },
  methods: {
    getColor(type) {
      return type === "I" || type === "i" ? "red" : "green";
    },
    //---- custom filter -----//
    updateSearch(search) {
      this.search = search;
    },
    filterOnlyCapsText(value, search, item) {
      return (
        value != null &&
        search != null &&
        value.toString().toLowerCase().includes(search.toLowerCase())
      );
    },
    //---- end custom filter -----//

    setPageFromQuery() {
      const page = this.$route.query.page;
      this.pagination.current = page ? parseInt(page, 10) : 1;
      this.getCustomers();
    },
    getCustomers() {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/customers`, {
          params: {
            page: this.pagination.current,
            includeInvoices: true,
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
      this.pagination.current = page;
      this.$router.push({ path: this.$route.path, query: { page } });
    },
    viewItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.viewDialog = true;
      this.item = item;
    },
    closeViewDialog() {
      this.viewDialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    editItem(item) {
      this.item = item;
      this.editedIndex = this.customers.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      this.editedItem = { ...item }; // Deep copy the item object
      this.dialog = true;
    },
    onCustomerSaved(response) {
      if (this.editedIndex > -1) {
        // const currentId = response.id - 1;
        // Object.assign(this.customers[currentId], response);
        this.customers.splice(this.editedIndex, 1, response);
      } else {
        // Add the new customer
        this.customers.push(response);
      }
      // this.getCustomers(); // Fetch the updated list
    },
    deleteItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      this.item = { ...item };
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.customers.splice(this.editedIndex, 1);
      this.selected = [];
      this.closeDelete();
    },

    // bulk delete
    updateDeleteAll() {
      this.customersId = this.selected.map((item) => item.id);
      this.dialogBulkDelete = true;
    },
    closeBulkDelete() {
      this.dialogBulkDelete = false;
    },
    bulkBeleteItemConfirm() {
      this.customers = this.customers.filter(
        (customer) => !this.customersId.includes(customer.id)
      );
      this.selected = [];
      this.closeBulkDelete();
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
    openDialog() {
      this.dialog = true;
    },
  },
};
</script>

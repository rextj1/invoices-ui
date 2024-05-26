<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="customers"
      :hide-default-footer="true"
      :options.sync="options"
      :server-items-length="pagination.total"
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
        <TableToolbar
          :singleSelect="singleSelect"
          @toggleSingleSelect="toggleSingleSelect"
          :search="search"
          @updateSearch="updateSearch"
          @openDialog="openDialog"
        />
      </template>

      <template v-slot:item.actions="{ item }">
        <TableActions
          :item="item"
          @viewItem="viewItem"
          @editItem="editItem"
          @deleteItem="deleteItem"
        />
      </template>

      <template v-slot:item.type="{ item }">
        <v-chip :color="getColor(item.type)" dark>{{ item.type }}</v-chip>
      </template>
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

    <CustomerDialog
      :dialog="dialog"
      :formTitle="formTitle"
      :editedItem="editedItem"
      :formFields="formFields"
      @close="close"
      @save="save"
    />

    <DeleteDialog
      :dialogDelete="dialogDelete"
      @closeDelete="closeDelete"
      @deleteItemConfirm="deleteItemConfirm"
    />
  </v-container>
</template>

<script>
import TableToolbar from "@/components/TableToolbar.vue";
import TableActions from "@/components/TableActions.vue";
import CustomerDialog from "@/components/CustomerDialog.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";

export default {
  middleware: "auth",
  name: "customers",
  data() {
    return {
      singleSelect: false,
      options: {},
      page: 1,
      dialog: false,
      loading: false,
      search: "",
      dialogDelete: false,
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
      editedItem: this.getDefaultItem(),
      pagination: {
        current: 1,
        total: 0,
      },
    };
  },
  components: {
    TableToolbar,
    TableActions,
    CustomerDialog,
    DeleteDialog,
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    formFields() {
      return [
        { model: "name", label: "Customer's Name" },
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
      if (!val) this.close();
    },
    dialogDelete(val) {
      if (!val) this.closeDelete();
    },
  },
  mounted() {
    this.setPageFromQuery();
    this.getCustomers();
  },
  methods: {
    getDefaultItem() {
      return {
        name: "",
        email: "",
        state: "",
        city: "",
        postalCode: "",
        type: "",
      };
    },
    getColor(type) {
      return type.toLowerCase() === "i" ? "red" : "green";
    },
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toLowerCase().includes(search.toLowerCase())
      );
    },
    setPageFromQuery() {
      const page = this.$route.query.page;
      this.pagination.current = page ? parseInt(page, 10) : 1;
    },
    getCustomers() {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/customers`, { params: { page: this.pagination.current } })
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
    toggleSingleSelect(value) {
      this.singleSelect = value;
    },
    updateSearch(value) {
      this.search = value;
    },
    viewItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.dialog = true;
    },
    editItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.customers.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = this.getDefaultItem();
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = this.getDefaultItem();
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
    openDialog() {
      this.dialog = true;
    },
  },
};
</script>

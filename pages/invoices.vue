<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :fixed-header="true"
      :items="invoices"
      :hide-default-footer="true"
      sort-by="invoices"
      class="elevation-1"
      :loading="loading"
      :search="search"
      :custom-filter="filterOnlyCapsText"
      v-model="selected"
      show-select
      :single-select="false"
    >
      <template v-slot:top>
        <TableTool
          :selected="selected"
          @updateSearch="updateSearch"
          @openDialog="openDialog"
          @editItem="editItem"
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
    </v-data-table>

    <InvoicesDialog
      v-if="dialog"
      :formTitle="formTitle"
      :dialog="dialog"
      :editedIndex="editedIndex"
      :editedItem="editedItem"
      @close="close"
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

    <InvoicesViewDialog
      v-if="viewDialog"
      :viewDialog="viewDialog"
      :item="item"
      @closeViewDialog="closeViewDialog"
    />
  </v-container>
</template>

<script>
import TableActions from "@/components/TableActions";
import InvoicesViewDialog from "@/components/Invoices/ViewDialog";
import TableTool from "@/components/TableTool";
import InvoicesDialog from "@/components/Invoices/Dialog";
import Pagination from "@/components/Pagination";

export default {
  data: () => ({
    dialog: false,
    loading: false,
    viewDialog: false,
    dialogDelete: false,
    item: {},
    selected: [],
    search: "",
    headers: [
      {
        text: "customer Id",
        align: "start",
        sortable: false,
        value: "customer.name",
      },
      { text: "Amount", value: "amount" },
      { text: "Status", value: "status" },
      { text: "Billed Date", value: "billedDate" },
      { text: "Paid Date", value: "paidDate" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    invoices: [],
    editedIndex: -1,
    editedItem: {
      customer: null,
      amount: null,
      status: null,
      billedDate: null,
      paidDate: null,
    },
    defaultItem: {},
    pageVisibility: 10,
    pagination: {
      current: 1,
      total: 0,
    },
  }),

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
    "$route.query.page": "setPageFromQuery",
  },

  mounted() {
    this.setPageFromQuery();
  },
  methods: {
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
      this.getInvoices();
    },
    getInvoices() {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/invoices`, {
          params: {
            page: this.pagination.current,
            // includeInvoices: true,
          },
        })
        .then((response) => {
          this.invoices = response.data;
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
      this.editedIndex = this.invoices.indexOf(item);
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
      this.editedIndex = this.invoices.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      this.editedItem = { ...item }; // Deep copy the item object
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.invoices.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      this.item = { ...item };
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
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
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
    openDialog() {
      this.dialog = true;
    },
  },
};
</script>

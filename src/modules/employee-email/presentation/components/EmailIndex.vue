<script setup lang="ts">
import { onMounted, ref } from "vue";
import { EmailController, getEmailTypeName } from "@/modules/employee-email";
import DataStatusBuilder from "@/shared/DataStatues/DataStatusBuilder.vue";
import AppTable, {
  type TableHeader,
} from "@/shared/HelpersComponents/AppTable.vue";
import type EmailModel from "@/modules/employee-email/core/models/email.model";
import FilterEmailParams from "../../core/params/filter.email.params";
import Pagination from "@/shared/HelpersComponents/Pagination.vue";

// Controller instance
const controller = EmailController.getInstance();

// Table headers
const headers: TableHeader[] = [
  { key: "email", label: "Email", width: "50%", sortable: true },
  { key: "type", label: "Type", width: "30%" },
];

// Pagination state
const perPage = ref(10);

const fetchEmails = async (page: number = 1) => {
  await controller.fetchList(new FilterEmailParams("", page, perPage.value));
};

const onPageChange = (page: number) => {
  fetchEmails(page);
};

const onPerPageChange = (count: number) => {
  perPage.value = count;
  fetchEmails(1);
};

// Fetch emails on component mount
onMounted(async () => {
  await fetchEmails();
});

const editEmail = (email: EmailModel) => {
  console.log("Edit email:", email);
};

const deleteEmail = (id: number) => {
  console.log("Delete email:", id);
};
</script>

<template>
  <div class="email-crud-example">
    <h2>Employee Email Management</h2>

    <DataStatusBuilder
      :controller="controller.listState.value"
      :on-retry="
        async () => {
          await fetchEmails();
        }
      "
    >
      <template #success="{ data }">
        <AppTable
          :headers="headers"
          :items="data as EmailModel[]"
          selectable
          show-index
          hoverable
          striped
        >
          <template #cell-type="{ item }">
            <span class="email-type">{{ getEmailTypeName(item.type) }}</span>
          </template>

          <template #actions="{ item }">
            <button @click="editEmail(item)">Edit</button>
            <button @click="deleteEmail(item.id!)">Delete</button>
          </template>
        </AppTable>

        <!-- Pagination -->
        <Pagination
          :pagination="controller.pagination.value"
          @change-page="onPageChange"
          @count-per-page="onPerPageChange"
        />
      </template>

      <template #empty>
        <p>No emails found</p>
      </template>
    </DataStatusBuilder>
  </div>
</template>

<style scoped>
.email-crud-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.email-list {
  margin-bottom: 30px;
}

.email-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.email-type {
  color: #666;
  font-size: 0.9em;
}

.actions {
  display: flex;
  gap: 10px;
}

.email-form {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.email-form input,
.email-form select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>

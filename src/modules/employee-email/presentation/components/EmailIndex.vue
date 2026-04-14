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
import DeleteEmailParams from "../../core/params/deleteParams";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "@/base/Presentation/Utils/debouced";
import { useFormsStore } from "@/stores/formsStore";

// Controller instance
const controller = EmailController.getInstance();
const router = useRouter();
const route = useRoute();
// Table headers
const headers: TableHeader[] = [
  { key: "email", label: "Email", width: "50%", sortable: true },
  { key: "type", label: "Type", width: "30%" },
];

// Pagination state
const perPage = ref(10);
const word = ref("");

const fetchEmails = async (page: number = 1, word: string = "") => {
  await controller.fetchList(
    new FilterEmailParams(
      word,
      route.query.page ? Number(route.query.page) : page,
      perPage.value,
    ),
  );
};

const Search = debounce(() => {
  router.push({
    query: {
      ...route.query,
      page: Number(route.query.page ?? 1),
      word: word.value || undefined,
    },
  });

  fetchEmails(1, word.value);
});

const onPageChange = (page: number) => {
  fetchEmails(page);
  router.push({
    query: {
      ...route.query,
      page: String(page),
      word: word.value,
    },
  });
};

const onPerPageChange = (count: number) => {
  perPage.value = count;
  fetchEmails(1);
};

// Fetch emails on component mount
onMounted(async () => {
  if (route.query.word) {
    word.value = String(route.query.word);
  }

  await fetchEmails(
    route.query.page ? Number(route.query.page) : 1,
    word.value,
  );
});

const deleteEmail = async (id: number) => {
  await controller.delete(new DeleteEmailParams(id));
  await fetchEmails();
};

const FormStore = useFormsStore();
const formRoute = "/emails/add";


</script>

<template>
  <div class="email-crud-example">
    <div class="index-header">
      <h2>Employee Email Management</h2>

      <router-link :to="formRoute" class="add-btn"
        >{{
          Object.keys(FormStore?.formData[formRoute] ?? {}).length === 0 ||
          Object.values(FormStore?.formData[formRoute] ?? {}).every(
            (v) => v == null,
          )
            ? `Add`
            : `Continue Adding`
        }}
        Email</router-link
      >
    </div>
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), Search())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="Search"
      />
    </div>

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
            <div class="btns-container">
              <router-link
                class="btn btn-primary"
                :to="`/emails/edit/${item.id}`"
                >Edit</router-link
              >
              <button @click="deleteEmail(item.id!)">Delete</button>
            </div>
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

<style lang="scss" scoped>
.btns-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.index-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.email-crud-example {
  padding: 20px;
  /* max-width: 800px;*/
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

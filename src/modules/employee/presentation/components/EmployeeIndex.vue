<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import EmployeeController from '../controllers/employee.controller';
  import IndexEmployeeParams from '../../core/params/index.employee.params';
  import DeleteEmployeeParams from '../../core/params/delete.employee.params';
  import type EmployeeModel from '../../core/models/employee.model';
  import DeleteDialog from '@/shared/HelpersComponents/dialog/DeleteDialog.vue';
  import { useFormsStore } from '@/stores/formsStore';

  // Controller instance
  const controller = EmployeeController.getInstance();
  const state = computed(() => controller.listState.value);
  const router = useRouter();
  const route = useRoute();

  const FormStore = useFormsStore();
  const formRoute = '/employees/add';

  // Table headers
  const headers: TableHeader[] = [
    { key: 'name', label: 'Name', width: '25%', sortable: true },
    { key: 'email', label: 'Email', width: '25%' },
    { key: 'phone', label: 'Phone', width: '15%' },
    { key: 'role_id', label: 'Role', width: '10%' },
    { key: 'employeeType', label: 'Type', width: '10%' },
    { key: 'isSuperadmin', label: 'Superadmin', width: '10%' },
  ];

// Pagination state
const perPage = ref(10);
const word = ref("");

const fetchEmployees = async (page: number = 1, wordStr: string = "") => {
  await controller.fetchList(
    new IndexEmployeeParams(wordStr || word.value, page, perPage.value),
  );
};

  const Search = debounce(() => {
    router.push({
      query: {
        ...route.query,
        page: 1,
        word: word.value || undefined,
      },
    });
    fetchEmployees(1, word.value);
  });

  const onPageChange = (page: number) => {
    fetchEmployees(page);
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
    fetchEmployees(1);
  };

  onMounted(async () => {
    if (route.query.word) {
      word.value = String(route.query.word);
    }
    await fetchEmployees(route.query.page ? Number(route.query.page) : 1, word.value);
  });

  const deleteEmployee = async (id: number) => {
    await controller.delete(new DeleteEmployeeParams(id));
    await fetchEmployees();
  };

  const isDraft = computed(() => {
    const data = FormStore?.formData[formRoute] ?? {};
    return Object.keys(data).length === 0 || Object.values(data).every((v) => v == null);
  });
</script>

<template>
  <div class="employee-page">
    <div class="index-header">
      <div class="toolbar">
        <div class="search-field">
          <span class="search-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            v-model="word"
            placeholder="Search by employee name or email…"
            class="search-input"
            type="text"
            @input="Search"
          />
        </div>
      </div>
      <router-link :to="formRoute" class="btn-add">
        <span>{{ isDraft ? "Add Employee" : "Continue Adding" }}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </router-link>
    </div>

    <DataStatusBuilder :controller="state" :on-retry="async () => await fetchEmployees()">
      <template #success="{ data }">
        <div class="table-frame">
          <AppTable
            :headers="headers"
            :items="data as EmployeeModel[]"
            selectable
            show-index
            hoverable
            striped
          >
            <template #cell-isSuperadmin="{ item }">
              <span
                :class="['status-badge', item.isSuperadmin ? 'admin' : 'user']"
              >
                {{ item.isSuperadmin ? "Yes" : "No" }}
              </span>
            </template>

            <template #actions="{ item }">
              <div class="row-actions">
                <router-link
                  class="action-btn edit"
                  :to="`/employees/edit/${item.id}`"
                  title="Edit"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                </router-link>

                <DeleteDialog @delete="deleteEmployee(item.id!)">
                  <template #Dialog>
                    <button class="action-btn delete" title="Delete">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </template>
                </DeleteDialog>
              </div>
            </template>
          </AppTable>
        </div>

        <Pagination
          v-if="controller.pagination.value"
          :pagination="controller.pagination.value"
          @change-page="onPageChange"
          @count-per-page="onPerPageChange"
        />
      </template>

      <template #empty>
        <div class="empty-state">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <h3>No employees found</h3>
          <p>Start by adding a new employee to your organization</p>
          <router-link :to="formRoute" class="btn-add empty-cta">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add Employee</span>
          </router-link>
        </div>
      </template>
    </DataStatusBuilder>
  </div>
</template>

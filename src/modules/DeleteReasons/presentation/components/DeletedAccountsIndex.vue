<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import DletedAccountsController from '../controllers/DeleteAccounts/deleted.accounts.controller';
  import IndexDeleteAccountsParams from '../../core/params/index.delete.accounts.params';
  import type DeleteAccountsModel from '../../core/models/delete.accountes.model';
  import DeletedReasonesDialog from '../subComponent/DeletedReasonesDialog.vue';

  // Controller instance
  const controller = DletedAccountsController.getInstance();

  const state = computed(() => controller.listState.value);
  const router = useRouter();
  const route = useRoute();

  // Table headers
  const headers: TableHeader[] = [
    { key: 'date', label: 'remove Date', width: '25%', sortable: true },
    { key: 'name', label: 'student name', width: '25%' },
    { key: 'reason', label: 'reason', width: '25%' },
    { key: 'notes', label: 'notes', width: '25%' },
  ];

  // Pagination state
  const perPage = ref(10);
  const word = ref('');

  const fetchStages = async (page: number = 1, word: string = '') => {
    await controller.fetchList(
      new IndexDeleteAccountsParams(
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

    fetchStages(1, word.value);
  });

  const onPageChange = (page: number) => {
    fetchStages(page);
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
    fetchStages(1);
  };

  // Fetch emails on component mount
  onMounted(async () => {
    if (route.query.word) {
      word.value = String(route.query.word);
    }

    await fetchStages(route.query.page ? Number(route.query.page) : 1, word.value);
  });
  const SelectedRow = ref<DeleteAccountsModel[]>([]);
  const setSelectef = (items: DeleteAccountsModel[]) => {
    SelectedRow.value = items;
  };
</script>

<template>
  <div class="deleted-accounts-page">
    <div class="header-container">
      <div class="header-container-text">
        <h5>Students Left the App</h5>
        <p>These students have removed the app, so they are no longer listed here</p>
      </div>
      <DeletedReasonesDialog />
    </div>
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
            placeholder="Search by country name or code…"
            class="search-input"
            type="text"
            @input="Search"
          />
        </div>
      </div>
    </div>

    <!-- ═══ Table ═══ -->
    <DataStatusBuilder :controller="state" :on-retry="async () => await fetchStages()">
      <template #success="{ data }">
        <div class="table-frame">
          <AppTable
            :headers="headers"
            :items="data as DeleteAccountsModel[]"
            selectable
            show-index
            hoverable
            striped
            @selection-change="setSelectef"
          >
            <template #cell-name="{ item }">
              {{ item.name }}
            </template>
            <template #cell-reason="{ item }">
              {{ item.Reason }}
            </template>
            <template #cell-notes="{ item }">
              {{ item.notes }}
            </template>

            <template #actions="{ item }"> </template>
          </AppTable>
        </div>

        <Pagination
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
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <h3>No emails yet</h3>
          <p>Add the first employee email to get started</p>
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
            <span>Add Email</span>
          </router-link>
        </div>
      </template>
    </DataStatusBuilder>
  </div>
</template>

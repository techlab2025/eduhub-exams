<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import { useFormsStore } from '@/stores/formsStore';
  import IndexDocumentParams from '../../core/params/index.document.params';
  import DocumentController from '../controllers/document.controller';
  import DeleteDocumentParams from '../../core/params/delete.document.params';
  import type DocumentModel from '../../core/models/document.model';
  import DeleteDialog from '@/shared/HelpersComponents/dialog/DeleteDialog.vue';

  const DOCUMENT_TYPE_LABELS: Record<number, string> = {
    1: 'Document Type 1',
    2: 'Document Type 2',
    3: 'Document Type 3',
  };

  const controller = DocumentController.getInstance();
  const state = computed(() => controller.listState.value);
  const router = useRouter();
  const route = useRoute();

  const headers: TableHeader[] = [
    { key: 'title', label: 'Title', width: '30%', sortable: true },
    { key: 'documentTypeId', label: 'Document Type', width: '25%' },
    { key: 'subjectId', label: 'Subject ID', width: '20%' },
    { key: 'stageId', label: 'Stage ID', width: '15%' },
  ];

  const perPage = ref(10);
  const word = ref('');

  const fetchDocuments = async (page: number = 1, searchWord: string = '') => {
    await controller.fetchList(
      new IndexDocumentParams(
        searchWord,
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
    fetchDocuments(1, word.value);
  });

  const onPageChange = (page: number) => {
    fetchDocuments(page);
    router.push({
      query: { ...route.query, page: String(page), word: word.value },
    });
  };

  const onPerPageChange = (count: number) => {
    perPage.value = count;
    fetchDocuments(1);
  };

  onMounted(async () => {
    if (route.query.word) {
      word.value = String(route.query.word);
    }
    await fetchDocuments(route.query.page ? Number(route.query.page) : 1, word.value);
  });

  const deleteDocument = async (id: number) => {
    await controller.delete(new DeleteDocumentParams({ document_id: id }));
    await fetchDocuments();
  };

  const FormStore = useFormsStore();
  const formRoute = computed(() => `/${route.params.country_code}/documents/add`);

  const isDraft = computed(() => {
    const data = FormStore?.formData[formRoute.value] ?? {};
    return Object.keys(data).length === 0 || Object.values(data).every((v) => v == null);
  });
</script>

<template>
  <div class="email-page">
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
            :placeholder="$t('search_documents')"
            class="search-input"
            type="text"
            @input="Search"
          />
        </div>
      </div>
      <router-link :to="formRoute" class="btn-add">
        <span>{{ isDraft ? $t('add_document') : $t('continue_adding') }}</span>
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

    <DataStatusBuilder :controller="state" :on-retry="async () => await fetchDocuments()">
      <template #success="{ data }">
        <div class="table-frame">
          <AppTable
            :headers="headers"
            :items="data as DocumentModel[]"
            selectable
            show-index
            hoverable
            striped
          >
            <template #cell-documentTypeId="{ item }">
              {{ DOCUMENT_TYPE_LABELS[item.documentTypeId] ?? item.documentTypeId }}
            </template>
            <template #actions="{ item }">
              <div class="row-actions">
                <router-link
                  class="action-btn edit"
                  :to="`/documents/edit/${item.id}`"
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </router-link>
                <DeleteDialog @delete="deleteDocument(item.id!)">
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h3>{{ $t('no_documents_yet') }}</h3>
          <p>{{ $t('add_first_document') }}</p>
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
            <span>{{ $t('add_document') }}</span>
          </router-link>
        </div>
      </template>
    </DataStatusBuilder>
  </div>
</template>

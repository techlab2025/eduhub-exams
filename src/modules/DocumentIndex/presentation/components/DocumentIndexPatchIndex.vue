<script setup lang="ts">
  import { computed, onMounted, ref, shallowRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import PlanViewIcon from '@/shared/icons/Plan/PlanViewIcon.vue';
  import RefreshIcon from '@/shared/icons/Question/reloadIcon.vue';
  import {
    DocumentIndexPatchStatusEnum,
    type DocumentIndexPatchStatusEnum as DocumentIndexPatchStatus,
  } from '../../core/constant/document.index.patch.status.enum';
  import type DocumentIndexPatchModel from '../../core/models/document.index.patch.model';
  import type DocumentIndexStatusModel from '../../core/models/document.index.status.model';
  import type GeneratedDocumentIndexModel from '../../core/models/generated.document.index.model';
  import IndexDocumentIndexPatchParams from '../../core/params/index.document.index.patch.params';
  import RefreshDocumentIndexStatusParams from '../../core/params/refresh.document.index.status.params';
  import DocumentIndexPatchController from '../controllers/document.index.patch.controller';
  import DocumentIndexProgressController from '../controllers/document.index.progress.controller';
  import GeneratedDocumentIndexDialog from './GeneratedDocumentIndexDialog.vue';

  const { t, locale } = useI18n();
  const controller = DocumentIndexPatchController.getInstance();
  const progressController = DocumentIndexProgressController.getInstance();
  const state = computed(() => controller.listState.value);
  const currentPage = ref(1);
  const perPage = ref(10);
  const word = ref('');
  const refreshingTransactionId = ref<string>();
  const checkedStatuses = ref<Record<string, DocumentIndexStatusModel>>({});
  const generatedDialogVisible = ref(false);
  const activeDocumentId = ref(0);
  const generatedIndex = shallowRef<GeneratedDocumentIndexModel | null>(null);

  const headers = computed<TableHeader[]>(() => [
    { key: 'transactionId', label: t('document_index.transaction_id'), width: '10%' },
    { key: 'educationType', label: t('document_index.education_type_column'), width: '11%' },
    { key: 'subject', label: t('document_index.subject_column'), width: '9%' },
    {
      key: 'subjectConfiguration',
      label: t('document_index.subject_configuration_name'),
      width: '15%',
    },
    { key: 'documentTitle', label: t('document_index.document_title'), width: '15%' },
    { key: 'createdBy', label: t('document_index.created_by'), width: '12%' },
    { key: 'createdAt', label: t('document_index.created_at'), width: '11%' },
    { key: 'status', label: t('document_index.status'), width: '9%' },
    { key: 'applied', label: t('document_index.applied'), width: '8%', align: 'center' },
  ]);

  const fetchPatches = async (page = currentPage.value) => {
    currentPage.value = page;
    await controller.fetchList(
      new IndexDocumentIndexPatchParams(page, perPage.value, 1, word.value.trim()),
    );
  };

  const searchTransactions = debounce(() => void fetchPatches(1), 400);

  const rowStatus = (patch: DocumentIndexPatchModel): DocumentIndexPatchStatus =>
    checkedStatuses.value[patch.transactionId]?.status ?? patch.status;

  const rowIsApply = (patch: DocumentIndexPatchModel): boolean =>
    checkedStatuses.value[patch.transactionId]?.isApply ?? patch.isApply;

  const statusLabel = (status: DocumentIndexPatchStatus): string => {
    if (status === DocumentIndexPatchStatusEnum.COMPLETE) {
      return t('document_index.status_success');
    }
    if (status === DocumentIndexPatchStatusEnum.FAILED) {
      return t('document_index.status_failed');
    }
    return t('document_index.status_pending');
  };

  const formatDate = (value: string): string => {
    if (!value) return '-';
    const date = new Date(value.includes(' ') ? value.replace(' ', 'T') : value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale.value, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
      .format(date)
      .replace(/\//g, '-');
  };

  const displayValue = (value: string): string => value || '-';

  const appliedLabel = (patch: DocumentIndexPatchModel): string => {
    if (rowStatus(patch) !== DocumentIndexPatchStatusEnum.COMPLETE) return '-';
    return rowIsApply(patch) ? t('document_index.yes') : t('document_index.no');
  };

  const viewGeneratedIndex = (patch: DocumentIndexPatchModel) => {
    activeDocumentId.value = patch.documentId;
    generatedIndex.value =
      checkedStatuses.value[patch.transactionId]?.generatedIndex ?? patch.generatedIndex;
    generatedDialogVisible.value = true;
  };

  const viewProgress = () => progressController.openProgress();

  const refreshStatus = async (patch: DocumentIndexPatchModel) => {
    if (refreshingTransactionId.value != null) return;

    refreshingTransactionId.value = patch.transactionId;
    try {
      const result = await controller.refreshStatus(
        new RefreshDocumentIndexStatusParams(patch.transactionId),
      );
      if (!(result instanceof DataSuccess)) return;
      if (result.data) {
        checkedStatuses.value = {
          ...checkedStatuses.value,
          [patch.transactionId]: result.data,
        };
      }
      await fetchPatches();
    } finally {
      refreshingTransactionId.value = undefined;
    }
  };

  const hasRowAction = (patch: DocumentIndexPatchModel): boolean => {
    return rowStatus(patch) !== DocumentIndexPatchStatusEnum.FAILED;
  };

  const actionList = (patch: DocumentIndexPatchModel) => {
    const status = rowStatus(patch);
    const isApplied = rowIsApply(patch);

    if (status === DocumentIndexPatchStatusEnum.IN_PROGRESS) {
      return [
        {
          text: t('document_index.view_progress'),
          icon: PlanViewIcon,
          action: viewProgress,
          skipDeleteConfirmation: true,
        },
      ];
    }

    if (isApplied) {
      return [
        {
          text: t('view'),
          icon: PlanViewIcon,
          action: () => viewGeneratedIndex(patch),
          skipDeleteConfirmation: true,
        },
      ];
    }

    return [
      {
        text:
          refreshingTransactionId.value === patch.transactionId
            ? t('document_index.refreshing_status')
            : t('document_index.refresh'),
        icon: RefreshIcon,
        action: () => void refreshStatus(patch),
        skipDeleteConfirmation: true,
      },
    ];
  };

  const changePage = (page: number) => void fetchPatches(page);
  const changePerPage = (count: number) => {
    perPage.value = count;
    void fetchPatches(1);
  };
  const refreshAfterSave = () => void fetchPatches();

  onMounted(() => fetchPatches());
</script>

<template>
  <main class="document-index-patch-page">
    <header class="document-index-patch-page__heading">
      <h1>{{ t('document_index.patches_title') }}</h1>
    </header>

    <div class="document-index-patch-page__search-field">
      <IndexSearchIcon aria-hidden="true" />
      <input
        v-model="word"
        type="search"
        :placeholder="t('document_index.transaction_search_placeholder')"
        :aria-label="t('document_index.transaction_search_placeholder')"
        @input="searchTransactions"
      />
    </div>

    <DataStatusBuilder :controller="state" :on-retry="() => fetchPatches()">
      <template #success="{ data }">
        <div
          class="document-index-patch-page__table"
          role="region"
          tabindex="0"
          :aria-label="t('document_index.patches_title')"
        >
          <AppTable
            :headers="headers"
            :items="(data ?? []) as DocumentIndexPatchModel[]"
            row-key="transactionId"
            hoverable
            :empty-message="t('document_index.no_patches')"
          >
            <template #cell-educationType="{ item }">
              {{ displayValue(item.educationType) }}
            </template>
            <template #cell-subject="{ item }">
              {{ displayValue(item.subject) }}
            </template>
            <template #cell-subjectConfiguration="{ item }">
              {{ displayValue(item.subjectConfiguration) }}
            </template>
            <template #cell-documentTitle="{ item }">
              {{ displayValue(item.documentTitle) }}
            </template>
            <template #cell-createdBy="{ item }">
              {{ displayValue(item.createdBy) }}
            </template>
            <template #cell-createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>
            <template #cell-status="{ item }">
              <span class="document-index-patch-page__status" :data-status="rowStatus(item)">
                {{ statusLabel(rowStatus(item)) }}
              </span>
            </template>
            <template #cell-applied="{ item }">
              {{ appliedLabel(item) }}
            </template>
            <template #actions="{ item }">
              <span v-if="!hasRowAction(item)" class="document-index-patch-page__unavailable">
                -
              </span>
              <div
                v-else
                class="document-index-patch-page__actions"
                :data-transaction-id="item.transactionId"
              >
                <DropList :action-list="actionList(item)" />
              </div>
            </template>
          </AppTable>
        </div>
        <Pagination
          v-if="controller.pagination.value"
          :pagination="controller.pagination.value"
          @change-page="changePage"
          @count-per-page="changePerPage"
        />
      </template>
      <template #empty>
        <div class="document-index-patch-page__empty">
          <h2>{{ t('document_index.no_patches') }}</h2>
          <p>{{ t('document_index.no_patches_description') }}</p>
        </div>
      </template>
      <template #loader>
        <TableSkelaton :rows="5" :columns="headers.length" />
      </template>
      <template #failed>
        <div class="document-index-patch-page__empty" role="alert">
          <h2>{{ t('document_index.patch_load_failed') }}</h2>
          <button type="button" class="document-index-patch-page__action" @click="fetchPatches()">
            {{ t('document_index.try_again') }}
          </button>
        </div>
      </template>
    </DataStatusBuilder>

    <GeneratedDocumentIndexDialog
      v-model:visible="generatedDialogVisible"
      :document-id="activeDocumentId"
      :generated-index="generatedIndex"
      @saved="refreshAfterSave"
    />
  </main>
</template>

<style scoped lang="scss">
  @use '../styles/document_index_patch';
</style>

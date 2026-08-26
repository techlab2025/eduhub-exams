<script setup lang="ts">
  import { computed, onMounted, ref, shallowRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  import {
    DocumentIndexPatchStatusEnum,
    type DocumentIndexPatchStatusEnum as DocumentIndexPatchStatus,
  } from '../../core/constant/document.index.patch.status.enum';
  import type DocumentIndexPatchModel from '../../core/models/document.index.patch.model';
  import type DocumentIndexStatusModel from '../../core/models/document.index.status.model';
  import type GeneratedDocumentIndexModel from '../../core/models/generated.document.index.model';
  import CheckDocumentIndexStatusParams from '../../core/params/check.document.index.status.params';
  import GenerateDocumentIndexParams from '../../core/params/generate.document.index.params';
  import IndexDocumentIndexPatchParams from '../../core/params/index.document.index.patch.params';
  import DocumentIndexPatchController from '../controllers/document.index.patch.controller';
  import GeneratedDocumentIndexDialog from './GeneratedDocumentIndexDialog.vue';

  const { t, locale } = useI18n();
  const controller = DocumentIndexPatchController.getInstance();
  const state = computed(() => controller.listState.value);
  const currentPage = ref(1);
  const perPage = ref(10);
  const checkingPatchId = ref<number>();
  const restartingPatchId = ref<number>();
  const checkedStatuses = ref<Record<number, DocumentIndexStatusModel>>({});
  const generatedDialogVisible = ref(false);
  const activeDocumentId = ref(0);
  const generatedIndex = shallowRef<GeneratedDocumentIndexModel | null>(null);

  const headers = computed<TableHeader[]>(() => [
    { key: 'id', label: t('document_index.patch_id'), width: '10%' },
    { key: 'employee', label: t('document_index.employee'), width: '20%' },
    { key: 'createdBy', label: t('document_index.created_by'), width: '20%' },
    { key: 'createdAt', label: t('document_index.date'), width: '20%' },
    { key: 'status', label: t('document_index.status'), width: '15%' },
    { key: 'action', label: t('document_index.action'), width: '15%', align: 'center' },
  ]);

  const fetchPatches = async (page = currentPage.value) => {
    currentPage.value = page;
    await controller.fetchList(new IndexDocumentIndexPatchParams(page, perPage.value, 1));
  };

  const rowStatus = (patch: DocumentIndexPatchModel): DocumentIndexPatchStatus =>
    checkedStatuses.value[patch.id]?.status ?? patch.status;

  const rowIsApply = (patch: DocumentIndexPatchModel): boolean =>
    checkedStatuses.value[patch.id]?.isApply ?? patch.isApply;

  const statusLabel = (status: DocumentIndexPatchStatus): string => {
    if (status === DocumentIndexPatchStatusEnum.COMPLETE) {
      return t('document_index.status_complete');
    }
    if (status === DocumentIndexPatchStatusEnum.FAILED) {
      return t('document_index.status_failed');
    }
    return t('document_index.status_in_progress');
  };

  const formatDate = (value: string): string => {
    if (!value) return t('document_index.not_available');
    const date = new Date(value.includes(' ') ? value.replace(' ', 'T') : value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale.value, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const canRestart = (patch: DocumentIndexPatchModel): boolean =>
    rowStatus(patch) === DocumentIndexPatchStatusEnum.FAILED && !rowIsApply(patch);

  const checkStatus = async (patch: DocumentIndexPatchModel) => {
    if (checkingPatchId.value != null || restartingPatchId.value != null) return;

    checkingPatchId.value = patch.id;
    const result = await controller.checkStatus(new CheckDocumentIndexStatusParams(patch.id));
    checkingPatchId.value = undefined;

    if (!(result instanceof DataSuccess) || !result.data) return;
    checkedStatuses.value = { ...checkedStatuses.value, [patch.id]: result.data };

    if (result.data.status === DocumentIndexPatchStatusEnum.COMPLETE && result.data.isApply) {
      activeDocumentId.value = result.data.documentId || patch.documentId;
      generatedIndex.value = result.data.generatedIndex;
      generatedDialogVisible.value = true;
    }
  };

  const restart = async (patch: DocumentIndexPatchModel) => {
    if (!patch.documentId || checkingPatchId.value != null || restartingPatchId.value != null) {
      return;
    }

    restartingPatchId.value = patch.id;
    const result = await controller.startIndex(new GenerateDocumentIndexParams(patch.documentId));
    restartingPatchId.value = undefined;

    if (!(result instanceof DataSuccess)) return;
    const nextStatuses = { ...checkedStatuses.value };
    delete nextStatuses[patch.id];
    checkedStatuses.value = nextStatuses;
    dialogManager.toastSuccess(t('document_index.restarted_successfully'));
    await fetchPatches();
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
      <p>{{ t('document_index.patches_description') }}</p>
    </header>

    <DataStatusBuilder :controller="state" :on-retry="() => fetchPatches()">
      <template #success="{ data }">
        <div class="document-index-patch-page__table">
          <AppTable
            :headers="headers"
            :items="(data ?? []) as DocumentIndexPatchModel[]"
            row-key="id"
            hoverable
            :empty-message="t('document_index.no_patches')"
          >
            <template #cell-createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>
            <template #cell-status="{ item }">
              <span class="document-index-patch-page__status" :data-status="rowStatus(item)">
                {{ statusLabel(rowStatus(item)) }}
              </span>
            </template>
            <template #cell-action="{ item }">
              <!-- v-if="canRestart(item)" -->
              <button
                class="document-index-patch-page__action document-index-patch-page__action--restart"
                type="button"
                :data-patch-id="item.id"
                :disabled="restartingPatchId === item.id"
                @click="restart(item)"
              >
                {{
                  restartingPatchId === item.id
                    ? t('document_index.restarting')
                    : t('document_index.restart')
                }}
              </button>
              <!-- v-else -->
              <button
                class="document-index-patch-page__action"
                type="button"
                :data-patch-id="item.id"
                :disabled="checkingPatchId === item.id"
                @click="checkStatus(item)"
              >
                {{
                  checkingPatchId === item.id
                    ? t('document_index.checking_status')
                    : t('document_index.check_status')
                }}
              </button>
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

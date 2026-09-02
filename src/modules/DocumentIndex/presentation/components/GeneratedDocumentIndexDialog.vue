<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import { useI18n } from 'vue-i18n';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  import { getDocumentIndexLevelKey } from '../../core/constant/DocumentIndexLevel.enum';
  import {
    copyEditableDocumentIndexItems,
    type EditableDocumentIndexItem,
  } from '../../core/models/editable.document.index.item.model';
  import type GeneratedDocumentIndexModel from '../../core/models/generated.document.index.model';
  import SaveDocumentIndexParams from '../../core/params/save.document.index.params';
  import UpdateDocumentIndexParams from '../../core/params/update.document.index.params';
  import DocumentIndexController from '../controllers/document.index.controller';

  const props = defineProps<{
    documentId: number;
    transactionId: string;
    generatedIndex: GeneratedDocumentIndexModel | null;
  }>();
  const visible = defineModel<boolean>('visible', { required: true });
  const emit = defineEmits<{
    saved: [payload: { documentId: number; items: EditableDocumentIndexItem[] }];
  }>();

  const { t } = useI18n();
  const controller = DocumentIndexController.getInstance();
  const items = ref<EditableDocumentIndexItem[]>([]);
  const originalItems = ref<EditableDocumentIndexItem[]>([]);
  const isEditing = ref(false);
  const isUpdating = ref(false);
  const isSaving = ref(false);

  const resetItems = () => {
    items.value = copyEditableDocumentIndexItems(props.generatedIndex?.editableItems ?? []);
    originalItems.value = copyEditableDocumentIndexItems(items.value);
    isEditing.value = false;
  };

  watch(
    [visible, () => props.generatedIndex],
    ([isVisible]) => {
      if (isVisible) resetItems();
    },
    { immediate: true },
  );

  const close = () => {
    visible.value = false;
    isEditing.value = false;
  };

  const startEditing = () => {
    originalItems.value = copyEditableDocumentIndexItems(items.value);
    isEditing.value = true;
  };

  const cancelEditing = () => {
    items.value = copyEditableDocumentIndexItems(originalItems.value);
    isEditing.value = false;
  };

  const updateIndex = async () => {
    if (!props.transactionId) return;

    isUpdating.value = true;
    const result = await controller.updateIndex(
      new UpdateDocumentIndexParams(props.transactionId, items.value),
    );
    isUpdating.value = false;

    if (!(result instanceof DataSuccess) || !result.data) return;
    items.value = copyEditableDocumentIndexItems(result.data.editableItems);
    originalItems.value = copyEditableDocumentIndexItems(items.value);
    isEditing.value = false;
    dialogManager.toastSuccess(t('document_index.updated_successfully'));
  };

  const saveIndex = async () => {
    if (!props.documentId || !props.transactionId || isEditing.value) return;

    isSaving.value = true;
    const result = await controller.saveIndex(
      new SaveDocumentIndexParams(props.transactionId, items.value),
    );
    isSaving.value = false;

    if (!(result instanceof DataSuccess)) return;
    emit('saved', {
      documentId: props.documentId,
      items: copyEditableDocumentIndexItems(items.value),
    });
    dialogManager.toastSuccess(t('document_index.saved_successfully'));
    close();
  };

  const levelKey = (level: EditableDocumentIndexItem['level']) => getDocumentIndexLevelKey(level);
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :show-header="false"
    :dismissable-mask="false"
    :pt="{
      root: 'document-index-generated-dialog',
      content: 'document-index-generated-dialog__content',
    }"
    @hide="close"
  >
    <section class="document-index-generated" aria-labelledby="generated-document-index-title">
      <header class="document-index-generated__header">
        <div>
          <h2 id="generated-document-index-title">
            {{ t('document_index.generated_title') }}
          </h2>
          <p>{{ t('document_index.generated_description') }}</p>
        </div>
        <button
          class="document-index-generated__close"
          type="button"
          :aria-label="t('document_index.close')"
          @click="close"
        >
          ×
        </button>
      </header>

      <div class="document-index-generated__table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ t('document_index.level') }}</th>
              <th>{{ t('document_index.index_title') }}</th>
              <th>{{ t('document_index.from_pdf') }}</th>
              <th>{{ t('document_index.to_pdf') }}</th>
              <th>{{ t('document_index.printed_page_label') }}</th>
              <!-- <th>{{ t('document_index.needs_admin_review') }}</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <span
                  class="document-index-generated__level"
                  :style="{ paddingInlineStart: `${(item.depth ?? 0) * 12}px` }"
                >
                  {{ item.levelLabel || t(`document_index.levels.${levelKey(item.level)}`) }}
                </span>
              </td>
              <td>
                <input
                  v-if="isEditing"
                  v-model.trim="item.title"
                  type="text"
                  :aria-label="t('document_index.index_title')"
                />
                <span v-else>{{ item.title }}</span>
              </td>
              <td>
                <input
                  v-if="isEditing"
                  v-model.number="item.fromPdf"
                  type="number"
                  min="1"
                  :aria-label="t('document_index.from_pdf')"
                />
                <span v-else>{{ item.fromPdf }}</span>
              </td>
              <td>
                <input
                  v-if="isEditing"
                  v-model.number="item.toPdf"
                  type="number"
                  min="1"
                  :aria-label="t('document_index.to_pdf')"
                />
                <span v-else>{{ item.toPdf }}</span>
              </td>
              <td>
                <input
                  v-if="isEditing"
                  v-model.trim="item.printedPageLabel"
                  type="text"
                  :aria-label="t('document_index.printed_page_label')"
                />
                <span v-else>{{ item.printedPageLabel }}</span>
              </td>
              <!-- <td>
                <span v-if="item.needsAdminReview" class="document-index-generated__review">
                  {{ t('document_index.needs_review') }}
                </span>
                <span v-else>{{ t('document_index.no_review') }}</span>
              </td> -->
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="6" class="document-index-generated__empty">
                {{ t('document_index.no_generated_items') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- <footer class="document-index-generated__actions">
        <button
          v-if="isEditing"
          class="document-index-generated__secondary-action document-index-generated__secondary-action--cancel"
          type="button"
          :disabled="isUpdating"
          @click="cancelEditing"
        >
          {{ t('document_index.cancel_edit') }}
        </button>
        <button
          v-else
          class="document-index-generated__secondary-action"
          type="button"
          :disabled="isSaving"
          @click="startEditing"
        >
          {{ t('document_index.edit_index') }}
        </button>
        <button
          v-if="isEditing"
          class="document-index-generated__save-action"
          type="button"
          :disabled="isUpdating"
          @click="updateIndex"
        >
          {{ isUpdating ? t('document_index.updating_index') : t('document_index.update_index') }}
        </button>
        <button
          v-else
          class="document-index-generated__save-action"
          type="button"
          :disabled="isSaving"
          @click="saveIndex"
        >
          {{ isSaving ? t('document_index.saving_index') : t('document_index.save_index') }}
        </button>
      </footer> -->
    </section>
  </Dialog>
</template>

<style scoped lang="scss">
  @use '../styles/document_index';
</style>

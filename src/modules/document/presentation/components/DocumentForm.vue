<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { onBeforeRouteLeave, useRoute } from 'vue-router';
  import { useFormsStore } from '@/stores/formsStore';
  import type DocumentModel from '../../core/models/document.model';
  import AddDocumentParams from '../../core/params/add.document.params';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import TitleInterface from '@/base/Data/Models/titleInterface';

  const emit = defineEmits(['updateData']);

  const { document, formKey } = defineProps<{
    document?: DocumentModel;
    formKey?: string;
  }>();

  const FormStore = useFormsStore();
  onBeforeRouteLeave((to, from) => {
    const savedData = FormStore.getFormData(formKey!);
    if (savedData && to.path !== from.path) {
      FormStore.showReturnWarning(formKey!);
    }
  });

  const documentTypeOptions: TitleInterface<number>[] = [
    new TitleInterface({ id: 1, title: 'Document Type 1' }),
    new TitleInterface({ id: 2, title: 'Document Type 2' }),
    new TitleInterface({ id: 3, title: 'Document Type 3' }),
  ];

  // Form state
  const title = ref<string>('');
  const subjectId = ref<number>(0);
  const stageId = ref<number>(0);
  const unitIds = ref<number[]>([]);
  const isAllUnits = ref<boolean>(false);
  const selectedDocumentType = ref<TitleInterface<number> | null>(null);

  watch(
    () => document,
    (newDoc) => {
      if (newDoc) {
        title.value = newDoc.title;
        subjectId.value = newDoc.subjectId;
        stageId.value = newDoc.stageId;
        unitIds.value = newDoc.unitIds;
        isAllUnits.value = newDoc.isAllUnits;
        selectedDocumentType.value =
          documentTypeOptions.find((o) => o.id === newDoc.documentTypeId) ?? null;
      }
    },
    { immediate: true },
  );

  const route = useRoute();

  const updateData = () => {
    FormStore.setFormData(formKey!, {
      title: title.value,
      subjectId: subjectId.value,
      stageId: stageId.value,
      unitIds: unitIds.value,
      isAllUnits: isAllUnits.value,
      documentTypeId: selectedDocumentType.value?.id ?? 0,
    });

    const params = new AddDocumentParams({
      title: title.value,
      subject_id: subjectId.value,
      stage_id: stageId.value,
      unit_ids: unitIds.value,
      document_type_id: selectedDocumentType.value?.id ?? 0,
      isAllUnits: isAllUnits.value,
    });
    emit('updateData', params);
  };

  const resetForm = () => {
    title.value = '';
    subjectId.value = 0;
    stageId.value = 0;
    unitIds.value = [];
    isAllUnits.value = false;
    selectedDocumentType.value = null;
  };

  onMounted(() => {
    const saved = FormStore.getFormData(formKey!);
    if (saved) {
      title.value = saved.title ?? '';
      subjectId.value = saved.subjectId ?? 0;
      stageId.value = saved.stageId ?? 0;
      unitIds.value = saved.unitIds ?? [];
      isAllUnits.value = saved.isAllUnits ?? false;
      selectedDocumentType.value =
        documentTypeOptions.find((o) => o.id === saved.documentTypeId) ?? null;
      updateData();
    } else {
      resetForm();
    }
  });
</script>

<template>
  <div class="email-form-card">
    <!-- ── Card Header ───────────────────────────────────── -->
    <header class="form-header">
      <div class="header-text">
        <h3>{{ route.params.id ? $t('edit_document') : $t('add_document') }}</h3>
        <p class="header-subtitle">
          {{ route.params.id ? $t('update_document_details') : $t('fill_document_details') }}
        </p>
      </div>
      <span v-if="route.params.id" class="edit-badge">{{ $t('editing') }}</span>
    </header>

    <!-- ── Divider ───────────────────────────────────────── -->
    <div class="form-divider" />

    <!-- ── Fields ────────────────────────────────────────── -->
    <div class="form-fields">
      <!-- Title -->
      <div class="field-group">
        <label class="field-label" for="doc-title">{{ $t('title') }}</label>
        <div class="input-wrap">
          <input
            id="doc-title"
            v-model="title"
            type="text"
            :placeholder="$t('document_title_placeholder')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <!-- Subject ID -->
      <div class="field-group">
        <label class="field-label" for="doc-subject">{{ $t('subject_id') }}</label>
        <div class="input-wrap">
          <input
            id="doc-subject"
            v-model.number="subjectId"
            type="number"
            :placeholder="$t('subject_id_placeholder')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <!-- Stage ID -->
      <div class="field-group">
        <label class="field-label" for="doc-stage">{{ $t('stage_id') }}</label>
        <div class="input-wrap">
          <input
            id="doc-stage"
            v-model.number="stageId"
            type="number"
            :placeholder="$t('stage_id_placeholder')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <!-- Document Type — static select via UpdatedCustomInputSelect -->
      <div class="field-group">
        <UpdatedCustomInputSelect
          id="doc-type-select"
          v-model="selectedDocumentType"
          :static-options="documentTypeOptions"
          :placeholder="$t('select_document_type')"
          label="document_type"
          :reload="false"
          required
          @update:model-value="updateData"
        />
      </div>

      <!-- Is All Units -->
      <div class="field-group checkbox-group">
        <label class="field-label checkbox-label">
          <input v-model="isAllUnits" type="checkbox" class="checkbox-input" @change="updateData" />
          {{ $t('is_all_units') }}
        </label>
      </div>
    </div>
  </div>
</template>

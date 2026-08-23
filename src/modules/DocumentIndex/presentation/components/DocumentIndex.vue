<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Dialog from 'primevue/dialog';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import StageController from '@/modules/Stages/presentation/controllers/stage.controller';
  import IndexStageParams from '@/modules/Stages/core/params/index.stage.params';
  import type StageModel from '@/modules/Stages/core/models/stage.model';
  import DocumentController from '@/modules/document/presentation/controllers/document.controller';
  import type DocumentModel from '@/modules/document/core/models/document.model';
  import GenerateDocumentIndexParams from '../../core/params/generate.document.index.params';
  import type { EditableDocumentIndexItem } from '../../core/models/editable.document.index.item.model';
  import type GeneratedDocumentIndexModel from '../../core/models/generated.document.index.model';
  import DocumentIndexController from '../controllers/document.index.controller';
  import {
    createSubjectOptions,
    findBranchById,
    findSubjectById,
    flattenLeafBranchOptions,
    flattenSubjectConfigurationOptions,
    type CurriculumBranchNode,
    type CurriculumSubjectNode,
  } from '../../core/utils/curriculum.options';
  import IndexDocumentParams from '@/modules/document/core/params/index.document.params';

  const emit = defineEmits<{
    saveIndex: [payload: { documentId: number; items: EditableDocumentIndexItem[] }];
  }>();

  const { t } = useI18n();
  const stageController = StageController.getInstance();
  const documentController = DocumentController.getInstance();
  const documentIndexController = DocumentIndexController.getInstance();
  const stageParams = new IndexStageParams('', 1, 100, 0);

  const curriculums = shallowRef<StageModel[]>([]);
  const selectedEducationType = ref<TitleInterface<number> | null>(null);
  const selectedEducationConfiguration = ref<TitleInterface<number> | null>(null);
  const selectedSubject = ref<TitleInterface<number> | null>(null);
  const selectedSubjectConfiguration = ref<TitleInterface<number> | null>(null);
  const submitted = ref(false);
  const resultsRequested = ref(false);
  const generationDialogVisible = ref(false);
  const generatedDialogVisible = ref(false);
  const isEditingGeneratedIndex = ref(false);
  const activeDocumentId = ref<number>();
  const generatedIndexItems = ref<EditableDocumentIndexItem[]>([]);
  const originalGeneratedIndexItems = ref<EditableDocumentIndexItem[]>([]);
  let generationAbortController: AbortController | null = null;

  const educationTypeOptions = computed(() =>
    curriculums.value.flatMap((stage) =>
      stage.id == null ? [] : [new TitleInterface<number>({ id: stage.id, title: stage.title })],
    ),
  );

  const selectedCurriculum = computed(() =>
    curriculums.value.find((stage) => stage.id === selectedEducationType.value?.id),
  );

  const selectedCurriculumBranches = computed(
    () => (selectedCurriculum.value?.branches ?? []) as CurriculumBranchNode[],
  );

  const educationConfigurationOptions = computed(() =>
    flattenLeafBranchOptions(selectedCurriculumBranches.value),
  );

  const selectedBranch = computed(() =>
    findBranchById(selectedCurriculumBranches.value, selectedEducationConfiguration.value?.id),
  );

  const branchSubjects = computed(
    () => (selectedBranch.value?.subjects ?? []) as CurriculumSubjectNode[],
  );

  const subjectOptions = computed(() => createSubjectOptions(branchSubjects.value));

  const selectedSubjectNode = computed(() =>
    findSubjectById(branchSubjects.value, selectedSubject.value?.id),
  );

  const subjectConfigurationOptions = computed(() =>
    flattenSubjectConfigurationOptions(selectedSubjectNode.value),
  );

  const documents = computed(() => documentController.listData.value ?? []);
  const isLoading = computed(() => documentController.isListLoading());
  const isFailed = computed(() => documentController.isListFailed());
  const isReadyToSearch = computed(
    () =>
      Boolean(selectedEducationType.value?.id) &&
      Boolean(selectedEducationConfiguration.value?.id) &&
      Boolean(selectedSubject.value?.id),
  );

  const fetchStages = async () => {
    await stageController.fetchList(stageParams);
    curriculums.value = (stageController.listData.value ?? []) as StageModel[];
  };

  const clearResults = () => {
    submitted.value = false;
    resultsRequested.value = false;
  };

  const selectEducationType = (value: TitleInterface<number> | null | undefined) => {
    selectedEducationType.value = value ?? null;
    selectedEducationConfiguration.value = null;
    selectedSubject.value = null;
    selectedSubjectConfiguration.value = null;
    clearResults();
  };

  const selectEducationConfiguration = (value: TitleInterface<number> | null | undefined) => {
    selectedEducationConfiguration.value = value ?? null;
    selectedSubject.value = null;
    selectedSubjectConfiguration.value = null;
    clearResults();
  };

  const selectSubject = (value: TitleInterface<number> | null | undefined) => {
    selectedSubject.value = value ?? null;
    selectedSubjectConfiguration.value = null;
    clearResults();
  };

  const selectSubjectConfiguration = (value: TitleInterface<number> | null | undefined) => {
    selectedSubjectConfiguration.value = value ?? null;
    clearResults();
  };

  const showResults = async () => {
    submitted.value = true;
    if (!isReadyToSearch.value) return;

    const subjectId = selectedSubject.value?.id;
    if (subjectId == null) return;

    resultsRequested.value = true;
    await documentController.fetchList(
      new IndexDocumentParams(
        '',
        1,
        10,
        0,
        '',
        undefined,
        selectedSubjectConfiguration.value ? subjectId : undefined,
        selectedSubjectConfiguration.value?.id,
      ),
    );
  };

  const localizedText = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      const translated = value.find(
        (item) => item && typeof item === 'object' && item.locale === 'en',
      );
      if (translated && typeof translated === 'object') {
        const translation = translated as Record<string, unknown>;
        return String(translation.description ?? translation.title ?? '');
      }
    }
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      return String(record.en ?? record.ar ?? '');
    }
    return '';
  };

  const documentDescription = (document: DocumentModel): string =>
    localizedText(document.description ?? document.tranaslations?.description);

  const documentImage = (document: DocumentModel): string => document.image ?? '';
  const documentSourceFile = (document: DocumentModel): string => document.file ?? '';
  const documentIndexFile = (document: DocumentModel): string => document.indexFile ?? '';
  const hasDocumentIndex = (document: DocumentModel): boolean => document.hasIndex;

  const fileName = (file: string): string => {
    if (!file) return '';
    const cleanFile = file.split('?')[0] ?? '';
    return decodeURIComponent(cleanFile.split('/').pop() ?? cleanFile);
  };

  const openFile = (file: string) => {
    if (file) window.open(file, '_blank', 'noopener,noreferrer');
  };

  const copyIndexItems = (items: EditableDocumentIndexItem[]): EditableDocumentIndexItem[] =>
    items.map((item) => ({ ...item }));

  const generateDocumentIndex = async (document: DocumentModel) => {
    if (document.id == null || generationDialogVisible.value) return;

    const requestController = new AbortController();
    generationAbortController = requestController;
    activeDocumentId.value = document.id;
    generatedDialogVisible.value = false;
    generationDialogVisible.value = true;

    const result = await documentIndexController.generateIndex(
      new GenerateDocumentIndexParams(document.id),
      {
        signal: requestController.signal,
        useStaticData: true,
      },
    );

    if (generationAbortController !== requestController) return;

    generationAbortController = null;
    generationDialogVisible.value = false;

    if (result instanceof DataSuccess && result.data) {
      const generatedIndex = result.data as GeneratedDocumentIndexModel;
      const items = generatedIndex.items.map((item) => ({ ...item }));
      generatedIndexItems.value = copyIndexItems(items);
      originalGeneratedIndexItems.value = copyIndexItems(items);
      activeDocumentId.value = generatedIndex.documentId ?? document.id;
      isEditingGeneratedIndex.value = false;
      generatedDialogVisible.value = true;
    }
  };

  const cancelGeneration = () => {
    generationAbortController?.abort();
    generationAbortController = null;
    generationDialogVisible.value = false;
  };

  const startEditingGeneratedIndex = () => {
    originalGeneratedIndexItems.value = copyIndexItems(generatedIndexItems.value);
    isEditingGeneratedIndex.value = true;
  };

  const cancelGeneratedIndexEdit = () => {
    generatedIndexItems.value = copyIndexItems(originalGeneratedIndexItems.value);
    isEditingGeneratedIndex.value = false;
  };

  const saveGeneratedIndex = () => {
    if (activeDocumentId.value == null) return;

    emit('saveIndex', {
      documentId: activeDocumentId.value,
      items: copyIndexItems(generatedIndexItems.value),
    });
    originalGeneratedIndexItems.value = copyIndexItems(generatedIndexItems.value);
    isEditingGeneratedIndex.value = false;
  };

  const closeGeneratedIndex = () => {
    generatedDialogVisible.value = false;
    isEditingGeneratedIndex.value = false;
  };

  const levelClass = (level: string): string => {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel === 'chapter') return 'document-index-generated__level--chapter';
    if (normalizedLevel === 'lesson') return 'document-index-generated__level--lesson';
    return '';
  };

  onMounted(fetchStages);
  onBeforeUnmount(cancelGeneration);
</script>

<template>
  <main class="document-index-page">
    <header class="document-index-page__heading">
      <h1>{{ t('document_index.title') }}</h1>
      <p>{{ t('document_index.description') }}</p>
    </header>

    <section class="document-index-page__card" aria-labelledby="document-index-curriculum">
      <h2 id="document-index-curriculum" class="document-index-page__section-title">
        {{ t('document_index.select_curriculum') }}
      </h2>

      <div class="document-index-page__fields">
        <div>
          <UpdatedCustomInputSelect
            id="document-index-education-type"
            :model-value="selectedEducationType"
            :label="t('document_index.education_type')"
            :placeholder="t('document_index.select_education_type')"
            :static-options="educationTypeOptions"
            :required="true"
            :reload="true"
            @update:model-value="selectEducationType($event as TitleInterface<number> | null)"
            @reload="fetchStages"
          />
          <small
            v-if="submitted && !selectedEducationType"
            class="document-index-page__field-error"
          >
            {{ t('document_index.required_field') }}
          </small>
        </div>

        <div>
          <UpdatedCustomInputSelect
            id="document-index-education-configuration"
            :model-value="selectedEducationConfiguration"
            :label="t('document_index.education_configuration')"
            :placeholder="t('document_index.select_education_configuration')"
            :static-options="educationConfigurationOptions"
            :required="true"
            :reload="false"
            :disabled="!selectedEducationType"
            @update:model-value="
              selectEducationConfiguration($event as TitleInterface<number> | null)
            "
          />
          <small
            v-if="submitted && !selectedEducationConfiguration"
            class="document-index-page__field-error"
          >
            {{ t('document_index.required_field') }}
          </small>
        </div>

        <div>
          <UpdatedCustomInputSelect
            id="document-index-subject"
            :model-value="selectedSubject"
            :label="t('document_index.subject')"
            :placeholder="t('document_index.select_subject')"
            :static-options="subjectOptions"
            :required="true"
            :reload="false"
            :disabled="!selectedEducationConfiguration"
            @update:model-value="selectSubject($event as TitleInterface<number> | null)"
          />
          <small v-if="submitted && !selectedSubject" class="document-index-page__field-error">
            {{ t('document_index.required_field') }}
          </small>
        </div>

        <UpdatedCustomInputSelect
          id="document-index-subject-configuration"
          :model-value="selectedSubjectConfiguration"
          :label="t('document_index.subject_configuration')"
          :placeholder="t('document_index.select_subject_configuration')"
          :static-options="subjectConfigurationOptions"
          :reload="false"
          :optional="true"
          :disabled="!selectedSubject || subjectConfigurationOptions.length === 0"
          @update:model-value="selectSubjectConfiguration($event as TitleInterface<number> | null)"
        />
      </div>

      <div class="document-index-page__actions">
        <button
          class="document-index-page__show-results"
          type="button"
          :disabled="isLoading"
          @click="showResults"
        >
          {{ isLoading ? t('document_index.loading') : t('document_index.show_results') }}
        </button>
      </div>
    </section>

    <section
      v-if="resultsRequested"
      class="document-index-page__card"
      aria-labelledby="document-index-results"
    >
      <h2 id="document-index-results" class="document-index-page__section-title">
        {{ t('document_index.results') }}
      </h2>

      <div v-if="isLoading" class="document-index-page__state">
        {{ t('document_index.loading') }}
      </div>
      <div v-else-if="isFailed" class="document-index-page__state" role="alert">
        {{ t('document_index.load_failed') }}
      </div>
      <div v-else-if="documents.length === 0" class="document-index-page__state">
        {{ t('document_index.no_documents') }}
      </div>
      <div v-else class="document-index-page__results">
        <article
          v-for="document in documents"
          :key="document.id"
          class="document-index-page__result-card"
        >
          <div class="document-index-page__thumbnail">
            <img
              v-if="documentImage(document)"
              :src="documentImage(document)"
              :alt="document.title"
            />
            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 3h8l4 4v14H6V3Z M14 3v5h4"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div class="document-index-page__result-content">
            <h3>{{ document.title }}</h3>
            <p>{{ documentDescription(document) || t('document_index.no_description') }}</p>
            <div class="document-index-page__metadata">
              <span>
                {{ t('document_index.type') }}:
                <strong>{{
                  document.doecumentType?.title ?? t('document_index.not_available')
                }}</strong>
              </span>
              <span>
                {{ t('document_index.reference_number') }}:
                <strong>{{ document.RefNumber || t('document_index.not_available') }}</strong>
              </span>
            </div>
          </div>

          <div class="document-index-page__result-actions">
            <button
              v-if="hasDocumentIndex(document)"
              class="document-index-page__result-button document-index-page__result-button--outline"
              type="button"
              @click="openFile(documentIndexFile(document))"
            >
              {{ t('document_index.show_index') }}
            </button>
            <button
              v-else
              class="document-index-page__result-button"
              type="button"
              @click="generateDocumentIndex(document)"
            >
              {{ t('document_index.generate_index') }}
            </button>

            <div v-if="documentSourceFile(document)" class="document-index-page__source-file">
              <span :title="fileName(documentSourceFile(document))">
                {{ fileName(documentSourceFile(document)) }}
              </span>
              <button
                type="button"
                :aria-label="t('document_index.view_document')"
                @click="openFile(documentSourceFile(document))"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                    stroke="currentColor"
                    stroke-width="1.7"
                  />
                  <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.7" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <Dialog
      v-model:visible="generationDialogVisible"
      modal
      :closable="false"
      :close-on-escape="false"
      :dismissable-mask="false"
      :show-header="false"
      :pt="{
        root: 'document-index-generation-dialog',
        content: 'document-index-generation-dialog__content',
      }"
    >
      <div class="document-index-generation" role="status" aria-live="polite">
        <div class="document-index-generation__brand" aria-hidden="true">
          <span class="document-index-generation__sparkle">✦</span>
          <strong>AI</strong>
        </div>
        <h2>{{ t('document_index.indexing_document') }}</h2>
        <p>{{ t('document_index.indexing_description') }}</p>
        <div class="document-index-generation__progress" aria-hidden="true">
          <span></span>
        </div>
        <button type="button" @click="cancelGeneration">
          {{ t('document_index.cancel_indexing') }}
        </button>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="generatedDialogVisible"
      modal
      :show-header="false"
      :dismissable-mask="false"
      :pt="{
        root: 'document-index-generated-dialog',
        content: 'document-index-generated-dialog__content',
      }"
      @hide="closeGeneratedIndex"
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
            @click="closeGeneratedIndex"
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
                <th>{{ t('document_index.needs_admin_review') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in generatedIndexItems" :key="item.id">
                <td>
                  <span class="document-index-generated__level" :class="levelClass(item.level)">
                    {{ item.level }}
                  </span>
                </td>
                <td>
                  <input
                    v-if="isEditingGeneratedIndex"
                    v-model.trim="item.title"
                    type="text"
                    :aria-label="t('document_index.index_title')"
                  />
                  <span v-else>{{ item.title }}</span>
                </td>
                <td>
                  <input
                    v-if="isEditingGeneratedIndex"
                    v-model.number="item.fromPdf"
                    type="number"
                    min="1"
                    :aria-label="t('document_index.from_pdf')"
                  />
                  <span v-else>{{ item.fromPdf }}</span>
                </td>
                <td>
                  <input
                    v-if="isEditingGeneratedIndex"
                    v-model.number="item.toPdf"
                    type="number"
                    min="1"
                    :aria-label="t('document_index.to_pdf')"
                  />
                  <span v-else>{{ item.toPdf }}</span>
                </td>
                <td>
                  <input
                    v-if="isEditingGeneratedIndex"
                    v-model.trim="item.printedPageLabel"
                    type="text"
                    :aria-label="t('document_index.printed_page_label')"
                  />
                  <span v-else>{{ item.printedPageLabel }}</span>
                </td>
                <td>
                  <span
                    :class="{
                      'document-index-generated__review': item.needsAdminReview,
                    }"
                  >
                    {{
                      item.needsAdminReview
                        ? t('document_index.needs_review')
                        : t('document_index.no_review')
                    }}
                  </span>
                </td>
              </tr>
              <tr v-if="generatedIndexItems.length === 0">
                <td colspan="6" class="document-index-generated__empty">
                  {{ t('document_index.no_generated_items') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="document-index-generated__actions">
          <button
            v-if="isEditingGeneratedIndex"
            class="document-index-generated__secondary-action document-index-generated__secondary-action--cancel"
            type="button"
            @click="cancelGeneratedIndexEdit"
          >
            {{ t('document_index.cancel_edit') }}
          </button>
          <button
            v-else
            class="document-index-generated__secondary-action"
            type="button"
            @click="startEditingGeneratedIndex"
          >
            {{ t('document_index.edit_index') }}
          </button>
          <button
            class="document-index-generated__save-action"
            type="button"
            @click="saveGeneratedIndex"
          >
            {{ t('document_index.save_index') }}
          </button>
        </footer>
      </section>
    </Dialog>
  </main>
</template>

<style scoped lang="scss">
  @use '../styles/document_index';
</style>

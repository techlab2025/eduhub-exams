<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Dialog from 'primevue/dialog';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import type StageModel from '@/modules/Stages/core/models/stage.model';
  import { EducationClassificationController } from '@/modules/EducationClassification';
  import type EducationClassificationModel from '@/modules/EducationClassification/core/models/education.classification.model';
  import IndexEducationClassificationParams from '@/modules/EducationClassification/core/params/index.educationClassification.params';
  import EducationSubjectItemController from '@/modules/EducationClassification/presentation/controllers/educationSubject/education.subject.item.controller';
  import FetchSubjectParams from '@/modules/EducationClassification/core/params/EducationSubjects/fetch.subject.params';
  import SubjectController from '@/modules/Subjects/presentation/controllers/subject.controller';
  import IndexEducationClassificationBranchesParams from '@/modules/Subjects/core/params/index.educationClassificationBranches.params';
  import DocumentController from '@/modules/document/presentation/controllers/document.controller';
  import type DocumentModel from '@/modules/document/core/models/document.model';
  import GenerateDocumentIndexParams from '../../core/params/generate.document.index.params';
  import {
    copyEditableDocumentIndexItems,
    type EditableDocumentIndexItem,
  } from '../../core/models/editable.document.index.item.model';
  import type GeneratedDocumentIndexModel from '../../core/models/generated.document.index.model';
  import UpdateDocumentIndexParams from '../../core/params/update.document.index.params';
  import SaveDocumentIndexParams from '../../core/params/save.document.index.params';
  import DocumentIndexController from '../controllers/document.index.controller';
  import {
    createSubjectOptions,
    flattenLeafBranchOptions,
    type CurriculumBranchNode,
    type CurriculumSubjectNode,
  } from '../../core/utils/curriculum.options';
  import IndexDocumentParams from '@/modules/document/core/params/index.document.params';
  import NorCurriculumIcon from '@/shared/icons/DocuecmntIndex/NorCurriculumIcon.vue';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  import {
    DocumentIndexLevelTypeEnum,
    getDocumentIndexLevelKey,
    type DocumentIndexLevelTypeEnum as DocumentIndexLevel,
  } from '../../core/constant/DocumentIndexLevel.enum';
  import DocIndex from '@/shared/icons/DocIndex.vue';
  import defaultDocumentCover from '@/assets/images/Book Cover Design 1.png';

  interface SubjectSelectLevel {
    options: TitleInterface<number>[];
    selected: TitleInterface<number> | null;
  }

  const emit = defineEmits<{
    saveIndex: [payload: { documentId: number; items: EditableDocumentIndexItem[] }];
  }>();

  const { t } = useI18n();
  const educationClassificationController = EducationClassificationController.getInstance();
  const branchController = SubjectController.getInstance();
  const subjectController = EducationSubjectItemController.getInstance();
  const documentController = DocumentController.getInstance();
  const documentIndexController = DocumentIndexController.getInstance();
  const educationClassificationParams = new IndexEducationClassificationParams({
    pageNumber: 1,
    perPage: 100,
    withPage: 0,
  });

  const educationClassifications = shallowRef<EducationClassificationModel[]>([]);
  const educationClassificationBranches = shallowRef<StageModel[]>([]);
  const selectedEducationType = ref<TitleInterface<number> | null>(null);
  const selectedEducationConfiguration = ref<TitleInterface<number> | null>(null);
  const subjectLevels = ref<SubjectSelectLevel[]>([{ options: [], selected: null }]);
  const submitted = ref(false);
  const resultsRequested = ref(false);
  const generationDialogVisible = ref(false);
  const generatedDialogVisible = ref(false);
  const isEditingGeneratedIndex = ref(false);
  const isUpdatingGeneratedIndex = ref(false);
  const isSavingGeneratedIndex = ref(false);
  const activeDocumentId = ref<number>();
  const generatedIndex = shallowRef<GeneratedDocumentIndexModel | null>(null);
  const generatedIndexItems = ref<EditableDocumentIndexItem[]>([]);
  const originalGeneratedIndexItems = ref<EditableDocumentIndexItem[]>([]);
  let generationAbortController: AbortController | null = null;
  let branchRequestId = 0;
  let subjectRequestId = 0;

  const educationTypeOptions = computed(() =>
    educationClassifications.value.map(
      (classification) =>
        new TitleInterface<number>({ id: classification.id, title: classification.title }),
    ),
  );

  const educationConfigurationOptions = computed(() =>
    flattenLeafBranchOptions(educationClassificationBranches.value as CurriculumBranchNode[]),
  );

  const selectedSubject = computed(() => subjectLevels.value[0]?.selected ?? null);
  const effectiveSubjectId = computed(() => {
    for (let index = subjectLevels.value.length - 1; index >= 0; index -= 1) {
      const selectedId = subjectLevels.value[index]?.selected?.id;
      if (selectedId != null) return selectedId;
    }
    return undefined;
  });
  const subjectSelectId = (levelIndex: number): string =>
    levelIndex === 0
      ? 'document-index-subject'
      : levelIndex === 1
        ? 'document-index-subject-configuration'
        : `document-index-subject-configuration-${levelIndex}`;
  const subjectSelectLabel = (levelIndex: number): string =>
    levelIndex === 0 ? t('document_index.subject') : t('document_index.subject_configuration');
  const subjectSelectPlaceholder = (levelIndex: number): string =>
    levelIndex === 0
      ? t('document_index.select_subject')
      : t('document_index.select_subject_configuration');

  const resetSubjectLevels = () => {
    subjectRequestId += 1;
    subjectLevels.value = [{ options: [], selected: null }];
  };

  const setRootSubjectOptions = (subjects: CurriculumSubjectNode[]) => {
    subjectLevels.value = [
      {
        options: createSubjectOptions(subjects),
        selected: null,
      },
    ];
  };

  const fetchEducationClassifications = async () => {
    const result = await educationClassificationController.fetchList(educationClassificationParams);
    if (result instanceof DataSuccess) {
      educationClassifications.value = result.data ?? [];
    }
  };

  const fetchSubjects = async (
    branchId: number,
    parentId?: number,
  ): Promise<CurriculumSubjectNode[]> => {
    const result = await subjectController.fetchList(
      new FetchSubjectParams({ stage_id: branchId, parent_id: parentId }),
    );
    return result instanceof DataSuccess ? (result.data ?? []) : [];
  };

  const documents = computed(() => documentController.listData.value ?? []);
  const isLoading = computed(() => documentController.isListLoading());
  const isFailed = computed(() => documentController.isListFailed());
  const isReadyToSearch = computed(
    () =>
      Boolean(selectedEducationType.value?.id) &&
      Boolean(selectedEducationConfiguration.value?.id) &&
      Boolean(selectedSubject.value?.id),
  );

  const clearResults = () => {
    submitted.value = false;
    resultsRequested.value = false;
  };

  const selectEducationType = async (value: TitleInterface<number> | null | undefined) => {
    selectedEducationType.value = value ?? null;
    selectedEducationConfiguration.value = null;
    educationClassificationBranches.value = [];
    resetSubjectLevels();
    clearResults();

    const educationClassificationId = selectedEducationType.value?.id;
    if (educationClassificationId == null) return;

    const requestId = ++branchRequestId;
    const result = await branchController.fetchList(
      new IndexEducationClassificationBranchesParams({ educationClassificationId }),
    );
    if (
      requestId !== branchRequestId ||
      selectedEducationType.value?.id !== educationClassificationId
    ) {
      return;
    }
    if (result instanceof DataSuccess) {
      educationClassificationBranches.value = result.data ?? [];
    }
  };

  const selectEducationConfiguration = async (value: TitleInterface<number> | null | undefined) => {
    selectedEducationConfiguration.value = value ?? null;
    resetSubjectLevels();
    clearResults();

    const branchId = selectedEducationConfiguration.value?.id;
    if (branchId == null) return;

    const requestId = ++subjectRequestId;
    const subjects = await fetchSubjects(branchId);
    if (requestId !== subjectRequestId || selectedEducationConfiguration.value?.id !== branchId) {
      return;
    }
    setRootSubjectOptions(subjects);
  };

  const selectSubject = async (
    levelIndex: number,
    value: TitleInterface<number> | null | undefined,
  ) => {
    const level = subjectLevels.value[levelIndex];
    if (!level) return;

    level.selected = value ?? null;
    subjectLevels.value = subjectLevels.value.slice(0, levelIndex + 1);
    clearResults();

    const branchId = selectedEducationConfiguration.value?.id;
    const parentId = level.selected?.id;
    if (branchId == null || parentId == null) {
      subjectRequestId += 1;
      return;
    }

    const requestId = ++subjectRequestId;
    const subjects = await fetchSubjects(branchId, parentId);
    if (
      requestId !== subjectRequestId ||
      selectedEducationConfiguration.value?.id !== branchId ||
      subjectLevels.value[levelIndex]?.selected?.id !== parentId
    ) {
      return;
    }

    const options = createSubjectOptions(subjects);
    if (options.length > 0) {
      subjectLevels.value.push({ options, selected: null });
    }
  };

  const showResults = async () => {
    submitted.value = true;
    if (!isReadyToSearch.value) return;

    if (effectiveSubjectId.value == null) return;

    resultsRequested.value = true;
    await documentController.fetchList(
      new IndexDocumentParams('', 1, 10, 0, '', undefined, effectiveSubjectId.value),
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

  const documentImage = (document: DocumentModel): string =>
    document.image?.trim() || defaultDocumentCover;
  const handleDocumentImageError = (event: Event): void => {
    if (event.target instanceof HTMLImageElement) event.target.src = defaultDocumentCover;
  };
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

  const generateDocumentIndex = async (document: DocumentModel) => {
    if (document.id == null || generationDialogVisible.value) return;

    const requestController = new AbortController();
    generationAbortController = requestController;
    activeDocumentId.value = document.id;
    generatedDialogVisible.value = false;
    generationDialogVisible.value = true;

    const result = await documentIndexController.generateIndex(
      new GenerateDocumentIndexParams(document.id),
      { signal: requestController.signal },
    );

    if (generationAbortController !== requestController) return;

    generationAbortController = null;
    generationDialogVisible.value = false;

    if (result instanceof DataSuccess && result.data) {
      generatedIndex.value = result.data as GeneratedDocumentIndexModel;
      generatedIndexItems.value = copyEditableDocumentIndexItems(
        generatedIndex.value.editableItems,
      );
      originalGeneratedIndexItems.value = copyEditableDocumentIndexItems(generatedIndexItems.value);
      activeDocumentId.value = document.id;
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
    originalGeneratedIndexItems.value = copyEditableDocumentIndexItems(generatedIndexItems.value);
    isEditingGeneratedIndex.value = true;
  };

  const cancelGeneratedIndexEdit = () => {
    generatedIndexItems.value = copyEditableDocumentIndexItems(originalGeneratedIndexItems.value);
    isEditingGeneratedIndex.value = false;
  };

  const updateGeneratedIndex = async () => {
    if (activeDocumentId.value == null) return;

    isUpdatingGeneratedIndex.value = true;
    const result = await documentIndexController.updateIndex(
      new UpdateDocumentIndexParams(activeDocumentId.value, generatedIndexItems.value),
    );
    isUpdatingGeneratedIndex.value = false;

    if (!(result instanceof DataSuccess) || !result.data) return;

    generatedIndex.value = result.data;
    generatedIndexItems.value = copyEditableDocumentIndexItems(result.data.editableItems);
    originalGeneratedIndexItems.value = copyEditableDocumentIndexItems(generatedIndexItems.value);
    isEditingGeneratedIndex.value = false;
    dialogManager.toastSuccess(t('document_index.updated_successfully'));
  };

  const saveGeneratedIndex = async () => {
    if (activeDocumentId.value == null || isEditingGeneratedIndex.value) return;

    isSavingGeneratedIndex.value = true;
    const result = await documentIndexController.saveIndex(
      new SaveDocumentIndexParams(activeDocumentId.value),
    );
    isSavingGeneratedIndex.value = false;

    if (!(result instanceof DataSuccess)) return;

    emit('saveIndex', {
      documentId: activeDocumentId.value,
      items: copyEditableDocumentIndexItems(generatedIndexItems.value),
    });
    dialogManager.toastSuccess(t('document_index.saved_successfully'));
    closeGeneratedIndex();
  };

  const closeGeneratedIndex = () => {
    generatedDialogVisible.value = false;
    isEditingGeneratedIndex.value = false;
    generatedIndex.value = null;
  };

  const levelClass = (level: DocumentIndexLevel): string => {
    if (level === DocumentIndexLevelTypeEnum.CHAPTER) {
      return 'document-index-generated__level--chapter';
    }
    if (level === DocumentIndexLevelTypeEnum.LESSON) {
      return 'document-index-generated__level--lesson';
    }
    return '';
  };

  const levelKey = (level: DocumentIndexLevel) => getDocumentIndexLevelKey(level);

  onMounted(fetchEducationClassifications);
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
            @reload="fetchEducationClassifications"
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

        <div v-for="(subjectLevel, levelIndex) in subjectLevels" :key="subjectSelectId(levelIndex)">
          <UpdatedCustomInputSelect
            :id="subjectSelectId(levelIndex)"
            :model-value="subjectLevel.selected"
            :label="subjectSelectLabel(levelIndex)"
            :placeholder="subjectSelectPlaceholder(levelIndex)"
            :static-options="subjectLevel.options"
            :required="levelIndex === 0"
            :reload="false"
            :optional="levelIndex > 0"
            :disabled="levelIndex === 0 && !selectedEducationConfiguration"
            @update:model-value="selectSubject(levelIndex, $event as TitleInterface<number> | null)"
          />
          <small
            v-if="levelIndex === 0 && submitted && !selectedSubject"
            class="document-index-page__field-error"
          >
            {{ t('document_index.required_field') }}
          </small>
        </div>
      </div>

      <div class="document-index-page__actions">
        <button
          class="document-index-page__show-results"
          type="button"
          :disabled="isLoading"
          :class="{ '--disabled': !selectedSubject }"
          @click="showResults"
        >
          {{ isLoading ? t('document_index.loading') : t('document_index.show_results') }}
        </button>
      </div>
    </section>

    <section v-if="!resultsRequested" class="document-index-page__card">
      <h2 id="document-index-results" class="document-index-page__section-title">
        {{ t('document_index.results') }}
      </h2>
      <div class="start-page">
        <NorCurriculumIcon />
        <h2>{{ t('document_index.select_curriculum') }}</h2>
        <p>{{ t('document_index.select_curriculum_description') }}</p>
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
        <DocIndex />
        <h2>{{ t('No_Documents_Found') }}</h2>
        <p>{{ t('There_are_no_documents_linked_to_this_subject_yet') }}</p>
        <p>{{ t('Upload_and_assign_a_document_to_this_subject_to_start_indexing') }}</p>
        <!-- {{ t('document_index.no_documents') }} -->
      </div>
      <div v-else class="document-index-page__results">
        <article
          v-for="document in documents"
          :key="document.id"
          class="document-index-page__result-card"
        >
          <div class="document-index-page__thumbnail">
            <img
              :src="documentImage(document)"
              :alt="document.title"
              @error="handleDocumentImageError"
            />
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
            <div v-if="generatedIndex" class="document-index-generated__summary">
              <span>
                {{ t('document_index.book_id') }}
                <strong>#{{ generatedIndex.bookId }}</strong>
              </span>
              <span>
                {{ t('document_index.book_status') }}
                <strong>{{ generatedIndex.bookStatus }}</strong>
              </span>
              <span>
                {{ t('document_index.chapters_count') }}
                <strong>{{ generatedIndex.chapters.length }}</strong>
              </span>
            </div>
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in generatedIndexItems" :key="item.id">
                <td>
                  <span class="document-index-generated__level" :class="levelClass(item.level)">
                    {{ t(`document_index.levels.${levelKey(item.level)}`) }}
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
              </tr>
              <tr v-if="generatedIndexItems.length === 0">
                <td colspan="5" class="document-index-generated__empty">
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
            :disabled="isUpdatingGeneratedIndex"
            @click="cancelGeneratedIndexEdit"
          >
            {{ t('document_index.cancel_edit') }}
          </button>
          <button
            v-else
            class="document-index-generated__secondary-action"
            type="button"
            :disabled="isSavingGeneratedIndex"
            @click="startEditingGeneratedIndex"
          >
            {{ t('document_index.edit_index') }}
          </button>
          <button
            v-if="isEditingGeneratedIndex"
            class="document-index-generated__save-action"
            type="button"
            :disabled="isUpdatingGeneratedIndex"
            @click="updateGeneratedIndex"
          >
            {{
              isUpdatingGeneratedIndex
                ? t('document_index.updating_index')
                : t('document_index.update_index')
            }}
          </button>
          <button
            v-else
            class="document-index-generated__save-action"
            type="button"
            :disabled="isSavingGeneratedIndex"
            @click="saveGeneratedIndex"
          >
            {{
              isSavingGeneratedIndex
                ? t('document_index.saving_index')
                : t('document_index.save_index')
            }}
          </button>
        </footer>
      </section>
    </Dialog>
  </main>
</template>

<style scoped lang="scss">
  @use '../styles/document_index';
  .start-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #f8f8f8;
    border: 1px dashed #e6e6e6;
    border-radius: 24px;
    padding: 50px;
  }
</style>

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
  import CheckDocumentIndexStatusParams from '../../core/params/check.document.index.status.params';
  import {
    DocumentIndexPatchStatusEnum,
    type DocumentIndexPatchStatusEnum as DocumentIndexPatchStatus,
  } from '../../core/constant/document.index.patch.status.enum';
  import type DocumentIndexStatusModel from '../../core/models/document.index.status.model';
  import type GeneratedDocumentIndexModel from '../../core/models/generated.document.index.model';
  import DocumentIndexPatchController from '../controllers/document.index.patch.controller';
  import GeneratedDocumentIndexDialog from './GeneratedDocumentIndexDialog.vue';
  import {
    createSubjectOptions,
    flattenLeafBranchOptions,
    type CurriculumBranchNode,
    type CurriculumSubjectNode,
  } from '../../core/utils/curriculum.options';
  import IndexDocumentParams from '@/modules/document/core/params/index.document.params';
  import NorCurriculumIcon from '@/shared/icons/DocuecmntIndex/NorCurriculumIcon.vue';
  import DocIndex from '@/shared/icons/DocIndex.vue';
  import IconArrowDown from '@/shared/icons/IconArrowDown.vue';
  import IconWarning from '@/shared/icons/IconWarning.vue';
  import defaultDocumentCover from '@/assets/images/Book Cover Design 1.png';

  interface SubjectSelectLevel {
    options: TitleInterface<number>[];
    selected: TitleInterface<number> | null;
  }

  interface DocumentIndexJob {
    patchId: number;
    status: DocumentIndexPatchStatus;
    generatedIndex: GeneratedDocumentIndexModel | null;
  }

  const { t } = useI18n();
  const educationClassificationController = EducationClassificationController.getInstance();
  const branchController = SubjectController.getInstance();
  const subjectController = EducationSubjectItemController.getInstance();
  const documentController = DocumentController.getInstance();
  const documentIndexPatchController = DocumentIndexPatchController.getInstance();
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
  const startingDocumentId = ref<number>();
  const checkingDocumentIds = ref<Set<number>>(new Set());
  const documentIndexJobs = ref<Record<number, DocumentIndexJob>>({});
  const activeDocumentId = ref<number>();
  const generationDialogVisible = ref(false);
  const cancelConfirmationVisible = ref(false);
  const generatedDialogVisible = ref(false);
  const generatedIndex = shallowRef<GeneratedDocumentIndexModel | null>(null);
  const statusPollTimers = new Map<number, ReturnType<typeof window.setTimeout>>();
  const cancelledPatchIds = new Set<number>();
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

  const documentJob = (document: DocumentModel): DocumentIndexJob | undefined =>
    document.id == null ? undefined : documentIndexJobs.value[document.id];

  const documentIndexStatus = (document: DocumentModel): DocumentIndexPatchStatus | undefined => {
    const localStatus = documentJob(document)?.status;
    if (localStatus != null) return localStatus;
    if (
      document.indexStatus === DocumentIndexPatchStatusEnum.IN_PROGRESS ||
      document.indexStatus === DocumentIndexPatchStatusEnum.COMPLETE ||
      document.indexStatus === DocumentIndexPatchStatusEnum.FAILED
    ) {
      return document.indexStatus;
    }
    return document.hasIndex ? DocumentIndexPatchStatusEnum.COMPLETE : undefined;
  };

  const isDocumentIndexing = (document: DocumentModel): boolean =>
    documentIndexStatus(document) === DocumentIndexPatchStatusEnum.IN_PROGRESS;

  const shouldShowIndexingAction = (document: DocumentModel): boolean =>
    isDocumentIndexing(document) &&
    !(generationDialogVisible.value && activeDocumentId.value === document.id);

  const hasDocumentIndex = (document: DocumentModel): boolean =>
    documentIndexStatus(document) === DocumentIndexPatchStatusEnum.COMPLETE;

  const isCheckingDocument = (document: DocumentModel): boolean =>
    document.id != null && checkingDocumentIds.value.has(document.id);

  const setCheckingDocument = (documentId: number, isChecking: boolean) => {
    const nextIds = new Set(checkingDocumentIds.value);
    if (isChecking) nextIds.add(documentId);
    else nextIds.delete(documentId);
    checkingDocumentIds.value = nextIds;
  };

  const updateDocumentJob = (documentId: number, job: DocumentIndexJob) => {
    documentIndexJobs.value = { ...documentIndexJobs.value, [documentId]: job };
  };

  const clearStatusPoll = (documentId: number) => {
    const timer = statusPollTimers.get(documentId);
    if (timer != null) window.clearTimeout(timer);
    statusPollTimers.delete(documentId);
  };

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

  const fileName = (file: string): string => {
    if (!file) return '';
    const cleanFile = file.split('?')[0] ?? '';
    return decodeURIComponent(cleanFile.split('/').pop() ?? cleanFile);
  };

  const openFile = (file: string) => {
    if (file) window.open(file, '_blank', 'noopener,noreferrer');
  };

  const showGeneratedIndex = (
    documentId: number,
    nextGeneratedIndex: GeneratedDocumentIndexModel,
  ) => {
    activeDocumentId.value = documentId;
    generatedIndex.value = nextGeneratedIndex;
    generatedDialogVisible.value = true;
  };

  interface CheckStatusOptions {
    openWhenComplete?: boolean;
    showProgressWhenPending?: boolean;
    reschedule?: boolean;
  }

  const checkDocumentIndexStatus = async (
    documentId: number,
    patchId: number,
    options: CheckStatusOptions = {},
  ): Promise<DocumentIndexStatusModel | null> => {
    if (checkingDocumentIds.value.has(documentId)) return null;

    setCheckingDocument(documentId, true);
    const result = await documentIndexPatchController.checkStatus(
      new CheckDocumentIndexStatusParams(patchId),
    );
    setCheckingDocument(documentId, false);

    if (cancelledPatchIds.has(patchId)) return null;
    if (!(result instanceof DataSuccess) || !result.data) return null;

    const status = result.data;
    updateDocumentJob(documentId, {
      patchId,
      status: status.status,
      generatedIndex:
        status.status === DocumentIndexPatchStatusEnum.COMPLETE
          ? status.generatedIndex
          : (documentIndexJobs.value[documentId]?.generatedIndex ?? null),
    });

    if (status.status === DocumentIndexPatchStatusEnum.COMPLETE) {
      clearStatusPoll(documentId);
      const shouldOpen =
        options.openWhenComplete ||
        (generationDialogVisible.value && activeDocumentId.value === documentId);
      if (activeDocumentId.value === documentId) {
        generationDialogVisible.value = false;
        cancelConfirmationVisible.value = false;
      }
      if (shouldOpen) showGeneratedIndex(documentId, status.generatedIndex);
      return status;
    }

    if (status.status === DocumentIndexPatchStatusEnum.FAILED) {
      clearStatusPoll(documentId);
      if (activeDocumentId.value === documentId) {
        generationDialogVisible.value = false;
        cancelConfirmationVisible.value = false;
      }
      return status;
    }

    if (options.showProgressWhenPending) {
      activeDocumentId.value = documentId;
      generationDialogVisible.value = true;
    }
    if (options.reschedule !== false) scheduleStatusPoll(documentId, patchId);
    return status;
  };

  const scheduleStatusPoll = (documentId: number, patchId: number) => {
    clearStatusPoll(documentId);
    statusPollTimers.set(
      documentId,
      window.setTimeout(() => {
        void checkDocumentIndexStatus(documentId, patchId);
      }, 5000),
    );
  };

  const generateDocumentIndex = async (document: DocumentModel) => {
    if (document.id == null || startingDocumentId.value != null) return;

    startingDocumentId.value = document.id;
    const result = await documentIndexPatchController.startIndex(
      new GenerateDocumentIndexParams(document.id, false),
    );
    startingDocumentId.value = undefined;

    if (!(result instanceof DataSuccess) || !result.data) return;

    cancelledPatchIds.delete(result.data);
    updateDocumentJob(document.id, {
      patchId: result.data,
      status: DocumentIndexPatchStatusEnum.IN_PROGRESS,
      generatedIndex: null,
    });
    activeDocumentId.value = document.id;
    generatedIndex.value = null;
    cancelConfirmationVisible.value = false;
    generationDialogVisible.value = true;
    scheduleStatusPoll(document.id, result.data);
  };

  const showDocumentIndex = async (document: DocumentModel) => {
    if (document.id == null || isCheckingDocument(document)) return;

    const job = documentJob(document);
    if (job?.status === DocumentIndexPatchStatusEnum.COMPLETE && job.generatedIndex) {
      showGeneratedIndex(document.id, job.generatedIndex);
      return;
    }

    const patchId = job?.patchId || document.indexPatchId || document.id;
    await checkDocumentIndexStatus(document.id, patchId, {
      openWhenComplete: true,
      showProgressWhenPending: true,
    });
  };

  const viewIndexingProgress = async (document: DocumentModel) => {
    if (document.id == null || isCheckingDocument(document)) return;

    const patchId = documentJob(document)?.patchId || document.indexPatchId || document.id;
    activeDocumentId.value = document.id;
    cancelConfirmationVisible.value = false;
    generationDialogVisible.value = true;
    await checkDocumentIndexStatus(document.id, patchId, { openWhenComplete: true });
  };

  const minimizeGeneration = () => {
    generationDialogVisible.value = false;
    cancelConfirmationVisible.value = false;
  };

  const requestCancelIndexing = () => {
    cancelConfirmationVisible.value = true;
  };

  const keepIndexing = () => {
    cancelConfirmationVisible.value = false;
  };

  const confirmCancelIndexing = () => {
    const documentId = activeDocumentId.value;
    if (documentId != null) {
      clearStatusPoll(documentId);
      const job = documentIndexJobs.value[documentId];
      if (job) {
        cancelledPatchIds.add(job.patchId);
        const nextJobs = { ...documentIndexJobs.value };
        delete nextJobs[documentId];
        documentIndexJobs.value = nextJobs;
      }
    }
    generationDialogVisible.value = false;
    cancelConfirmationVisible.value = false;
    activeDocumentId.value = undefined;
  };

  onMounted(fetchEducationClassifications);
  onBeforeUnmount(() => {
    statusPollTimers.forEach((timer) => window.clearTimeout(timer));
    statusPollTimers.clear();
  });
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
              :disabled="isCheckingDocument(document)"
              @click="showDocumentIndex(document)"
            >
              {{
                isCheckingDocument(document)
                  ? t('document_index.checking_status')
                  : t('document_index.show_index')
              }}
            </button>
            <div
              v-else-if="shouldShowIndexingAction(document)"
              class="document-index-page__indexing-action"
            >
              <span>{{ t('document_index.ai_indexing') }}</span>
              <div class="document-index-page__indexing-progress" aria-hidden="true">
                <i></i>
              </div>
              <button
                type="button"
                :disabled="isCheckingDocument(document)"
                @click="viewIndexingProgress(document)"
              >
                {{
                  isCheckingDocument(document)
                    ? t('document_index.checking_status')
                    : t('document_index.view_progress')
                }}
              </button>
            </div>
            <button
              v-else-if="!isDocumentIndexing(document)"
              class="document-index-page__result-button"
              type="button"
              :disabled="startingDocumentId === document.id"
              @click="generateDocumentIndex(document)"
            >
              {{
                startingDocumentId === document.id
                  ? t('document_index.starting_index')
                  : t('document_index.generate_index')
              }}
            </button>

            <div
              v-if="
                documentSourceFile(document) &&
                !hasDocumentIndex(document) &&
                !isDocumentIndexing(document)
              "
              class="document-index-page__source-file"
            >
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
      <section class="document-index-generation" role="status" aria-live="polite">
        <button
          class="document-index-generation__minimize"
          type="button"
          :aria-label="t('document_index.minimize_indexing')"
          @click="minimizeGeneration"
        >
          <IconArrowDown />
        </button>
        <div class="document-index-generation__brand" aria-hidden="true">
          <span class="document-index-generation__sparkle">✦</span>
          <strong>AI</strong>
        </div>
        <h2>{{ t('document_index.indexing_analysis') }}</h2>
        <p>{{ t('document_index.indexing_background_description') }}</p>
        <div class="document-index-generation__progress" aria-hidden="true">
          <span></span>
        </div>
        <button
          class="document-index-generation__cancel"
          type="button"
          @click="requestCancelIndexing"
        >
          {{ t('document_index.cancel_indexing') }}
        </button>
      </section>
    </Dialog>

    <Dialog
      v-model:visible="cancelConfirmationVisible"
      modal
      :closable="false"
      :close-on-escape="false"
      :dismissable-mask="false"
      :show-header="false"
      :pt="{
        root: 'document-index-cancel-dialog',
        content: 'document-index-cancel-dialog__content',
      }"
    >
      <section class="document-index-cancel" aria-labelledby="document-index-cancel-title">
        <h2 id="document-index-cancel-title">
          {{ t('document_index.cancel_confirmation_title') }}
        </h2>
        <div class="document-index-cancel__warning">
          <IconWarning aria-hidden="true" />
          <p>{{ t('document_index.cancel_confirmation_description') }}</p>
        </div>
        <footer>
          <button
            class="document-index-cancel__confirm"
            type="button"
            @click="confirmCancelIndexing"
          >
            {{ t('document_index.cancel') }}
          </button>
          <button class="document-index-cancel__keep" type="button" @click="keepIndexing">
            {{ t('document_index.keep_indexing') }}
          </button>
        </footer>
      </section>
    </Dialog>

    <GeneratedDocumentIndexDialog
      v-model:visible="generatedDialogVisible"
      :document-id="activeDocumentId ?? 0"
      :generated-index="generatedIndex"
    />
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
    background-color: var(--gray-50);
    border: 1px dashed var(--border-weak);
    border-radius: 24px;
    padding: 50px;
  }
</style>

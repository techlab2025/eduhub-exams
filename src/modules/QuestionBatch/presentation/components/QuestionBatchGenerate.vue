<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import StageController from '@/modules/Stages/presentation/controllers/stage.controller';
  import IndexStageParams from '@/modules/Stages/core/params/index.stage.params';
  import type StageModel from '@/modules/Stages/core/models/stage.model';
  import EmployeeController from '@/modules/employee/presentation/controllers/employee.controller';
  import IndexEmployeeParams from '@/modules/employee/core/params/index.employee.params';
  import DocumentController from '@/modules/document/presentation/controllers/document.controller';
  import IndexDocumentParams from '@/modules/document/core/params/index.document.params';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
  import { NumberOfQuestionTypeEnum } from '../../core/constant/number.of.question.type.enum';
  import { QuestionBatchDifficultyEnum } from '../../core/constant/question.batch.difficulty.enum';
  import { QuestionBatchStatusEnum } from '../../core/constant/question.batch.status.enum';
  import { QuestionBatchTypeEnum } from '../../core/constant/question.batch.type.enum';
  import StoreQuestionBatchParams from '../../core/params/store.question.batch.params';
  import {
    findQuestionBatchBranch,
    flattenQuestionBatchBranches,
    questionBatchSubjectOptions,
    type QuestionBatchBranchNode,
  } from '../../core/utils/question.batch.options';
  import QuestionBatchController from '../controllers/question.batch.controller';
  import GeneratedQuestionBatchDialog from './GeneratedQuestionBatchDialog.vue';
  import QuestionBatchLoadingDialog from './QuestionBatchLoadingDialog.vue';

  const props = withDefaults(defineProps<{ useStaticData?: boolean }>(), {
    useStaticData: false,
  });
  const { t } = useI18n();
  const router = useRouter();
  const stageController = StageController.getInstance();
  const employeeController = EmployeeController.getInstance();
  const documentController = DocumentController.getInstance();
  const questionBatchController = QuestionBatchController.getInstance();

  const stages = shallowRef<StageModel[]>([]);
  const selectedEducationType = ref<TitleInterface<number> | null>(null);
  const selectedConfiguration = ref<TitleInterface<number> | null>(null);
  const selectedSubject = ref<TitleInterface<number> | null>(null);
  const selectedReviewer = ref<TitleInterface<number> | null>(null);
  const selectedDocumentId = ref<number>();
  const numberType = ref<NumberOfQuestionTypeEnum>(NumberOfQuestionTypeEnum.ANY_NUMBER);
  const numberOfQuestions = ref(10);
  const difficulty = ref<QuestionBatchDifficultyEnum>(QuestionBatchDifficultyEnum.ANY_DIFFICULTY);
  const questionType = ref<QuestionBatchTypeEnum>(QuestionBatchTypeEnum.ANY_TYPE);
  const submitted = ref(false);
  const loadingDialogVisible = ref(false);
  const reviewDialogVisible = ref(false);
  const generatedQuestions = ref<ShowQuestionsModel[]>([]);
  let generationController: AbortController | null = null;

  const educationTypes = computed(() =>
    stages.value.flatMap((stage) =>
      stage.id == null ? [] : [new TitleInterface<number>({ id: stage.id, title: stage.title })],
    ),
  );
  const selectedStage = computed(() =>
    stages.value.find((stage) => stage.id === selectedEducationType.value?.id),
  );
  const branches = computed(
    () => (selectedStage.value?.branches ?? []) as QuestionBatchBranchNode[],
  );
  const configurations = computed(() => flattenQuestionBatchBranches(branches.value));
  const selectedBranch = computed(() =>
    findQuestionBatchBranch(branches.value, selectedConfiguration.value?.id),
  );
  const subjects = computed(() =>
    questionBatchSubjectOptions(selectedBranch.value?.subjects ?? []),
  );
  const reviewers = computed(() =>
    (employeeController.listData.value ?? []).flatMap((employee) =>
      employee.id == null
        ? []
        : [new TitleInterface<number>({ id: employee.id, title: employee.name })],
    ),
  );
  const documents = computed(() => documentController.listData.value ?? []);
  const curriculumPath = computed(() =>
    [
      selectedEducationType.value?.title,
      ...(selectedConfiguration.value?.title?.split(' → ') ?? []),
      selectedSubject.value?.title,
    ].filter((value): value is string => Boolean(value)),
  );
  const canGenerate = computed(
    () =>
      selectedConfiguration.value?.id != null &&
      selectedSubject.value?.id != null &&
      selectedReviewer.value?.id != null &&
      selectedDocumentId.value != null &&
      (numberType.value === NumberOfQuestionTypeEnum.ANY_NUMBER || numberOfQuestions.value > 0),
  );

  const numberOptions = computed(() => [
    { id: NumberOfQuestionTypeEnum.ANY_NUMBER, title: t('question_batch.any_number') },
    { id: NumberOfQuestionTypeEnum.SPECIFIC_NUMBER, title: t('question_batch.exact_number') },
  ]);
  const difficultyOptions = computed(() => [
    { id: QuestionBatchDifficultyEnum.ANY_DIFFICULTY, title: t('question_batch.any_difficulty') },
    { id: QuestionBatchDifficultyEnum.EASY, title: t('question_batch.easy') },
    { id: QuestionBatchDifficultyEnum.MEDIUM, title: t('question_batch.medium') },
    { id: QuestionBatchDifficultyEnum.HARD, title: t('question_batch.hard') },
  ]);
  const questionTypeOptions = computed(() => [
    { id: QuestionBatchTypeEnum.ANY_TYPE, title: t('question_batch.any_type') },
    { id: QuestionBatchTypeEnum.MCQ, title: t('question_batch.mcq') },
    { id: QuestionBatchTypeEnum.TRUE_FALSE, title: t('question_batch.true_false') },
    { id: QuestionBatchTypeEnum.RANKING, title: t('question_batch.ranking') },
    { id: QuestionBatchTypeEnum.COMPLETION, title: t('question_batch.completion') },
    { id: QuestionBatchTypeEnum.MATCHING, title: t('question_batch.matching') },
  ]);

  const fetchStages = async () => {
    await stageController.fetchList(new IndexStageParams('', 1, 100, 0));
    stages.value = (stageController.listData.value ?? []) as StageModel[];
  };
  const fetchReviewers = async () => {
    await employeeController.fetchList(
      new IndexEmployeeParams({ word: '', pageNumber: 1, perPage: 100, withPage: 0, status: null }),
    );
  };
  const fetchDocuments = async () => {
    selectedDocumentId.value = undefined;
    if (selectedSubject.value?.id == null) return;
    await documentController.fetchList(
      new IndexDocumentParams('', 1, 100, 0, '', undefined, selectedSubject.value.id),
    );
  };

  const updateEducationType = (value: TitleInterface<number> | null | undefined) => {
    selectedEducationType.value = value ?? null;
    selectedConfiguration.value = null;
    selectedSubject.value = null;
    selectedDocumentId.value = undefined;
  };
  const updateConfiguration = (value: TitleInterface<number> | null | undefined) => {
    selectedConfiguration.value = value ?? null;
    selectedSubject.value = null;
    selectedDocumentId.value = undefined;
  };
  const updateSubject = async (value: TitleInterface<number> | null | undefined) => {
    selectedSubject.value = value ?? null;
    await fetchDocuments();
  };

  const generate = async () => {
    submitted.value = true;
    if (!canGenerate.value) return;
    const educationClassificationId = selectedConfiguration.value?.id;
    const subjectId = selectedSubject.value?.id;
    const documentId = selectedDocumentId.value;
    if (educationClassificationId == null || subjectId == null || documentId == null) return;

    const request = new AbortController();
    generationController = request;
    reviewDialogVisible.value = false;
    loadingDialogVisible.value = true;
    const result = await questionBatchController.generateBatch(
      new StoreQuestionBatchParams({
        educationClassificationId,
        eCSubjectId: subjectId,
        documentId,
        status: QuestionBatchStatusEnum.DRAFT,
        numberOfQuestionsType: numberType.value,
        numberOfQuestions: numberOfQuestions.value,
        questionType: questionType.value,
        questionDifficulty: difficulty.value,
      }),
      { signal: request.signal, useStaticData: props.useStaticData },
    );

    if (generationController !== request) return;
    generationController = null;
    loadingDialogVisible.value = false;
    if (result instanceof DataSuccess && result.data) {
      generatedQuestions.value = [...result.data.questions];
      reviewDialogVisible.value = true;
    }
  };

  const cancelGeneration = () => {
    generationController?.abort();
    generationController = null;
    loadingDialogVisible.value = false;
  };
  const deleteQuestion = (id: number) => {
    generatedQuestions.value = generatedQuestions.value.filter((question) => question.id !== id);
  };
  const updateGeneratedQuestion = (payload: { index: number; question: ShowQuestionsModel }) => {
    generatedQuestions.value = generatedQuestions.value.map((question, index) =>
      index === payload.index ? payload.question : question,
    );
  };
  const saveBatch = () => {
    reviewDialogVisible.value = false;
    void router.push({ name: 'Question Batches' });
  };

  onMounted(() => Promise.all([fetchStages(), fetchReviewers()]));
  onBeforeUnmount(cancelGeneration);
</script>

<template>
  <main class="question-batch-generate">
    <header class="question-batch-generate__heading">
      <h1>{{ t('question_batch.generate_title') }}</h1>
      <p>{{ t('question_batch.generate_description') }}</p>
    </header>

    <section class="question-batch-section">
      <h2>{{ t('question_batch.curriculum_scope') }} <span>⌃</span></h2>
      <div class="question-batch-section__fields">
        <UpdatedCustomInputSelect
          id="question-batch-education-type"
          :model-value="selectedEducationType"
          :label="t('question_batch.education_type')"
          :placeholder="t('question_batch.select_education_type')"
          :static-options="educationTypes"
          required
          @update:model-value="updateEducationType($event as TitleInterface<number> | null)"
          @reload="fetchStages"
        />
        <UpdatedCustomInputSelect
          id="question-batch-configuration"
          :model-value="selectedConfiguration"
          :label="t('question_batch.education_configuration')"
          :placeholder="t('question_batch.select_education_configuration')"
          :static-options="configurations"
          :reload="false"
          :disabled="!selectedEducationType"
          required
          @update:model-value="updateConfiguration($event as TitleInterface<number> | null)"
        />
        <UpdatedCustomInputSelect
          id="question-batch-subject"
          :model-value="selectedSubject"
          :label="t('question_batch.subject')"
          :placeholder="t('question_batch.select_subject')"
          :static-options="subjects"
          :reload="false"
          :disabled="!selectedConfiguration"
          required
          @update:model-value="updateSubject($event as TitleInterface<number> | null)"
        />
        <UpdatedCustomInputSelect
          id="question-batch-reviewer"
          v-model="selectedReviewer"
          :label="t('question_batch.reviewer')"
          :placeholder="t('question_batch.select_reviewer')"
          :static-options="reviewers"
          required
          @reload="fetchReviewers"
        />
        <p v-if="submitted && !canGenerate" class="question-batch-generate__error">
          {{ t('question_batch.complete_required_fields') }}
        </p>
      </div>
    </section>

    <section class="question-batch-section">
      <h2>{{ t('question_batch.documents_sources') }} <span>⌃</span></h2>
      <div class="question-batch-documents">
        <label
          v-for="document in documents"
          :key="document.id"
          class="question-batch-document"
          :class="{ 'question-batch-document--selected': selectedDocumentId === document.id }"
        >
          <input v-model="selectedDocumentId" type="radio" name="document" :value="document.id" />
          <img v-if="document.image" :src="document.image" :alt="document.title" />
          <span v-else class="question-batch-document__placeholder" aria-hidden="true">▤</span>
          <span>
            <small>{{ document.doecumentType?.title || t('question_batch.document') }}</small>
            <strong>{{ document.title }}</strong>
            <em>{{ t('question_batch.reference') }}: {{ document.RefNumber }}</em>
          </span>
        </label>
        <p v-if="selectedSubject && documents.length === 0" class="question-batch-documents__empty">
          {{ t('question_batch.no_documents') }}
        </p>
      </div>
    </section>

    <section class="question-batch-section">
      <h2>{{ t('question_batch.generate_setting') }} <span>⌃</span></h2>
      <fieldset class="question-batch-options">
        <legend>{{ t('question_batch.number_of_questions') }}</legend>
        <label v-for="option in numberOptions" :key="option.id">
          <input v-model="numberType" type="radio" name="number-type" :value="option.id" />
          <span>{{ option.title }}</span>
        </label>
        <input
          v-if="numberType === NumberOfQuestionTypeEnum.SPECIFIC_NUMBER"
          v-model.number="numberOfQuestions"
          class="question-batch-options__number"
          type="number"
          min="1"
          :aria-label="t('question_batch.number_of_questions')"
        />
      </fieldset>
      <fieldset class="question-batch-options question-batch-options--four">
        <legend>{{ t('question_batch.difficulty') }}</legend>
        <label v-for="option in difficultyOptions" :key="option.id">
          <input v-model="difficulty" type="radio" name="difficulty" :value="option.id" />
          <span>{{ option.title }}</span>
        </label>
      </fieldset>
      <fieldset class="question-batch-options question-batch-options--six">
        <legend>{{ t('question_batch.questions_type') }}</legend>
        <label v-for="option in questionTypeOptions" :key="option.id">
          <input v-model="questionType" type="radio" name="question-type" :value="option.id" />
          <span>{{ option.title }}</span>
        </label>
      </fieldset>
    </section>

    <footer class="question-batch-generate__actions">
      <button type="button" class="question-batch-generate__submit" @click="generate">
        {{ t('question_batch.generate_question') }}
      </button>
      <button type="button" class="question-batch-generate__cancel" @click="router.back()">
        {{ t('question_batch.cancel') }}
      </button>
    </footer>

    <QuestionBatchLoadingDialog v-model:visible="loadingDialogVisible" @cancel="cancelGeneration" />
    <GeneratedQuestionBatchDialog
      v-model:visible="reviewDialogVisible"
      :questions="generatedQuestions"
      :curriculum-path="curriculumPath"
      :requested-count="numberOfQuestions"
      @update-question="updateGeneratedQuestion"
      @delete="deleteQuestion"
      @save="saveBatch"
    />
  </main>
</template>

<style lang="scss">
  @use '../styles/question_batch';
</style>

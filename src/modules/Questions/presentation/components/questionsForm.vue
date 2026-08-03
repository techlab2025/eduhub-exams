<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import type ShowQuestionsModel from '../../core/models/show.questions.model';
  import AddquestionsParams from '../../core/params/add.question.params';
  import BasicQuestionDataForm from './FormComponent/BasicQuestionDataForm.vue';
  import QuestionAnswersDataForm from './FormComponent/QuestionAnswersDataForm.vue';
  import EditquestionsParams from '../../core/params/edit.question.params';
  import FolderIcon from '@/shared/icons/Question/FolderIcon.vue';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  import { QuestionTypeEnum } from '../../core/constant/question.type.enum';
  import { AnswerEvaluationTypeEnum } from '../../core/constant/answer.evaluation.type.enum';
  // import { CustomToast } from '../subComponents/CustomTosat.ts';

  const route = useRoute();
  const routeArticleId = () => {
    const id = route.query.article_id ?? route.query.artical_id;
    return id ? Number(id) : null;
  };
  const { t } = useI18n();
  const emit = defineEmits(['updateData']);
  const { question, articleId, subjectId } = defineProps<{
    question?: ShowQuestionsModel;
    articleId?: number;
    subjectId?: number;
  }>();

  type QuestionValidationErrors = Partial<
    Record<
      'title' | 'subject' | 'sequence' | 'topics' | 'difficulty' | 'skills' | 'answers',
      string
    >
  >;

  const validationErrors = ref<QuestionValidationErrors>({});

  const getValidationErrors = (): QuestionValidationErrors => {
    const errors: QuestionValidationErrors = {};
    const basicData = BasicData.value;
    const answers = AnswerData.value?.answers;
    const questionType = basicData?.questionType;

    if (!basicData?.title?.trim()) errors.title = t('question_title_required');
    if (!basicData?.subjectId) errors.subject = t('question_subject_required');
    if (!basicData?.questionSequenceId) errors.sequence = t('question_sequence_required');
    if (!basicData?.topics?.length) errors.topics = t('question_topics_required');
    if (!basicData?.difficultyLevel) errors.difficulty = t('question_difficulty_required');
    if (!basicData?.skills?.length) errors.skills = t('question_skills_required');
    if (!answers?.length || answers.some((answer) => !answer.title?.trim())) {
      errors.answers = t('question_answers_required');
    } else if (
      questionType === QuestionTypeEnum.matching &&
      answers.some((answer) => !answer.matchAnswer?.trim())
    ) {
      errors.answers = t('question_matching_answers_required');
    } else if (
      questionType === QuestionTypeEnum.ranking &&
      answers.some((answer) => Number(answer.rank) <= 0 || !Number.isInteger(Number(answer.rank)))
    ) {
      errors.answers = t('question_answer_ranks_required');
    } else if (
      (questionType === QuestionTypeEnum.mcq || questionType === QuestionTypeEnum.true_false) &&
      !answers.some((answer) => answer.isCorrect)
    ) {
      errors.answers = t('question_correct_answer_required');
    } else if (questionType === QuestionTypeEnum.true_false && answers.length !== 2) {
      errors.answers = t('question_true_false_answers_count');
    } else if (
      answers.length < 2 &&
      answers[0]?.answerEvaluation !== AnswerEvaluationTypeEnum.need_correct
    ) {
      errors.answers = t('question_minimum_answers_required');
    } else if (questionType === QuestionTypeEnum.complate && !answers[0]?.answerEvaluation) {
      errors.answers = t('question_answer_evaluation_required');
    } else if (
      questionType === QuestionTypeEnum.complate &&
      answers[0]?.answerEvaluation === AnswerEvaluationTypeEnum.similar &&
      (!answers[0].similarPrecentage ||
        Number(answers[0].similarPrecentage) <= 1 ||
        Number(answers[0].similarPrecentage) > 100)
    ) {
      errors.answers = t('question_similarity_percentage_invalid');
    }

    return errors;
  };

  const refreshVisibleValidation = () => {
    if (Object.keys(validationErrors.value).length) {
      validationErrors.value = getValidationErrors();
    }
  };

  const validate = async (): Promise<boolean> => {
    validationErrors.value = getValidationErrors();
    if (!Object.keys(validationErrors.value).length) return true;

    dialogManager.toastWarning(t('question_required_fields_warning'), {
      title: t('invalid_input_warning_title'),
    });
    await nextTick();
    document.querySelector<HTMLElement>('[data-question-error]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    return false;
  };

  defineExpose({ validate });

  const updateData = () => {
    let params: EditquestionsParams | AddquestionsParams;
    if (route.params.id) {
      params = new EditquestionsParams({
        id: Number(route.params.id),
        title: BasicData.value?.title,
        image: BasicData.value?.image,
        questionType: BasicData.value?.questionType,
        subjectId: BasicData.value?.subjectId,
        skills: BasicData.value?.skills,
        difficultyLevel: BasicData.value?.difficultyLevel,
        topics: BasicData.value?.topics ?? undefined,
        questionSequenceId: BasicData.value?.questionSequenceId,
        questionSource: BasicData.value?.questionSource,
        answers: AnswerData.value?.answers,
        isQuestionClarification: AnswerData.value?.isQuestionClarification,
        questionClarification: AnswerData.value?.questionClarification,
        isSolutionSteps: AnswerData.value?.isSolutionSteps,
        solutionSteps: AnswerData.value?.solutionSteps,
        isSolutionHint: AnswerData.value?.isSolutionHint,
        solutionHint: AnswerData.value?.solutionHint,
        answerEvaluation: AnswerData.value?.answers?.[0]?.answerEvaluation,
        similarPrecentage: AnswerData.value?.answers?.[0]?.similarPrecentage,
        parentId: BasicData.value?.parentId,
      });
    } else {
      params = new AddquestionsParams({
        title: BasicData.value?.title,
        image: BasicData.value?.image,
        questionType: BasicData.value?.questionType,
        subjectId: BasicData.value?.subjectId,
        skills: BasicData.value?.skills,
        difficultyLevel: BasicData.value?.difficultyLevel,
        topics: BasicData.value?.topics ?? undefined,
        questionSequenceId: BasicData.value?.questionSequenceId,
        questionSource: BasicData.value?.questionSource,
        answers: AnswerData.value?.answers,
        isQuestionClarification: AnswerData.value?.isQuestionClarification,
        questionClarification: AnswerData.value?.questionClarification,
        isSolutionSteps: AnswerData.value?.isSolutionSteps,
        solutionSteps: AnswerData.value?.solutionSteps,
        isSolutionHint: AnswerData.value?.isSolutionHint,
        solutionHint: AnswerData.value?.solutionHint,
        answerEvaluation: AnswerData.value?.answers?.[0]?.answerEvaluation,
        similarPrecentage: AnswerData.value?.answers?.[0]?.similarPrecentage,
        parentId: BasicData.value?.parentId,
      });
    }

    emit('updateData', params);
  };

  const BasicData = ref<AddquestionsParams>();
  const GetAllBasicData = (data: AddquestionsParams) => {
    BasicData.value = new AddquestionsParams({
      title: data.title,
      image: data.image,
      questionType: data.questionType,
      subjectId: data.subjectId,
      skills: data.skills,
      difficultyLevel: data.difficultyLevel,
      topics: data.topics,
      questionSequenceId: data.questionSequenceId,
      questionSource: data.questionSource,
      parentId: articleId ?? routeArticleId(),
    });
    refreshVisibleValidation();
    updateData();
  };

  const AnswerData = ref<AddquestionsParams>();
  const GetAllAnswers = (data: AddquestionsParams) => {
    AnswerData.value = new AddquestionsParams({
      answers: data.answers,
      isQuestionClarification: data.isQuestionClarification,
      questionClarification: data.questionClarification,
      isSolutionSteps: data.isSolutionSteps,
      solutionSteps: data.solutionSteps,
      isSolutionHint: data.isSolutionHint,
      solutionHint: data.solutionHint,
    });
    refreshVisibleValidation();
    // console.log(AnswerData.value, 'AnswerData.value');
    updateData();
  };

  watch(
    () => question,
    (newquestion) => {
      if (newquestion) {
      }
    },
    { immediate: true },
  );
  // const QuestionDraftData = ref<AddquestionsParams>();

  // const draftRef =
  //   !route.params.id && localStorage.getItem('question-draft')
  //     ? CustomToast<AddquestionsParams>('question-draft')
  //     : null;

  // watch(draftRef!, (newVal) => {
  //   if (newVal) {
  //     QuestionDraftData.value = newVal;
  //     BasicData.value = newVal;
  //     AnswerData.value = newVal;
  //   }
  // });
</script>

<template>
  <div class="questions-details-form-card">
    <header class="form-header">
      <div class="form-title">
        <div class="header-text">
          <h3>
            <FolderIcon />
            <span>
              {{ route.params.id ? 'Edit Question' : 'Add question' }}
            </span>
          </h3>
        </div>
      </div>
    </header>

    <!-- :draft-data="QuestionDraftData" -->
    <BasicQuestionDataForm
      :question-data="question"
      :subject-id="subjectId"
      :validation-errors="validationErrors"
      @update-data="GetAllBasicData"
    />
    <!-- :draft-data="QuestionDraftData" -->
    <QuestionAnswersDataForm
      :question-data="question!"
      :question-type="BasicData?.questionType!"
      :validation-error="validationErrors.answers"
      @update-data="GetAllAnswers"
    />
  </div>
</template>

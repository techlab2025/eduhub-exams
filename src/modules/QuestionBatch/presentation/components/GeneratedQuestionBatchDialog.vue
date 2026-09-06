<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import { useI18n } from 'vue-i18n';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
  import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
  import { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';
  import EditableGeneratedQuestionModel from '../../core/models/editable.generated.question.model';

  const props = defineProps<{
    questionBatchId?: number;
    questions: ShowQuestionsModel[];
    curriculumPath: string[];
    requestedCount: number;
  }>();
  const visible = defineModel<boolean>('visible', { required: true });
  const emit = defineEmits<{
    approve: [questionId: number];
    edit: [questionId: number];
    updateQuestion: [payload: { index: number; question: ShowQuestionsModel }];
    delete: [questionId: number];
    save: [];
  }>();
  const { t } = useI18n();
  const approvedIds = ref<number[]>([]);
  const editingKey = ref<string>();
  const collapsedKeys = ref<string[]>([]);
  const drafts = ref<Record<string, EditableGeneratedQuestionModel>>({});

  watch(visible, (isVisible) => {
    if (isVisible) {
      approvedIds.value = [];
      editingKey.value = undefined;
      collapsedKeys.value = [];
      drafts.value = {};
    }
  });

  const editableQuestionTypes = computed(() => [
    { id: QuestionTypeEnum.mcq, title: t('question_batch.mcq') },
    { id: QuestionTypeEnum.true_false, title: t('question_batch.true_false') },
    { id: QuestionTypeEnum.ranking, title: t('question_batch.ranking') },
    { id: QuestionTypeEnum.complate, title: t('question_batch.completion') },
    { id: QuestionTypeEnum.matching, title: t('question_batch.matching') },
    { id: QuestionTypeEnum.paragraph, title: t('question_batch.paragraph') },
  ]);
  const editableDifficulties = computed(() => [
    { id: QuestionDifficultyEnum.easy, title: t('question_batch.easy') },
    { id: QuestionDifficultyEnum.medium, title: t('question_batch.medium') },
    { id: QuestionDifficultyEnum.hard, title: t('question_batch.hard') },
  ]);

  const possibleDuplicate = (question: ShowQuestionsModel): boolean =>
    Number(question.similarPrecentage ?? 0) >= 70;
  const duplicateCount = computed(() => props.questions.filter(possibleDuplicate).length);
  const uniqueCount = computed(() => props.questions.length - duplicateCount.value);

  const questionType = (value?: number): string => {
    const labels: Record<number, string> = {
      [QuestionTypeEnum.mcq]: t('question_batch.mcq'),
      [QuestionTypeEnum.true_false]: t('question_batch.true_false'),
      [QuestionTypeEnum.ranking]: t('question_batch.ranking'),
      [QuestionTypeEnum.complate]: t('question_batch.completion'),
      [QuestionTypeEnum.matching]: t('question_batch.matching'),
      [QuestionTypeEnum.paragraph]: t('question_batch.paragraph'),
    };
    return labels[value ?? 0] ?? t('question_batch.any_type');
  };

  const difficulty = (value?: number): string => {
    const labels: Record<number, string> = {
      [QuestionDifficultyEnum.easy]: t('question_batch.easy'),
      [QuestionDifficultyEnum.medium]: t('question_batch.medium'),
      [QuestionDifficultyEnum.hard]: t('question_batch.hard'),
    };
    return labels[value ?? 0] ?? t('question_batch.any_difficulty');
  };

  const approve = (questionId?: number) => {
    if (questionId == null || approvedIds.value.includes(questionId)) return;
    approvedIds.value = [...approvedIds.value, questionId];
    emit('approve', questionId);
  };

  const firstImage = (question: ShowQuestionsModel): string =>
    question.questionImage?.[0]?.file ?? '';
  const answerImage = (answer: NonNullable<ShowQuestionsModel['answers']>[number]): string =>
    answer.image?.[0]?.file ?? '';
  const source = (question: ShowQuestionsModel): string => {
    const document = question.questionDocuments?.[0];
    return [document?.title, document?.source].filter(Boolean).join(' ');
  };

  const questionKey = (question: ShowQuestionsModel, index: number): string =>
    String(question.id ?? `question-${index}`);
  const isEditing = (question: ShowQuestionsModel, index: number): boolean =>
    editingKey.value === questionKey(question, index);
  const isCollapsed = (question: ShowQuestionsModel, index: number): boolean =>
    collapsedKeys.value.includes(questionKey(question, index));
  const editableQuestion = (
    question: ShowQuestionsModel,
    index: number,
  ): EditableGeneratedQuestionModel => {
    const key = questionKey(question, index);
    const existing = drafts.value[key];
    if (existing) return existing;
    const draft = EditableGeneratedQuestionModel.fromQuestion(question);
    drafts.value[key] = draft;
    return draft;
  };
  const startEditing = (question: ShowQuestionsModel, index: number) => {
    const key = questionKey(question, index);
    drafts.value[key] = EditableGeneratedQuestionModel.fromQuestion(question);
    editingKey.value = key;
    collapsedKeys.value = props.questions.flatMap((item, itemIndex) => {
      const itemKey = questionKey(item, itemIndex);
      return itemKey === key ? [] : [itemKey];
    });
    if (question.id != null) emit('edit', question.id);
  };
  const saveQuestionChanges = (question: ShowQuestionsModel, index: number) => {
    const key = questionKey(question, index);
    const draft = drafts.value[key];
    if (!draft) return;
    emit('updateQuestion', { index, question: draft.toQuestion(question) });
    editingKey.value = undefined;
    collapsedKeys.value = collapsedKeys.value.filter((item) => item !== key);
  };
  const toggleDetails = (question: ShowQuestionsModel, index: number) => {
    const key = questionKey(question, index);
    collapsedKeys.value = collapsedKeys.value.includes(key)
      ? collapsedKeys.value.filter((item) => item !== key)
      : [...collapsedKeys.value, key];
  };
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :show-header="false"
    :dismissable-mask="false"
    :pt="{
      root: 'generated-question-batch-dialog',
      content: 'generated-question-batch-dialog__content',
    }"
  >
    <section
      class="generated-question-batch"
      aria-labelledby="generated-question-batch-title"
      :data-question-batch-id="questionBatchId"
    >
      <header class="generated-question-batch__header">
        <div>
          <h2 id="generated-question-batch-title">{{ t('question_batch.review_title') }}</h2>
          <p>{{ t('question_batch.draft_preview') }}</p>
        </div>
        <div class="generated-question-batch__summary">
          <span class="generated-question-batch__unique">
            {{ t('question_batch.unique_count', { count: uniqueCount }) }}
          </span>
          <span class="generated-question-batch__duplicate">
            {{ t('question_batch.duplicate_count', { count: duplicateCount }) }}
          </span>
          <button type="button" :aria-label="t('question_batch.close')" @click="visible = false">
            ×
          </button>
        </div>
      </header>

      <div class="generated-question-batch__context">
        <div class="generated-question-batch__path">
          <template v-for="(part, index) in curriculumPath" :key="`${part}-${index}`">
            <span>{{ part }}</span
            ><b v-if="index < curriculumPath.length - 1">›</b>
          </template>
        </div>
        <div>
          <span class="question_batch_background"
            >{{ t('question_batch.requested') }}: <strong>{{ requestedCount }}</strong></span
          >
          <span class="question_batch_background"
            >{{ t('question_batch.generated') }}: <strong>{{ questions.length }}</strong></span
          >
        </div>
      </div>

      <div class="generated-question-batch__list">
        <article
          v-for="(question, index) in questions"
          :key="question.id ?? index"
          class="generated-question-card"
          :class="{
            'generated-question-card--duplicate': possibleDuplicate(question),
            'generated-question-card--editing': isEditing(question, index),
          }"
        >
          <header>
            <strong>Q{{ String(index + 1).padStart(2, '0') }}</strong>
            <span
              :class="
                possibleDuplicate(question)
                  ? 'generated-question-card__duplicate'
                  : 'generated-question-card__unique'
              "
            >
              {{
                possibleDuplicate(question)
                  ? t('question_batch.possible_duplicate')
                  : t('question_batch.unique_question')
              }}
            </span>
            <div class="generated-question-card__actions">
              <button
                v-if="!isEditing(question, index)"
                type="button"
                class="generated-question-card__approve"
                @click="approve(question.id)"
              >
                {{
                  question.id != null && approvedIds.includes(question.id)
                    ? t('question_batch.approved')
                    : t('question_batch.approve')
                }}
              </button>
              <button
                v-if="isEditing(question, index)"
                type="button"
                class="generated-question-card__approve"
                @click="saveQuestionChanges(question, index)"
              >
                {{ t('question_batch.save_changes') }}
              </button>
              <button v-else type="button" @click="startEditing(question, index)">
                {{ t('question_batch.edit') }}
              </button>
              <button
                type="button"
                class="generated-question-card__delete"
                @click="question.id != null && emit('delete', question.id)"
              >
                {{ t('question_batch.delete') }}
              </button>
            </div>
          </header>

          <div v-if="isCollapsed(question, index)" class="generated-question-card__collapsed">
            <div class="generated-question-card__meta">
              <span>
                {{ t('question_batch.question_type') }}:
                <b>{{ questionType(question.questionType) }}</b>
              </span>
              <span>
                {{ t('question_batch.difficulty') }}:
                <b>{{ difficulty(question.difficulty) }}</b>
              </span>
            </div>
            <small>{{ t('question_batch.question') }}</small>
            <div class="generated-question-card__title">
              <strong>{{ question.questionTitle || question.question }}</strong>
              <img v-if="firstImage(question)" :src="firstImage(question)" alt="" />
            </div>
          </div>

          <div v-else-if="isEditing(question, index)" class="generated-question-card__edit-form">
            <div class="generated-question-card__edit-selects">
              <label>
                <span>{{ t('question_batch.question_type') }}</span>
                <select v-model.number="editableQuestion(question, index).questionType">
                  <option
                    v-for="option in editableQuestionTypes"
                    :key="option.id"
                    :value="option.id"
                  >
                    {{ option.title }}
                  </option>
                </select>
              </label>
              <label>
                <span>{{ t('question_batch.difficulty') }}</span>
                <select v-model.number="editableQuestion(question, index).difficulty">
                  <option
                    v-for="option in editableDifficulties"
                    :key="option.id"
                    :value="option.id"
                  >
                    {{ option.title }}
                  </option>
                </select>
              </label>
            </div>

            <label class="generated-question-card__edit-question">
              <span>{{ t('question_batch.question') }}</span>
              <span>
                <input
                  v-model="editableQuestion(question, index).title"
                  type="text"
                  :aria-label="t('question_batch.question')"
                />
                <img v-if="firstImage(question)" :src="firstImage(question)" alt="" />
              </span>
            </label>

            <div class="generated-question-card__edit-answers">
              <label
                v-for="(answer, answerIndex) in editableQuestion(question, index).answers"
                :key="answer.id ?? answerIndex"
                :class="{ 'generated-question-card__answer--correct': answer.isCorrect }"
              >
                <span>{{ t('question_batch.answer_number', { number: answerIndex + 1 }) }}</span>
                <span>
                  <input v-model="answer.answer" type="text" />
                  <img v-if="answerImage(answer)" :src="answerImage(answer)" alt="" />
                </span>
              </label>
              <label class="generated-question-card__edit-explanation">
                <span>{{ t('question_batch.explain_answer') }}</span>
                <input v-model="editableQuestion(question, index).explanation" type="text" />
              </label>
            </div>
          </div>

          <div v-else class="generated-question-card__question">
            <div class="generated-question-card__meta">
              <span class="generated_question_span"
                >{{ t('question_batch.question_type') }}:
                <b>{{ questionType(question.questionType) }}</b></span
              >
              <span
                >{{ t('question_batch.difficulty') }}:
                <b>{{ difficulty(question.difficulty) }}</b></span
              >
            </div>
            <small>{{ t('question_batch.question') }}</small>
            <div class="generated-question-card__title">
              <strong>{{ question.questionTitle || question.question }}</strong>
              <img v-if="firstImage(question)" :src="firstImage(question)" alt="" />
            </div>
          </div>

          <div
            v-if="
              !isCollapsed(question, index) &&
              !isEditing(question, index) &&
              question.answers?.length
            "
            class="generated-question-card__answers"
          >
            <div
              v-for="(answer, answerIndex) in question.answers"
              :key="answer.id ?? answerIndex"
              :class="{ 'generated-question-card__answer--correct': answer.is_right_answer }"
            >
              <span>
                <small>{{ t('question_batch.answer_number', { number: answerIndex + 1 }) }}</small>
                {{ answer.answer }}
              </span>
              <img v-if="answerImage(answer)" :src="answerImage(answer)" alt="" />
            </div>
          </div>

          <footer v-if="!isCollapsed(question, index)">
            {{ t('question_batch.question_source') }}:
            {{ source(question) || t('question_batch.not_available') }}
          </footer>
          <button
            type="button"
            class="generated-question-card__details-toggle"
            :aria-expanded="!isCollapsed(question, index)"
            @click="toggleDetails(question, index)"
          >
            {{
              isCollapsed(question, index)
                ? t('question_batch.show_details')
                : t('question_batch.show_less')
            }}
          </button>
        </article>

        <p v-if="questions.length === 0" class="generated-question-batch__empty">
          {{ t('question_batch.no_generated_questions') }}
        </p>
      </div>

      <footer class="generated-question-batch__footer">
        <button type="button" @click="emit('save')">{{ t('question_batch.save_batch') }}</button>
      </footer>
    </section>
  </Dialog>
</template>

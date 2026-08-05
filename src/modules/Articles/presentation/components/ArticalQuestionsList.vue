<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';
  import type { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
  import type { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
  import ShowArticlesParams from '../../core/params/show.Articles.params';
  import ArticleController from '../controllers/Article.controller';
  import ArticleQuestion from './ArticleDetails/ArticleQuestion.vue';
  import Dialog from 'primevue/dialog';
  import QuestionsAdd from '@/modules/Questions/presentation/components/questionsAdd.vue';

  interface ArticleQuestionFilters {
    question_type?: QuestionTypeEnum;
    difficulty?: QuestionDifficultyEnum;
    status?: QuestionStatusEnum;
    word?: string;
  }

  const controller = ArticleController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const hasFetched = ref(false);
  const showAddQuestionDialog = ref(false);
  const articleId = computed(() => Number(route.params.artical_id));
  const article = computed(() => controller.itemState.value.data);
  const articleSubjectId = computed(() => {
    const querySubjectId = Number(route.query?.subject_id);
    return querySubjectId || article.value?.subjectTree?.id || article.value?.e_c_subject?.id;
  });
  const articleSequenceId = computed(() => {
    const querySequenceId = Number(route.query?.sequence_id);
    return querySequenceId || article.value?.sequenceTree?.id || article.value?.e_c_subject?.id;
  });
  const questions = computed(() => article.value?.questions ?? []);
  const questionCount = computed(
    () => questions.value.length || article.value?.number_of_questions || 0,
  );
  const hasQuestions = computed(() => questionCount.value > 0);

  const fetchArticle = async (filters?: ArticleQuestionFilters) => {
    try {
      await controller.fetchOne(
        new ShowArticlesParams(
          articleId.value,
          filters?.question_type,
          filters?.difficulty,
          filters?.status,
          filters?.word,
        ),
      );
    } finally {
      hasFetched.value = true;
    }
  };

  const finish = () => {
    router.push({ name: 'Articles' });
  };

  const back = () => {
    router.push({ name: 'Edit article', params: { id: articleId.value } });
  };

  const handleQuestionSaved = async () => {
    showAddQuestionDialog.value = false;
    await fetchArticle();
  };

  onMounted(fetchArticle);
</script>

<template>
  <div class="article-questions-step">
    <div class="article-form-steps" :aria-label="$t('article_form_progress')">
      <div class="article-form-step completed">
        <span>{{ $t('article_details_step') }}</span>
        <small>{{ $t('step_one') }}</small>
      </div>
      <div class="article-form-step active" aria-current="step">
        <span>{{ $t('question_management_step') }}</span>
        <small>{{ $t('step_two') }}</small>
      </div>
    </div>

    <div v-if="!hasFetched" class="questions-loading" role="status" aria-live="polite">
      <span class="questions-loading-spinner" aria-hidden="true"></span>
      <div>
        <strong>{{ $t('article_questions_loading') }}</strong>
        <small>{{ $t('question_management_step') }}</small>
      </div>
    </div>

    <template v-else-if="hasQuestions">
      <section class="question-management-toolbar">
        <div class="question-management-summary">
          <span class="question-management-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3.5h7l4 4V18a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 2-2.45Z"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linejoin="round"
              />
              <path
                d="M14 3.5v4h4M8.5 11h6M8.5 14.5h4"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
            </svg>
          </span>
          <div>
            <span>{{ $t('question_management_step') }}</span>
            <h2>{{ $t('article_questions_title') }}</h2>
          </div>
        </div>

        <div class="question-management-controls">
          <span class="question-count" :aria-label="$t('article_questions_title')">
            {{ questionCount }}
          </span>
          <button class="add-question-button" type="button" @click="showAddQuestionDialog = true">
            <span aria-hidden="true">+</span>
            {{ $t('article_questions_add_button') }}
          </button>
        </div>
      </section>

      <ArticleQuestion :artical="article!" :show-header="false" />
    </template>

    <section v-else class="empty-questions-card">
      <header class="empty-questions-header">
        <h2>{{ $t('article_questions_title') }}</h2>
        <span>{{ questionCount }}</span>
      </header>

      <div class="empty-questions-content">
        <svg
          class="empty-question-icon"
          width="62"
          height="72"
          viewBox="0 0 62 72"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M11 3H35L49 17V52C49 56.4 45.4 60 41 60H11C6.6 60 3 56.4 3 52V11C3 6.6 6.6 3 11 3Z"
            stroke="currentColor"
            stroke-width="3"
            stroke-linejoin="round"
          />
          <path
            d="M35 3V17H49M15 24H23M15 35H37M15 46H37"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M49 54V68M42 61H56"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <h3>{{ $t('article_questions_empty_title') }}</h3>
        <p>{{ $t('article_questions_empty_description') }}</p>
        <button class="add-question-button" type="button" @click="showAddQuestionDialog = true">
          <span aria-hidden="true">+</span>
          {{ $t('article_questions_add_button') }}
        </button>
      </div>
    </section>

    <div v-if="hasFetched" class="article-question-actions">
      <button class="finish-button" type="button" :disabled="!hasQuestions" @click="finish">
        {{ $t('save') }}
      </button>
      <button class="back-button" type="button" @click="back">
        {{ $t('article_questions_back') }}
      </button>
    </div>

    <Dialog
      v-model:visible="showAddQuestionDialog"
      modal
      dismissable-mask
      class="article-question-create-dialog"
      :style="{ width: 'min(1180px, 96vw)' }"
      :content-style="{ maxHeight: '82vh', overflowY: 'auto' }"
    >
      <template #header>
        <div class="question-dialog-header">
          <div class="question-dialog-icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3.5h7l4 4V18a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 2-2.45Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M14 3.5v4h4M8.5 11h6M8.5 14.5h4"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path
                d="M18.5 16v5M16 18.5h5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="question-dialog-heading">
            <span class="question-dialog-eyebrow">{{ $t('question_management_step') }}</span>
            <h2>{{ $t('article_questions_dialog_title') }}</h2>
            <p>{{ $t('article_questions_dialog_description') }}</p>
          </div>
          <div class="article-context-badge">
            <span>{{ $t('article') }}</span>
            <strong>#{{ articleId }}</strong>
          </div>
        </div>
      </template>

      <div class="question-dialog-body">
        <div class="question-dialog-tip">
          <span class="tip-spark" aria-hidden="true">✦</span>
          <span>{{ $t('article_questions_dialog_tip') }}</span>
        </div>

        <QuestionsAdd
          v-if="showAddQuestionDialog"
          class="dialog-question-form"
          embedded
          :article-id="articleId"
          :subject-id="articleSubjectId"
          :sequence-id="articleSequenceId"
          @saved="handleQuestionSaved"
          @close="showAddQuestionDialog = false"
        />
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
  @use '../../../../styles/variables' as *;
  @use '../styles/article_questions_step_modern' as modern;

  .article-questions-step {
    width: 100%;
  }

  .article-form-steps {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $XsSize4;
    margin-bottom: $XlSize2;
  }

  .article-form-step {
    position: relative;
    min-height: 58px;
    padding: $XsSize $XlSize2;
    border: 1px solid var(--primary-green);
    border-radius: $XsSize4;
    background: var(--BgWhite);
    color: var(--primary-green);
    display: flex;
    flex-direction: column;
    justify-content: center;

    span {
      font-size: $SmSize;
      font-weight: $BaseFontSemiBoldWeight;
    }

    small {
      margin-top: 2px;
      color: inherit;
      font-size: $XsSize;
    }

    &.completed {
      border-color: var(--primary-green);
      background: var(--primary-green);
      color: var(--BgWhite);

      &::before,
      &::after {
        position: absolute;
        z-index: 2;
        top: 50%;
        width: 0;
        height: 0;
        border-block: 30px solid transparent;
        border-inline-end: 0;
        content: '';
        transform: translateY(-50%);
        pointer-events: none;
      }

      &::before {
        inset-inline-end: -17px;
        border-inline-start: 17px solid var(--BgWhite);
      }

      &::after {
        inset-inline-end: -14px;
        border-block-width: 27px;
        border-inline-start: 15px solid var(--primary-green);
      }
    }
  }

  .questions-loading,
  .empty-questions-card {
    min-height: 365px;
    border: 1px solid var(--input-border-color);
    border-radius: $MdSize;
    background: var(--BgWhite);
    box-shadow: 0 2px 3px var(--PrimaryColor-alpha-10);
  }

  .questions-loading {
    display: grid;
    place-items: center;
    color: var(--SecondText);
  }

  .empty-questions-header {
    display: flex;
    align-items: center;
    gap: $XsSize4;
    margin: 0 $XsSize;
    padding: $MdSize $XsSize4;
    border-bottom: 1px dashed var(--input-border-color);

    h2 {
      margin: 0;
      color: var(--title-header-color);
      font-size: $MdSize;
      font-weight: $BaseFontSemiBoldWeight;
    }

    span {
      min-width: 22px;
      padding: 2px 6px;
      border-radius: $XsSize4;
      background: var(--gray-100);
      color: var(--title-header-color);
      text-align: center;
      font-size: $SmSize;
    }
  }

  .empty-questions-content {
    min-height: 290px;
    padding: $XlSize2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 8px;

    h3 {
      margin: $MdSize 0 $XsSize4;
      color: var(--title-header-color);
      font-size: 24px;
      font-weight: 600;
    }

    p {
      max-width: 510px;
      margin: 0 0 $MdSize2;
      color: var(--SecondText);
      font-size: 14px;
      line-height: 1.5;
    }
  }

  .empty-question-icon {
    color: var(--title-header-color);
  }

  .add-question-button {
    display: inline-flex;
    align-items: center;
    gap: $XsSize4;
    padding: $XsSize $MdSize;
    border-radius: $XlSize4;
    background: var(--primary-green);
    color: var(--BgWhite);
    font-size: $SmSize;
    text-decoration: none;
    border: 0;
    cursor: pointer;
  }

  .question-list-add-action {
    margin-top: $MdSize;
    display: flex;
    justify-content: flex-end;
  }

  .article-question-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(110px, 15%);
    gap: $MdSize;
    margin-top: $MdSize;

    button {
      min-height: 48px;
      border: 0;
      border-radius: $XlSize4;
      font-weight: $BaseFontSemiBoldWeight;
      cursor: pointer;
    }
  }

  .finish-button {
    background: var(--primary-green);
    color: var(--BgWhite);

    &:disabled {
      background: var(--gray-300);
      cursor: not-allowed;
    }
  }

  .back-button {
    background: var(--gray-100);
    color: var(--title-header-color);
  }

  :global(.article-question-create-dialog) {
    overflow: hidden;
    border: 1px solid var(--PrimaryColor-alpha-10);
    border-radius: 24px;
    background: var(--gray-50);
    box-shadow: var(--shadow-xl);
  }

  :global(.article-question-create-dialog .p-dialog-header) {
    position: relative;
    overflow: hidden;
    padding: 24px 28px;
    border-bottom: 1px solid var(--PrimaryColor-alpha-10);
    background: linear-gradient(120deg, var(--PrimaryColor-alpha-10), var(--BgWhite));
  }

  :global(.article-question-create-dialog .p-dialog-header::after) {
    position: absolute;
    inset-inline-end: -35px;
    top: -55px;
    width: 170px;
    height: 170px;
    border: 28px solid var(--PrimaryColor-alpha-10);
    border-radius: 50%;
    content: '';
    pointer-events: none;
  }

  :global(.article-question-create-dialog .p-dialog-header-actions) {
    position: relative;
    z-index: 2;
    align-self: flex-start;
  }

  :global(.article-question-create-dialog .p-dialog-close-button) {
    border: 1px solid var(--input-border-color);
    background: var(--BgWhite);
    color: var(--title-header-color);
    box-shadow: var(--shadow-sm);
  }

  :global(.article-question-create-dialog .p-dialog-content) {
    padding: 0;
    background: var(--gray-50);
  }

  .question-dialog-header {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
  }

  .question-dialog-icon {
    width: 58px;
    height: 58px;
    border: 1px solid var(--PrimaryColor-alpha-10);
    border-radius: 18px;
    background: var(--primary-green);
    color: var(--BgWhite);
    display: grid;
    place-items: center;
    box-shadow: var(--shadow-md);
    transform: rotate(-3deg);
  }

  .question-dialog-heading {
    min-width: 0;

    h2 {
      margin: 2px 0 4px;
      color: var(--title-header-color);
      font-size: 22px;
      font-weight: $BaseFontSemiBoldWeight;
    }

    p {
      margin: 0;
      color: black !important;
      font-size: $SmSize;
      font-family: 'Light';
    }
  }

  .question-dialog-eyebrow {
    color: var(--primary-green);
    font-size: $XsSize;
    font-weight: $BaseFontSemiBoldWeight;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .article-context-badge {
    padding: 8px 14px;
    border: 1px solid var(--PrimaryColor-alpha-10);
    border-radius: $XlSize4;
    background: var(--BgWhite);
    color: var(--SecondText);
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: $XsSize;
    box-shadow: var(--shadow-sm);

    strong,
    span {
      color: var(--primary-green);
      font-size: $SmSize;
    }
  }

  .question-dialog-body {
    padding: 18px 22px 22px;
  }

  .question-dialog-tip {
    margin-bottom: 14px;
    padding: 10px 14px;
    border: 1px solid var(--PrimaryColor-alpha-10);
    border-radius: 14px;
    background: var(--BgWhite);
    color: var(--SecondText);
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: $SmSize;

    .tip-spark {
      color: var(--primary-green);
      font-size: $MdSize2;
    }
  }

  :deep(.dialog-question-form) {
    overflow: hidden;
    // border: 1px solid var(--input-border-color);
    border-radius: 18px;
    background: var(--BgWhite);
    box-shadow: var(--shadow-sm);
    padding: 12px;

    > .questions-details-form-card {
      margin: 0;
      border: 0;
      border-radius: 0;
      box-shadow: none;

      > .form-header {
        display: none;
      }
    }

    > .actions {
      position: sticky;
      z-index: 3;
      bottom: 0;
      margin: 0;
      padding: 16px 20px;
      border-top: 1px solid var(--input-border-color);
      background: var(--BgWhite);
      box-shadow: 0 -8px 20px var(--PrimaryColor-alpha-10);
    }
  }

  @media (max-width: 640px) {
    .article-form-steps,
    .article-question-actions {
      grid-template-columns: minmax(0, 1fr);
    }

    .article-form-step.completed {
      &::before,
      &::after {
        display: none;
      }
    }

    .question-dialog-header {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .article-context-badge {
      display: none;
    }

    .question-dialog-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
    }

    .question-dialog-body {
      padding: 12px;
    }
  }

  @include modern.article-questions-step;
</style>

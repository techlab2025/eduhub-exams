<script lang="ts" setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import QuestionCard from './QuestionCard.vue';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model.ts';
  import ArticleQuestionIcon from '@/shared/icons/ArticleQuestion.vue';

  const props = withDefaults(
    defineProps<{
      artical?: ShowQuestionsModel;
      showHeader?: boolean;
    }>(),
    {
      artical: undefined,
      showHeader: true,
    },
  );

  const route = useRoute();
  const articleId = computed(
    () => props.artical?.id ?? Number(route.params.artical_id ?? route.params.id),
  );
  const addQuestionRoute = computed(() => ({
    name: 'Add question',
    query: {
      artical_id: articleId.value,
      ...(props.artical?.e_c_subject?.id && { subject_id: props.artical.e_c_subject.id }),
    },
  }));
</script>
<template>
  <!-- <pre>{{ artical }}</pre> -->
  <div class="article_question">
    <header v-if="showHeader" class="questions-header">
      <div class="questions-header__content">
        <ArticleQuestionIcon class="questions-header__icon" aria-hidden="true" />
        <div class="questions-header__text">
          <h2>{{ $t('article_questions_title') }}</h2>
          <p>{{ $t('questions_linked_to_this_passage') }}</p>
        </div>
      </div>

      <RouterLink
        class="btn btn-primary questions-header__add"
        :to="addQuestionRoute"
        :aria-label="$t('article_questions_add_button')"
      >
        <span aria-hidden="true">+</span>
        {{ $t('article_questions_add_button') }}
      </RouterLink>
    </header>

    <div class="question_list">
      <QuestionCard v-if="props.artical?.questions" :allquestion="props.artical.questions" />
    </div>
  </div>
</template>
<style scoped lang="scss">
  @use '../../../../../styles/variables' as *;
  @use '../../../../../styles/mixins/flex' as *;

  .questions-header {
    @include flex(row, nowrap, space-between, center);

    gap: $MdSize;
    padding: $XsSize5;
    margin-bottom: $XlSize2;
    background: var(--color-light-gray);
    border-radius: $MdSize;
  }

  .questions-header__content {
    @include flex(row, nowrap, flex-start, center);

    gap: $XsSize3;
    min-width: 0;
  }

  .questions-header__icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
  }

  .questions-header__text {
    min-width: 0;

    h2,
    p {
      margin: 0;
      font-family: 'Medium';
    }

    h2 {
      color: var(--standard-black);
      font-size: $MdSize2;
      font-weight: $BaseFontSemiBoldWeight;
    }

    p {
      margin-top: $XsSize3;
      color: var(--gray-500-std);
      font-size: $MdSize;
      font-weight: $BaseFontMediumWeight;
    }
  }

  .questions-header__add {
    @include flex(row, nowrap, center, center);

    gap: $XsSize3;
    flex-shrink: 0;
    border-radius: $XlSize4;
    text-decoration: none;
  }

  @media (max-width: 640px) {
    .questions-header {
      align-items: stretch;
      flex-direction: column;
    }

    .questions-header__add {
      width: 100%;
    }
  }
</style>

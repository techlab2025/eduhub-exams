<script lang="ts" setup>
  import QuestionCard from './QuestionCard.vue';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model.ts';

  const { artical } = defineProps<{
    artical?: ShowQuestionsModel;
  }>();
</script>
<template>
  <div class="article_question">
    <div class="question_list">
      <QuestionCard v-if="artical?.questions" :allquestion="artical.questions" />
    </div>
  </div>
</template>
<style scoped lang="scss">
  @use '../../../../../styles/variables' as *;
  @use '../../../../../styles/mixins/flex' as *;
</style>

<script setup lang="ts">
  import type AnswerModel from '@/modules/Questions/core/models/subModels/answer.model';
  import NoImage from '@/assets/images/question/NoImage.png';
  const { answers } = defineProps<{ answers: AnswerModel[] }>();
  const numberToTxt = (index: number) => {
    const txt = [
      'First',
      'Second',
      'Third',
      'Fourth',
      'Fifth',
      'Sixth',
      'Seventh',
      'Eighth',
      'Ninth',
      'Tenth',
    ];

    return txt[index] ?? `${index + 1}th`;
  };
</script>
<template>
  <div class="question-answers-wrapper">
    <div class="question-answers-list">
      <div
        v-for="(answer, index) in answers"
        :key="answer?.id"
        class="question-answer-item"
        :class="{ correct: answer?.is_right_answer }"
      >
        <div class="answer-content">
          <label> {{ numberToTxt(index) }} Answer </label>
          <h2 class="answer">{{ answer?.answer }}</h2>
        </div>
        <div class="answer-image">
          <img
            v-if="answer?.image"
            :src="answer?.image?.[0]?.file || NoImage"
            :alt="answer?.answer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

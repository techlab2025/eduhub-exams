<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    difficultyFields: {
      key: string;
      label: string;
      placeholder: string;
      class: string;
      value: number;
    }[];
    questionCount: number;
    calculatedQuestions: Record<string, number>;
    totalPercentage: number;
  }>();

  const model = defineModel<{
    easy: number;
    medium: number;
    hard: number;
  }>({
    required: true,
  });

  const handlePercentageInput = (event: Event, key: 'easy' | 'medium' | 'hard') => {
    const target = event.target as HTMLInputElement;
    let value = target.value.replace(/\D/g, '');
    let numericValue = Number(value);
    // if (numericValue > 100) {
    //   numericValue = 100;
    // }
    // const currentFieldValue = model.value[key];
    // const totalWithoutCurrent = props.totalPercentage - currentFieldValue;
    // if (totalWithoutCurrent + numericValue > 100) {
    //   numericValue = 100 - totalWithoutCurrent;
    // }
    // if (numericValue < 0) {
    //   numericValue = 0;
    // }
    model.value[key] = numericValue;
    target.value = numericValue ? `${numericValue}%` : '';
  };

  const showQuestionCountError = computed(() => {
    return props.questionCount === 0;
  });
</script>

<template>
  <div class="difficulty-selection">
    <div v-for="field in difficultyFields" :key="field.key" class="difficulty-option-row">
      <div class="input" :class="field.class">
        <label class="field-label">
          {{ field.label }}
        </label>

        <!-- :value="model[field.key as 'easy' | 'medium' | 'hard'] + '%'" -->
        <input
          class="field-input"
          type="text"
          :placeholder="field.placeholder"
          @input="handlePercentageInput($event, field.key as 'easy' | 'medium' | 'hard')"
          :disabled="
            (totalPercentage >= 100 && !model[field.key as 'easy' | 'medium' | 'hard']) ||
            showQuestionCountError
          "
          :value="model[field?.key] + '%'"
        />

        <small v-if="showQuestionCountError" class="error-text">
          Please enter number of questions and time first
        </small>
      </div>

      <div class="percentage">
        <p>equal</p>

        <h6>
          <span>
            {{ calculatedQuestions[field.key] || 0 }}
          </span>

          questions
        </h6>
      </div>
    </div>
  </div>
</template>

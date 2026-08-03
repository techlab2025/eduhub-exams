<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import DifficultyQuestion from './subComponenets/DifficultyQuestion.vue';
  import HeaderForm from '@/shared/icons/Placements/HeaderForm.vue';
  import PlacementPercentageWarning from './subComponenets/PlacementPercentageWarning.vue';
  import type PlacementModel from '../../core/models/placement.model';
  const { placement } = defineProps<{ placement?: PlacementModel }>();

  const numberOfQuestions = ref<number>(placement?.numberOfQuestions ?? 0);
  const time = ref<number>(placement?.time ?? 0);

  // const difficulties = ref<{ easy: number; medium: number; hard: number }>({
  //   easy: 0,
  //   medium: 0,
  //   hard: 0,
  // });

  const difficulties = ref({
    easy: placement?.difficulties?.easy ?? 0,
    medium: placement?.difficulties?.medium ?? 0,
    hard: placement?.difficulties?.hard ?? 0,
  });
  const difficultyFields = [
    {
      key: 'easy',
      label: 'easy questions',
      placeholder: 'enter percentage of easy questions like 20%',
      class: 'easy',
      value: difficulties.value.easy,
    },
    {
      key: 'medium',
      label: 'medium questions',
      placeholder: 'enter percentage of medium questions like 80%',
      class: 'medium',
      value: difficulties.value.medium,
    },
    {
      key: 'hard',
      label: 'hard questions',
      placeholder: 'enter percentage of hard questions like 20%',
      class: 'hard',
      value: difficulties.value.hard,
    },
  ];

  const totalPercentage = computed(() => {
    return difficulties.value.easy + difficulties.value.medium + difficulties.value.hard;
  });

  const calculatedQuestions = computed(() => {
    return {
      easy: Math.floor((numberOfQuestions.value * difficulties.value.easy) / 100),

      medium: Math.floor((numberOfQuestions.value * difficulties.value.medium) / 100),

      hard: Math.floor((numberOfQuestions.value * difficulties.value.hard) / 100),
    };
  });
  const emit = defineEmits(['close']);
  const closeDialog = () => {
    emit('close');
  };

  watch(
    () => placement,
    (newVal) => {
      difficulties.value = newVal?.difficulties!;
      numberOfQuestions.value = newVal?.numberOfQuestions!;
      time.value = newVal?.time!;
    },
    { deep: true },
  );
</script>

<template>
  <div class="placement-form-card">
    <div class="form-header">
      <HeaderForm />
      <h2 class="title">{{ $t('Placement test configuration') }}</h2>
    </div>

    <div class="form-fields">
      <div class="input-wrap">
        <label>Number Of Questions</label>
        <input v-model="numberOfQuestions" type="number" class="field-input" />
      </div>

      <div class="input-wrap">
        <label>Placement Time (Minutes)</label>
        <input v-model="time" type="number" class="field-input" />
      </div>
    </div>

    <DifficultyQuestion
      v-model="difficulties"
      :difficulty-fields="difficultyFields"
      :question-count="numberOfQuestions"
      :calculated-questions="calculatedQuestions"
      :total-percentage="totalPercentage"
      :placement="placement"
    />

    <div class="summary">
      <p>Total Percentage: {{ totalPercentage }}%</p>
      <PlacementPercentageWarning
        v-if="totalPercentage > 100"
        :percentage="totalPercentage"
        @close="closeDialog"
      />
    </div>
  </div>
</template>

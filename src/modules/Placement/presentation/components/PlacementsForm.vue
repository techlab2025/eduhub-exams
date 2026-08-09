<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import DifficultyQuestion from './subComponenets/DifficultyQuestion.vue';
  import HeaderForm from '@/shared/icons/Placements/HeaderForm.vue';
  import PlacementPercentageWarning from './subComponenets/PlacementPercentageWarning.vue';
  import type PlacementModel from '../../core/models/placement.model';
  import AddPlacementParams from '../../core/params/add.placement.params';
  import EditPlacementParams from '../../core/params/edit.placement.params';

  const props = defineProps<{
    placement?: PlacementModel;
    formKey?: string;
  }>();

  const emit = defineEmits<{
    close: [];
    updateData: [params: AddPlacementParams | EditPlacementParams];
  }>();

  const route = useRoute();

  const numberOfQuestions = ref<number>(props.placement?.numberOfQuestions ?? 0);
  const time = ref<number>(props.placement?.time ?? 0);

  // const difficulties = ref<{ easy: number; medium: number; hard: number }>({
  //   easy: 0,
  //   medium: 0,
  //   hard: 0,
  // });

  const difficulties = ref({
    easy: props.placement?.difficulties?.easy ?? 0,
    medium: props.placement?.difficulties?.medium ?? 0,
    hard: props.placement?.difficulties?.hard ?? 0,
  });
  const difficultyFields: {
    key: 'easy' | 'medium' | 'hard';
    label: string;
    placeholder: string;
    class: string;
    value: number;
  }[] = [
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
  const closeDialog = () => {
    emit('close');
  };

  const updateData = () => {
    const data = {
      numberOfQuestions: numberOfQuestions.value,
      time: time.value,
      difficulties: { ...difficulties.value },
    };

    const params = route.params.id
      ? new EditPlacementParams({
          id: Number(route.params.id),
          ...data,
        })
      : new AddPlacementParams(data);

    emit('updateData', params);
  };

  watch(
    () => props.placement,
    (newVal) => {
      if (!newVal) return;

      difficulties.value = {
        easy: newVal.difficulties?.easy ?? 0,
        medium: newVal.difficulties?.medium ?? 0,
        hard: newVal.difficulties?.hard ?? 0,
      };
      numberOfQuestions.value = newVal.numberOfQuestions ?? 0;
      time.value = newVal.time ?? 0;
    },
    { immediate: true },
  );

  watch(
    [numberOfQuestions, time, difficulties],
    () => {
      updateData();
    },
    { deep: true, immediate: true },
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
        <input v-model.number="numberOfQuestions" type="number" class="field-input" />
      </div>

      <div class="input-wrap">
        <label>Placement Time (Minutes)</label>
        <input v-model.number="time" type="number" class="field-input" />
      </div>
    </div>

    <DifficultyQuestion
      v-model="difficulties"
      :difficulty-fields="difficultyFields"
      :question-count="numberOfQuestions"
      :calculated-questions="calculatedQuestions"
      :total-percentage="totalPercentage"
      :placement="props.placement"
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

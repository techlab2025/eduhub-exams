<script setup lang="ts">
  import { ref, watch } from 'vue';

  // Props
  defineProps<{
    modelValue: { title: string; img?: string }[];
    withImage?: boolean;
  }>();

  // Emit
  const emit = defineEmits<{
    (e: 'update:modelValue', value: { title: string; img?: string }[]): void;
  }>();

  // Local copy of inputs
  const inputs = ref([...modelValue]);

  // Sync when parent updates
  watch(
    () => modelValue,
    (newVal) => {
      inputs.value = [...newVal];
    },
    { deep: true },
  );

  // Sync back to parent
  watch(
    inputs,
    (newVal) => {
      emit('update:modelValue', newVal);
    },
    { deep: true },
  );
</script>

<template>
  <div class="input-wrapper">
    <label for="">Title</label>
    <input v-model="input.title" type="text" placeholder="Enter Title" />
  </div>
</template>

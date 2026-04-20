<script setup lang="ts">
  import { ref, watch } from 'vue';
  import UploadAppend from '@/shared/icons/UploadAppend.vue';
  import IconAdd from '@/shared/icons/IconAdd.vue';
  import IconMinus from '@/shared/icons/IconMinus.vue';

  // Props
  const { modelValue, withImage = false } = defineProps<{
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

  // Add new input
  const addInput = () => {
    inputs.value.push({ title: '', img: '' });
  };

  // Remove input by index
  const removeInput = (index: number) => {
    inputs.value.splice(index, 1);
  };

  // Handle file change
  const onFileChange = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        inputs.value[index].img = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
</script>

<template>
  <div class="input-wrapper">
    <label for="">Title</label>
    <input v-model="input.title" type="text" placeholder="Enter Title" />
  </div>
</template>

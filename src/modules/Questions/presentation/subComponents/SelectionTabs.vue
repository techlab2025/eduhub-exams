<script setup lang="ts">
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import RadioButton from 'primevue/radiobutton';

  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  const emit = defineEmits(['update:modelValue']);
  const props = defineProps<{
    tabs: TitleInterface<number>[];
    selectedTab?: number | null;
  }>();
  const route = useRoute();

  const selectedTab = ref<number | null>(props.selectedTab || null);
  const selectTab = (id: number) => {
    selectedTab.value = id;
    emit('update:modelValue', id);
  };

  watch(
    () => props.selectedTab,
    (newSelectedTab) => {
      selectedTab.value = newSelectedTab!;
      emit('update:modelValue', newSelectedTab);
    },
    { deep: true },
  );
</script>

<template>
  <div
    class="all_tabs"
    :class="{ disabled: route.params.id }"
    :style="{ '--tab-count': Math.max(tabs.length, 1) }"
  >
    <div
      v-for="item in tabs"
      :key="item.id"
      class="tab-item"
      :class="{ active: selectedTab === item.id }"
      @click="selectTab(item.id)"
    >
      <RadioButton v-model="selectedTab" :input-id="String(item.id)" name="tab" :value="item.id" />
      <label>{{ $t(item.title!) }}</label>
    </div>
  </div>
</template>

<style scoped>
  .all_tabs {
    grid-template-columns: repeat(var(--tab-count), minmax(0, 1fr));

    @media (max-width: 1000px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .disabled {
    opacity: 0.5;
    position: relative;

    &::after {
      background-color: transparent;
      content: '';
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 9999;
    }
  }
</style>

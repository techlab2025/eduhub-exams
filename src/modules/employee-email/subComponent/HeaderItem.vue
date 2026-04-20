<script setup lang="ts">
interface HeaderItemProps {
  header: string;
  content: string;
  id: number;
}

const props = defineProps<{
  item: HeaderItemProps;
}>();
</script>
<template>
  <div>
    <h1>{{ item?.header }}</h1>
    <p>{{ item?.content }}</p>
    <p>{{ item?.id }}</p>
  </div>
</template>

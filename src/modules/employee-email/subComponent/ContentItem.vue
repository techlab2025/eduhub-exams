<script setup lang="ts">
interface ContentItemProps {
  content: string;
  header: string;
  id: number;
  text: string;
}

const props = defineProps<{
  item: ContentItemProps;
}>();
</script>
<template>
  <div>
    <p>{{ item?.content }}</p>
    <h1>{{ item?.header }}</h1>
    <p>{{ item?.id }}</p>
    <p>{{ item?.text }}</p>
  </div>
</template>

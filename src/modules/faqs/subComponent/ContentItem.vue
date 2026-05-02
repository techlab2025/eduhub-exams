<script setup lang="ts">
  defineProps<{
    item: Record<string, unknown>;
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

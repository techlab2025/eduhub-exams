<script setup lang="ts">
  import NoItem from '@/assets/images/NoItem.gif';
  const { image, title, description } = defineProps<{
    image?: string;
    title: string;
    description?: string;
  }>();
</script>
<template>
  <div class="empty-items">
    <img :src="image || NoItem" alt="" />
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
  </div>
</template>

<style scoped>
  .empty-items {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 500px;
    gap: 10px;
  }
  h2 {
    color: #1a1a1a;
    font-size: 24px;
    font-weight: 600;
  }
  p {
    color: #4b4b4b;
    max-width: 442px;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
  }
  .empty-items img {
    width: 300px;
    height: 300px;
  }
</style>

<script setup lang="ts">
  import ArrowIcons from '../../icons/ArrowIcons.vue';

  interface BreadCramp {
    title: string;
    link: string;
  }

  defineProps<{
    BreadCramps: BreadCramp[];
  }>();
</script>

<template>
  <nav class="breadcrumbs" aria-label="breadcrumb">
    <ul>
      <li v-for="(item, index) in BreadCramps" :key="item.link">
        <a :href="item.link">{{ item.title }}</a>
        <ArrowIcons v-if="index < BreadCramps.length - 1" />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
  .breadcrumbs ul {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 0.25rem;
  }

  .breadcrumbs li {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .breadcrumbs a {
    text-decoration: none;
    color: inherit;
  }
</style>

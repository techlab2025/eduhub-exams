<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import ArticleController from '../../controllers/Article.controller';
  import ShowArticlesParams from '../../../core/params/show.Articles.params';
  import OverViewArticle from './OverViewArticle.vue';
  import ArticleQuestion from './ArticleQuestion.vue';
  // import AnalysisReport from './AnalysisReport.vue';

  const controller = ArticleController.getInstance();
  const state = computed(() => controller.itemState.value);
  const route = useRoute();

  // const fetchArticle = async () => {
  //     await controller.fetchOne(new ShowArticlesParams(Number(route.params.id)));
  // }
  onMounted(() => fetchArticle());

  // const updateData = (filters: any) => {
  //   console.log(filters);

  //   fetchArticle();
  // };
  const fetchArticle = async () => {
    await controller.fetchOne(new ShowArticlesParams(Number(route.params.id)));
  };

  const updateData = () => fetchArticle();
</script>
<template>
  <div class="Article_details">
    <OverViewArticle :artical="state.data!" />
    <!-- <AnalysisReport :artical="state.data!" /> -->
    <ArticleQuestion :artical="state.data!" @update-data="updateData" />
  </div>
</template>

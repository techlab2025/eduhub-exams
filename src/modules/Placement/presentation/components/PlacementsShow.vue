<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import placementController from '../controllers/placement.controller';
  import ShowplacementParams from '../../core/params/show.placement.params';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const controller = placementController.getInstance();
  const showState = computed(() => controller.itemState.value);
  onMounted(() => {
    const params = new ShowplacementParams(Number(route.params.id));
    controller.fetchOne(params);
  });
</script>

<template>
  <QuestionHeader v-if="showState?.data" :questionData="showState?.data" />

  <div class="question-show-page">
    <!-- <h1>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto atque suscipit, quaerat
      perspiciatis, autem ipsa nam perferendis commodi eum deleniti rerum animi dolores nostrum
      debitis est, esse vitae? Facilis, provident?
    </h1> -->
  </div>
</template>

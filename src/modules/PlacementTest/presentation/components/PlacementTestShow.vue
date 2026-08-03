<script lang="ts" setup>
  import { computed, onMounted } from 'vue';
  import PlacementTestController from '../controllers/placement.test.controller';
  import ShowPlacementTestParams from '../../core/params/show.placement.params';
  import { useRoute } from 'vue-router';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import PlacemnetStudentCard from './subCompnents/PlacemnetStudentCard.vue';
  import PlacemnetExamCard from './subCompnents/PlacemnetExamCard.vue';
  import PlacementResultAnalysisCard from './subCompnents/PlacementResultAnalysisCard.vue';
  import PlacementTimeAnalysisCard from './subCompnents/PlacementTimeAnalysisCard.vue';
  import PlacementQuestionTimeChart from './subCompnents/PlacementQuestionTimeChart.vue';
  import PlacementAnalysisTabs from './subCompnents/PlacementAnalysisTabs.vue';

  const controller = PlacementTestController.getInstance();
  const state = computed(() => controller.itemState.value);

  const route = useRoute();
  const FetchDetails = async () => {
    const showPlacementTestParams = new ShowPlacementTestParams(
      route.params.id as unknown as number,
    );
    await controller.fetchOne(showPlacementTestParams);
  };

  onMounted(() => {
    FetchDetails();
  });
</script>
<template>
  <DataStatusBuilder :controller="state">
    <template #success="{ data }">
      <div class="placement-test-show">
        <PlacemnetStudentCard
          v-if="data.student && data.EducationClassificationSubject"
          :student="data.student"
          :subjects="data.EducationClassificationSubject"
        />
        <PlacemnetExamCard :placement-test="data" />
        <div class="placement-test-show__analysis">
          <PlacementResultAnalysisCard :placement-test="data" />
          <PlacementTimeAnalysisCard :placement-test="data" />
        </div>
        <PlacementQuestionTimeChart :placement-test="data" />
        <PlacementAnalysisTabs :placement-test="data" />
      </div>
    </template>
  </DataStatusBuilder>
</template>

<style scoped lang="scss">
  .placement-test-show {
    display: flex;
    flex-direction: column;
    gap: 14px;

    &__analysis {
      display: grid;
      grid-template-columns: minmax(280px, 0.9fr) minmax(420px, 1.9fr);
      gap: 14px;
      align-items: stretch;
    }
  }

  @media (max-width: 960px) {
    .placement-test-show__analysis {
      grid-template-columns: 1fr;
    }
  }
</style>

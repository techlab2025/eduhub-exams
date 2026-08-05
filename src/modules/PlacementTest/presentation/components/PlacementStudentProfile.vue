<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import ShowPlacementStudentParams from '../../core/params/show.placement.student.params';
  import PlacementTestController from '../controllers/placement.test.controller';
  import PlacementStudentExamHistory from './subCompnents/studentProfile/PlacementStudentExamHistory.vue';
  import PlacementStudentExamPerformance from './subCompnents/studentProfile/PlacementStudentExamPerformance.vue';
  import PlacementStudentForesight from './subCompnents/studentProfile/PlacementStudentForesight.vue';
  import PlacementStudentHeader from './subCompnents/studentProfile/PlacementStudentHeader.vue';
  import PlacementStudentSkillProgress from './subCompnents/studentProfile/PlacementStudentSkillProgress.vue';
  import PlacementStudentSnapshot from './subCompnents/studentProfile/PlacementStudentSnapshot.vue';

  const controller = PlacementTestController.getInstance();
  const state = computed(() => controller.studentProfileState.value);
  const route = useRoute();
  const { t } = useI18n();

  const fetchProfile = async () => {
    await controller.fetchStudentProfile(
      new ShowPlacementStudentParams(Number(route.params.studentId)),
    );
  };

  onMounted(fetchProfile);
</script>

<template>
  <DataStatusBuilder :controller="state" :on-retry="fetchProfile" use-skeleton>
    <template #success="{ data }">
      <main class="student-profile">
        <PlacementStudentHeader :profile="data" />
        <PlacementStudentForesight :profile="data" />
        <PlacementStudentSnapshot :snapshot="data.performanceSnapshot" />
        <PlacementStudentExamPerformance
          :performance="data.examPerformance"
          :analysis="data.examAnalysis"
        />
        <PlacementStudentSkillProgress
          :selected-skill="data.selectedSkill"
          :progress="data.skillProgress"
          :markers="data.planMarkers"
        />
        <PlacementStudentExamHistory :history="data.examHistory" />
      </main>
    </template>

    <template #empty>
      <p class="student-profile__state">{{ t('placement_test.no_profile_data') }}</p>
    </template>

    <template #failed>
      <div class="student-profile__state">
        <p>{{ t('placement_test.profile_load_failed') }}</p>
        <button type="button" @click="fetchProfile">{{ t('placement_test.try_again') }}</button>
      </div>
    </template>
  </DataStatusBuilder>
</template>

<style lang="scss">
  @use '../styles/placement_test_student';
</style>

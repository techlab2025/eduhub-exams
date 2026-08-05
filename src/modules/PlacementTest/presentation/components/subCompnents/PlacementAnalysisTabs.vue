<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
  import PlacementSkillsAnalysis from './PlacementAnalysis/PlacementSkillsAnalysis.vue';
  import PlacementCurriculumAnalysis from './PlacementAnalysis/PlacementCurriculumAnalysis.vue';
  import PlacementQuestionsAnalysis from './PlacementAnalysis/PlacementQuestionsAnalysis.vue';
  import IconSkillAnanly from '@/shared/icons/IconSkillAnanly.vue';
  import IconCurent from '@/shared/icons/IconCurent.vue';
  import IconQuesion from '@/shared/icons/IconQuesion.vue';

  const PlacementAnalysisTabEnum = {
    skills: 'skills',
    curriculum: 'curriculum',
    questions: 'questions',
  } as const;

  type PlacementAnalysisTab =
    (typeof PlacementAnalysisTabEnum)[keyof typeof PlacementAnalysisTabEnum];

  defineProps<{
    placementTest: ShowPlcaementTestModel;
  }>();

  const { t } = useI18n();
  const activeTab = ref<PlacementAnalysisTab>(PlacementAnalysisTabEnum.questions);

  const tabs = computed(() => [
    { value: PlacementAnalysisTabEnum.questions, label: t('placement_test.questions') },
    { value: PlacementAnalysisTabEnum.skills, label: t('placement_test.skills_analysis') },

    {
      value: PlacementAnalysisTabEnum.curriculum,
      label: t('placement_test.curriculum_analysis'),
    },
  ]);
</script>

<template>
  <section class="placement-analysis-tabs">
    <div class="placement-analysis-tabs__list" role="tablist">
      <button
        v-for="tab in tabs"
        :id="`placement-${tab.value}-tab`"
        :key="tab.value"
        class="placement-analysis-tabs__tab"
        :class="{ 'placement-analysis-tabs__tab--active': activeTab === tab.value }"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.value"
        :aria-controls="`placement-${tab.value}-panel`"
        :data-tab="tab.value"
        @click="activeTab = tab.value"
      >
        <IconSkillAnanly v-if="tab.value === PlacementAnalysisTabEnum.skills" />
        <IconCurent v-else-if="tab.value === PlacementAnalysisTabEnum.curriculum" />
        <IconQuesion v-else-if="tab.value === PlacementAnalysisTabEnum.questions" />
        {{ tab.label }}
      </button>
    </div>

    <PlacementSkillsAnalysis
      v-if="activeTab === PlacementAnalysisTabEnum.skills"
      :placement-test="placementTest"
    />

    <PlacementCurriculumAnalysis
      v-else-if="activeTab === PlacementAnalysisTabEnum.curriculum"
      :placement-test="placementTest"
    />
    <PlacementQuestionsAnalysis v-else :placement-test="placementTest" />
  </section>
</template>

<style scoped lang="scss">
  .placement-analysis-tabs {
    padding: 14px;
    background: var(--gray-50);
    border-radius: var(--radius-xl);

    &__list {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 22px;
      margin-bottom: 14px;
    }

    &__tab {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 48px;
      color: var(--table-header-color);
      font-family: 'demi';
      font-size: var(--md-size);
      font-weight: 600;
      cursor: pointer;
      background: var(--gray-200);
      border: 1px solid transparent;
      border-radius: var(--radius-md);

      :deep(svg) {
        width: 17px;
        height: 17px;
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.5;
      }

      &--active {
        color: var(--gray-900);
        background: var(--bg-card);
        border-color: var(--PrimaryColor);

        :deep(path) {
          stroke: var(--PrimaryColor);
        }

        &::after {
          position: absolute;
          bottom: -20px;
          left: 50%;
          z-index: 2;
          width: 14px;
          height: 14px;
          content: '';
          background: var(--bg-card);
          border-top: 1px solid var(--border-weak);
          border-left: 1px solid var(--border-weak);
          transform: translateX(-50%) rotate(45deg);
        }
      }
    }
  }

  @media (max-width: 640px) {
    .placement-analysis-tabs {
      padding: 10px;

      &__list {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      &__tab--active::after {
        display: none;
      }
    }
  }
</style>

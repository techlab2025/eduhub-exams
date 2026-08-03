<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    PlacementAnalysisFilterEnum,
    type PlacementAnalysisFilterEnum as PlacementAnalysisFilter,
  } from '@/modules/PlacementTest/core/constant/placement.analysis.filter.enum';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
  import type ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';

  const props = defineProps<{
    placementTest: ShowPlcaementTestModel;
  }>();

  const { t } = useI18n();
  const activeFilter = ref<PlacementAnalysisFilter>(PlacementAnalysisFilterEnum.all);

  const filters = computed(() => [
    { value: PlacementAnalysisFilterEnum.all, label: t('placement_test.all') },
    { value: PlacementAnalysisFilterEnum.strong, label: t('placement_test.strong') },
    { value: PlacementAnalysisFilterEnum.average, label: t('placement_test.average') },
    { value: PlacementAnalysisFilterEnum.weak, label: t('placement_test.weak') },
  ]);

  const curriculumItems = computed(() =>
    (props.placementTest.quesions ?? []).map((question, index) => ({
      id: question.id ?? index,
      question,
      level: getLevel(question.correctStatus),
    })),
  );

  const filteredItems = computed(() => {
    if (activeFilter.value === PlacementAnalysisFilterEnum.all) return curriculumItems.value;

    return curriculumItems.value.filter((item) =>
      getTopics(item.question, item.level).some((topic) => topic.level === activeFilter.value),
    );
  });

  function getLevel(status?: number): PlacementAnalysisFilter {
    if (status === 1) return PlacementAnalysisFilterEnum.strong;
    if (status === 0) return PlacementAnalysisFilterEnum.weak;
    return PlacementAnalysisFilterEnum.average;
  }

  function getPath(question: ShowQuestionsModel): string {
    return (
      question.subjectTree?.full_title ??
      question.subjectTree?.title ??
      question.e_c_subject?.title ??
      '—'
    );
  }

  function getTopicLevel(
    topic: TitleInterface<number>,
    fallback: PlacementAnalysisFilter,
  ): PlacementAnalysisFilter {
    if (topic.subtitle === 1) return PlacementAnalysisFilterEnum.strong;
    if (topic.subtitle === 2) return PlacementAnalysisFilterEnum.average;
    if (topic.subtitle === 3) return PlacementAnalysisFilterEnum.weak;
    return fallback;
  }

  function getTopics(
    question: ShowQuestionsModel,
    fallback: PlacementAnalysisFilter,
  ): Array<{ id: number; title: string; level: PlacementAnalysisFilter }> {
    if (question.topics?.length) {
      return question.topics.map((topic) => ({
        id: topic.id,
        title: topic.title ?? '—',
        level: getTopicLevel(topic, fallback),
      }));
    }

    if (question.sequenceTree) {
      return [
        {
          id: question.sequenceTree.id,
          title: question.sequenceTree.title ?? '—',
          level: fallback,
        },
      ];
    }

    return [];
  }
</script>

<template>
  <div
    id="placement-curriculum-panel"
    class="curriculum-analysis"
    role="tabpanel"
    aria-labelledby="placement-curriculum-tab"
  >
    <h2>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
        <path d="m11 13 8-8 2 2-8 8-3 1 1-3Z" />
      </svg>
      {{ t('placement_test.curriculum_analysis') }}
    </h2>

    <div class="curriculum-analysis__filters" :aria-label="t('placement_test.analysis_filter')">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="curriculum-analysis__filter"
        :class="`curriculum-analysis__filter--${filter.value}`"
        type="button"
        :aria-pressed="activeFilter === filter.value"
        :data-filter="filter.value"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="curriculum-analysis__list">
      <article v-for="item in filteredItems" :key="item.id" class="curriculum-analysis__item">
        <strong>{{ getPath(item.question) }}</strong>
        <div class="curriculum-analysis__topics">
          <span
            v-for="topic in getTopics(item.question, item.level)"
            :key="topic.id"
            :class="`curriculum-analysis__topic--${topic.level}`"
          >
            {{ topic.title }}
          </span>
        </div>
      </article>

      <p v-if="!filteredItems.length" class="curriculum-analysis__empty">
        {{ t('placement_test.no_curriculum_data') }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .curriculum-analysis {
    padding: 20px 14px 14px;
    background: var(--bg-card);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-xl);

    > h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 22px;
      color: var(--gray-900);
      font-family: var(--font-family);
      font-size: var(--md-size);

      svg {
        width: 18px;
        height: 18px;
        fill: none;
        stroke: var(--gray-900);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.5;
      }
    }

    &__filters {
      display: grid;
      grid-template-columns: 120px repeat(3, minmax(160px, 1fr));
      gap: 12px;
      margin-bottom: 22px;
    }

    &__filter {
      min-height: 42px;
      color: var(--gray-700);
      font-family: var(--font-family);
      cursor: pointer;
      background: var(--gray-100);
      border: 0;
      border-radius: var(--radius-full);

      &--strong {
        color: var(--success);
        background: var(--success-light);
      }

      &--average {
        color: var(--warning-dark);
        background: var(--warning-light);
      }

      &--weak {
        color: var(--danger);
        background: var(--danger-light);
      }

      &[aria-pressed='true'] {
        color: var(--bg-card);
        background: var(--PrimaryColor);
      }
    }

    &__list {
      min-height: 360px;
      padding: 0 16px;
      background: var(--gray-50);
      border-radius: var(--radius-lg);
    }

    &__item {
      display: grid;
      grid-template-columns: minmax(340px, 1.7fr) minmax(220px, 1fr);
      gap: 28px;
      min-height: 118px;
      padding: 18px 0;
      border-bottom: 1px dashed var(--border-weak);

      &:last-of-type {
        border-bottom: 0;
      }

      > strong {
        position: relative;
        color: var(--gray-700);
        font-size: var(--xs-size);
        line-height: 1.6;

        &::after {
          position: absolute;
          top: 10px;
          inset-inline-end: -28px;
          width: 22px;
          content: '';
          border-top: 1px dashed var(--border-weak);
        }

        &::before {
          position: absolute;
          top: 7px;
          inset-inline-end: -28px;
          width: 6px;
          height: 6px;
          content: '';
          border-top: 1px solid var(--border-strong);
          border-inline-end: 1px solid var(--border-strong);
          transform: rotate(45deg);
        }
      }
    }

    &__topics {
      display: flex;
      flex-direction: column;
      gap: 12px;

      span {
        position: relative;
        padding-inline-start: 20px;
        font-size: var(--xs-size);
        font-weight: 600;

        &::before {
          position: absolute;
          top: 50%;
          inset-inline-start: 0;
          width: 13px;
          content: '';
          border-top: 1px dashed var(--border-weak);
        }

        &::after {
          position: absolute;
          top: calc(50% - 3px);
          inset-inline-start: 10px;
          width: 6px;
          height: 6px;
          content: '';
          border-top: 1px solid var(--border-strong);
          border-inline-end: 1px solid var(--border-strong);
          transform: rotate(45deg);
        }
      }
    }

    &__topic {
      &--strong {
        color: var(--success);
      }

      &--average {
        color: var(--warning-dark);
      }

      &--weak {
        color: var(--danger);
      }
    }

    &__empty {
      padding: 60px 0;
      color: var(--gray-500);
      text-align: center;
    }
  }

  @media (max-width: 720px) {
    .curriculum-analysis {
      &__filters {
        grid-template-columns: repeat(2, 1fr);
      }

      &__item {
        grid-template-columns: 1fr;
        min-height: auto;
      }
    }
  }
</style>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import IconWarning from '@/shared/icons/IconWarning.vue';
  import type StudentExamAnalysisModel from '../../../../core/models/subModels/studentProfile/student.exam.analysis.model';
  import type StudentExamPerformanceModel from '../../../../core/models/subModels/studentProfile/student.exam.performance.model';

  defineProps<{
    performance: StudentExamPerformanceModel[];
    analysis?: StudentExamAnalysisModel;
  }>();
  const { t } = useI18n();
</script>

<template>
  <section class="student-profile__exam-performance profile-card">
    <div class="student-profile__section-heading">
      <div>
        <h2 class="profile-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 19 9 14l4 3 7-9m0 0h-5m5 0v5" />
          </svg>
          {{ t('placement_test.improve_performance') }}
        </h2>
        <p>{{ t('placement_test.performance_description') }}</p>
      </div>
      <span class="profile-select">{{ t('placement_test.arabic') }}⌄</span>
    </div>

    <div class="student-profile__exam-layout">
      <div class="bar-chart" :aria-label="t('placement_test.exam_performance_chart')">
        <div class="bar-chart__plot">
          <span v-for="tick in [60, 50, 40, 30, 20, 10, 0]" :key="tick" class="bar-chart__line">
            <i>{{ tick }}</i>
          </span>
          <div class="bar-chart__bars">
            <div v-for="item in performance" :key="item.examNumber" class="bar-chart__item">
              <span
                class="bar-chart__bar"
                :class="`bar-chart__bar--${item.tone}`"
                :style="{ '--bar-score': item.score ?? 0 }"
              ></span>
              <small>{{ item.label }}</small>
            </div>
          </div>
        </div>
      </div>

      <aside class="student-profile__exam-analysis">
        <h3>{{ t('placement_test.exams_analysis') }}</h3>
        <div class="student-profile__score-grid">
          <article class="score-card score-card--success">
            <span>{{ t('placement_test.best_score') }}</span>
            <strong>{{ analysis?.bestScore }}%</strong>
            <small>{{ t('placement_test.exam_id', { id: analysis?.bestExamId }) }}</small>
          </article>
          <article class="score-card score-card--danger">
            <span>{{ t('placement_test.lowest_score') }}</span>
            <strong>{{ analysis?.lowestScore }}%</strong>
            <small>{{ t('placement_test.exam_id', { id: analysis?.lowestExamId }) }}</small>
          </article>
          <article class="score-card">
            <span>{{ t('placement_test.average_score') }}</span>
            <strong>{{ analysis?.averageScore }}%</strong>
          </article>
        </div>
        <p v-if="analysis?.performanceDeclining" class="student-profile__decline-warning">
          <span aria-hidden="true"><IconWarning /></span>
          {{ t('placement_test.performance_decline') }}
        </p>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import IconDimoned from '@/shared/icons/IconDimoned.vue';
  import PlansCreat from '@/shared/icons/PlansCreat.vue';
  import Totalexam from '@/shared/icons/Totalexam.vue';
  import type StudentPerformanceSnapshotModel from '../../../../core/models/subModels/studentProfile/student.performance.snapshot.model';

  defineProps<{ snapshot?: StudentPerformanceSnapshotModel }>();
  const { t } = useI18n();
</script>

<template>
  <section class="student-profile__snapshot profile-card">
    <h2 class="profile-title">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19V9m5 10V5m5 14v-7m4 7H3" />
      </svg>
      {{ t('placement_test.performance_snapshot') }}
    </h2>
    <div class="student-profile__snapshot-grid">
      <article>
        <span>{{ t('placement_test.current_plan') }}</span>
        <strong>{{ snapshot?.currentPlan }}</strong>
        <small>{{ t('placement_test.expire_date', { date: snapshot?.planExpiresAt }) }}</small>
        <IconDimoned class="snapshot-icon" aria-hidden="true" />
      </article>
      <article>
        <span>{{ t('placement_test.total_exams') }}</span>
        <strong>{{ snapshot?.totalExams }}</strong>
        <small>+{{ snapshot?.examsThisMonth }} {{ t('placement_test.this_month') }}</small>
        <Totalexam class="snapshot-icon" aria-hidden="true" />
      </article>
      <article>
        <span>{{ t('placement_test.total_plans_created') }}</span>
        <strong>{{ snapshot?.totalPlansCreated }}</strong>
        <small>+{{ snapshot?.plansThisMonth }} {{ t('placement_test.this_month') }}</small>
        <PlansCreat class="snapshot-icon" aria-hidden="true" />
      </article>
    </div>
  </section>
</template>

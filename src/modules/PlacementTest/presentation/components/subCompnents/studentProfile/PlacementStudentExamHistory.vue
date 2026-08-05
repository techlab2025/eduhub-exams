<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import type StudentExamHistoryModel from '../../../../core/models/subModels/studentProfile/student.exam.history.model';

  defineProps<{ history: StudentExamHistoryModel[] }>();
  const { t } = useI18n();
</script>

<template>
  <section class="student-profile__history profile-card">
    <h2><span aria-hidden="true">🧩</span>{{ t('placement_test.exam_history') }}</h2>
    <div class="student-profile__history-list">
      <article v-for="exam in history" :key="exam.id">
        <span class="student-profile__history-number">{{ exam.id }}</span>
        <div class="student-profile__history-info">
          <h3>
            {{ exam.title }}
            <i>_</i>
            <strong>{{ exam.language }}</strong>
            <i>_</i>
            {{ exam.scope }}
          </h3>
          <p>
            <span>{{ t('placement_test.subject') }}: {{ exam.subject }}</span>
            <span>{{ t('placement_test.date') }}: {{ exam.date }}</span>
            <span>{{ t('placement_test.duration') }}: {{ exam.duration }}</span>
          </p>
        </div>
        <div class="student-profile__history-result" :class="`is-${exam.status}`">
          <strong>{{ exam.score }}/100</strong>
          <span>{{ exam.status ? t(`placement_test.${exam.status}`) : '' }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

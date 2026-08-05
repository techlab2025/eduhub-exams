<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import IconStars from '@/shared/icons/IconStars.vue';
  import type PlacementStudentProfileModel from '../../../../core/models/placement.student.profile.model';

  defineProps<{ profile: PlacementStudentProfileModel }>();
  const { t } = useI18n();
</script>

<template>
  <section class="student-profile__foresight profile-card">
    <IconStars class="student-profile__foresight-icon" aria-hidden="true" />
    <div>
      <h2>{{ t('placement_test.academic_foresight') }}</h2>
      <p>
        {{ profile.foresightMessage }}
        <strong v-if="profile.declinePercentage !== undefined">
          {{
            t('placement_test.decline_detail', {
              percentage: profile.declinePercentage,
              subject: profile.declineSubject,
            })
          }}
        </strong>
      </p>
    </div>
  </section>
</template>

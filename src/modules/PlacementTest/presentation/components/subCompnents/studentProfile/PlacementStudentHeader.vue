<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import type PlacementStudentProfileModel from '../../../../core/models/placement.student.profile.model';

  defineProps<{ profile: PlacementStudentProfileModel }>();
  const { t } = useI18n();
</script>

<template>
  <section class="student-profile__identity profile-card">

    <div class="student-profile__person">
      <img
        v-if="profile.placementTest.student?.image"
        :src="profile.placementTest.student.image"
        :alt="profile.placementTest.student.name"
      />
      <span v-else class="student-profile__avatar-placeholder" aria-hidden="true">
        {{ profile.placementTest.student?.name?.charAt(0) ?? '?' }}
      </span>
      <div>
        <div class="student-profile__name-row">
          <h1>{{ profile.placementTest.student?.name }}</h1>
          <span class="student-profile__active">
            <i></i>
            {{ profile.studentStatus }}
          </span>
        </div>
        <p>{{ profile.studentCode }}</p>
      </div>
    </div>

    <div class="student-profile__actions">
      <button type="button" :aria-label="t('placement_test.export')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 15v4h14v-4" />
        </svg>
      </button>
      <button type="button" :aria-label="t('placement_test.share')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4" />
        </svg>
      </button>
    </div>

    <div class="student-profile__path">
      <span v-for="item in profile.classificationPath" :key="item">{{ item }}</span>
    </div>

    <dl class="student-profile__contact">
      <div>
        <dt>{{ t('placement_test.enrolled_since') }}</dt>
        <dd>{{ profile.enrolledSince || '—' }}</dd>
      </div>
      <div>
        <dt>{{ t('placement_test.parent_name') }}</dt>
        <dd>{{ profile.parentName || '—' }}</dd>
      </div>
      <div>
        <dt>{{ t('placement_test.parent_phone') }}</dt>
        <dd>{{ profile.parentPhone || '—' }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
  import type EducationClassificationSubjectModel from '@/shared/GeneralModels/education.classification.subject.model';
  import type StudentModel from '@/shared/GeneralModels/student.model';
  import ExportPlacmentIcon from '@/shared/icons/PlcaemenIcons/ExportPlacmentIcon.vue';
  import PlacemenetShowIcon from '@/shared/icons/PlcaemenIcons/PlacemenetShowIcon.vue';
  import SHarePlacemenetIcon from '@/shared/icons/PlcaemenIcons/SHarePlacemenetIcon.vue';

  const { student, subjects } = defineProps<{
    student: StudentModel;
    subjects: EducationClassificationSubjectModel;
  }>();
  const getSubjectPath = (item: EducationClassificationSubjectModel) => {
    if (!item?.fullTitle) return '';
    const parts = item.fullTitle?.split(/\s*->\s*/);

    return parts?.map((subject) => subject.trim()) ?? '';
  };
</script>
<template>
  <div class="placement-student-card">
    <div class="placement-student-card-header">
      <div class="card-body">
        <img
          :src="student?.image || `https://cyber.comolho.com/static/img/avatar.png`"
          :alt="student?.name || ''"
        />
        <div class="text">
          <h5 class="card-title">{{ student?.name }}</h5>
          <span>{{ student.id }}</span>
        </div>
      </div>
      <div class="card-action">
        <ExportPlacmentIcon class="card-icon" />
        <router-link
          v-if="student.id"
          :to="{
            name: 'Placement Test Student Profile',
            params: { studentId: student.id },
          }"
          class="card-icon-link"
          :title="$t('placement_test.open_profile')"
        >
          <PlacemenetShowIcon class="card-icon" />
        </router-link>
        <SHarePlacemenetIcon class="card-icon" />
      </div>
    </div>
    <div class="subjects">
      <div v-for="subject in getSubjectPath(subjects)" :key="subject" class="subject">
        {{ subject }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .placement-student-card {
    position: relative;
    display: flex;
    align-items: start;
    flex-direction: column;
    justify-content: start;
    width: 100%;
    gap: 10px;
    padding: 10px;
    overflow: hidden;
    background-color: var(--gray-50);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-xl);

    .placement-student-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .card-body {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 10px;

        img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .text {
          display: flex;
          align-items: start;
          flex-direction: column;
          justify-content: start;
          gap: 5px;

          h5 {
            color: var(--gray-900);
            font-family: var(--font-family);
            font-size: var(--md-size-2);
            font-weight: 700;
          }

          span {
            color: var(--gray-500);
            font-family: var(--font-family);
            font-size: var(--md-size);
            font-weight: 500;
          }
        }
      }

      .card-action {
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;

        .card-icon {
          cursor: pointer;
        }

        .card-icon-link {
          display: inline-flex;
          color: inherit;
        }
      }
    }

    .subjects {
      display: flex;
      align-items: center;
      justify-content: start;

      .subject {
        margin: 5px;
        padding: 5px 30px;
        color: var(--gray-700);
        font-family: var(--font-family);
        font-size: var(--sm-size);
        font-weight: 400;
        background-color: var(--bg-card);
        border-radius: var(--radius-full);
      }
    }

    &::after {
      position: absolute;
      right: 0;
      bottom: -90px;
      width: 200px;
      height: 200px;
      content: '';
      background-color: var(--gray-200);
      border-radius: 50%;
    }

    &::before {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 100px;
      height: 100px;
      content: '';
      background-color: var(--gray-200);
      border-radius: 50%;
    }
  }
</style>

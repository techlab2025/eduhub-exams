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
        <PlacemenetShowIcon class="card-icon" />
        <SHarePlacemenetIcon class="card-icon" />
      </div>
    </div>
    <div class="subjects">
      <div class="subject" v-for="subject in getSubjectPath(subjects)" :key="subject">
        {{ subject }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .placement-student-card {
    width: 100%;
    background-color: #24385c0d;
    border-radius: 24px;
    border: 1px solid #4faf7c1a;
    padding: 10px;
    gap: 10px;
    display: flex;
    justify-content: start;
    align-items: start;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    .placement-student-card-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .card-body {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 10px;
        img {
          width: 50px;
          height: 50px;
        }
        .text {
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: start;
          justify-content: start;
          h5 {
            color: #111827;
            font-size: 18px;
            font-weight: 700;
            font-family: 'Demi';
          }
          span {
            color: #8a8a8a;
            font-size: 16px;
            font-weight: 500;
            font-family: 'Demi';
          }
        }
      }
      .card-action {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        z-index: 999;
        .card-icon {
          cursor: pointer;
        }
      }
    }
    .subjects {
      display: flex;
      justify-content: start;
      align-items: center;
      .subject {
        margin: 5px;
        padding: 5px 30px;
        background-color: white !important;
        border-radius: 20px;
        color: #4b4b4b;
        font-size: 14px;
        font-weight: 400;
        font-family: 'Demi';
      }
    }
    &::after {
      content: '';
      position: absolute;
      border-width: 2px;
      border-radius: 50%;
      background-color: #24385c26;
      width: 200px;
      height: 200px;
      bottom: -90px;
      right: 0px;
    }
    &::before {
      content: '';
      position: absolute;
      border-width: 2px;
      border-radius: 50%;
      background-color: #24385c26;
      width: 100px;
      height: 100px;
      top: -20px;
      right: -20px;
    }
  }
</style>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import type StudentPlanMarkerModel from '../../../../core/models/subModels/studentProfile/student.plan.marker.model';
  import type StudentSkillProgressModel from '../../../../core/models/subModels/studentProfile/student.skill.progress.model';

  defineProps<{
    selectedSkill?: string;
    progress: StudentSkillProgressModel[];
    markers: StudentPlanMarkerModel[];
  }>();

  const { t } = useI18n();
  const chartWidth = 900;
  const chartStart = 52;
  const chartEnd = 875;
  const chartTop = 38;
  const chartBottom = 190;
  const skillTicks = [60, 50, 40, 30, 20, 10, 0];

  const pointX = (examNumber: number | undefined, total: number): number => {
    if (total <= 1) return chartStart;
    return chartStart + (((examNumber ?? 1) - 1) / (total - 1)) * (chartEnd - chartStart);
  };

  const pointY = (percentage: number | undefined): number =>
    chartBottom - ((percentage ?? 0) / 60) * (chartBottom - chartTop);

  const skillPolyline = (points: StudentSkillProgressModel[]): string =>
    points
      .map((point) => `${pointX(point.examNumber, points.length)},${pointY(point.percentage)}`)
      .join(' ');
</script>

<template>
  <section class="student-profile__skill profile-card">
    <div class="student-profile__section-heading">
      <h2 class="profile-title">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {{ t('placement_test.skill_progress') }}
      </h2>
      <span class="profile-select">{{ selectedSkill }}⌄</span>
    </div>

    <div class="line-chart">
      <span class="line-chart__y-label">{{ t('placement_test.skill_percentage') }}</span>
      <svg
        :viewBox="`0 0 ${chartWidth} 230`"
        role="img"
        :aria-label="t('placement_test.skill_progress_chart')"
      >
        <g class="line-chart__grid">
          <g v-for="tick in skillTicks" :key="tick">
            <line :x1="chartStart" :x2="chartEnd" :y1="pointY(tick)" :y2="pointY(tick)" />
            <text x="8" :y="pointY(tick) + 4">{{ tick }}%</text>
          </g>
        </g>
        <g class="line-chart__plans">
          <g v-for="marker in markers" :key="`${marker.title}-${marker.examNumber}`">
            <line
              :class="`line-chart__plan--${marker.tone}`"
              :x1="pointX(marker.examNumber, progress.length)"
              :x2="pointX(marker.examNumber, progress.length)"
              :y1="chartTop"
              :y2="chartBottom"
            />
            <text
              :class="`line-chart__plan-label--${marker.tone}`"
              :x="pointX(marker.examNumber, progress.length)"
              y="24"
              text-anchor="middle"
            >
              {{ marker.title }}
            </text>
          </g>
        </g>
        <polyline class="line-chart__series" :points="skillPolyline(progress)" />
        <g class="line-chart__points">
          <circle
            v-for="point in progress"
            :key="point.examNumber"
            :cx="pointX(point.examNumber, progress.length)"
            :cy="pointY(point.percentage)"
            r="3"
          />
        </g>
        <g class="line-chart__x-labels">
          <text
            v-for="point in progress"
            :key="point.examNumber"
            :x="pointX(point.examNumber, progress.length)"
            y="214"
            text-anchor="middle"
          >
            {{ point.examNumber }}E
          </text>
        </g>
      </svg>
      <span class="line-chart__x-title">{{ t('placement_test.exam_number') }}</span>
    </div>
  </section>
</template>

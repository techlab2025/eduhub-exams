<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import type ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
  import IconSkill from '@/shared/icons/IconSkill.vue';
  import IconSkillAnanly from '@/shared/icons/IconSkillAnanly.vue';

  defineProps<{
    placementTest: ShowPlcaementTestModel;
  }>();

  const { t } = useI18n();
</script>

<template>
  <div
    id="placement-skills-panel"
    class="skills-analysis"
    role="tabpanel"
    aria-labelledby="placement-skills-tab"
  >
    <h2>
      <!-- <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 8v4l3 2M5 5l2 2" />
      </svg> -->
      <IconSkillAnanly />
      {{ t('placement_test.skills_analysis') }}
    </h2>

    <div class="skills-analysis__content">
      <div class="skills-analysis__progress-list">
        <div
          v-for="skill in placementTest.SkillsAnalysis"
          :key="skill.skill?.id"
          class="skills-analysis__progress-item"
        >
          <span>{{ skill.skill?.title }}</span>
          <div class="skills-analysis__progress-track">
            <span :style="{ '--skill-percentage': skill.precentage ?? 0 }"></span>
          </div>
          <strong>{{ skill.precentage ?? 0 }}%</strong>
        </div>
        <p v-if="!placementTest.SkillsAnalysis?.length" class="skills-analysis__empty">
          {{ t('placement_test.no_skills_data') }}
        </p>
      </div>

      <article class="skills-analysis__card skills-analysis__card--important">
        <h3>
          <!-- <span aria-hidden="true">◎</span> -->
          <IconSkill />
          {{ `${t('the')} ${placementTest.MostImportantSkillsAnalysis?.length} ${t('Most Important Skills')} ` }}  
        </h3> 
        <div v-for="skill in placementTest.MostImportantSkillsAnalysis" :key="skill.skill?.id">
          <span>{{ skill.skill?.title }}</span>
          <strong>{{ skill.precentage ?? 0 }}%</strong>
        </div>
        <p v-if="!placementTest.MostImportantSkillsAnalysis?.length">
          {{ t('placement_test.no_skills_data') }}
        </p>
      </article>

      <article class="skills-analysis__card skills-analysis__card--development">
        <h3>
          <span aria-hidden="true">!</span>
          {{ t('placement_test.skills_need_development') }}
        </h3>
        <div v-for="skill in placementTest.NeedDevelopSkillsAnalysis" :key="skill.skill?.id">
          <span>{{ skill.skill?.title }}</span>
          <strong>{{ skill.precentage ?? 0 }}%</strong>
        </div>
        <p v-if="!placementTest.NeedDevelopSkillsAnalysis?.length">
          {{ t('placement_test.no_skills_data') }}
        </p>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .skills-analysis {
    padding: 20px 16px 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-xl);

    > h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 24px;
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

    &__content {
      display: grid;
      grid-template-columns: minmax(320px, 1.55fr) minmax(230px, 1fr) minmax(230px, 1fr);
      gap: 16px;
      align-items: stretch;
    }

    &__progress-list {
      display: flex;
      justify-content: center;
      flex-direction: column;
      gap: 12px;
    }

    &__progress-item {
      display: grid;
      grid-template-columns: minmax(100px, 0.8fr) minmax(140px, 1.6fr) 48px;
      gap: 10px;
      align-items: center;
      color: var(--gray-600);

      strong {
        color: var(--gray-800);
        font-size: var(--xs-size);
      }
    }

    &__progress-track {
      height: 8px;
      overflow: hidden;
      background: var(--gray-100);
      border-radius: var(--radius-full);

      > span {
        display: block;
        width: clamp(0%, calc(var(--skill-percentage) * 1%), 100%);
        height: 100%;
        background: var(--PrimaryColor-alpha-40);
        border-radius: inherit;
      }
    }

    &__card {
      padding: 16px;
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-md);

      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 16px;
        color: var(--gray-900);
        font-size: var(--sm-size);

        span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          color: var(--success);
          font-size: var(--xs-size-2);
          border: 1px solid currentColor;
          border-radius: 50%;
        }
      }

      > div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
        color: var(--gray-600);

        strong {
          color: var(--gray-800);
        }
      }

      p {
        color: var(--gray-500);
      }

      &--important {
        background: var(--success-light);
        border-color: var(--PrimaryColor-alpha-40);
      }

      &--development {
        background: var(--danger-light);
        border-color: var(--danger-alpha-15);

        h3 span {
          color: var(--danger);
        }
      }
    }

    &__empty {
      color: var(--gray-500);
      text-align: center;
    }
  }

  @media (max-width: 960px) {
    .skills-analysis__content {
      grid-template-columns: 1fr;
    }
  }
</style>

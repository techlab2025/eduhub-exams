<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';

  const props = defineProps<{
    placementTest: ShowPlcaementTestModel;
  }>();

  const { t } = useI18n();
  
  const examDetails = computed(() =>
    [
      props.placementTest.EducationClassificationBranch?.title,
      props.placementTest.EducationClassificationSubject?.title,
    ].filter((item): item is string => Boolean(item)),
  );
</script>

<template>
  <section class="placement-exam-card" aria-labelledby="placement-exam-title">
    <div class="placement-exam-card__content">
      <span class="placement-exam-card__id"> {{ t('placement_test.id') }}: Ex-{{ placementTest.id }} </span>

      <div class="placement-exam-card__details">
        <h2 id="placement-exam-title">{{ t('placement_test.exam') }}</h2>
        <template v-for="(detail, index) in examDetails" :key="detail">
          <span class="placement-exam-card__separator" aria-hidden="true">_</span>
          <span
            class="placement-exam-card__detail"
            :class="{ 'placement-exam-card__detail--primary': index === 0 }"
          >
            {{ detail }}
          </span>
        </template>
      </div>
    </div>

    <time class="placement-exam-card__date" >
      {{ placementTest.createdAt }}
    </time>
  </section>
</template>

<style scoped lang="scss">
  .placement-exam-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 72px;
    padding: 14px 18px;
    background: var(--bg-card);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-md);

    &__content {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    &__id {
      color: var(--gray-500);
      font-size: var(--xs-size);
    }

    &__details {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    h2 {
      margin: 0;
      color: var(--gray-900);
      font-family: var(--font-family);
      font-size: var(--sm-size);
      font-weight: 700;
    }

    &__separator {
      color: var(--gray-400);
      font-weight: 700;
    }

    &__detail {
      color: var(--gray-700);
      font-size: var(--xs-size);

      &--primary {
        color: var(--PrimaryColor);
        font-weight: 600;
      }
    }

    &__date {
      flex: 0 0 auto;
      color: var(--gray-700);
      font-size: var(--xs-size);
      font-weight: 500;
    }
  }

  @media (max-width: 640px) {
    .placement-exam-card {
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
    }
  }
</style>

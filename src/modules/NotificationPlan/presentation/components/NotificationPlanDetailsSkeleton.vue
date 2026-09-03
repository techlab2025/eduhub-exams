<script setup lang="ts">
  import Skeleton from 'primevue/skeleton';
</script>

<template>
  <main
    class="notification-plan-details notification-plan-details-skeleton"
    role="status"
    aria-busy="true"
    :aria-label="$t('notification_plan.details.loading')"
  >
    <header class="notification-plan-details__page-heading">
      <Skeleton width="12rem" height="1rem" />
    </header>

    <section class="notification-plan-details__summary">
      <div class="notification-plan-details-skeleton__summary-copy">
        <div class="notification-plan-details-skeleton__title-line">
          <Skeleton width="16rem" height="1.4rem" />
          <Skeleton width="4.5rem" height="1.5rem" border-radius="1rem" />
        </div>
        <Skeleton width="13rem" height="0.75rem" />
      </div>
      <Skeleton shape="circle" size="3rem" />
    </section>

    <div class="notification-plan-details__layout">
      <div class="notification-plan-details__content">
        <section class="notification-plan-details__recipients notification-plan-details__card">
          <header class="notification-plan-details-skeleton__section-heading">
            <Skeleton width="7rem" height="0.95rem" />
            <Skeleton width="15rem" height="0.7rem" />
          </header>
          <div class="notification-plan-details__recipient-list">
            <Skeleton width="6rem" height="1.8rem" border-radius="1rem" />
            <Skeleton width="5rem" height="1.8rem" border-radius="1rem" />
            <Skeleton width="7rem" height="1.8rem" border-radius="1rem" />
          </div>
        </section>

        <section
          class="notification-plan-details__triggers-heading notification-plan-details-skeleton__section-heading"
        >
          <Skeleton width="13rem" height="1rem" />
          <Skeleton width="80%" height="0.7rem" />
        </section>

        <div class="notification-plan-details__features">
          <article class="notification-plan-details__feature">
            <header>
              <Skeleton width="7rem" height="0.95rem" />
              <Skeleton shape="circle" size="2.25rem" />
            </header>
            <div class="notification-plan-details__feature-body">
              <div class="notification-plan-details-skeleton__action-list">
                <Skeleton width="6.5rem" height="1.65rem" border-radius="1rem" />
                <Skeleton width="7.5rem" height="1.65rem" border-radius="1rem" />
                <Skeleton width="6rem" height="1.65rem" border-radius="1rem" />
              </div>
              <div class="notification-plan-details-skeleton__message">
                <Skeleton width="7rem" height="0.75rem" />
                <Skeleton width="100%" height="3.5rem" />
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="notification-plan-details__record notification-plan-details__card">
        <div class="notification-plan-details-skeleton__record-heading">
          <Skeleton width="8rem" height="0.95rem" />
        </div>
        <div class="notification-plan-details-skeleton__record-list">
          <div v-for="row in 4" :key="row" class="notification-plan-details-skeleton__record-row">
            <Skeleton width="5rem" height="0.7rem" />
            <Skeleton width="7rem" height="0.7rem" />
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

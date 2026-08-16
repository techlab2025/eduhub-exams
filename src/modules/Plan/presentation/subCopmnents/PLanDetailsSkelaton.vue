<template>
  <main class="plan-details-skeleton" aria-hidden="true">
    <section class="skeleton-card skeleton-summary">
      <div class="summary-heading">
        <div class="title-line">
          <span class="skeleton skeleton-title"></span>
          <span class="skeleton skeleton-badge"></span>
          <span class="skeleton skeleton-badge skeleton-badge-wide"></span>
        </div>
        <span class="skeleton skeleton-action"></span>
      </div>

      <div class="summary-meta">
        <div v-for="item in 5" :key="item" class="meta-item">
          <span class="skeleton skeleton-icon"></span>
          <div class="meta-copy">
            <span class="skeleton skeleton-label"></span>
            <span class="skeleton skeleton-value"></span>
          </div>
        </div>
      </div>
    </section>

    <div class="skeleton-tabs">
      <span class="skeleton skeleton-tab"></span>
      <span class="skeleton skeleton-tab"></span>
    </div>

    <section class="skeleton-card details-section">
      <div class="section-heading">
        <span class="skeleton skeleton-heading-icon"></span>
        <span class="skeleton skeleton-section-title"></span>
      </div>
      <div class="pricing-grid">
        <div v-for="item in 4" :key="item" class="pricing-item">
          <span class="skeleton skeleton-pricing-label"></span>
          <span class="skeleton skeleton-pricing-value"></span>
        </div>
      </div>
    </section>

    <section class="skeleton-card details-section features-section">
      <div class="section-heading">
        <span class="skeleton skeleton-heading-icon"></span>
        <span class="skeleton skeleton-section-title"></span>
      </div>
      <div class="feature-groups">
        <div v-for="group in 3" :key="group" class="feature-group">
          <span class="skeleton skeleton-feature-title"></span>
          <div class="feature-items">
            <span v-for="item in 4" :key="item" class="skeleton skeleton-feature"></span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
  .plan-details-skeleton {
    display: grid;
    gap: var(--xl-size-base);
  }

  .skeleton-card {
    overflow: hidden;
    background: var(--BgWhite);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  .skeleton {
    position: relative;
    display: block;
    overflow: hidden;
    background: var(--gray-100-std);
    border-radius: var(--radius-sm);

    &::after {
      position: absolute;
      inset: 0;
      content: '';
      transform: translateX(-100%);
      background: linear-gradient(90deg, transparent, var(--BgWhite), transparent);
      animation: plan-skeleton-shimmer 1.4s infinite;
    }
  }

  .summary-heading {
    min-height: 64px;
    padding: var(--xl-size-base);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--xs-size);
  }

  .title-line,
  .feature-items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--xs-size);
  }

  .skeleton-title {
    width: 190px;
    height: 22px;
  }

  .skeleton-badge {
    width: 64px;
    height: 25px;
    border-radius: var(--radius-full);
  }

  .skeleton-badge-wide {
    width: 92px;
  }

  .skeleton-action {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    border-radius: var(--radius-md);
  }

  .summary-meta {
    padding: 0 var(--xl-size-base) var(--xl-size-base);
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .meta-item {
    min-width: 0;
    padding-inline: var(--xs-size);
    display: flex;
    align-items: center;
    gap: var(--xs-size-3);
    border-inline-end: 1px solid var(--border-weak);

    &:last-child {
      border-inline-end: 0;
    }
  }

  .skeleton-icon {
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
    border-radius: var(--radius-md);
  }

  .meta-copy {
    min-width: 0;
    display: grid;
    gap: 6px;
  }

  .skeleton-label {
    width: 72px;
    max-width: 100%;
    height: 9px;
  }

  .skeleton-value {
    width: 96px;
    max-width: 100%;
    height: 11px;
  }

  .skeleton-tabs {
    min-height: 48px;
    padding-inline: var(--xl-size-base);
    display: flex;
    align-items: center;
    gap: var(--xl-size-2);
    border-bottom: 4px solid var(--gray-100);
  }

  .skeleton-tab {
    width: 110px;
    height: 14px;
  }

  .details-section {
    padding: var(--xl-size-base);
    border-inline-start: 3px solid var(--gray-100-std);
  }

  .section-heading {
    min-height: 34px;
    display: flex;
    align-items: center;
    gap: var(--xs-size-3);
    border-bottom: 1px solid var(--border-weak);
  }

  .skeleton-heading-icon {
    width: 20px;
    height: 20px;
  }

  .skeleton-section-title {
    width: 130px;
    height: 14px;
  }

  .pricing-grid {
    padding-top: var(--xs-size);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--xs-size);
  }

  .pricing-item {
    display: flex;
    align-items: center;
    gap: var(--xs-size-3);
  }

  .skeleton-pricing-label {
    width: 125px;
    height: 12px;
  }

  .skeleton-pricing-value {
    width: 170px;
    height: 12px;
  }

  .features-section {
    background: var(--gray-50-std);
  }

  .feature-groups {
    padding-top: var(--xs-size);
    display: grid;
    gap: var(--xs-size);
  }

  .feature-group {
    padding: var(--xs-size) var(--xl-size-base);
    background: var(--BgWhite);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
  }

  .skeleton-feature-title {
    width: 145px;
    height: 12px;
    margin-bottom: var(--xs-size);
  }

  .feature-items {
    padding-top: var(--xs-size);
    border-top: 1px dashed var(--border-weak);
  }

  .skeleton-feature {
    width: 105px;
    height: 25px;
    border-radius: var(--radius-full);
  }

  @keyframes plan-skeleton-shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton::after {
      animation: none;
    }
  }

  @media (max-width: 768px) {
    .summary-meta,
    .pricing-grid {
      grid-template-columns: 1fr;
    }

    .summary-meta {
      gap: var(--xs-size);
    }

    .meta-item {
      padding: 0;
      border-inline-end: 0;
    }

    .skeleton-tabs {
      padding-inline: 0;
      justify-content: space-around;
      gap: 0;
    }

    .skeleton-tab {
      width: 35%;
    }

    .pricing-item {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>

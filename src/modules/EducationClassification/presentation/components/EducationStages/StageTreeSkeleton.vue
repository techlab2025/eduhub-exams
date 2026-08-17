<template>
  <div class="education-tree education-tree-skeleton">
    <!-- Left Panel Skeleton -->
    <div class="left-panel">
      <div class="toolbar">
        <div class="skeleton skeleton-search"></div>
      </div>

      <div class="tree-list">
        <div v-for="item in 6" :key="item" class="skeleton-tree-node" :class="`level-${item % 3}`">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-action"></div>
        </div>
      </div>

      <div class="skeleton skeleton-button"></div>
    </div>

    <!-- Right Panel Skeleton -->
    <div class="right-panel">
      <div class="right-header">
        <div class="right-title">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton skeleton-heading"></div>
        </div>
        <div class="skeleton skeleton-add"></div>
      </div>

      <div class="right-children">
        <div v-for="item in 5" :key="item" class="right-child-row skeleton-row">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton skeleton-child-name"></div>
          <div class="skeleton skeleton-label"></div>
          <span class="spacer"></span>
          <div class="skeleton skeleton-small-action"></div>
          <div class="skeleton skeleton-small-action"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use '../../../../../styles/variables' as *;
  @use '../../../../../styles/mixins/flex' as *;

  .education-tree-skeleton {
    .left-panel {
      padding-inline: 20px;
    }

    .right-panel {
      margin-inline: 20px;
    }

    .skeleton {
      position: relative;
      overflow: hidden;
      background: var(--gray-100-std);
      border-radius: 10px;
      gap: 10px;
    }

    .skeleton::after {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
      animation: skeleton-loading 1.4s infinite;
    }

    .skeleton-search {
      width: 100%;
      height: 44px;
      border-radius: 14px;
    }

    .tree-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 16px;
    }

    .skeleton-tree-node {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 46px;
      padding: 10px 12px;
      background: var(--standard-white);
      border: 1px solid var(--gray-200-std);
      border-radius: 14px;
    }

    // .skeleton-tree-node.level-1 {
    //   margin-inline-start: 18px;
    // }

    // .skeleton-tree-node.level-2 {
    //   margin-inline-start: 36px;
    // }

    .skeleton-icon {
      width: 18px;
      height: 18px;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .skeleton-title {
      width: 60%;
      height: 12px;
    }

    .skeleton-action {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      margin-inline-start: auto;
    }

    .skeleton-button {
      width: 100%;
      height: 44px;
      border-radius: 14px;
      margin-top: 18px;
    }

    .right-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }

    .right-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .skeleton-heading {
      width: 160px;
      height: 14px;
    }

    .skeleton-add {
      width: 34px;
      height: 34px;
      border-radius: 50%;
    }

    .right-children {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .skeleton-row {
      pointer-events: none;
    }

    .skeleton-child-name {
      width: 150px;
      height: 12px;
    }

    .skeleton-label {
      width: 70px;
      height: 20px;
      border-radius: 6px;
    }

    .skeleton-small-action {
      width: 24px;
      height: 24px;
      border-radius: 6px;
    }

    .spacer {
      flex: 1;
    }
  }

  @keyframes skeleton-loading {
    100% {
      transform: translateX(100%);
    }
  }
</style>

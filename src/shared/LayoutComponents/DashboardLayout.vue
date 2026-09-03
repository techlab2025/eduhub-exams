<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import SidebarNavigation from './SubComponents/SidebarNavigation.vue';
  import Navbar from './SubComponents/Navbar.vue';
  import FeatureHeader from '../FeatureHeader/FeatureHeader.vue';
  import DocumentIndexProgressOverlay from '@/modules/DocumentIndex/presentation/components/DocumentIndexProgressOverlay.vue';
  import IndexPluseIcon from '@/shared/icons/IndexPluseIcon.vue';

  interface HeaderAction {
    icon?: 'plus';
    label: string;
    to: string;
  }

  const route = useRoute();
  const router = useRouter();
  const { t, te } = useI18n();

  const headerAction = computed<HeaderAction | null>(() => {
    const action = route.meta.headerAction;
    if (!action || typeof action !== 'object') return null;

    const candidate = action as Record<string, unknown>;
    if (typeof candidate.label !== 'string' || typeof candidate.to !== 'string') return null;

    return {
      icon: candidate.icon === 'plus' ? 'plus' : undefined,
      label: candidate.label,
      to: candidate.to,
    };
  });

  const headerActionLabel = computed(() => {
    const label = headerAction.value?.label;
    if (!label) return '';
    return te(label) ? t(label) : label;
  });

  const executeHeaderAction = () => {
    if (headerAction.value) void router.push(headerAction.value.to);
  };
</script>

<template>
  <main class="content">
    <div class="sidebar-container">
      <SidebarNavigation />
    </div>
    <section class="content-wrapper">
      <Navbar />
      <div class="main-content">
        <FeatureHeader>
          <template #actions>
            <button
              v-if="headerAction"
              class="btn btn-primary feature-header__action"
              type="button"
              :aria-label="headerActionLabel"
              @click="executeHeaderAction"
            >
              <IndexPluseIcon v-if="headerAction.icon === 'plus'" aria-hidden="true" />
              <span>{{ headerActionLabel }}</span>
            </button>
          </template>
        </FeatureHeader>
        <slot />
      </div>
    </section>
    <DocumentIndexProgressOverlay />
  </main>
</template>

<style scoped>
  .mobile-nav {
    display: none;
  }

  @media (max-width: 600px) {
    .mobile-nav {
      display: block;
    }
  }
</style>

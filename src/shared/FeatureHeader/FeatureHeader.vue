<script setup lang="ts">
  import Breadcrumb from 'primevue/breadcrumb';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { buildBreadcrumb } from '../LayoutComponents/SubComponents/RouteHelper';
  import FeatureHeader from '@/assets/images/FeatureHeader.jpg';

  const route = useRoute();
  const router = useRouter();
  const { t, te } = useI18n();

  const translateBreadcrumbLabel = (label: string) => {
    const translationKey = label.toLocaleLowerCase() === 'home' ? 'home' : label;
    return te(translationKey) ? t(translationKey) : label;
  };

  const items = computed(() =>
    buildBreadcrumb(route, router).map((item) => ({
      ...item,
      label: translateBreadcrumbLabel(item.label),
    })),
  );
</script>

<template>
  <div class="feature-header-container">
    <img class="header-img" :src="FeatureHeader" alt="" aria-hidden="true" />
    <div class="content">
      <p class="title">
        {{ items[items.length - 1]?.label }}
      </p>
      <div class="breadcrump">
        <Breadcrumb :model="items">
          <template #item="{ item }">
            <span @click="$router.push(item.url!)">{{ item.label }}</span>
          </template>
          <template #separator> / </template>
        </Breadcrumb>
      </div>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

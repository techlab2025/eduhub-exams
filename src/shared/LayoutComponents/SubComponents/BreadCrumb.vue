<script setup lang="ts">
import BackIcon from "@/shared/icons/BackIcon.vue";
import Breadcrumb from "primevue/breadcrumb";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
// import FastRoutes from './FastrRoutes/FastRoutes.vue'

const route = useRoute();
const router = useRouter();
const items = ref<{ label: string; url?: string }[]>([]);
const navigationHistory = ref<{ path: string; name: string; params: any }[]>(
  [],
);

// Common words to ignore when comparing routes
const IGNORE_WORDS = new Set([
  "organization",
  "page",
  "view",
  "list",
  "detail",
  "details",
  "management",
  "admin",
  "dashboard",
]);

const extractKeywords = (text: string): string[] => {
  return text
    .toLowerCase()
    .split(/[-_\s]/)
    .filter((word) => word && !IGNORE_WORDS.has(word));
};

// Check if two routes share common MEANINGFUL keywords
const shareKeywords = (route1: string, route2: string): boolean => {
  const keywords1 = extractKeywords(route1);
  const keywords2 = extractKeywords(route2);

  // If either route has no meaningful keywords after filtering, they don't match
  if (keywords1.length === 0 || keywords2.length === 0) {
    return false;
  }

  return keywords1.some((keyword) => keywords2.includes(keyword));
};

// Extract the first path segment after /organization/
const getRouteSection = (path: string): string | null => {
  const match = path.match(/^\/organization\/([^\/]+)/);
  return match ? match[1] : null;
};

const removeGuard = router.beforeEach((to, from) => {
  if (to.path !== from.path && from.name) {
    const toName = to.name as string;
    const fromName = from.name as string;

    // Check if we're at organization base
    const isFromOrganization =
      from.path === "/organization" ||
      from.name?.toLowerCase() === "organization";
    const isToOrganization =
      to.path === "/organization" || to.name?.toLowerCase() === "organization";

    // If leaving or returning to organization home, clear history
    if (isFromOrganization || isToOrganization) {
      navigationHistory.value = [];
      return;
    }

    // Get the main section after /organization/ for both routes
    const fromSection = getRouteSection(from.path);
    const toSection = getRouteSection(to.path);

    // Compare route sections - only keep history if they match
    if (fromSection && toSection && fromSection === toSection) {
      // Same section - manage history
      const existingToIndex = navigationHistory.value.findIndex(
        (h) => h.path === to.path,
      );

      if (existingToIndex !== -1) {
        // Navigating back to existing route - trim history
        navigationHistory.value = navigationHistory.value.slice(
          0,
          existingToIndex,
        );
      } else {
        // Add from route if not already in history
        const existingFromIndex = navigationHistory.value.findIndex(
          (h) => h.path === from.path,
        );

        if (existingFromIndex === -1) {
          navigationHistory.value.push({
            path: from.path,
            name: fromName,
            params: { ...from.params },
          });
        }
      }
    } else {
      // Different sections - CLEAR history completely
      navigationHistory.value = [];
    }
  }
});

const GetFullPath = () => {
  items.value = [];

  items.value.push({
    label: "Home",
    url: "/",
  });

  const currentRouteName = route.name as string;

  if (!currentRouteName || currentRouteName.toLowerCase() === "organization") {
    return;
  }

  // Filter history to only include items related to current route
  const seenPaths = new Set<string>();
  const relatedHistory = navigationHistory.value.filter((h) =>
    shareKeywords(h.name, currentRouteName),
  );

  relatedHistory.forEach((historyItem) => {
    if (!seenPaths.has(historyItem.path)) {
      seenPaths.add(historyItem.path);
      items.value.push({
        label: historyItem.name,
        url: historyItem.path,
      });
    }
  });

  // Add current route if not duplicate
  if (!seenPaths.has(route.path)) {
    items.value.push({
      label: currentRouteName,
      url: undefined,
    });
  }
};

onMounted(() => {
  GetFullPath();
});

onUnmounted(() => {
  removeGuard();
});

watch(
  () => route.fullPath,
  () => {
    GetFullPath();
  },
);

const RouterBack = () => {
  if (navigationHistory.value.length > 0) {
    navigationHistory.value.pop();
  }
  router.back();
};

const IsHome = computed(
  () => route.path === "/organization" || route.path === "/admin",
);
</script>

<template>
  <div class="breadcrump-container">
    <div class="breadcrump">
      <button class="sidebar-back" @click="RouterBack" v-if="!IsHome">
        <BackIcon class="icon" />
        <span>back</span>
      </button>
      <Breadcrumb :model="items" />
    </div>
  </div>
</template>

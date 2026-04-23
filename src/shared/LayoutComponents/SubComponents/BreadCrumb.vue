<script setup lang="ts">
import Breadcrumb from "primevue/breadcrumb";
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { buildBreadcrumb } from "./RouteHelper";

const route = useRoute();
const router = useRouter();

// const getUrlWithParams = () => {
//   if (route.path.includes("add")) {
//     const Params = Object.values(route.params)[0];
//     return Params;
//   } else {
//     const Params = Object.values(route.query)[1];
//     return Params;
//   }
// };
const items = computed(() => {
  const breadcrumb = buildBreadcrumb(route, router);

  return breadcrumb;
});

// const allRoutes = router.getRoutes();

// const { user } = useUserStore();

watch(
  () => route,
  () => {
    buildBreadcrumb(route, router);
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div class="breadcrump-container">
    <div class="breadcrump">
      <Breadcrumb :model="items" />
    </div>
  </div>
</template>

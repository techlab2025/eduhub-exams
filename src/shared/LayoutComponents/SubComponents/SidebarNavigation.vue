<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CustomAccordion from "@/shared/Accordion/CustomAccordion.vue";
import IconSetting from "@/shared/icons/IconSetting.vue";
import BackIcon from "@/shared/icons/BackIcon.vue";

// ── Section Types ─────────────────────────────────────────────
const SidebarSectionType = {
  settings: "settings",
  location: "location",
  unknown: "unknown",
} as const;

type SidebarSectionKey =
  (typeof SidebarSectionType)[keyof typeof SidebarSectionType];

interface SidebarSection {
  title: string;
  type: SidebarSectionKey;
  icon?: string | object;
  routes: SidebarRoute[];
}

interface SidebarRoute {
  link: string;
  name: string;
}

// ── Section Data ──────────────────────────────────────────────
const sections = ref<SidebarSection[]>([
  {
    title: "settings",
    type: SidebarSectionType.settings,
    icon: IconSetting,
    routes: [
      {
        link: "/emails",
        name: "Emails",
      },
      {
        link: "/emails",
        name: "Emails",
      },
    ],
  },
  {
    title: "location",
    type: SidebarSectionType.location,
    icon: IconSetting,
    routes: [{ link: "/admin/countries", name: "country" }],
  },
]);

const route = useRoute();
const accordionValue = ref<string[]>([]);

watch(
  () => route.path,
  (newPath) => {
    const activeIndex = sections.value.findIndex((s) =>
      s.routes.some((r) => newPath.includes(r.link)),
    );
    accordionValue.value = activeIndex >= 0 ? [activeIndex.toString()] : [];
  },
  { immediate: true },
);

const isOpen = ref(true);
const router = useRouter();
const RouterBack = () => {
  router.back();
};
</script>

<template>
  <aside :class="['sidebar', isOpen ? 'open' : 'close']">
    <div class="sidebar-wrapper">
      <button class="sidebar-back" @click="RouterBack">
        <BackIcon class="icon" />
        <span>back</span>
      </button>

      <div class="links">
        <CustomAccordion
          :items="sections"
          :multiple="false"
          :defaultValue="accordionValue"
          AccordionClass="sidebar-accordion"
          AccordionPanelClass="sidebar-panel"
          AccordionHeaderClass="sidebar-header"
          AccordionContentClass="sidebar-content"
        >
          <template #header="{ item }">
            <div class="links-header">
              <component
                v-if="typeof item.icon !== 'string' && item.icon"
                :is="item.icon"
              />
              {{ $t(item.title) }}
            </div>
          </template>

          <template #content="{ item }">
            <ul>
              <li v-for="(routeItem, index) in item.routes" :key="index">
                <router-link
                  :to="routeItem.link"
                  :class="{ active: route.path.includes(routeItem.link) }"
                >
                  <span>{{ $t(routeItem.name) }}</span>
                </router-link>
              </li>
            </ul>
          </template>
        </CustomAccordion>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.links-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    a {
      display: block;
      padding: 0.5rem 0;
      color: inherit;
      text-decoration: none;

      &.active {
        color: #3b82f6;
        font-weight: 500;
      }
    }
  }
}

@media (max-width: 600px) {
  aside {
    display: none !important;
  }
}
</style>

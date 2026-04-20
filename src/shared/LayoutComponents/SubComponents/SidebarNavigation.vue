<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, type Component } from "vue";
import BackIcon from "@/shared/icons/BackIcon.vue";

// Example icons (replace with yours)
// import IconDashboard from "@/shared/icons/IconDashboard.vue";
import IconSettings from "@/shared/icons/IconSetting.vue";
import SettingIcon from "@/shared/icons/SidebarIcons/SettingIcon.vue";

const route = useRoute();
const router = useRouter();
interface MenuItem {
  link: string;
  name: string;
  icon?: Component;
  badge?: string;
  hasArrow?: boolean;
}
interface MenuSection {
  group: string;
  items: MenuItem[];
}
const RouterBack = () => {
  router.back();
};

const menu = ref<MenuSection[]>([
  {
    group: "Overview",
    items: [
      {
        link: "/employees",
        name: "Employees",
        icon: SettingIcon,
      },
    ],
  },
  {
    group: "location",
    items: [
      {
        link: "/countries",
        name: "Countries",
        icon: SettingIcon,
      },
    ],
  },
]);
</script>
<template>
  <aside class="sidebar">
    <div class="sidebar-wrapper">
      <div class="logo-container">
        <h2 class="logo">Logo</h2>
      </div>

      <!-- Menu -->
      <div class="menu">
        <div v-for="(group, gIndex) in menu" :key="gIndex" class="menu-group">
          <p v-if="group.group" class="group-title">
            {{ group.group }}
          </p>

          <router-link
            v-for="(item, i) in group.items"
            :key="i"
            :to="item.link"
            class="menu-item"
            :class="{ active: route.path === item.link }"
          >
            <component :is="item.icon" class="icon" />

            <span class="label">{{ item.name }}</span>

            <span v-if="item?.badge" class="badge">
              {{ item?.badge }}
            </span>

            <span v-if="item?.hasArrow" class="arrow">›</span>
          </router-link>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss"></style>

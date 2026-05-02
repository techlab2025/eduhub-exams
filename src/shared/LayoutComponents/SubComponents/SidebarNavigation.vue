<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, type Component } from 'vue';
import SettingIcon from '@/shared/icons/SidebarIcons/SettingIcon.vue';
import DocumentIcon from '@/shared/icons/BreadcrumbIcons/DocumentIcon.vue';
import TechlabLogo from '@/assets/images/TechlabLogo.png';
import EducationClassificationIcon from '@/shared/icons/SidebarIcons/EducationClassificationIcon.vue';
const route = useRoute();
const emit = defineEmits(['clickItem']);
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

const baseMenu: MenuSection[] = [
  {
    group: 'Overview',
    items: [
      {
        link: '/education-classifications',
        name: 'Education Classifications',
        icon: EducationClassificationIcon,
      },
      {
        link: '/employees',
        name: 'Employees',
        icon: SettingIcon,
      },
      {
        link: '/documents',
        name: 'Documents',
        icon: DocumentIcon,
      },
      {
        link: '/faqs',
        name: 'Faqs',
        icon: SettingIcon,
      },
      {
        link: '/privacy',
        name: 'Privacy',
        icon: SettingIcon,
      },
      {
        link: '/terms-conditions',
        name: 'Terms Conditions',
        icon: SettingIcon,
      },
      {
        link: '/stages',
        name: 'Stages',
        icon: SettingIcon,
      },
      {
        link: '/subjects',
        name: 'Subjects',
        icon: SettingIcon,
      },
      {
        link: '/units',
        name: 'Units',
        icon: SettingIcon,
      },
      {
        link: '/about',
        name: 'About',
        icon: SettingIcon,
      },
    ],
  },
  {
    group: 'location',
    items: [
      {
        link: '/countries',
        name: 'Countries',
        icon: SettingIcon,
      },
    ],
  },
];

const countryCode = computed(() => (route.params?.country_code as string) || '');

const menu = computed<MenuSection[]>(() =>
  baseMenu.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      link: countryCode.value ? `/${countryCode.value}${item.link}` : item.link,
    })),
  })),
);
</script>
<template>
  <aside class="sidebar">
    <div class="sidebar-wrapper">
      <div class="logo-container">
        <img class="logo" :src="TechlabLogo" alt="Techlab Logo" />
        <!-- <h2 class="logo">Logo</h2> -->
      </div>

      <!-- Menu -->
      <div class="menu">
        <div v-for="(group, gIndex) in menu" :key="gIndex" class="menu-group">
          <p v-if="group.group" class="group-title">
            {{ group.group }}
          </p>

          <router-link v-for="(item, i) in group.items" :key="i" :to="item.link" class="menu-item"
            :class="{ active: route.path === item.link }" @click="emit('clickItem')">
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

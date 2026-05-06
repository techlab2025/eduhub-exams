<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed, type Component } from 'vue';
  import SettingIcon from '@/shared/icons/SidebarIcons/SettingIcon.vue';
  import DocumentIcon from '@/shared/icons/BreadcrumbIcons/DocumentIcon.vue';
  import TechlabLogo from '@/assets/images/TechlabLogo.png';
  import EducationClassificationIcon from '@/shared/icons/SidebarIcons/EducationClassificationIcon.vue';
  import SidebarPrivecy from '@/shared/icons/SidebarPrivecy.vue';
  import SidebarTerms from '@/shared/icons/SidebarTerms.vue';
  import Sidebaremploye from '@/shared/icons/Sidebaremploye.vue';
  import SupportIcon from '@/shared/icons/SidebarIcons/SupportIcon.vue';
  import AboutIcon from '@/shared/icons/SidebarIcons/AboutIcon.vue';
  import FaqsIcon from '@/shared/icons/SidebarIcons/FaqsIcon.vue';
  import { useUserStore } from '@/stores/user';
  import AuthArrowIcon from '@/shared/icons/SidebarIcons/AuthArrowIcon.vue';

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

  const adminMenu: MenuSection[] = [
    {
      group: 'Management',
      items: [
        {
          link: '/admin',
          name: 'Admins',
          icon: SettingIcon,
        },
        {
          link: '/admin/country',
          name: 'Countries',
          icon: SettingIcon,
        },
      ],
    },
  ];

  const baseMenu: MenuSection[] = [
    {
      group: 'Overview',
      items: [
        {
          link: '/education-classifications',
          name: 'Education configuration',
          icon: EducationClassificationIcon,
        },
        {
          link: '/employees',
          name: 'Employees',
          icon: Sidebaremploye,
        },
        {
          link: '/documents',
          name: 'Documents',
          icon: DocumentIcon,
        },
      ],
    },
    {
      group: 'statics',
      items: [
        {
          link: '/about',
          name: 'About',
          icon: AboutIcon,
        },
        {
          link: '/support',
          name: 'Support',
          icon: SupportIcon,
        },
        {
          link: '/faqs',
          name: 'Faqs',
          icon: FaqsIcon,
        },
        {
          link: '/privacy',
          name: 'Privacy and policy',
          icon: SidebarPrivecy,
        },
        {
          link: '/terms-conditions',
          name: 'terms & conditions',
          icon: SidebarTerms,
        },
        {
          link: '/deleted-accounts',
          name: 'add logout reasons',
          icon: SidebarTerms,
        },
      ],
    },
  ];

  const isAdminRoute = computed(() => route.path.startsWith('/admin'));

  const countryCode = computed(() => (route.params?.country_code as string) || '');

  const activeMenu = computed<MenuSection[]>(() => {
    if (isAdminRoute.value) return adminMenu;
    return baseMenu;
  });

  const menu = computed<MenuSection[]>(() =>
    activeMenu.value.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        link:
          !isAdminRoute.value && countryCode.value
            ? `/${countryCode.value}${item.link}`
            : item.link,
      })),
    })),
  );

  const { user } = useUserStore();
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-wrapper">
      <div class="logo-container">
        <img class="logo" :src="TechlabLogo" alt="Techlab Logo" />
      </div>

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
            @click="emit('clickItem')"
          >
            <component :is="item.icon" class="icon" />
            <span class="label">{{ item.name }}</span>
            <span v-if="item?.badge" class="badge">{{ item?.badge }}</span>
            <span v-if="item?.hasArrow" class="arrow">›</span>
          </router-link>
        </div>
      </div>

      <div class="auth-container">
        <div class="auth-data">
          <img
            :src="user?.image || `https://cyber.comolho.com/static/img/avatar.png`"
            alt="image"
          />
          <div class="user-data">
            <span class="name">{{ user?.name }}</span>
            <span class="status">Admin</span>
          </div>
        </div>
        <auth-arrow-icon />
      </div>
    </div>
  </aside>
</template>

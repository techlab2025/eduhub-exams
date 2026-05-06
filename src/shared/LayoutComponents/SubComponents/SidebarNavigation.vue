<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import { computed, ref, type Component } from 'vue';
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
import IconLogout from '@/shared/icons/IconLogout.vue';
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

        // {
        //   link: '/stages',
        //   name: 'Stages',
        //   icon: SettingIcon,
        // },
        // {
        //   link: '/subjects',
        //   name: 'Subjects',
        //   icon: SettingIcon,
        // },
        // {
        //   link: '/units',
        //   name: 'Units',
        //   icon: SettingIcon,
        // },
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

  const { user } = useUserStore();
  //logout
    const userStore = useUserStore();
  const router = useRouter();
  const logout = () => {
    userStore.logout();
    router.push('/login');
  };

  const isDropMenuOpen = ref(false);

  const toggleDropMenu = () => {
    isDropMenuOpen.value = !isDropMenuOpen.value;
  };
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

            <span v-if="item?.badge" class="badge">
              {{ item?.badge }}
            </span>

            <span v-if="item?.hasArrow" class="arrow">›</span>
          </router-link>
        </div>
      </div>

      <div class="auth-container" @click="toggleDropMenu">
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
       <div class="user cursor-pointer dropdown-trigger" >
          <!-- <IconArrowDownNav class="drop-icon" /> -->
          <div v-if="isDropMenuOpen" class="dropdown-menu">
            <ul>
              <li @click="logout">
                <icon-logout />
                <span> {{ $t('logout') }} </span>
              </li>
            </ul>
          </div>
        </div>
    </div>
  </aside>
</template>

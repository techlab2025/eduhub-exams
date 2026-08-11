<script setup lang="ts">
  import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router';
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
  import Accordion from 'primevue/accordion';
  import AccordionPanel from 'primevue/accordionpanel';
  import AccordionHeader from 'primevue/accordionheader';
  import AccordionContent from 'primevue/accordioncontent';
  import Question from '@/shared/icons/question.vue';
  import ArticleIcon from '@/shared/icons/ArticleIcon.vue';
  import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';

  const route = useRoute();
  const emit = defineEmits(['clickItem']);
  interface MenuItem {
    link: RouteLocationRaw;
    name: string;
    icon?: Component;
    badge?: string;
    hasArrow?: boolean;
    status?: QuestionStatusEnum;
    children?: MenuItem[];
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
        {
          link: '/skills',
          name: 'Skills',
          icon: SettingIcon,
        },
        // {
        //   link: '/highlight-badges',
        //   name: 'highlight_badges',
        //   icon: SettingIcon,
        // },
        // {
        //   link: '/plans',
        //   name: 'plans',
        //   icon: SettingIcon,
        // },
        // {
        //   link: '/subscriptions',
        //   name: 'subscriptions',
        //   icon: SettingIcon,
        // },
        // {
        //   link: '/students',
        //   name: 'students',
        //   icon: SettingIcon,
        // },
        {
          link: '/subjects',
          name: 'Subjects',
          icon: SettingIcon,
        },
        {
          link: '/placement-test',
          name: 'Placement Test',
          icon: SettingIcon,
        },
        // {
        //   link: '/placements/show',
        //   name: 'Placement Configuration',
        //   icon: SettingIcon,
        // },
      ],
    },

    {
      group: 'Apps Kits',
      items: [
        {
          link: '/questions',
          name: 'Questions',
          icon: Question,
          children: [
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.ARCHIVED } },
              name: 'question_status_menu.archived',
              status: QuestionStatusEnum.ARCHIVED,
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.APPROVED } },
              name: 'question_status_menu.approved',
              status: QuestionStatusEnum.APPROVED,
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.REJECTED } },
              name: 'question_status_menu.rejected',
              status: QuestionStatusEnum.REJECTED,
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.DRAFT } },
              name: 'question_status_menu.draft',
              status: QuestionStatusEnum.DRAFT,
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.NOT_REVIEW } },
              name: 'question_status_menu.not_reviewed',
              status: QuestionStatusEnum.NOT_REVIEW,
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.REVISION } },
              name: 'question_status_menu.revision',
              status: QuestionStatusEnum.REVISION,
            },
          ],
        },
        {
          link: '/articles',
          name: 'Articles',
          icon: ArticleIcon,
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
        // {
        //   link: '/deleted-accounts',
        //   name: 'add logout reasons',
        //   icon: SidebarTerms,
        // },
      ],
    },
  ];

  const menu = computed<MenuSection[]>(() => baseMenu);

  const { user } = useUserStore();
  //logout
  const userStore = useUserStore();
  const router = useRouter();

  const logout = () => {
    userStore.logout();
    router.push({ name: 'Choose Country' });
  };

  const isDropMenuOpen = ref(false);

  const toggleDropMenu = () => {
    isDropMenuOpen.value = !isDropMenuOpen.value;
  };

  const getMenuPath = (item: MenuItem) => {
    if (typeof item.link === 'string') return item.link;
    if ('path' in item.link) return item.link.path;
    return router.resolve(item.link).path;
  };

  const isMenuItemActive = (item: MenuItem) => {
    if (route.path.toLowerCase() !== String(getMenuPath(item)).toLowerCase()) return false;

    if (item.status !== undefined) {
      return Number(route.query.status) === item.status;
    }

    return !item.children || route.query.status === undefined;
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

          <div v-for="(item, i) in group.items" :key="i" class="menu-entry">
            <router-link
              :to="item.link"
              class="menu-item"
              :class="{ active: isMenuItemActive(item) }"
              @click="emit('clickItem')"
            >
              <component :is="item.icon" class="icon" />

              <span class="label">{{ $t(item.name) }}</span>

              <span v-if="item?.badge" class="badge">
                {{ item?.badge }}
              </span>

              <span v-if="item?.hasArrow" class="arrow">›</span>
            </router-link>

            <div v-if="item.children" class="submenu">
              <router-link
                v-for="child in item.children"
                :key="child.status"
                :to="child.link"
                class="submenu-item"
                :class="{ active: isMenuItemActive(child) }"
                @click="emit('clickItem')"
              >
                <span class="submenu-dot"></span>
                <span>{{ $t(child.name) }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <Accordion :value="0">
        <template #collapseicon> </template>
        <template #expandicon> </template>
        <AccordionPanel value="0">
          <AccordionHeader>
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
          </AccordionHeader>
          <AccordionContent>
            <div class="mega-body">
              <button class="menu-item">
                <icon-user-circle />
                <span>{{ $t('my_profile') }}</span>
                <icon-chevron-right class="arrow" />
              </button>
              <button class="menu-item">
                <icon-settings />
                <span>{{ $t('settings') }}</span>
                <icon-chevron-right class="arrow" />
              </button>
              <button class="menu-item">
                <icon-bell />
                <span>{{ $t('notifications') }}</span>
                <icon-chevron-right class="arrow" />
              </button>
              <div class="divider"></div>
              <button class="menu-item danger" @click="logout">
                <icon-logout />
                <span>{{ $t('logout') }}</span>
              </button>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </aside>
</template>

<style scoped>
  :deep(.p-accordionheader) {
    padding: 0 !important;
    box-shadow: none !important;
    margin: 0 !important;
  }

  :deep(.p-accordionheader-link) {
    padding: 0 !important;
    box-shadow: none !important;
    margin: 0 !important;
  }

  :deep(.p-accordion) {
    margin-top: auto;
  }

  :deep(.p-accordioncontent-content) {
    padding: 0 !important;
  }

  .menu-entry {
    width: 100%;
  }

  .submenu {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-block: 4px 8px;
    padding-inline-start: 34px;
  }

  .submenu-item {
    align-items: center;
    border-radius: 8px;
    color: var(--sidebar-menu-text-color);
    display: flex;
    font-size: 13px;
    gap: 9px;
    min-height: 34px;
    padding: 7px 10px;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &.active {
      background-color: var(--PrimaryColor-alpha-15);
      color: var(--standard-white);
    }
  }

  .submenu-dot {
    background-color: currentColor;
    border-radius: 50%;
    flex: 0 0 auto;
    height: 5px;
    width: 5px;
  }
</style>

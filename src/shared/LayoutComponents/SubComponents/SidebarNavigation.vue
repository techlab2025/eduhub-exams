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
  import { PermissionsEnum, type PermissionCode } from '@/modules/Permission';
  import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue';

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
    permissions: PermissionCode[];
  }
  interface MenuSection {
    group: string;
    items: MenuItem[];
    permissions: PermissionCode[];
  }

  const baseMenu: MenuSection[] = [
    {
      group: 'Overview',
      permissions: [
        PermissionsEnum.EDUCATION_CLASSIFICATION_FETCH,
        PermissionsEnum.EDUCATION_CLASSIFICATION_CREATE,
        PermissionsEnum.EDUCATION_CLASSIFICATION_UPDATE,
        PermissionsEnum.EDUCATION_CLASSIFICATION_DELETE,
        PermissionsEnum.EDUCATION_CLASSIFICATION_TOGGLE_STATUS,
        PermissionsEnum.EMPLOYEE_ALL,
        PermissionsEnum.EMPLOYEE_FETCH,
        PermissionsEnum.EMPLOYEE_CREATE,
        PermissionsEnum.EMPLOYEE_UPDATE,
        PermissionsEnum.EMPLOYEE_DELETE,
        PermissionsEnum.EMPLOYEE_CHANGE_STATUS,
        PermissionsEnum.ROLE_ALL,
        PermissionsEnum.ROLE_FETCH,
        PermissionsEnum.ROLE_CREATE,
        PermissionsEnum.ROLE_UPDATE,
        PermissionsEnum.ROLE_DELETE,
        PermissionsEnum.DOCUMENT_ALL,
        PermissionsEnum.DOCUMENT_FETCH,
        PermissionsEnum.DOCUMENT_CREATE,
        PermissionsEnum.DOCUMENT_UPDATE,
        PermissionsEnum.DOCUMENT_DELETE,
        PermissionsEnum.SKILL_ALL,
        PermissionsEnum.SKILL_FETCH,
        PermissionsEnum.SKILL_CREATE,
        PermissionsEnum.SKILL_UPDATE,
        PermissionsEnum.SKILL_DELETE,
        PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_ALL,
        PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_FETCH,
        PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_CREATE,
        PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_UPDATE,
        PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_DELETE,
        PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_FETCH_FULL,
        PermissionsEnum.PLACEMENT_TEST_ALL,
        PermissionsEnum.PLACEMENT_TEST_FETCH,
        PermissionsEnum.HIGHLIGHT_BADGE_ALL,
        PermissionsEnum.HIGHLIGHT_BADGE_FETCH,
        PermissionsEnum.HIGHLIGHT_BADGE_CREATE,
        PermissionsEnum.HIGHLIGHT_BADGE_UPDATE,
        PermissionsEnum.HIGHLIGHT_BADGE_DELETE,
        PermissionsEnum.ADVICE_ALL,
        PermissionsEnum.ADVICE_FETCH,
        PermissionsEnum.ADVICE_CREATE,
        PermissionsEnum.ADVICE_UPDATE,
        PermissionsEnum.ADVICE_DELETE,
        PermissionsEnum.DOCUMENT_INDEX_ALL,
        PermissionsEnum.DOCUMENT_INDEX_FETCH,
        PermissionsEnum.DOCUMENT_INDEX_UPDATE,
        PermissionsEnum.DOCUMENT_INDEX_START,
        PermissionsEnum.DOCUMENT_INDEX_STATUS,
        PermissionsEnum.DOCUMENT_INDEX_REFRESH_STATUS,
        PermissionsEnum.DOCUMENT_INDEX_SAVE,
        PermissionsEnum.DOCUMENT_INDEX_FETCH_TRANSACTIONS,
        PermissionsEnum.BLOCK_REASON_ALL,
        PermissionsEnum.BLOCK_REASON_FETCH,
        PermissionsEnum.BLOCK_REASON_CREATE,
        PermissionsEnum.BLOCK_REASON_UPDATE,
        PermissionsEnum.BLOCK_REASON_DELETE,
        PermissionsEnum.Generate_Questions,
        PermissionsEnum.SUBSCRIPTION_PLAN_ALL,
        PermissionsEnum.SUBSCRIPTION_PLAN_FETCH,
        PermissionsEnum.SUBSCRIPTION_PLAN_CREATE,
        PermissionsEnum.SUBSCRIPTION_PLAN_UPDATE,
        PermissionsEnum.SUBSCRIPTION_PLAN_DELETE,
        PermissionsEnum.SUBSCRIPTION_PLAN_TOGGLE_FEATURE,
        PermissionsEnum.SUBSCRIPTION_PLAN_TOGGLE_STATUS,
        PermissionsEnum.SUBSCRIPTION_PLAN_CHANGE_STATUS,
        PermissionsEnum.SUBSCRIPTION_ALL,
        PermissionsEnum.SUBSCRIPTION_FETCH,
        PermissionsEnum.SUBSCRIPTION_DELETE,
        PermissionsEnum.SUBSCRIPTION_STATISTICS,
        PermissionsEnum.STUDENT_ALL,
        PermissionsEnum.STUDENT_FETCH,
        PermissionsEnum.STUDENT_STATISTICS,
        PermissionsEnum.STUDENT_CHANGE_STATUS,
        PermissionsEnum.STUDENT_FORCE_LOGOUT,
        PermissionsEnum.STUDENT_ADD_NOTE,
      ],
      items: [
        {
          link: '/education-classifications',
          name: 'Education configuration',
          icon: EducationClassificationIcon,
          permissions: [
            PermissionsEnum.EDUCATION_CLASSIFICATION_ALL,
            PermissionsEnum.EDUCATION_CLASSIFICATION_FETCH,
            PermissionsEnum.EDUCATION_CLASSIFICATION_CREATE,
            PermissionsEnum.EDUCATION_CLASSIFICATION_UPDATE,
            PermissionsEnum.EDUCATION_CLASSIFICATION_DELETE,
            PermissionsEnum.EDUCATION_CLASSIFICATION_TOGGLE_STATUS,
          ],
        },
        {
          link: '/employees',
          name: 'Employees',
          icon: Sidebaremploye,
          permissions: [
            PermissionsEnum.EMPLOYEE_ALL,
            PermissionsEnum.EMPLOYEE_FETCH,
            PermissionsEnum.EMPLOYEE_CREATE,
            PermissionsEnum.EMPLOYEE_UPDATE,
            PermissionsEnum.EMPLOYEE_DELETE,
            PermissionsEnum.EMPLOYEE_CHANGE_STATUS,
          ],
        },
        {
          link: '/roles',
          name: 'role.title_plural',
          icon: SettingIcon,
          permissions: [
            PermissionsEnum.ROLE_ALL,
            PermissionsEnum.ROLE_FETCH,
            PermissionsEnum.ROLE_CREATE,
            PermissionsEnum.ROLE_UPDATE,
            PermissionsEnum.ROLE_DELETE,
          ],
        },
        {
          link: '/documents',
          name: 'Documents',
          icon: DocumentIcon,
          permissions: [
            PermissionsEnum.DOCUMENT_ALL,
            PermissionsEnum.DOCUMENT_FETCH,
            PermissionsEnum.DOCUMENT_CREATE,
            PermissionsEnum.DOCUMENT_UPDATE,
            PermissionsEnum.DOCUMENT_DELETE,
          ],
        },
        {
          link: '/skills',
          name: 'Skills',
          icon: SettingIcon,
          permissions: [
            PermissionsEnum.SKILL_ALL,
            PermissionsEnum.SKILL_FETCH,
            PermissionsEnum.SKILL_CREATE,
            PermissionsEnum.SKILL_UPDATE,
            PermissionsEnum.SKILL_DELETE,
          ],
        },

        {
          link: '/subjects',
          name: 'Subjects',
          icon: SettingIcon,
          permissions: [
            PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_ALL,
            PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_FETCH,
            PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_CREATE,
            PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_UPDATE,
            PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_DELETE,
            PermissionsEnum.EDUCATION_CLASSIFICATION_SUBJECT_FETCH_FULL,
          ],
        },
        {
          link: '/placement-test',
          name: 'Placement Test',
          icon: SettingIcon,
          permissions: [PermissionsEnum.PLACEMENT_TEST_ALL, PermissionsEnum.PLACEMENT_TEST_FETCH],
        },
        {
          link: '/highlight-badges',
          name: 'highlight_badges',
          icon: SettingIcon,
          permissions: [
            PermissionsEnum.HIGHLIGHT_BADGE_ALL,
            PermissionsEnum.HIGHLIGHT_BADGE_FETCH,
            PermissionsEnum.HIGHLIGHT_BADGE_CREATE,
            PermissionsEnum.HIGHLIGHT_BADGE_UPDATE,
            PermissionsEnum.HIGHLIGHT_BADGE_DELETE,
          ],
        },
        {
          link: '/advices',
          name: 'advices',
          icon: SettingIcon,
          permissions: [
            PermissionsEnum.ADVICE_ALL,
            PermissionsEnum.ADVICE_FETCH,
            PermissionsEnum.ADVICE_CREATE,
            PermissionsEnum.ADVICE_UPDATE,
            PermissionsEnum.ADVICE_DELETE,
          ],
        },
        {
          link: '/document-index',
          name: 'document_index.title',
          icon: DocumentIcon,
          permissions: [
            PermissionsEnum.DOCUMENT_INDEX_ALL,
            PermissionsEnum.DOCUMENT_INDEX_FETCH,
            PermissionsEnum.DOCUMENT_INDEX_UPDATE,
            PermissionsEnum.DOCUMENT_INDEX_START,
            PermissionsEnum.DOCUMENT_INDEX_STATUS,
            PermissionsEnum.DOCUMENT_INDEX_REFRESH_STATUS,
            PermissionsEnum.DOCUMENT_INDEX_SAVE,
            PermissionsEnum.DOCUMENT_INDEX_FETCH_TRANSACTIONS,
          ],
          children: [
            {
              link: '/fetch-document-index-patch',
              name: 'document_index.transactions_sidebar',
              permissions: [PermissionsEnum.DOCUMENT_INDEX_FETCH_TRANSACTIONS],
            },
          ],
        },
        {
          link: '/block-reasons',
          name: 'block_reasons',
          icon: SettingIcon,
          permissions: [
            PermissionsEnum.BLOCK_REASON_ALL,
            PermissionsEnum.BLOCK_REASON_FETCH,
            PermissionsEnum.BLOCK_REASON_CREATE,
            PermissionsEnum.BLOCK_REASON_UPDATE,
            PermissionsEnum.BLOCK_REASON_DELETE,
          ],
        },
        {
          link: '/question-batches',
          name: 'question_batch.title',
          icon: SettingIcon,
          permissions: [PermissionsEnum.Generate_Questions],
          children: [
            {
              link: '/question-batches/generate',
              name: 'question_batch.generate',
              permissions: [PermissionsEnum.Generate_Questions],
            },
          ],
        },

        {
          link: '/plans',
          name: 'plans',
          icon: SettingIcon,
          permissions: [
            PermissionsEnum.SUBSCRIPTION_PLAN_ALL,
            PermissionsEnum.SUBSCRIPTION_PLAN_FETCH,
            PermissionsEnum.SUBSCRIPTION_PLAN_CREATE,
            PermissionsEnum.SUBSCRIPTION_PLAN_UPDATE,
            PermissionsEnum.SUBSCRIPTION_PLAN_DELETE,
            PermissionsEnum.SUBSCRIPTION_PLAN_TOGGLE_FEATURE,
            PermissionsEnum.SUBSCRIPTION_PLAN_TOGGLE_STATUS,
            PermissionsEnum.SUBSCRIPTION_PLAN_CHANGE_STATUS,
          ],
          children: [
            {
              link: '/plans/add',
              name: 'add plan',
              permissions: [PermissionsEnum.SUBSCRIPTION_PLAN_CREATE],
            },
          ],
        },
        {
          link: '/subscriptions',
          name: 'subscriptions',
          icon: SettingIcon,
          permissions: [
            PermissionsEnum.SUBSCRIPTION_ALL,
            PermissionsEnum.SUBSCRIPTION_FETCH,
            PermissionsEnum.SUBSCRIPTION_DELETE,
            PermissionsEnum.SUBSCRIPTION_STATISTICS,
          ],
        },
        // {
        //   link: '/notification-plans',
        //   name: 'notification_plan.title',
        //   icon: SettingIcon,
        //   children: [
        //     {
        //       link: '/notification-plans/add',
        //       name: 'notification_plan.add',
        //     },
        //   ],
        // },
        {
          link: '/students',
          name: 'students',
          icon: SettingIcon,
          permissions: [
            PermissionsEnum.STUDENT_ALL,
            PermissionsEnum.STUDENT_FETCH,
            PermissionsEnum.STUDENT_STATISTICS,
            PermissionsEnum.STUDENT_CHANGE_STATUS,
            PermissionsEnum.STUDENT_FORCE_LOGOUT,
            PermissionsEnum.STUDENT_ADD_NOTE,
          ],
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
      permissions: [
        PermissionsEnum.QUESTION_ALL,
        PermissionsEnum.QUESTION_FETCH,
        PermissionsEnum.QUESTION_CREATE,
        PermissionsEnum.QUESTION_UPDATE,
        PermissionsEnum.QUESTION_DELETE,
        PermissionsEnum.QUESTION_UPDATE_REVIEW_STATUS,
        PermissionsEnum.QUESTION_FETCH_REVIEW_STATUS_HISTORY,
      ],
      items: [
        {
          link: '/questions',
          name: 'Questions',
          icon: Question,
          permissions: [
            PermissionsEnum.QUESTION_ALL,
            PermissionsEnum.QUESTION_FETCH,
            PermissionsEnum.QUESTION_CREATE,
            PermissionsEnum.QUESTION_UPDATE,
            PermissionsEnum.QUESTION_DELETE,
            PermissionsEnum.QUESTION_UPDATE_REVIEW_STATUS,
            PermissionsEnum.QUESTION_FETCH_REVIEW_STATUS_HISTORY,
          ],
          children: [
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.ARCHIVED } },
              name: 'question_status_menu.archived',
              status: QuestionStatusEnum.ARCHIVED,
              permissions: [PermissionsEnum.QUESTION_ALL, PermissionsEnum.QUESTION_FETCH],
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.APPROVED } },
              name: 'question_status_menu.approved',
              status: QuestionStatusEnum.APPROVED,
              permissions: [PermissionsEnum.QUESTION_FETCH],
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.REJECTED } },
              name: 'question_status_menu.rejected',
              status: QuestionStatusEnum.REJECTED,
              permissions: [PermissionsEnum.QUESTION_FETCH],
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.DRAFT } },
              name: 'question_status_menu.draft',
              status: QuestionStatusEnum.DRAFT,
              permissions: [PermissionsEnum.QUESTION_FETCH],
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.NOT_REVIEW } },
              name: 'question_status_menu.not_reviewed',
              status: QuestionStatusEnum.NOT_REVIEW,
              permissions: [PermissionsEnum.QUESTION_FETCH],
            },
            {
              link: { path: '/questions', query: { status: QuestionStatusEnum.REVISION } },
              name: 'question_status_menu.revision',
              status: QuestionStatusEnum.REVISION,
              permissions: [PermissionsEnum.QUESTION_FETCH],
            },
          ],
        },
        {
          link: '/articles',
          name: 'Articles',
          icon: ArticleIcon,
          permissions: [
            PermissionsEnum.QUESTION_ALL,
            PermissionsEnum.QUESTION_FETCH,
            PermissionsEnum.QUESTION_CREATE,
            PermissionsEnum.QUESTION_UPDATE,
            PermissionsEnum.QUESTION_DELETE,
          ],
        },
      ],
    },
    {
      group: 'statics',
      permissions: [
        PermissionsEnum.ABOUT_US_ALL,
        PermissionsEnum.ABOUT_US_FETCH,
        PermissionsEnum.ABOUT_US_CREATE,
        PermissionsEnum.ABOUT_US_DELETE,
        PermissionsEnum.SOCIAL_LINK_ALL,
        PermissionsEnum.SOCIAL_LINK_UPDATE,
        PermissionsEnum.SOCIAL_LINK_DELETE,
        PermissionsEnum.SUPPORT_ALL,
        PermissionsEnum.SUPPORT_FETCH,
        PermissionsEnum.SUPPORT_CREATE,
        PermissionsEnum.SUPPORT_UPDATE,
        PermissionsEnum.SUPPORT_DELETE,
        PermissionsEnum.FAQ_ALL,
        PermissionsEnum.FAQ_FETCH,
        PermissionsEnum.FAQ_CREATE,
        PermissionsEnum.FAQ_UPDATE,
        PermissionsEnum.FAQ_DELETE,
        PermissionsEnum.PRIVACY_ALL,
        PermissionsEnum.PRIVACY_FETCH,
        PermissionsEnum.PRIVACY_CREATE,
        PermissionsEnum.PRIVACY_UPDATE,
        PermissionsEnum.PRIVACY_DELETE,
        PermissionsEnum.TERM_ALL,
        PermissionsEnum.TERM_FETCH,
        PermissionsEnum.TERM_CREATE,
        PermissionsEnum.TERM_UPDATE,
        PermissionsEnum.TERM_DELETE,
        PermissionsEnum.DELETE_ACCOUNT_REASON_ALL,
        PermissionsEnum.DELETE_ACCOUNT_REASON_FETCH,
        PermissionsEnum.DELETE_ACCOUNT_REASON_CREATE,
        PermissionsEnum.DELETE_ACCOUNT_REASON_UPDATE,
        PermissionsEnum.DELETE_ACCOUNT_REASON_DELETE,
      ],
      items: [
        {
          link: '/about',
          name: 'About',
          icon: AboutIcon,
          permissions: [
            PermissionsEnum.ABOUT_US_ALL,
            PermissionsEnum.ABOUT_US_FETCH,
            PermissionsEnum.ABOUT_US_CREATE,
            PermissionsEnum.ABOUT_US_DELETE,
            PermissionsEnum.SOCIAL_LINK_ALL,
            PermissionsEnum.SOCIAL_LINK_UPDATE,
            PermissionsEnum.SOCIAL_LINK_DELETE,
          ],
        },
        {
          link: '/support',
          name: 'Support',
          icon: SupportIcon,
          permissions: [
            PermissionsEnum.SUPPORT_ALL,
            PermissionsEnum.SUPPORT_FETCH,
            PermissionsEnum.SUPPORT_CREATE,
            PermissionsEnum.SUPPORT_UPDATE,
            PermissionsEnum.SUPPORT_DELETE,
            PermissionsEnum.SUPPORT_CONTACT_ALL,
            PermissionsEnum.SUPPORT_CONTACT_UPDATE,
            PermissionsEnum.SUPPORT_CONTACT_DELETE,
          ],
        },
        {
          link: '/faqs',
          name: 'Faqs',
          icon: FaqsIcon,
          permissions: [
            PermissionsEnum.FAQ_ALL,
            PermissionsEnum.FAQ_FETCH,
            PermissionsEnum.FAQ_CREATE,
            PermissionsEnum.FAQ_UPDATE,
            PermissionsEnum.FAQ_DELETE,
          ],
        },
        {
          link: '/privacy',
          name: 'Privacy and policy',
          icon: SidebarPrivecy,
          permissions: [
            PermissionsEnum.PRIVACY_ALL,
            PermissionsEnum.PRIVACY_FETCH,
            PermissionsEnum.PRIVACY_CREATE,
            PermissionsEnum.PRIVACY_UPDATE,
            PermissionsEnum.PRIVACY_DELETE,
          ],
        },
        {
          link: '/terms-conditions',
          name: 'terms & conditions',
          icon: SidebarTerms,
          permissions: [
            PermissionsEnum.TERM_ALL,
            PermissionsEnum.TERM_FETCH,
            PermissionsEnum.TERM_CREATE,
            PermissionsEnum.TERM_UPDATE,
            PermissionsEnum.TERM_DELETE,
          ],
        },
        {
          link: '/deleted-accounts',
          name: 'add logout reasons',
          icon: SidebarTerms,
          permissions: [
            PermissionsEnum.DELETE_ACCOUNT_REASON_ALL,
            PermissionsEnum.DELETE_ACCOUNT_REASON_FETCH,
            PermissionsEnum.DELETE_ACCOUNT_REASON_CREATE,
            PermissionsEnum.DELETE_ACCOUNT_REASON_UPDATE,
            PermissionsEnum.DELETE_ACCOUNT_REASON_DELETE,
          ],
        },
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
          
          <PermissionBuilder :code="group.permissions">
            <p v-if="group.group" class="group-title">
              {{ group.group }}
            </p>

            <div v-for="(item, i) in group.items" :key="i" class="menu-entry">
              <PermissionBuilder :code="item.permissions">
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
              </PermissionBuilder>

              <div v-if="item.children" class="submenu">
                <PermissionBuilder :code="item.permissions">
                  <router-link
                    v-for="child in item.children"
                    :key="child.name"
                    :to="child.link"
                    class="submenu-item"
                    :class="{ active: isMenuItemActive(child) }"
                    @click="emit('clickItem')"
                  >
                    <span class="submenu-dot"></span>
                    <span>{{ $t(child.name) }}</span>
                  </router-link>
                </PermissionBuilder>
              </div>
            </div>
          </PermissionBuilder>
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

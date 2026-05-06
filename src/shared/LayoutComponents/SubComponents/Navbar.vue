<script lang="ts" setup>
  import { ref } from 'vue';
  import IconLogout from '@/shared/icons/IconLogout.vue';
  import { useUserStore } from '@/stores/user';
  import { useThemeStore } from '@/stores/theme';
  import SearchIcon from '@/shared/icons/SearchIcon.vue';
  import HeaderSettingIcon from '@/shared/icons/HeaderIcons/HeaderSettingIcon.vue';
  import HeaderDarkModeIcon from '@/shared/icons/HeaderIcons/HeaderDarkModeIcon.vue';
  import HeaderMessgaesIcon from '@/shared/icons/HeaderIcons/HeaderMessgaesIcon.vue';
  import HeaderNotificationIcon from '@/shared/icons/HeaderIcons/HeaderNotificationIcon.vue';
  import EmployeeImage from '@/assets/images/headerIMages/employee.jpg';
  import { useRouter } from 'vue-router';
  import Drawer from 'primevue/drawer';
  import SidebarNavigation from './SidebarNavigation.vue';
  import HeaderSidebarIcon from '@/shared/icons/HeaderIcons/HeaderSidebarIcon.vue';
  // import TechlabLogo from "@/assets/images/TechlabLogo.png";

  // const props = defineProps({

  const userStore = useUserStore();
  const themeStore = useThemeStore();
  const router = useRouter();
  const logout = () => {
    userStore.logout();
    router.push('/login');
  };

  const isDropMenuOpen = ref(false);

  const toggleDropMenu = () => {
    isDropMenuOpen.value = !isDropMenuOpen.value;
  };
  const DrawerVisible = ref(false);
  const { user } = useUserStore();
</script>

<template>
  <header class="header">
    <nav class="nav">
      <!-- <img class="logo-img" :src="TechlabLogo" alt="Techlab Logo" /> -->
      <div class="search">
        <SearchIcon />
        <input type="serach" placeholder="Search What You Want" />
      </div>

      <div class="setting">
        <HeaderNotificationIcon class="cursor-pointer" />
        <HeaderMessgaesIcon class="cursor-pointer" />
        <HeaderDarkModeIcon class="cursor-pointer" @click="themeStore.toggle()" />
        <HeaderSettingIcon class="cursor-pointer" />

        <!-- <IconArrowDownNav class="drop-icon" /> -->
        <div class="user cursor-pointer dropdown-trigger">
          <img alt="user" :src="EmployeeImage" @click="toggleDropMenu" />

          <transition name="mega-menu">
            <div v-if="isDropMenuOpen" class="mega-menu">
              <div class="mega-header">
                <img
                  :src="EmployeeImage || `https://cyber.comolho.com/static/img/avatar.png`"
                  alt="image"
                />
                <div>
                  <p class="name">{{ user?.name }}</p>
                  <span class="role">Admin</span>
                </div>
              </div>

              <div class="divider"></div>

              <div class="mega-actions">
                <button class="logout-btn" @click="logout">
                  <icon-logout />
                  <span>{{ $t('logout') }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div class="sidebar-drawer">
          <button class="cursor-pointer" @click="DrawerVisible = true">
            <HeaderSidebarIcon />
          </button>
          <Drawer v-model:visible="DrawerVisible" position="right">
            <template #header> </template>
            <SidebarNavigation @click-item="DrawerVisible = false" />
          </Drawer>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss"></style>
<!-- <style scoped>
.logo-img {
  background-color: red;
  width: 100px;
  height: 100px;
}
</style> -->

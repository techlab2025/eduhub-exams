<script lang="ts" setup>
import { markRaw, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import IconFullScreen from '@/shared/icons/IconFullScreen.vue'
// import IconMenu from '@/shared/icons/IconMenu.vue'
import IconLogout from '@/shared/icons/IconLogout.vue'
import IconArrowDownNav from '@/shared/icons/IconArrowDownNav.vue'
// import { setDefaultImage } from '@/base/Presentation/Utils/set_default_image'
// import { setDefaultImage } from "@/base/Presentation/Utils/set_default_image";
// import { useUserStore } from "@/stores/user";
// import defaultImage from "@/assets/images/user.png";
// import ChangeLanguage from './ChangeLanguage.vue'
import Notification from '../icons/Notification.vue'
import SearchIcon from '../icons/SearchIcon.vue'
import { useUserStore } from '@/stores/user'
// import defaultLogo from '@/assets/images/logo.svg'

const route = useRoute()
// console.log(route.name)
// defineEmits(["open"]);

const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['open'])

const language = ref<string>('')

const router = useRouter()
// const userStore = useUserStore();

const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  window.location.href = '/login/admin'

}

const isDropMenuOpen = ref(false)

const toggleDropMenu = () => {
  isDropMenuOpen.value = !isDropMenuOpen.value
}

// fetch user store data
const { user } = useUserStore()
</script>

<template>
  <header class="header">
    <nav class="nav">
      <div class="menu">
        <!-- Add the new icon to open the sidebar -->
        <!-- <span v-if="!props.open" class="cursor-pointer" @click="toggleSidebar">
          <IconMenu />
        </span> -->
        <!-- <span  class="cursor-pointer" @click="toggleSidebar">
          <IconMenu />
        </span> -->
        <!-- <div class="header-link flex gap-sm items-center">
          <h1>
            <router-link to="/">{{ $t('home') }} </router-link>
          </h1>
          <p class="route-name">{{ $t(typeof route?.name === 'string' ? route.name : '') }} /</p>
        </div> -->
        <router-link class="flex items-center gap-2" :to="'/'">
          <!-- <img :src="defaultLogo" alt="logo-img"> -->
          <p class="logo">logo </p>
        </router-link>
      </div>

      <div class="search">
        <SearchIcon />
        <input type="serach" placeholder="Search What You Want" />
      </div>

      <div class="setting">
        <!-- <ChangeLanguage class="countery-icon" /> -->

        <div class="notification cursor-pointer" @click="toggleFullScreen">
          <Notification />
        </div>

        <div class="user cursor-pointer dropdown-trigger" @click="toggleDropMenu">
          <IconArrowDownNav class="drop-icon" />
          <div class="profile-data">
            <span>{{ user?.name.split(' ')[0] }}</span>
            <!-- <span>{{ user?.type == OrganizationTypeEnum.ADMIN ? 'Admin' : 'Organization' }}</span> -->
          </div>

          <img alt="user" src="../../assets/images/travel.png" />

          <div class="dropdown-menu" v-if="isDropMenuOpen">
            <ul>
              <li @click="logout">
                <IconLogout />
                <span> {{ $t('logout') }} </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>

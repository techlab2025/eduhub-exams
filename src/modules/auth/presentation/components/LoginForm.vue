<script setup lang="ts">
import { ref } from 'vue'
// import LoginController from '@/features/auth/presentation/controllers/login_controller'
// import LoginParams from '@/features/auth/Core/Params/login_params'
import { useRouter } from 'vue-router'
import { OrganizationTypeEnum } from '../../Core/Enum/organization_type'
// import Email from '@/shared/icons/email.vue'
// import Lock from '@/shared/icons/lock.vue'
// import CloseEye from '@/shared/icons/closeEye.vue'
// import Loca from '@/shared/icons/loca.vue'
// import EyeIcon from '@/shared/icons/EyeIcon.vue'

const router = useRouter()
const email = ref('')
const password = ref('')

// const activeTab = ref(OrganizationTypeEnum.ADMIN)

// const changeTab = (tab: OrganizationTypeEnum) => {
//   activeTab.value = tab
// }

const login = () => {
  // LoginController.getInstance().login(
  //   new LoginParams(email.value, password.value),
  //   router,
  //   OrganizationTypeEnum.ADMIN,
  // )
}

const isPasswordVisible = ref()
</script>

<template>
  <section class="login">
    <div class="images">
      <div class="login-image">
        <div class="top-glass-card">
          <p>{{ $t('See your entire safety operation at a glance') }}</p>
          <span>{{ $t('Real-time data. One powerful dashboard') }}</span>
        </div>
        <!-- <img src="@/assets/images/login.png" alt="" /> -->
        <div class="bottom-glass-card">
          <p>{{ $t('Work from the field — even offline') }}</p>
          <span>{{ $t('Submit reports, inspections & observations anytime, anywhere') }}</span>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="111" height="120" viewBox="0 0 111 120" fill="none">
        <g opacity="0.1">
          <path
            d="M6.62818 119.845C4.01659 119.845 1.64793 118.265 0.651881 115.848C-0.356318 113.431 0.202443 110.637 2.04878 108.791L37.275 73.5639C39.8137 71.0373 43.9072 71.0373 46.4338 73.5639C48.9725 76.0905 48.9725 80.1962 46.4338 82.7229L11.2076 117.95C10.005 119.164 8.35305 119.845 6.62818 119.845Z"
            fill="#CAD8FF" />
          <path
            d="M110.336 0.354388L18.2259 92.4541C-1.01491 73.213 -1.01491 42.007 18.2259 22.7537C45.6051 -4.62595 110.336 0.354388 110.336 0.354388Z"
            fill="white" />
          <path
            d="M87.9253 92.4523C68.6845 111.706 37.479 111.706 18.2261 92.4523L110.336 0.352539C110.336 0.352539 115.317 65.0726 87.9253 92.4523Z"
            fill="#CAD8FF" />
        </g>
      </svg>
    </div>

    <form @submit.prevent="login" class="login-form">
      <div class="title">
        <div class="logo">
          <!-- <img src="@/assets/images/logo.svg" width="22" alt="logo" /> -->
          <h2>HSE.Cloud.Ai</h2>
        </div>

        <div class="text">
          <p>{{ $t('Log in now') }}</p>
          <span>{{ $t('Please enter your email and password to log in') }}</span>
        </div>
      </div>

      <!-- <div class="tabs">
        <div
          class="tab"
          @click="changeTab(OrganizationTypeEnum.ADMIN)"
          :class="{ active: activeTab === OrganizationTypeEnum.ADMIN }"
        >
          {{ $t('admin') }}
        </div>
        <div
          class="tab"
          @click="changeTab(OrganizationTypeEnum.ORGANIZATION)"
          :class="{ active: activeTab === OrganizationTypeEnum.ORGANIZATION }"
        >
          {{ $t('organization') }}
        </div>
      </div> -->

      <div class="inputs">
        <div class="input-wrapper ">
          <!-- <Email class="icon " /> -->
          <input class="input py " :placeholder="$t('Enter Your Mail')" type="email" id="email" v-model="email" />
        </div>
        <div class="input-wrapper ">
          <!-- <Loca class="icon" /> -->
          <input :type="isPasswordVisible ? 'text' : 'password'" id="password" :placeholder="$t('Enter Password')"
            class="input py " v-model="password" />
          <!-- <CloseEye class="icon-eye" v-if="isPasswordVisible" @click="isPasswordVisible = !isPasswordVisible" /> -->
          <!-- <EyeIcon class="icon-eye" v-else @click="isPasswordVisible = !isPasswordVisible" /> -->
        </div>
      </div>
      <button type="submit" class="btn btn-primary">{{ $t('login') }}</button>
    </form>
  </section>
</template>

<style scoped></style>

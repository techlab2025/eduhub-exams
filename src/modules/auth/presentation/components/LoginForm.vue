<script setup lang="ts">
import { ref } from 'vue';
import LoginController from '../controllers/login.controller';
import LoginParams from '../../core/params/login.params';
import logo from '@/assets/images/TechlabLogo.png';
import CloseEyeIcon from '@/shared/icons/Login/CloseEyeIcon.vue';
import OpenEyeIcon from '@/shared/icons/Login/OpenEyeIcon.vue';
// import ChangeLanguage from '@/shared/LayoutComponents/SubComponents/ChangeLanguage.vue';

const email = ref('');
const password = ref('');

const controller = LoginController.getInstance();

const login = async () => {
  const params = new LoginParams(email.value, password.value);
  await controller.login(params);
};

const isPasswordVisible = ref(false);
</script>

<template>
  <section class="login">
    <div class="login-header">
      <img :src="logo" alt="TechLab" class="logo-img" />
    </div>

    <form class="login-form" @submit.prevent="login">
      <div class="lang-switcher">
        <!-- <ChangeLanguage /> -->
      </div>

      <div class="title">
        <h2>{{ $t('Welcome Back') }}</h2>
        <p>{{ $t('Access your dashboard to manage platform content and data') }}</p>
      </div>

      <div class="inputs">
        <div class="input-wrapper">
          <label for="email">Email</label>
          <input id="email" v-model="email" class="input" :placeholder="$t('Enter Your Mail')" type="email" />
        </div>
        <div class="input-wrapper">
          <label for="password">{{ $t('Password') }}</label>
          <input id="password" v-model="password" :type="isPasswordVisible ? 'text' : 'password'"
            :placeholder="$t('Enter Your Password')" class="input py" />
          <CloseEyeIcon v-if="isPasswordVisible" class="icon-eye" @click="isPasswordVisible = !isPasswordVisible" />
          <OpenEyeIcon v-else class="icon-eye" @click="isPasswordVisible = !isPasswordVisible" />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">{{ $t('Log In') }}</button>
    </form>
  </section>
</template>

<style scoped>
.login {
  background-image: url('../../../../assets/images/LoginBg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}


</style>

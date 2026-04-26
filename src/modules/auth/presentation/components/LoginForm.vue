<script setup lang="ts">
  import { ref } from 'vue';
  import LoginController from '../controllers/login.controller';
  import LoginParams from '../../core/params/login.params';
  import logo from '@/assets/images/TechlabLogo.png';
  import CloseEyeIcon from '@/shared/icons/Login/CloseEyeIcon.vue';
  import OpenEyeIcon from '@/shared/icons/Login/OpenEyeIcon.vue';

  const email = ref('');
  const password = ref('');

  const controller = LoginController.getInstance();

  const login = async () => {
    const params = new LoginParams(email.value, password.value);
    await controller.login(params);
  };

  const isPasswordVisible = ref();
</script>

<template>
  <section class="login">
    <div class="card">
      <div class="login-logo">
        <img :src="logo" width="22" alt="logo" class="logo" />
      </div>
    </div>

    <form class="login-form" @submit.prevent="login">
      <div class="title">
        <div class="logo">
          <h2>HSE.Cloud.Ai</h2>
        </div>
        <div class="text">
          <p>{{ $t('Login_now') }}</p>
          <span>{{ $t('Please enter your email and password to log in') }}</span>
        </div>
      </div>
      <div class="inputs">
        <div class="input-wrapper">
          <input
            id="email"
            v-model="email"
            class="input"
            :placeholder="$t('Enter Your Mail')"
            type="email"
          />
        </div>
        <div class="input-wrapper">
          <input
            id="password"
            v-model="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            :placeholder="$t('Enter Password')"
            class="input py"
          />
          <CloseEyeIcon
            v-if="isPasswordVisible"
            class="icon-eye"
            @click="isPasswordVisible = !isPasswordVisible"
          />
          <OpenEyeIcon v-else class="icon-eye" @click="isPasswordVisible = !isPasswordVisible" />
        </div>
      </div>
      <button type="submit" class="btn btn-primary">{{ $t('login') }}</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { useRouter } from 'vue-router'
import LoginController from "../controllers/login.controller";
import LoginParams from "../../core/params/login.params";
// import LoginIcon from "@/shared/icons/LoginIcon.vue";

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
    <div class="login-logo">
      <!-- <LoginIcon class="login-icon" /> -->
      <span>logo</span>
      <!-- <img src="@/assets/images/logo.svg" width="22" alt="logo" /> -->
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

      <div class="inputs">
        <div class="input-wrapper">
          <!-- <Email class="icon " /> -->
          <input
            id="email"
            v-model="email"
            class="input py"
            :placeholder="$t('Enter Your Mail')"
            type="email"
          />
        </div>
        <div class="input-wrapper">
          <!-- <Loca class="icon" /> -->
          <input
            id="password"
            v-model="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            :placeholder="$t('Enter Password')"
            class="input py"
          />
          <!-- <CloseEye class="icon-eye" v-if="isPasswordVisible" @click="isPasswordVisible = !isPasswordVisible" /> -->
          <!-- <EyeIcon class="icon-eye" v-else @click="isPasswordVisible = !isPasswordVisible" /> -->
        </div>
      </div>
      <button type="submit" class="btn btn-primary">{{ $t('login') }}</button>
    </form>
  </section>
</template>

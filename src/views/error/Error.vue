<script setup lang="ts">
import ErrorIcon404 from "@/shared/icons/Error/ErrorIcon404.vue";
</script>
<template>
  <div class="error-container">
    <h2 class="error-404">404</h2>
    <ErrorIcon404 class="error-icon" />
    <h3 class="error-text">Opp! Page Not Found</h3>
    <p class="error-description">
      We couldn’t find the page you were looking for. It might have been moved
      or deleted.
    </p>
  </div>
</template>

<style scoped>
.error-container {
  width: 100%;
  height: 100vh;
  position: relative;
}
.error-404 {
  font-size: 600px;
  font-weight: bold;
  color: #4faf7c1a;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.error-text {
  font-size: 94px;
  font-weight: 700;
  color: #24385c;
  text-align: center;
  position: absolute;
  top: 80%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
  z-index: 99;
}

.error-description {
  font-size: 20px;
  font-weight: 500;
  color: #8a8a8a;
  text-align: center;
  position: absolute;
  top: 92%;
  left: 50%;
  width: 40%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
</style>

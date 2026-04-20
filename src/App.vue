<script setup lang="ts">
import UnifiedDialog from "@/base/Presentation/Dialogs/UnifiedDialog.vue";
import ToastContainer from "@/base/Presentation/Dialogs/ToastContainer.vue";
import { useThemeStore } from "@/stores/theme";

// Initialise early so the `dark` class is applied before first paint
useThemeStore();
</script>

<template>
  <div>
    <UnifiedDialog />
    <ToastContainer position="top-right" />
    <RouterView />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

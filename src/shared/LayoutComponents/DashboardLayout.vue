<script setup lang="ts">
import BreadCrumb from "./SubComponents/BreadCrumb.vue";
import SidebarNavigation from "./SubComponents/SidebarNavigation.vue";
import Navbar from "./SubComponents/Navbar.vue";
import NavigationBarMobile from "./SubComponents/NavigationBarMobile.vue";
</script>

<template>
  <main class="content">
    <div class="sidebar-container">
      <SidebarNavigation />
    </div>
    <section class="content-wrapper">
      <Navbar />
      <div class="main-content">
        <BreadCrumb  :BreadCramps="[]" />
        <slot />
      </div>
      <NavigationBarMobile class="mobile-nav" />
    </section>
  </main>
</template>

<style scoped>
.mobile-nav {
  display: none;
}

@media (max-width: 600px) {
  .mobile-nav {
    display: block;
  }
}
</style>

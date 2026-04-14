<script setup lang="ts">
import Header from '@/shared/LayoutComponents/Header.vue'
import NewSidebar from '../LayoutComponents/NewSidebar.vue'
import BreadCrumb from '../LayoutComponents/BreadCrumb.vue'

</script>

<template>
  <main class="content">
    <NewSidebar />
    <section class="content-wrapper">
      <Header />
      <div class="main-content">
        <BreadCrumb />
        <slot />
      </div>
    </section>
  </main>
</template>

<style scoped></style>

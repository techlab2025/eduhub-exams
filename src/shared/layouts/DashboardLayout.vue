<script setup lang="ts">
import { useRoute } from 'vue-router'
import Header from '@/shared/LayoutComponents/Header.vue'
import { useUserStore } from '@/stores/user'
import NewSidebar from '../LayoutComponents/NewSidebar.vue'
import BreadCrumb from '../LayoutComponents/BreadCrumb.vue'

const route = useRoute()




</script>

<template>
  <main class="content">
    <!--  -->
    <!-- <Sidebar  /> -->
    <!-- <div class="sidebar"> -->
    <NewSidebar />
    <!-- </div> -->
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

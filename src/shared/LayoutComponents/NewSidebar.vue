<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import AdminSidebar from './AdminSidebar.vue'
import BackIcon from '../icons/BackIcon.vue'
import { useRoute, useRouter } from 'vue-router'

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const active = ref('0')
const user = useUserStore()

const router = useRouter()
const RouterBack = () => {
  router.back()
}
</script>

<template>
  <aside :class="['sidebar', isOpen ? 'open' : 'close']">
    <div class="sidebar-wrapper">

      <button class="sidebar-back" @click="RouterBack">
        <BackIcon class="icon" />
        <span>back</span>
      </button>

      <div class="links">
        <AdminSidebar />
      </div>
    </div>
  </aside>
</template>

<style scoped></style>

<script lang="ts"></script>
<template>
  <div class="panel-container">
    <slot />
  </div>
</template>

<style scoped>
.panel-container {
  background: white;
  border-radius: 14px;
  padding: 22px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.panel-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
}
</style>

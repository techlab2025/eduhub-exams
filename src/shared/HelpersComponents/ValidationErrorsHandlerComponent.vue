<script setup lang="ts">
  //   defineProps<{
  //     validations: Array<{
  //       key: string;
  //       message: string;
  //     },>;
  //   }>();
  defineProps<{
    validationKey: string;
    validations: Array<{
      key: string;
      message: string;
    }>;
  }>();
</script>

<template>
  <div v-for="validation in validations" :key="validation.key">
    <small v-if="validation.key === validationKey" role="alert">{{ validation.message }}</small>
  </div>
</template>
<style scoped>
  small {
    color: red;
    font-size: 16px;
    font-family: 'Demi';
  }
</style>

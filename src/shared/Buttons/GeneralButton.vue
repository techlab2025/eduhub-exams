<script setup lang="ts">
const props = defineProps({
  type: {
    type: String as () => "button" | "submit" | "reset",
    default: "button",
  },
  title: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "btn btn-primary",
  },
  icon: {
    type: [Object, Boolean],
    default: false,
  },
  isLink: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
    default: "/",
  },
});
</script>

<template>
  <router-link :class="props.class" :to="`${props.link}`" v-if="props.isLink">
    <component :is="props.icon" />
    {{ props.title }}
  </router-link>
  <button :type="props.type" :class="props.class" v-else>
    <component :is="props.icon" />
    {{ props.title }}
  </button>
</template>

<style scoped></style>

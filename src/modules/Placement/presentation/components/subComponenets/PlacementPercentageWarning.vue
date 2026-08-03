<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import warningGif from '@/assets/images/placement-warning.gif';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const props = defineProps<{
    percentage: number;
  }>();

  const warningVisible = ref<boolean>(true);

  const warningText = computed(() => {
    if (props.percentage > 100) {
      return t(
        'The percentage exceeds the 100% limit. Please adjust the values to ensure the total does not exceed 100%.',
      );
    }
    return t(
      'The percentage is less than 100%. To ensure a balanced distribution of questions, please adjust the values so the total reaches 100%.',
    );
  });

  const emit = defineEmits(['close']);
  const closeDialog = () => {
    warningVisible.value = false;
    emit('close');
  };
</script>

<template>
  <Dialog
    v-model:visible="warningVisible"
    modal
    :style="{ width: '40rem' }"
    :pt="{
      root: 'placement-dialog',
      header: 'dialog-placement-header',
      content: 'dialog-placement-body',
    }"
  >
    <div class="dialog-content">
      <div class="warning-icon">
        <img :src="warningGif" alt="skills" width="60" />
      </div>
      <h2 class="dialog-title">{{ warningText }}</h2>
    </div>

    <div class="dialog-footer">
      <button class="btn btn-primary" @click="closeDialog">
        {{ $t('okay i understand') }}
      </button>
    </div>
  </Dialog>
</template>

<style scoped>
  .warning-icon {
    width: 250px;
    height: 250px;
    margin: auto;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>

<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import { ref } from 'vue';
  import Saved from '@/assets/images/question/Saved.gif';
  const SaveStatusEnum = {
    Save: 1,
    SaveAndNew: 2,
  } as const;

  type SaveStatusEnum = (typeof SaveStatusEnum)[keyof typeof SaveStatusEnum];

  const visable = ref();
  defineEmits(['with-review', 'without-review']);
  const { saveStatus } = defineProps<{
    saveStatus: SaveStatusEnum;
  }>();
</script>

<template>
  <button type="button" class="btn"
  :class="saveStatus == SaveStatusEnum.Save ?`btn-primary`:`btn-secondary` "
  @click="visable = true">
    {{ saveStatus == SaveStatusEnum.Save ? $t('save') : $t(`Save & New`) }}
  </button>
  <Dialog
    v-model:visible="visable"
    modal
    :pt="{
      root: 'review-dialog question-action-dialog save-review-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <div class="dialog-content">
      <img class="dialog-illustration" :src="Saved" alt="" />
      <div class="dialog-message">
        <h2>{{ $t('save_review_dialog.title') }}</h2>
        <p>{{ $t('save_review_dialog.description') }}</p>
      </div>
      <div class="btns">
        <button
          type="button"
          class="btn btn-primary without-review-btn"
          @click="$emit('without-review')"
        >
          {{ $t('save_review_dialog.without_review') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="$emit('with-review')">
          {{ $t('save_review_dialog.with_review') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>


<style scoped>
.btn-primary
{
  width: 60%;
}
.btn-secondary{
  width: 30%;

}
</style>
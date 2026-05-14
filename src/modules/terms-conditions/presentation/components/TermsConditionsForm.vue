<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import Privecyicon from '@/shared/icons/privecyicon.vue';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import TermsConditionsController from '../controllers/terms-conditions.controller';
  import AddTermsConditionsParams from '../../core/params/add.terms-conditions.params';

  const emit = defineEmits(['update:data']);

  const title = ref<Record<string, string> | string>();
  const description = ref<Record<string, string> | string>();
  const termsConditionsController = TermsConditionsController.getInstance();

  const status = computed(() => termsConditionsController.listState.value);
  const updateData = () => {
    const Data = {
      title: title.value,
      description: description.value,
    };
    emit('update:data', Data);
  };

  // ─── Init ───────────────────────────────
  onMounted(() => {
    updateData();
  });

  const SubmitData = async () => {
    await termsConditionsController.create(
      new AddTermsConditionsParams({
        translations: new TranslationParams({
          title: title.value as Record<string, string>,
          description: description.value as Record<string, string>,
        }),
      }),
    );
  };

  const ShowPrivacy = async () => {
    await termsConditionsController.fetchList();

    const firstItem = status.value.data?.[0];
    console.log(firstItem, 'firstItem');
    if (firstItem) {
      title.value = firstItem?.title;
      description.value = firstItem?.description;
    }
  };

  onMounted(() => {
    ShowPrivacy();
  });

  onUnmounted(() => {
    title.value = {};
    description.value = {};
  });

  const ResetData = () => {
    title.value = {};
    description.value = {};
  };
</script>

<template>
  <div class="terms-container">
    <!-- Header -->
    <div class="terms-header">
      <h3>{{ $t('Terms & Conditions') }}</h3>
      <p>{{ $t('Add or update the terms and conditions of your platform') }}</p>
    </div>

    <div class="form-header-left">
      <p><Privecyicon /> {{ $t(`Terms Details`) }}</p>
      <button @click="ResetData" class="reset-btn">{{ $t(`reset`) }}</button>
    </div>

    <!-- List -->
    <div class="terms-list">
      <!-- Question -->
      <div class="field">
        <MultiLangInput
          :field-key="`terms`"
          :label="`terms title`"
          :languages="['en', 'ar']"
          :type="`title`"
          :model-value="title as Record<string, string>"
          @update:model-value="title = $event"
        />
      </div>
      <div class="field">
        <MultiLangInput
          :field-key="`terms`"
          :label="`terms description`"
          :languages="['en', 'ar']"
          :modelValue="description as Record<string, string>"
          :type="`description`"
          @update:model-value="description = $event"
        />
      </div>
    </div>

    <!-- Add Button -->
    <div class="btn-container">
      <button class="btn btn-primary" @click="SubmitData">{{ $t(`Save`) }}</button>
      <button class="btn btn-cancel">{{ $t(`cancel`) }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

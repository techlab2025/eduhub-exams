<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import PrivacyController from '../controllers/privacy.controller';
  import AddPrivacyParams from '../../core/params/add.privacy.params';
  import Privecyicon from '@/shared/icons/privecyicon.vue';
  import TranslationParams from '@/modules/about/core/params/translation.params';

  const emit = defineEmits(['update:data']);

  const title = ref<Record<string, string>>();
  const description = ref<Record<string, string>>();
  const privacyController = PrivacyController.getInstance();

  const status = computed(() => privacyController.listState.value);
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
    await privacyController.create(
      new AddPrivacyParams({
        translations: new TranslationParams({
          title: title.value!,
          description: description.value!,
        }),
      }),
    );
  };

  const ShowPrivacy = async () => {
    await privacyController.fetchList();

    const firstItem = status.value.data?.[0];
    if (firstItem) {
      title.value = firstItem.title || {};
      description.value = firstItem.description || {};
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
  <div class="privacy-container">
    <!-- Header -->
    <div class="privacy-header">
      <h3>{{ $t('Privacy & Policy') }}</h3>
      <p>{{ $t('Define how user data is collected, used, and protected') }}</p>
    </div>

    <div class="form-header-left">
      <p><Privecyicon /> {{ $t(`Policy Details`) }}</p>
      <button @click="ResetData" class="reset-btn">{{ $t(`reset`) }}</button>
    </div>

    <!-- List -->
    <div class="privacy-list">
      <!-- Question -->
      <div class="field">
        <MultiLangInput
          :field-key="`privacy`"
          :label="`policy title`"
          :languages="['en', 'ar']"
          :type="`title`"
          :model-value="title"
          @update:model-value="title = $event"
        />
      </div>
      <div class="field">
        <MultiLangInput
          :field-key="`policy`"
          :label="`Description`"
          :languages="['en', 'ar']"
          :model-value="description"
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

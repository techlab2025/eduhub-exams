<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import PrivacyController from '../controllers/privacy.controller';
  import AddPrivacyParams from '../../core/params/add.privacy.params';
  import Privecyicon from '@/shared/icons/privecyicon.vue';

  const emit = defineEmits(['update:data']);

  const data = ref<Record<string, string>>();

  const updateData = () => {
    emit('update:data', data.value);
  };

  // ─── Init ───────────────────────────────
  onMounted(() => {
    updateData();
  });

  const privacyController = PrivacyController.getInstance();
  const SubmitData = () => {
    privacyController.create(
      new AddPrivacyParams({
        privacy: data.value!,
      }),
    );
  };

  const ShowPrivacy = async () => {
    const result = await privacyController.fetchList();

    if (result instanceof DataSuccess) {
      data.value = result.data[0].privacy;
    }
  };

  onMounted(() => {
    ShowPrivacy();
  });

  onUnmounted(() => {
    data.value = {};
  });
</script>

<template>
  <div class="faq-container">
    <!-- Header -->
    <div class="faq-header">
      <h3>{{ $t('Privacy & Policy') }}</h3>
      <p>{{ $t('Define how user data is collected, used, and protected') }}</p>
    </div>

    <div class="faq-details">
      <p><Privecyicon /> {{ $t(`Policy Details`) }}</p>
      <h6>{{ $t(`reset`) }}</h6>
    </div>

    <!-- List -->
    <div class="faq-list">
      <!-- Question -->
      <div class="field">
        <MultiLangInput
          :field-key="`privacy`"
          :label="`policy title`"
          :languages="['en', 'ar', 'fr']"
          :model-value="data"
          @update:model-value="data = $event"
        />
      </div>
      <div class="field">
        <MultiLangInput
          :field-key="`policy`"
          :label="`Description`"
          :languages="['en', 'ar', 'fr']"
          :model-value="data"
          :type="`description`"
          @update:model-value="data = $event"
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

<style scoped lang="scss">
  .faq-container {
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: 16px;
    padding: 20px;

    .faq-details {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 20px;

      p {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 600;
        font-family: 'medium';
        color: var(--table-header-color);
      }

      h6 {
        font-size: 16px;
        font-weight: 600;
        font-family: 'medium';
        color: var(--danger-color);
        cursor: pointer;
        border-bottom: 3px solid var(--danger-color);
      }
    }

    .btn-container {
      margin-top: 1rem;

      .btn-cancel {
        background-color: var(--background-btn-outline-color);
        color: var(--danger-color);
        border: 1px solid rgba(245, 194, 192, 1);
        border-radius: 50px;
        width: 20%;

        @media (max-width: 768px) {
          width: 50%;
        }
      }

      .btn-primary {
        width: 80%;

        @media (max-width: 768px) {
          width: 50%;
        }
      }
    }
  }
</style>

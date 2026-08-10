<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import {
    ShowHighlightBadgeParams,
    StoreHighlightBadgeParams,
    UpdateHighlightBadgeParams,
  } from '../../core/params/highlightBadge.params';
  import HighlightBadgeController from '../controllers/highlightBadge.controller';

  const route = useRoute();
  const router = useRouter();
  const controller = HighlightBadgeController.getInstance();
  const translations = ref<Record<string, string>>({});
  const loading = ref(false);
  const id = Number(route.params.id || 0);
  const toTranslations = (value: unknown) =>
    Array.isArray(value)
      ? Object.fromEntries(value.map((item) => [String(item.locale), String(item.title ?? '')]))
      : ((value as Record<string, string>) ?? {});

  const save = async () => {
    loading.value = true;
    const fields = new TranslationParams({ title: translations.value });
    const result = id
      ? await controller.update(new UpdateHighlightBadgeParams(id, fields))
      : await controller.create(new StoreHighlightBadgeParams(fields));
    loading.value = false;
    if (result?.data || !result?.hasError) await router.push('/highlight-badges');
  };
  onMounted(async () => {
    if (!id) return;
    await controller.fetchOne(new ShowHighlightBadgeParams(id, true));
    translations.value = toTranslations(controller.itemData.value?.title);
  });
</script>

<template>
  <section class="form-card">
    <h2>{{ $t(id ? 'edit_highlight_badge' : 'add_highlight_badge') }}</h2>
    <MultiLangInput
      field-key="title"
      :label="$t('title')"
      :model-value="translations"
      @update:model-value="translations = $event"
    />
    <div class="actions">
      <button class="btn btn-primary" :disabled="loading" @click="save">{{ $t('save') }}</button>
      <button class="btn btn-cancel" @click="router.push('/highlight-badges')">
        {{ $t('cancel') }}
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .form-card {
    display: grid;
    gap: var(--xl-size-base);
    padding: var(--xl-size-1);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
    background: var(--bg-main);
  }

  .actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: flex-end;
  }
</style>

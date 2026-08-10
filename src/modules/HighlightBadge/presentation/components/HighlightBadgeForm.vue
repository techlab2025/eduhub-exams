<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import type HighlightBadgeModel from '../../core/models/highlightBadge.model';
  import AddHighLightsBadgesParams from '../../core/params/add.highlightBadge.params';
  import EditHighLightsBadgesParams from '../../core/params/edit.highlightBadge.params';

  const props = defineProps<{
    highlightBadge?: HighlightBadgeModel;
    loading?: boolean;
    formKey?: string;
  }>();
  const emit = defineEmits(['updateData']);
  const route = useRoute();
  const id = Number(route.params.id || 0);
  const translations = ref<Record<string, string>>({});

  const toTranslations = (value: unknown) =>
    Array.isArray(value)
      ? Object.fromEntries(
          value.map((item: Record<string, unknown>) => [
            String(item.locale),
            String(item.title ?? ''),
          ]),
        )
      : ((value as Record<string, string>) ?? {});

  const updateData = () => {
    const data = {
      translations: new TranslationParams({ title: translations.value }),
    };
    emit(
      'updateData',
      id
        ? new EditHighLightsBadgesParams({ highlightBadgeId: id, ...data })
        : new AddHighLightsBadgesParams(data),
    );
  };

  watch(
    () => props.highlightBadge,
    (highlightBadge) => {
      if (highlightBadge) translations.value = toTranslations(highlightBadge.title);
    },
    { immediate: true },
  );
  watch(translations, updateData, { deep: true, immediate: true });
</script>

<template>
  <section class="form-card" :class="{ 'is-loading': props.loading }">
    <h2>{{ $t(id ? 'edit_highlight_badge' : 'add_highlight_badge') }}</h2>
    <MultiLangInput
      field-key="title"
      :label="$t('title')"
      :model-value="translations"
      @update:model-value="translations = $event"
    />
  </section>
</template>

<style scoped lang="scss">
  .form-card {
    display: grid;
    gap: var(--xl-size-base);
    padding: var(--xl-size-1);
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);

    &.is-loading {
      pointer-events: none;
      opacity: 0.7;
    }
  }
</style>

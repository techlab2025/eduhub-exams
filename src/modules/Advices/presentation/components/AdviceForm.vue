<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import type AdviceModel from '../../core/models/advice.model';
  import AddAdviceParams from '../../core/params/add.advice.params';
  import EditAdviceParams from '../../core/params/edit.advice.params';

  const props = defineProps<{
    advice?: AdviceModel;
    loading?: boolean;
    formKey?: string;
  }>();
  const emit = defineEmits(['updateData']);
  const route = useRoute();
  const id = Number(route.params.id || 0);
  const titleTranslations = ref<Record<string, string>>({});
  const descriptionTranslations = ref<Record<string, string>>({});

  const toTranslations = (value: unknown, field: 'title' | 'description') =>
    Array.isArray(value)
      ? Object.fromEntries(
          value.map((item: Record<string, unknown>) => [
            String(item.locale),
            String(item[field] ?? ''),
          ]),
        )
      : typeof value === 'object' && value !== null
        ? (value as Record<string, string>)
        : {};

  const updateData = () => {
    const data = {
      translations: new TranslationParams({
        title: titleTranslations.value,
        description: descriptionTranslations.value,
      }),
    };

    emit(
      'updateData',
      id ? new EditAdviceParams({ adviceId: id, ...data }) : new AddAdviceParams(data),
    );
  };

  watch(
    () => props.advice,
    (advice) => {
      if (!advice) return;
      titleTranslations.value = toTranslations(advice.title, 'title');
      descriptionTranslations.value = toTranslations(advice.description, 'description');
    },
    { immediate: true },
  );
  watch([titleTranslations, descriptionTranslations], updateData, {
    deep: true,
    immediate: true,
  });
</script>

<template>
  <section class="form-card" :class="{ 'is-loading': props.loading }">
    <h2>{{ $t(id ? 'edit_advice' : 'add_advice') }}</h2>
    <MultiLangInput
      field-key="title"
      :label="$t('title')"
      :model-value="titleTranslations"
      @update:model-value="titleTranslations = $event"
    />
    <MultiLangInput
      field-key="description"
      type="description"
      :label="$t('description')"
      :model-value="descriptionTranslations"
      @update:model-value="descriptionTranslations = $event"
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

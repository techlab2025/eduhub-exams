<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import type AdviceModel from '../../core/models/advice.model';
  import AddAdviceParams from '../../core/params/add.advice.params';
  import EditAdviceParams from '../../core/params/edit.advice.params';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import AdviceCategoryController from '@/modules/AdviceCategory/presentation/controllers/advice.category.controller';
  import IndexAdviceCategoryParams from '@/modules/AdviceCategory/core/params/index.advice.category.params';

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
  const adviceCategory = ref<TitleInterface<number> | null>(null);
  const adviceCategoryController = AdviceCategoryController.getInstance();
  const adviceCategoryParams = new IndexAdviceCategoryParams();

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
      adviceCategoryId: adviceCategory.value?.id ?? 0,
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
      adviceCategory.value = advice.adviceCategory;
    },
    { immediate: true },
  );
  watch([titleTranslations, descriptionTranslations, adviceCategory], updateData, {
    deep: true,
    immediate: true,
  });
</script>

<template>
  <section class="form-card" :class="{ 'is-loading': props.loading }">
    <h2>{{ $t(id ? 'edit_advice' : 'add_advice') }}</h2>
    <UpdatedCustomInputSelect
      id="advice-category"
      v-model="adviceCategory"
      :label="$t('advice_category')"
      :placeholder="$t('select_advice_category')"
      :controller="adviceCategoryController"
      :params="adviceCategoryParams"
      required
      @update:model-value="updateData"
    />
    <MultiLangInput
      class="required-field"
      field-key="title"
      :label="$t('title')"
      :model-value="titleTranslations"
      @update:model-value="titleTranslations = $event"
    />
    <MultiLangInput
      class="required-field"
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

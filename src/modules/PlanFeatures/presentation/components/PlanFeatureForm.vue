<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import { PlanFeatureTypeEnum } from '../../core/models/planFeature.model';
  import {
    ShowPlanFeatureParams,
    StorePlanFeatureParams,
    UpdatePlanFeatureParams,
  } from '../../core/params/planFeature.params';
  import PlanFeatureController from '../controllers/planFeature.controller';

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const controller = PlanFeatureController.getInstance();
  const id = Number(route.params.id || 0);
  const title = ref<Record<string, string>>({});
  const description = ref<Record<string, string>>({});
  const queryParentId = Number(route.query.parent_id ?? 0);
  const parentId = ref<number | null>(queryParentId > 0 ? queryParentId : null);
  const type = ref<TitleInterface<number> | null>(null);
  const loading = ref(false);
  const typeOptions = computed(() => [
    {
      id: Number(PlanFeatureTypeEnum.SWITCH),
      title: t('switch'),
    },
    {
      id: Number(PlanFeatureTypeEnum.NUMBER),
      title: t('number'),
    },
  ]);
  const queryFeatureType = String(route.query.plan_feature_type ?? route.query.feature_type ?? '');
  if (
    parentId.value &&
    Object.values(PlanFeatureTypeEnum).includes(queryFeatureType as PlanFeatureTypeEnum)
  ) {
    type.value = typeOptions.value.find((option) => option.id === Number(queryFeatureType)) ?? null;
  }
  const normalize = (value: unknown, key: string) =>
    Array.isArray(value)
      ? Object.fromEntries(value.map((item) => [String(item.locale), String(item[key] ?? '')]))
      : ((value as Record<string, string>) ?? {});
  const save = async () => {
    if (!type.value) return;
    loading.value = true;
    const payload = {
      translations: new TranslationParams({ title: title.value, description: description.value }),
      parentId: parentId.value,
      type: String(type.value.id) as PlanFeatureTypeEnum,
    };
    const result = id
      ? await controller.update(new UpdatePlanFeatureParams(id, payload))
      : await controller.create(new StorePlanFeatureParams(payload));
    loading.value = false;
    if (result?.data || !result?.hasError) await router.push('/plan-features');
  };
  onMounted(async () => {
    if (!id) return;
    await controller.fetchOne(new ShowPlanFeatureParams(id, true));
    const item = controller.itemData.value;
    if (!item) return;
    title.value = normalize(item.title, 'title');
    description.value = normalize(item.description, 'description');
    type.value = typeOptions.value.find((option) => option.id === Number(item.type)) ?? null;
    parentId.value = item.parentId;
  });
</script>

<template>
  <section class="form-card">
    <h2>{{ $t(id ? 'edit_plan_feature' : 'add_plan_feature') }}</h2>
    <MultiLangInput
      field-key="title"
      :label="$t('title')"
      :model-value="title"
      @update:model-value="title = $event"
    />
    <MultiLangInput
      field-key="description"
      type="description"
      :label="$t('description')"
      :model-value="description"
      @update:model-value="description = $event"
    />
    <div v-if="parentId" class="inherited-feature">
      <span>{{ $t('parent_feature') }}: #{{ parentId }}</span>
      <span>{{ $t('feature_type') }}: {{ type?.title }}</span>
    </div>
    <UpdatedCustomInputSelect
      v-if="!parentId"
      v-model="type"
      :label="$t('feature_type')"
      :placeholder="$t('select_feature_type')"
      :static-options="typeOptions"
      required
    />
    <div class="actions">
      <button class="btn btn-primary" :disabled="loading" @click="save">{{ $t('save') }}</button>
      <button class="btn btn-cancel" @click="router.push('/plan-features')">
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
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  .actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: flex-end;
  }

  .inherited-feature {
    display: flex;
    gap: var(--xs-size);
    justify-content: space-between;
    padding: var(--xs-size);
    color: var(--gray-700);
    background: var(--gray-50);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-md);
  }
</style>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import type PlanFeatureModel from '../../core/models/planFeature.model';
  import { PlanFeatureTypeEnum } from '../../core/models/planFeature.model';
  import {
    DeletePlanFeatureParams,
    IndexPlanFeatureParams,
  } from '../../core/params/planFeature.params';
  import PlanFeatureController from '../controllers/planFeature.controller';

  const { t } = useI18n();
  const router = useRouter();
  const controller = PlanFeatureController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const headers = computed<TableHeader[]>(() => [
    { key: 'title', label: t('title') },
    { key: 'description', label: t('description') },
    { key: 'type', label: t('feature_type') },
  ]);
  const fetchItems = (page = 1) =>
    controller.fetchList(new IndexPlanFeatureParams(word.value, page, perPage.value));
  const remove = async (id: number) => {
    if (!window.confirm(t('confirm_delete'))) return;
    await controller.delete(new DeletePlanFeatureParams(id));
    await fetchItems();
  };
  const addSubFeature = (item: PlanFeatureModel) => {
    router.push({
      path: '/plan-features/add',
      query: {
        parent_id: String(item.id),
        plan_feature_type: item.type,
      },
    });
  };
  onMounted(() => fetchItems());
</script>

<template>
  <section>
    <header class="index-header">
      <input
        v-model="word"
        class="search-input"
        :placeholder="$t('search')"
        @input="fetchItems()"
      />
      <button class="btn btn-primary" @click="router.push('/plan-features/add')">
        {{ $t('add_plan_feature') }}
      </button>
    </header>
    <DataStatusBuilder
      :controller="state"
      :on-retry="
        async () => {
          await fetchItems();
        }
      "
    >
      <template #success="{ data }">
        <AppTable :headers="headers" :items="data as PlanFeatureModel[]" show-index>
          <template #cell-type="{ item }">
            {{ $t(item.type === PlanFeatureTypeEnum.SWITCH ? 'switch' : 'number') }}
          </template>
          <template #actions="{ item }">
            <div class="row-actions">
              <button class="btn btn-primary" @click="addSubFeature(item)">
                {{ $t('add_sub_feature') }}
              </button>
              <button class="btn" @click="router.push(`/plan-features/edit/${item.id}`)">
                {{ $t('edit') }}
              </button>
              <button class="btn btn-cancel" @click="remove(item.id)">{{ $t('delete') }}</button>
            </div>
          </template>
        </AppTable>
        <Pagination
          v-if="controller.pagination.value"
          :pagination="controller.pagination.value"
          @change-page="fetchItems"
          @count-per-page="
            (count) => {
              perPage = count;
              fetchItems();
            }
          "
        />
      </template>
    </DataStatusBuilder>
  </section>
</template>

<style scoped lang="scss">
  .index-header,
  .row-actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: space-between;
  }
</style>

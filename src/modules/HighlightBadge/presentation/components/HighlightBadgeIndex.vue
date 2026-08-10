<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import type HighlightBadgeModel from '../../core/models/highlightBadge.model';
  import {
    DeleteHighlightBadgeParams,
    IndexHighlightBadgeParams,
  } from '../../core/params/highlightBadge.params';
  import HighlightBadgeController from '../controllers/highlightBadge.controller';

  const { t } = useI18n();
  const router = useRouter();
  const controller = HighlightBadgeController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const headers = computed<TableHeader[]>(() => [{ key: 'title', label: t('title') }]);

  const fetchItems = (page = 1) =>
    controller.fetchList(new IndexHighlightBadgeParams(word.value, page, perPage.value));
  const remove = async (id: number) => {
    if (!window.confirm(t('confirm_delete'))) return;
    await controller.delete(new DeleteHighlightBadgeParams(id));
    await fetchItems();
  };
  onMounted(() => fetchItems());
</script>

<template>
  <section class="feature-page">
    <header class="index-header">
      <input
        v-model="word"
        class="search-input"
        :placeholder="$t('search')"
        @input="fetchItems()"
      />
      <button class="btn btn-primary" @click="router.push('/highlight-badges/add')">
        {{ $t('add_highlight_badge') }}
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
        <AppTable :headers="headers" :items="data as HighlightBadgeModel[]" show-index>
          <template #actions="{ item }">
            <div class="row-actions">
              <button class="btn" @click="router.push(`/highlight-badges/edit/${item.id}`)">
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

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import type HighlightBadgeModel from '../../core/models/highlightBadge.model';
  import {
    DeleteHighlightBadgeParams,
    IndexHighlightBadgeParams,
  } from '../../core/params/highlightBadge.params';
  import HighlightBadgeController from '../controllers/highlightBadge.controller';
  import { debounce } from '@/base/Presentation/Utils/debouced';

  const { t } = useI18n();
  const router = useRouter();
  const controller = HighlightBadgeController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const headers = computed<TableHeader[]>(() => [{ key: 'title', label: t('title') }]);

  const fetchItems = (page = 1, word: string = '') =>
    controller.fetchList(new IndexHighlightBadgeParams(word, page, perPage.value));
  const remove = async (id: number) => {
    if (!window.confirm(t('confirm_delete'))) return;
    await controller.delete(new DeleteHighlightBadgeParams(id));
    await fetchItems();
  };
  onMounted(() => fetchItems());
  const route = useRoute();
  const Search = debounce(() => {
    router.push({
      query: {
        ...route.query,
        page: 1,
        word: word.value || undefined,
      },
    });
    fetchItems(1, word.value);
  });
</script>

<template>
  <section class="feature-page">
    <div class="search-field">
      <span class="search-icon">
        <IndexSearchIcon />
      </span>
      <input
        v-model="word"
        placeholder="Search by employee name or email…"
        class="search-input"
        type="text"
        @input="Search"
      />
    </div>
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

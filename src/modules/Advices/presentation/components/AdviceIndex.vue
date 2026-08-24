<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import NoItemContainer from '@/shared/HelpersComponents/NoItemContainer.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import EditIcon from '@/shared/icons/DropListIcons/EditIcon.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import type AdviceModel from '../../core/models/advice.model';
  import DeleteAdviceParams from '../../core/params/delete.advice.params';
  import IndexAdviceParams from '../../core/params/index.advice.params';
  import AdviceController from '../controllers/advice.controller';
  import AdviceCategoryDialog from '@/modules/AdviceCategory/presentation/components/AdviceCategoryDialog.vue';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const controller = AdviceController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const headers = computed<TableHeader[]>(() => [
    { key: 'title', label: t('title') },
    { key: 'description', label: t('description') },
  ]);

  const fetchItems = (page = 1, searchWord: string = '') =>
    controller.fetchList(new IndexAdviceParams({ word: searchWord, page, perPage: perPage.value }));

  const remove = async (id: number) => {
    await controller.delete(new DeleteAdviceParams({ adviceId: id }));
    await fetchItems();
  };

  const actionList = (item: AdviceModel) => [
    {
      text: t('edit'),
      icon: EditIcon,
      link: `/advices/edit/${item.id}`,
    },
    {
      text: t('delete'),
      icon: DeletIcon,
      action: () => remove(item.id),
    },
  ];

  const search = debounce(() => {
    router.push({
      query: { ...route.query, page: 1, word: word.value || undefined },
    });
    fetchItems(1, word.value);
  });

  onMounted(() => fetchItems());
</script>

<template>
  <section class="feature-page">
    <header>
      <div class="search-field">
        <span class="search-icon"><IndexSearchIcon /></span>
        <input
          v-model="word"
          :placeholder="$t('search_advices')"
          class="search-input"
          type="text"
          @input="search"
        />
      </div>
      <div class="header-actions">
        <AdviceCategoryDialog />
        <button class="btn btn-primary" @click="router.push('/advices/add')">
          {{ $t('add_advice') }}
        </button>
      </div>
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
        <AppTable :headers="headers" :items="data as AdviceModel[]" show-index>
          <template #actions="{ item }">
            <div class="row-actions">
              <DropList
                :action-list="actionList(item)"
                :delete-dialog-title="$t('advice_confirm_delete')"
                :delete-dialog-message="$t('delete_advice_message')"
              />
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
      <template #empty>
        <NoItemContainer :title="$t('no_advices_found')" :description="$t('add_advice_message')" />
      </template>
      <template #failed>
        <NoItemContainer :title="$t('no_advices_found')" :description="$t('add_advice_message')" />
      </template>
      <template #no-network>
        <NoItemContainer :title="$t('no_advices_found')" :description="$t('add_advice_message')" />
      </template>
    </DataStatusBuilder>
  </section>
</template>

<style scoped lang="scss">
  header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .row-actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: flex-end;
  }

  .header-actions {
    display: flex;
    gap: var(--xs-size);
  }
</style>

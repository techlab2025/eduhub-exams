<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import type BlockReasonModel from '../../core/models/blockReason.model';

  import BlockReasonController from '../controllers/blockReason.controller';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import EditIcon from '@/shared/icons/DropListIcons/EditIcon.vue';
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import IndexBlockReasonsParams from '../../core/params/index.blockReason.params';
  import DeleteBlockReasonsParams from '../../core/params/delete.blockReason.params';
  import NoItemContainer from '@/shared/HelpersComponents/NoItemContainer.vue';

  const { t } = useI18n();
  const router = useRouter();
  const controller = BlockReasonController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const headers = computed<TableHeader[]>(() => [{ key: 'title', label: t('title') }]);

  const fetchItems = (page = 1, word: string = '') =>
    controller.fetchList(
      new IndexBlockReasonsParams({ word, pageNumber: page, perPage: perPage.value }),
    );

  const remove = async (id: number) => {
    await controller.delete(new DeleteBlockReasonsParams({ blockReasonId: id }));
    await fetchItems();
  };

  const actionList = (item: BlockReasonModel) => [
    {
      text: t('edit'),
      icon: EditIcon,
      link: `/block-reasons/edit/${item.id}`,
    },
    {
      text: t('delete'),
      icon: DeletIcon,
      action: () => remove(item.id),
    },
  ];

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
    <header>
      <div class="search-field">
        <span class="search-icon">
          <IndexSearchIcon />
        </span>
        <input
          v-model="word"
          :placeholder="$t('search_block_reasons')"
          class="search-input"
          type="text"
          @input="Search"
        />
      </div>
      <button class="btn btn-primary" @click="router.push('/block-reasons/add')">
        {{ $t('add_block_reason') }}
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
        <AppTable :headers="headers" :items="data as BlockReasonModel[]" show-index>
          <template #actions="{ item }">
            <div class="row-actions">
              <DropList
                :action-list="actionList(item)"
                :delete-dialog-title="$t('block_reason_confirm_delete')"
                :delete-dialog-message="$t('delete_block_reason_message')"
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
        <NoItemContainer
          :title="$t('no_block_reasons_found')"
          :description="$t('add_block_reason_message')"
        />
      </template>
      <template #failed>
        <NoItemContainer
          :title="$t('no_block_reasons_found')"
          :description="$t('add_block_reason_message')"
        />
      </template>
      <template #no-network>
        <NoItemContainer
          :title="$t('no_block_reasons_found')"
          :description="$t('add_block_reason_message')"
        />
      </template>
    </DataStatusBuilder>
  </section>
</template>

<style scoped lang="scss">
  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .index-header,
  .row-actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: space-between;
  }
</style>

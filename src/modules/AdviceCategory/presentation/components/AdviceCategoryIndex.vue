<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import Dialog from 'primevue/dialog';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import EmptyFolderIcon from '@/shared/icons/EmptyFolderIcon.vue';
  import FolderCrudIcon from '@/shared/icons/FolderCrudIcon.vue';
  import CategoryEditIcon from '@/shared/icons/DropListIcons/EditIcon.vue';
  import DeleteIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import type AdviceCategoryModel from '../../core/models/advice.category.model';
  import AddAdviceCategoryParams from '../../core/params/add.advice.category.params';
  import AdviceCategoryTranslationParams from '../../core/params/advice.category.translation.params';
  import DeleteAdviceCategoryParams from '../../core/params/delete.advice.category.params';
  import EditAdviceCategoryParams from '../../core/params/edit.advice.category.params';
  import IndexAdviceCategoryParams from '../../core/params/index.advice.category.params';
  import ShowAdviceCategoryParams from '../../core/params/show.advice.category.params';
  import AdviceCategoryController from '../controllers/advice.category.controller';
  import AdviceCategoryFeedbackDialog from './AdviceCategoryFeedbackDialog.vue';
import IconEditAdvice from '@/shared/icons/IconEditAdvice.vue';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const controller = AdviceCategoryController.getInstance();
  const state = computed(() => controller.listState.value);
  const perPage = ref(10);
  const title = ref<Record<string, string>>({});
  const saving = ref(false);
  const editDialogVisible = ref(false);
  const editLoading = ref(false);
  const editSaving = ref(false);
  const editId = ref<number | null>(null);
  const editTitle = ref<Record<string, string>>({});
  const pendingDelete = ref<AdviceCategoryModel | null>(null);
  const deleteDialogVisible = ref(false);
  const deleteDialogVariant = ref<'delete-confirm' | 'delete-error'>('delete-confirm');
  const deleteErrorMessage = ref('');
  const deleteLoading = ref(false);

  const headers = computed<TableHeader[]>(() => [
    { key: 'id', label: t('advice_category_page.table.id'), width: '14%' },
    { key: 'title', label: t('advice_category_page.table.category'), width: '38%' },
    { key: 'createdAt', label: t('advice_category_page.table.added_date'), width: '28%' },
    { key: 'status', label: t('advice_category_page.table.status'), width: '20%' },
  ]);

  const currentPage = () => Number(route.query.page ?? 1);
  const fetchCategories = async (page = currentPage()): Promise<void> => {
    await controller.fetchList(new IndexAdviceCategoryParams('', page, perPage.value, 1));
  };

  const hasTitle = (translations: Record<string, string>) =>
    Object.values(translations).some((value) => value.trim().length > 0);

  const normalizeTranslations = (translations: Record<string, string>) =>
    Object.entries(translations).reduce<Record<string, string>>((normalized, [locale, value]) => {
      const trimmedValue = value.trim();
      if (trimmedValue) normalized[locale] = trimmedValue;
      return normalized;
    }, {});

  const saveCategory = async () => {
    if (saving.value) return;
    if (!hasTitle(title.value)) {
      dialogManager.toastError(t('advice_category_page.title_required'));
      return;
    }

    saving.value = true;
    try {
      const translations = new AdviceCategoryTranslationParams({
        title: normalizeTranslations(title.value),
      });
      const result = await controller.create(new AddAdviceCategoryParams({ translations }));
      if (!result || result.hasError) return;

      title.value = {};
      await fetchCategories(1);
    } finally {
      saving.value = false;
    }
  };

  const getItemTranslations = (item: AdviceCategoryModel) =>
    Object.keys(item.translations).length > 0 ? { ...item.translations } : { en: item.title };

  const openEdit = async (item: AdviceCategoryModel) => {
    editId.value = item.id;
    editTitle.value = getItemTranslations(item);
    editDialogVisible.value = true;
    editLoading.value = true;
    try {
      const result = await controller.fetchOne(
        new ShowAdviceCategoryParams({ adviceCategoryId: item.id }),
      );
      if (!result?.data) return;
      editTitle.value = getItemTranslations(result.data);
    } finally {
      editLoading.value = false;
    }
  };

  const resetEdit = () => {
    editDialogVisible.value = false;
    editId.value = null;
    editTitle.value = {};
  };

  const closeEdit = () => {
    if (editSaving.value) return;
    resetEdit();
  };

  const saveEdit = async () => {
    if (editSaving.value || editId.value === null) return;
    if (!hasTitle(editTitle.value)) {
      dialogManager.toastError(t('advice_category_page.title_required'));
      return;
    }

    editSaving.value = true;
    try {
      const translations = new AdviceCategoryTranslationParams({
        title: normalizeTranslations(editTitle.value),
      });
      const result = await controller.update(
        new EditAdviceCategoryParams({ adviceCategoryId: editId.value, translations }),
      );
      if (!result || result.hasError) return;

      resetEdit();
      await fetchCategories();
    } finally {
      editSaving.value = false;
    }
  };

  const requestDelete = (item: AdviceCategoryModel) => {
    pendingDelete.value = item;
    deleteDialogVariant.value = 'delete-confirm';
    deleteErrorMessage.value = '';
    deleteDialogVisible.value = true;
  };

  const confirmDelete = async () => {
    if (deleteLoading.value || !pendingDelete.value) return;

    deleteLoading.value = true;
    try {
      const result = await controller.delete(
        new DeleteAdviceCategoryParams({ adviceCategoryId: pendingDelete.value.id }),
        undefined,
        false,
      );
      if (!result || result.hasError) {
        deleteDialogVariant.value = 'delete-error';
        deleteErrorMessage.value = result?.error?.displayMessage ?? '';
        return;
      }

      deleteDialogVisible.value = false;
      pendingDelete.value = null;
      await fetchCategories();
    } finally {
      deleteLoading.value = false;
    }
  };

  const actionList = (item: AdviceCategoryModel) => [
    {
      text: t('edit'),
      icon: CategoryEditIcon,
      action: () => openEdit(item),
      skipDeleteConfirmation: true,
    },
    {
      text: t('delete'),
      icon: DeleteIcon,
      action: () => requestDelete(item),
      skipDeleteConfirmation: true,
      danger: true,
    },
  ];

  const changePage = (page: number) => {
    router.replace({ query: { ...route.query, page } });
    fetchCategories(page);
  };

  const changePerPage = (count: number) => {
    perPage.value = count;
    router.replace({ query: { ...route.query, page: 1 } });
    fetchCategories(1);
  };

  onMounted(() => fetchCategories());
</script>

<template>
  <main class="advice-category-page">
    <section class="advice-category-page__form" :aria-label="$t('advice_category_page.add')">
      <header class="advice-category-page__form-title">
        <FolderCrudIcon aria-hidden="true" />
        <h1>{{ $t('advice_category_page.add') }}</h1>
      </header>

      <div class="advice-category-page__form-controls">
        <MultiLangInput
          field-key="title"
          :label="$t('advice_category_page.category')"
          :placeholder="$t('advice_category_page.category_placeholder')"
          :model-value="title"
          type="title"
          @update:model-value="title = $event"
        />
        <button
          type="button"
          class="advice-category-page__save"
          :disabled="saving"
          @click="saveCategory"
        >
          {{ $t('advice_category_page.save') }}
        </button>
      </div>
    </section>

    <section class="advice-category-page__list" :aria-label="$t('advice_categories')">
      <DataStatusBuilder :controller="state" :on-retry="fetchCategories">
        <template #success="{ data }">
          <AppTable
            :headers="headers"
            :items="(data ?? []) as AdviceCategoryModel[]"
            row-key="id"
            hoverable
          >
            <template #cell-createdAt="{ item }">
              {{ item.createdAt || '—' }}
            </template>
            <template #cell-status="{ item }">
              <span
                v-if="item.status !== null"
                class="advice-category-page__status"
                :class="{ 'advice-category-page__status--active': item.status }"
                :aria-label="$t(item.status ? 'active' : 'inactive')"
                role="status"
              >
                <span aria-hidden="true"></span>
              </span>
              <span v-else>—</span>
            </template>
            <template #actions="{ item }">
              <DropList :action-list="actionList(item)" />
            </template>
          </AppTable>

          <Pagination
            v-if="controller.pagination.value"
            :pagination="controller.pagination.value"
            @change-page="changePage"
            @count-per-page="changePerPage"
          />
        </template>

        <template #empty>
          <div class="advice-category-page__empty">
            <EmptyFolderIcon aria-hidden="true" />
            <h2>{{ $t('advice_category_page.empty_title') }}</h2>
            <p>{{ $t('advice_category_page.empty_description') }}</p>
          </div>
        </template>

        <template #loader>
          <TableSkelaton :rows="6" :columns="headers.length" :has-actions="true" />
        </template>

        <template #failed>
          <div class="advice-category-page__empty">
            <EmptyFolderIcon aria-hidden="true" />
            <h2>{{ $t('advice_category_page.load_error_title') }}</h2>
            <button type="button" class="advice-category-page__retry" @click="fetchCategories()">
              {{ $t('advice_category_page.retry') }}
            </button>
          </div>
        </template>

        <template #no-network>
          <div class="advice-category-page__empty">
            <EmptyFolderIcon aria-hidden="true" />
            <h2>{{ $t('advice_category_page.load_error_title') }}</h2>
            <button type="button" class="advice-category-page__retry" @click="fetchCategories()">
              {{ $t('advice_category_page.retry') }}
            </button>
          </div>
        </template>
      </DataStatusBuilder>
    </section>

    <Dialog
      v-model:visible="editDialogVisible"
      modal
      :closable="false"
      :dismissable-mask="!editSaving"
      :close-on-escape="!editSaving"
      :pt="{
        root: 'advice-category-edit-dialog-host',
        mask: 'advice-category-edit-dialog-mask',
      }"
    >
      <template #container>
        <section class="advice-category-edit-dialog" :aria-busy="editLoading || editSaving">
          <header class="advice-category-edit-dialog__heading">
            <IconEditAdvice aria-hidden="true" />
            <div>
              <h2>{{ $t('advice_category_page.edit.title') }}</h2>
              <p>{{ $t('advice_category_page.edit.description') }}</p>
            </div>
          </header>

          <MultiLangInput
            field-key="title"
            :label="$t('advice_category_page.category')"
            :placeholder="$t('advice_category_page.category_placeholder')"
            :model-value="editTitle"
            type="title"
            @update:model-value="editTitle = $event"
          />

          <footer class="advice-category-edit-dialog__actions">
            <button type="button" :disabled="editLoading || editSaving" @click="saveEdit">
              {{ $t('advice_category_page.edit.save') }}
            </button>
            <button type="button" :disabled="editSaving" @click="closeEdit">
              {{ $t('cancel') }}
            </button>
          </footer>
        </section>
      </template>
    </Dialog>

    <AdviceCategoryFeedbackDialog
      v-model="deleteDialogVisible"
      :variant="deleteDialogVariant"
      :message="deleteErrorMessage"
      :loading="deleteLoading"
      @confirm="confirmDelete"
    />
  </main>
</template>

<style scoped lang="scss">
  .advice-category-page {
    display: grid;
    gap: 24px;
  }

  .advice-category-page__form,
  .advice-category-page__list {
    border: 1px solid var(--border-weak);
    border-radius: 20px;
    background: var(--BgWhite);
  }

  .advice-category-page__form {
    display: grid;
    gap: 20px;
    padding: 20px;
  }

  .advice-category-page__form-title,
  .advice-category-edit-dialog__heading {
    display: flex;
    align-items: center;
    gap: 10px;

    h1,
    h2,
    p {
      margin: 0;
      font-family: var(--font-family);
    }

    h1,
    h2 {
      color: var(--standard-black);
      font-weight: 700;
    }
  }

  .advice-category-page__form-title h1 {
    font-size: 22px;
  }

  .advice-category-page__form-controls {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(180px, 1fr);
    align-items: end;
    gap: 20px;
  }

  .advice-category-page__save,
  .advice-category-page__retry,
  .advice-category-edit-dialog__actions button {
    min-height: 48px;
    padding-inline: 24px;
    border: 1px solid var(--PrimaryColor);
    border-radius: var(--radius-full);
    background: var(--PrimaryColor);
    color: var(--BgWhite);
    font-family: var(--font-family);
    font-size: 14px;
    font-weight: 600;

    &:disabled {
      cursor: wait;
      opacity: 0.65;
    }

    &:focus-visible {
      outline: 2px solid var(--PrimaryColor);
      outline-offset: 2px;
    }
  }

  .advice-category-page__list {
    min-width: 0;
    overflow: hidden;
  }

  .advice-category-page__status {
    display: inline-flex;
    align-items: center;
    width: 38px;
    height: 22px;
    padding: 3px;
    border-radius: var(--radius-full);
    background: var(--gray-300);

    span {
      width: 16px;
      height: 16px;
      border-radius: var(--radius-full);
      background: var(--BgWhite);
    }
  }

  .advice-category-page__status--active {
    justify-content: flex-end;
    background: var(--PrimaryColor);
  }

  .advice-category-page__empty {
    display: grid;
    place-items: center;
    align-content: center;
    gap: 12px;
    min-height: 390px;
    padding: 32px;
    text-align: center;

    :deep(svg) {
      width: 110px;
      height: 110px;
      opacity: 0.55;
    }

    h2,
    p {
      margin: 0;
      font-family: var(--font-family);
    }

    h2 {
      color: var(--standard-black);
      font-size: 22px;
      font-weight: 700;
    }

    p {
      max-width: 34rem;
      color: var(--title-header-color);
      font-size: 16px;
      line-height: 1.5;
    }
  }

  .advice-category-page__retry {
    min-width: 150px;
  }

  :global(.advice-category-edit-dialog-host) {
    width: min(42rem, calc(100vw - 2rem));
    overflow: hidden;
    border-radius: 24px;
  }

  :global(.advice-category-edit-dialog-mask) {
    background: var(--black-alpha-40);
  }

  .advice-category-edit-dialog {
    display: grid;
    gap: 22px;
    padding: 24px;
    border-radius: 24px;
    background: var(--BgWhite);
  }

  .advice-category-edit-dialog__heading {
    align-items: flex-start;

    h2 {
      font-size: 20px;
    }

    p {
      margin-top: 4px;
      color: var(--title-header-color);
      font-size: 14px;
      line-height: 1.5;
    }
  }

  .advice-category-edit-dialog__actions {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(130px, 1fr);
    gap: 12px;

    button:last-child {
      border-color: var(--gray-200);
      background: var(--gray-100);
      color: var(--standard-black);
    }
  }

  @media (max-width: 700px) {
    .advice-category-page__form-controls,
    .advice-category-edit-dialog__actions {
      grid-template-columns: 1fr;
    }

    .advice-category-page__form,
    .advice-category-edit-dialog {
      padding: 16px;
    }
  }
</style>

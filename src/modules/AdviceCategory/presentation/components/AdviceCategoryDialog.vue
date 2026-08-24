<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue';
  import DeletedAccountsIcon from '@/assets/images/DeletedReson.png';
  import IndexDelete from '@/shared/icons/DocaumentType/IndexDelete.vue';
  import EditeIcon from '@/shared/icons/DocaumentType/EditeIcon.vue';
  import IndexAddIcon from '@/shared/icons/IndexAddIcon.vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import AddAdviceCategoryParams from '../../core/params/add.advice.category.params';
  import AdviceCategoryTranslationParams from '../../core/params/advice.category.translation.params';
  import DeleteAdviceCategoryParams from '../../core/params/delete.advice.category.params';
  import EditAdviceCategoryParams from '../../core/params/edit.advice.category.params';
  import IndexAdviceCategoryParams from '../../core/params/index.advice.category.params';
  import ShowAdviceCategoryParams from '../../core/params/show.advice.category.params';
  import AdviceCategoryController from '@/modules/AdviceCategory/presentation/controllers/advice.category.controller';

  const visible = ref(false);
  const saving = ref(false);
  const editId = ref<number | null>(null);
  const title = ref<Record<string, string>>({});
  const controller = AdviceCategoryController.getInstance();
  const categories = computed(() => controller.listData.value ?? []);
  const isEdit = computed(() => editId.value !== null);

  const resetForm = () => {
    editId.value = null;
    title.value = {};
  };

  const fetchCategories = () => controller.fetchList(new IndexAdviceCategoryParams());

  const openDialog = async () => {
    visible.value = true;
    resetForm();
    await fetchCategories();
  };

  const closeDialog = () => {
    visible.value = false;
    resetForm();
  };

  const saveCategory = async () => {
    saving.value = true;
    try {
      const translations = new AdviceCategoryTranslationParams({ title: title.value });
      if (editId.value !== null) {
        await controller.update(
          new EditAdviceCategoryParams({
            adviceCategoryId: editId.value,
            translations,
          }),
        );
      } else {
        await controller.create(new AddAdviceCategoryParams({ translations }));
      }
      resetForm();
      await fetchCategories();
    } finally {
      saving.value = false;
    }
  };

  const editCategory = async (id: number) => {
    const result = await controller.fetchOne(
      new ShowAdviceCategoryParams({ adviceCategoryId: id }),
    );
    editId.value = id;
    title.value = { ...(result?.data?.translations ?? {}) };
  };

  const deleteCategory = async (id: number) => {
    await controller.delete(new DeleteAdviceCategoryParams({ adviceCategoryId: id }));
    if (editId.value === id) resetForm();
    await fetchCategories();
  };
</script>

<template>
  <button type="button" class="btn btn-primary" @click="openDialog">
    <IndexAddIcon />
    <span>{{ $t('advice_categories') }}</span>
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    :pt="{
      root: 'advice-category-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
    :style="{ width: '35rem' }"
  >
    <template #header>
      <div class="header-container">
        <img :src="DeletedAccountsIcon" alt="" width="50" />
        <div class="header-text">
          <h4>{{ $t('manage_advice_categories') }}</h4>
          <p>{{ $t('manage_advice_categories_description') }}</p>
        </div>
      </div>
    </template>

    <div class="category-content">
      <div v-for="item in categories" :key="item.id" class="category-row">
        <div class="item-title">
          <span class="item-small-title">{{ $t('advice_category') }}</span>
          <span class="item-main-title" :title="item.title">{{ item.title }}</span>
        </div>
        <div class="item-actions">
          <button
            type="button"
            class="icon-button edit-category"
            :aria-label="$t('edit_advice_category')"
            @click="editCategory(item.id)"
          >
            <EditeIcon />
          </button>
          <DeleteDialog
            :title="$t('advice_category_confirm_delete')"
            :message="$t('delete_advice_category_message')"
            :hasbtn="true"
            @delete="deleteCategory(item.id)"
          >
            <template #btn><IndexDelete /></template>
          </DeleteDialog>
        </div>
      </div>

      <p v-if="categories.length === 0" class="empty-message">
        {{ $t('no_advice_categories_found') }}
      </p>

      <div class="input-wrapper">
        <MultiLangInput
          field-key="title"
          :label="$t('title')"
          :languages="['en', 'ar']"
          :model-value="title"
          type="title"
          @update:model-value="title = $event"
        />
      </div>

      <div class="btns">
        <button
          type="button"
          class="btn btn-primary save-category"
          :disabled="saving"
          @click="saveCategory"
        >
          {{ $t(isEdit ? 'update_advice_category' : 'save_advice_category') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="closeDialog">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
  .header-container,
  .category-row,
  .item-actions,
  .btns {
    display: flex;
    align-items: center;
  }

  .header-container {
    gap: var(--xs-size);
  }

  .header-text p {
    color: var(--title-header-color);
  }

  .category-content {
    display: grid;
    gap: var(--xs-size);
  }

  .category-row {
    justify-content: space-between;
    gap: var(--xs-size);
    padding: var(--xl-size-base);
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  .item-title {
    display: grid;
    min-width: 0;
  }

  .item-small-title,
  .empty-message {
    color: var(--title-header-color);
  }

  .item-main-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-actions {
    flex: 0 0 auto;
    gap: var(--xs-size);
  }

  .icon-button {
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
  }

  .input-wrapper {
    margin-top: var(--xs-size);
  }

  .btns {
    justify-content: flex-end;
    gap: var(--xs-size);
  }
</style>

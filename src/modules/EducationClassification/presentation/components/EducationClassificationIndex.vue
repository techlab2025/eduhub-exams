<script setup lang="ts">
  import { onMounted, ref, computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import { useRoute, useRouter } from 'vue-router';
  // import { debounce } from '@/base/Presentation/Utils/debouced';
  // import { useFormsStore } from '@/stores/formsStore';
  import EducationClassificationController from '../controllers/educationClassification.controller';
  import IndexEducationClassificationParams from '../../core/params/index.educationClassification.params';
  import type EducationClassificationModel from '../../core/models/education.classification.model';
  // import DeleteEducationClassificationParams from '../../core/params/educationClassificationParams';
  import AddIcon from '@/shared/icons/AddIcon.vue';
  // import EducationClassificationForm from './EducationClassificationForm.vue';
  import EducationClassificationAdd from './EducationClassificationAdd.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import EditIcon from '@/shared/icons/DropListIcons/EditIcon.vue';
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  // import RenameClassificationDialog from '../../subComponent/RenameClassificationDialog.vue';
  import deleteEducationClassificationParams from '../../core/params/delete.educationClassification.params';
  import RenameEducatuinClassificationDialog from '../../subComponent/RenameEducatuinClassificationDialog.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  import NoItemContainer from '@/shared/HelpersComponents/NoItemContainer.vue';
  import ToggleStatusEducationClassificationParams from '../../core/params/toggle.educationClassification.status.params.ts';
  // Controller instance
  import ToggleSwitch from 'primevue/toggleswitch';

  const controller = EducationClassificationController.getInstance();
  const { t } = useI18n();
  const state = computed(() => controller.listState.value);
  const router = useRouter();
  const route = useRoute();
  const statusById = ref<Record<number, boolean>>({});

  watch(
    () => state.value.data,
    (items) => {
      if (!items) return;

      statusById.value = Object.fromEntries(items.map((item) => [item.id, item.status]));
    },
    { immediate: true },
  );

  // Table headers
  const headers = computed<TableHeader[]>(() => [
    { key: 'title', label: t('education type'), width: '40%' },
    { key: 'added_date', label: t('Added date'), width: '40%' },
    { key: 'status', label: t('status'), width: '30%' },
  ]);

  // Pagination state
  const perPage = ref(10);
  const word = ref('');

  const fetchEducationClassifications = async (
    page: number = 1,
    word: string = '',
    order: number = 1,
  ) => {
    await controller.fetchList(
      new IndexEducationClassificationParams({
        word: word,
        pageNumber: page,
        perPage: perPage.value,
        withPage: 1,
        date: '',
        order: order,
      }),
    );
  };

  const onPageChange = (page: number) => {
    fetchEducationClassifications(page);
    router.push({
      query: {
        ...route.query,
        page: String(page),
        word: word.value,
      },
    });
  };

  const onPerPageChange = (count: number) => {
    perPage.value = count;
    fetchEducationClassifications(1);
  };

  // Fetch emails on component mount
  onMounted(async () => {
    if (route.query.word) {
      word.value = String(route.query.word);
    }

    await fetchEducationClassifications(
      route.query.page ? Number(route.query.page) : 1,
      word.value,
      1,
    );
  });

  const deleteEducationClassification = async (id: number) => {
    await controller.delete(
      new deleteEducationClassificationParams({
        id: id,
      }),
    );
    await fetchEducationClassifications();
  };

  const SelectedRow = ref<EducationClassificationModel[]>([]);
  const setSelectef = (items: EducationClassificationModel[]) => {
    SelectedRow.value = items;
  };

  const ShoweEditDialog = ref<boolean>(false);
  const selectedItemId = ref<number>(0);
  const actionList = (id: number, deleteEducationClassification: (id: number) => void) => [
    {
      text: t('rename'),
      icon: EditIcon,
      action: () => {
        selectedItemId.value = id;
        ShoweEditDialog.value = true;
      },
    },
    {
      text: t('delete'),
      icon: DeletIcon,
      action: () => deleteEducationClassification(id),
    },
  ];
  const DeleteItems = async () => {
    SelectedRow.value.forEach((item) => {
      deleteEducationClassification(item.id);
    });
  };

  const ToggleStatus = async (id: number) => {
    await controller.toggleStatus(new ToggleStatusEducationClassificationParams({ id }));
    await fetchEducationClassifications(
      route.query.page ? Number(route.query.page) : 1,
      word.value,
      1,
    );
  };

  const getStatus = (item: EducationClassificationModel) => {
    return statusById.value[item.id] ?? item.status;
  };

  const toggleItemStatus = async (item: EducationClassificationModel, status: boolean) => {
    statusById.value[item.id] = status;
    await ToggleStatus(item.id);
  };
</script>

<template>
  <div class="education-calssification-page">
    <div class="index-header">
      <EducationClassificationAdd />
    </div>

    <!-- ═══ Table ═══ -->
    <DataStatusBuilder
      :controller="state"
      :on-retry="async () => await fetchEducationClassifications()"
    >
      <template #success="{ data }">
        <div class="table-frame">
          <AppTable
            :headers="headers"
            :items="data as EducationClassificationModel[]"
            selectable
            show-index
            hoverable
            striped
            @selection-change="setSelectef"
          >
            <template #cell-title="{ item }">
              {{ item.title }}
            </template>

            <template #cell-added_date="{ item }">
              {{ item.created_at }}
            </template>
            <template #cell-status="{ item }">
              <ToggleSwitch
                :model-value="getStatus(item)"
                :aria-label="`${$t('active')}: ${item.title}`"
                @update:model-value="toggleItemStatus(item, $event)"
              />
            </template>

            <template #actions="{ item }">
              <div class="row-actions">
                <router-link
                  :to="`/education-classifications-configuration/${item.id}`"
                  class="configuration-btn"
                >
                  <AddIcon />
                  {{ $t('add_configuration') }}
                </router-link>
                <router-link
                  :to="`/education-classifications-tree/${item.id}`"
                  class="configuration-btn tree-btn"
                  :class="!item.has_configuration ? `disabled` : ``"
                >
                  <AddIcon />
                  {{ $t('add_tree') }}
                </router-link>
                <DropList
                  :action-list="actionList(item.id, deleteEducationClassification)"
                  :delete-dialog-title="
                    $t('are_you_sure_you_want_to_remove_this_education_classification')
                  "
                  :delete-dialog-message="
                    $t(
                      'Deleting_this_classification_will_remove_all_related_data_including_any_configurations_and_tree_structures_This_action_is_irreversible_and_the_classification_must_be_created_again_if_needed',
                    )
                  "
                />
              </div>
            </template>
          </AppTable>
          <RenameEducatuinClassificationDialog
            v-model:visable="ShoweEditDialog"
            :item-id="selectedItemId"
            @update:name="fetchEducationClassifications(1, word, 1)"
          />
        </div>

        <div v-if="SelectedRow.length > 0" class="items-deleted">
          <div class="num-type">
            <h6>{{ SelectedRow.length }} education type</h6>
          </div>
          <div class="num-deleted" @click="DeleteItems">
            <h6>delete {{ SelectedRow.length }} item</h6>
          </div>
        </div>

        <Pagination
          :pagination="controller.pagination.value"
          @change-page="onPageChange"
          @count-per-page="onPerPageChange"
        />
      </template>

      <template #empty>
        <!-- <div class="empty-state">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <h3>{{ $t('no_education_classifications_yet') }}</h3>
          <p>{{ $t('add_first_education_classification') }}</p>
        </div> -->
        <NoItemContainer
          :title="$t('no_education_classifications')"
          :description="$t('add_first_education_classification')"
        />
      </template>
      <template #loader>
        <TableSkelaton
          :rows="5"
          :columns="headers.length"
          :has-actions="true"
          :show-index="true"
          :selectable="true"
        >
        </TableSkelaton>
      </template>
    </DataStatusBuilder>
  </div>
</template>

<style scoped lang="scss">
  :deep(.td-data::before) {
    display: none;
    // pointer-events: none;
  }

  .p-toggleswitch-input {
    width: 100% !important;
    height: 100% !important;
  }

  .status-toggle {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 42px;
    height: 24px;
    padding: 3px;
    border: 0;
    border-radius: var(--radius-full);
    background-color: var(--gray-300);
    cursor: pointer;
    transition: background-color var(--transition-fast);

    &--active {
      justify-content: flex-end;
      background-color: var(--PrimaryColor);
    }

    &:focus-visible {
      outline: 2px solid var(--PrimaryColor);
      outline-offset: 2px;
    }

    &__thumb {
      width: 18px;
      height: 18px;
      border-radius: var(--radius-full);
      background-color: var(--BgWhite);
      box-shadow: var(--shadow-sm);
    }
  }
</style>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import { useRoute, useRouter } from 'vue-router';
  import SubjectController from '../controllers/subject.controller';
  import IndexSubjectParams from '../../core/params/index.subject.params';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import { useI18n } from 'vue-i18n';
  import DeleteSubjectParams from '../../core/params/delete.subject.params';
  import ShowIcon from '@/shared/icons/ShowIcon.vue';
  import flattenBranchTree from '@/modules/document/core/TreeSelectHelper';
  import type StageModel from '@/modules/Stages/core/models/stage.model';
  import PricingIcon from '@/shared/icons/PricingIcon.vue';
  import SkillsDialog from '@/modules/EducationClassification/subComponent/EducationTree/SkillsDialog.vue';
  import RenameSubjectDialog from '@/modules/EducationClassification/subComponent/RenameSubjectDialog.vue';
  import EditIcon from '@/shared/icons/DropListIcons/EditIcon.vue';

  const subjectcontroller = SubjectController.getInstance();
  const state = computed(() => subjectcontroller.listState.value);
  const route = useRoute();

  const headers: TableHeader[] = [{ key: 'title', label: 'name', width: '90%', sortable: true }];

  const perPage = ref(10);
  const word = ref('');
  const TableTitle = ref<TitleInterface<number>[]>([]);

  const AllBranchesOptions = ref<TitleInterface<number>[]>([]);

  const fetchBranches = async (page: number = 1, word: string = '') => {
    const result = await subjectcontroller.fetchList(
      new IndexSubjectParams(
        word,
        route.query.page ? Number(route.query.page) : page,
        perPage.value,
        0,
      ),
    );
    AllBranchesOptions.value = flattenBranchTree(result.data as StageModel[]).map((item) => {
      return new TitleInterface<number>({
        id: item.id,
        title: item.title,
      });
    });
  };

  onMounted(async () => {
    if (route.query.word) {
      word.value = String(route.query.word);
    }
    await FetchSubjects();
    await fetchBranches(route.query.page ? Number(route.query.page) : 1, word.value);
  });

  const formRoute = computed(() => '/subjects/add');

  const SelectedRow = ref<TitleInterface<number>[]>([]);
  const setSelectef = (items: TitleInterface<number>[]) => {
    SelectedRow.value = items;
  };
  const deleteSubject = async (id: number) => {
    await subjectcontroller.delete(new DeleteSubjectParams({ id }));

    await FetchSubjects();
  };
  const ShoweEditDialog = ref(false);
  const selectedSkillsSubject = ref<TitleInterface<number>>();
  const skillsDialogVisible = computed({
    get: () => selectedSkillsSubject.value !== undefined,
    set: (visible: boolean) => {
      if (!visible) selectedSkillsSubject.value = undefined;
    },
  });

  const { t } = useI18n();
  const router = useRouter();
  const actionList = (item: TitleInterface<number>, deleteSubject: (item: number) => void) => [
    {
      text: t('delete'),
      icon: EditIcon,
      action: () => {
        deleteSubject(item.id);
      },
    },
    {
      text: t('show_question'),
      icon: ShowIcon,
      action: () => {
        router.push(`/Questions?subjectId=${item.id}`);
      },
    },
    {
      text: t('rename'),
      icon: EditIcon,
      action: () => {
        ShoweEditDialog.value = true;
        SelctedSubject.value = item.id;
      },
    },
    {
      text: t('skills'),
      icon: PricingIcon,
      action: () => {
        selectedSkillsSubject.value = item;
      },
    },
  ];
  const FetchSubjects = async (id?: number) => {
    const result = await subjectcontroller.indexSubjects(
      new IndexSubjectParams(
        word.value,
        route.query.page ? Number(route.query.page) : 1,
        perPage.value,
        1,
        id,
      ),
    );

    TableTitle.value = flattenBranchTree(result!.data as StageModel[]).map((item) => {
      return new TitleInterface<number>({
        id: item.id,
        title: item.title,
      });
    });
  };
  const selectedFilter = ref<TitleInterface<number>>();
  const updateFilter = (filter: TitleInterface<number>) => {
    selectedFilter.value = filter;
    FetchSubjects(filter.id);
  };
  const SelctedSubject = ref<number>();
</script>

<template>
  <div class="subject-page">
    <div class="index-header">
      <div class="toolbar">
        <UpdatedCustomInputSelect
          id="education-filter"
          v-model="selectedFilter"
          :static-options="AllBranchesOptions"
          :placeholder="`select subject `"
          :reload="false"
          @update:model-value="updateFilter"
          @reload="FetchSubjects"
        />
      </div>
    </div>

    <DataStatusBuilder :controller="state">
      <template #success>
        <div class="table-frame">
          <AppTable
            :headers="headers"
            :items="TableTitle"
            selectable
            show-index
            hoverable
            striped
            @selection-change="setSelectef"
          >
            <template #cell-title="{ item }">
              <span class="subject-title-cell">{{ item.title }}</span>
            </template>

            <template #actions="{ item }">
              <div class="row-actions">
                <DropList
                  :action-list="actionList(item, deleteSubject)"
                  :delete-dialog-title="$t('are_you_sure_you_want_to_remove_this_subject')"
                  :delete-dialog-message="
                    $t(
                      'Deleting_this_subject_will_remove_all_related_data_including_any_configurations_and_tree_structures_This_action_is_irreversible_and_the_subject_must_be_created_again_if_needed',
                    )
                  "
                />
              </div>
            </template>
          </AppTable>
        </div>
      </template>
      <template #empty>
        <div class="empty-state">
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
          <h3>{{ $t('no_subjects') }}</h3>
          <p>{{ $t('add_the_first_subject_to_get_started') }}</p>
          <router-link :to="formRoute" class="btn-add empty-cta">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>{{ $t('add_email') }}</span>
          </router-link>
        </div>
      </template>
    </DataStatusBuilder>
  </div>
  <SkillsDialog
    v-if="selectedSkillsSubject"
    v-model:visible="skillsDialogVisible"
    :level="1"
    :branch-name="selectedSkillsSubject.title!"
    :branch-id="selectedSkillsSubject.id"
  />
  <RenameSubjectDialog
    v-model:visable="ShoweEditDialog"
    :item-id="SelctedSubject!"
    :stage-id="selectedFilter?.id! || null"
    @update:name="FetchSubjects"
  />
</template>
<style scoped>
  .toolbar {
    width: 50%;
  }
</style>

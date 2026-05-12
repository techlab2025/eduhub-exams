<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue';
  import Dialog from 'primevue/dialog';
  import AddEducationSubjectSkillsParams from '../../core/params/EducationSkills/add.education.subject.skills.params';
  import EducationSkillsController from '../../presentation/controllers/EducationSkills/education.skills.controller';
  import SubjectSkllsIcon from '@/shared/icons/SubjectSkllsIcon.vue';
  import SkillParams from '../../core/params/EducationSkills/skill.params';
  import SkillsController from '@/modules/Skills/presentation/controllers/skills.controller';
  import IndexSkillsParams from '@/modules/Skills/core/params/index.skills.params';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';

  const props = defineProps<{
    visible: boolean;
    level: number;
    branchName: string;
    branchId?: number;
  }>();
  const controller = SkillsController.getInstance();
  const indexSkills = new IndexSkillsParams('', 1, 10, 1);
  const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void;
  }>();

  const percentageValue = ref<string>('');
  const timeValue = ref<number>(10);
  const inputRef = ref<HTMLInputElement | null>(null);

  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
  });

  watch(dialogVisible, async (val) => {
    if (val) {
      percentageValue.value = '';
      timeValue.value = 0;
      await nextTick();
      inputRef.value?.focus();
    }
  });

  const isInputEmpty = computed(() => !percentageValue.value || !selectedSkill.value);
  const selectedSkill = ref<TitleInterface<number>>();

  const updateSelectedSkill = (skill: TitleInterface<number>) => {
    selectedSkill.value = skill;
  };
  // async function handleConfirm() {
  //   const params = new AddEducationSubjectSkillsParams({
  //     id: props.branchId!,
  //     skills: [
  //       new SkillParams({
  //         skillId: selectedSkill.value?.id!,
  //         percentage: percentageValue.value,
  //       }),
  //     ],
  //   });
  //   const controller = EducationSkillsController.getInstance();
  //   await controller.create(params);
  //   dialogVisible.value = false;
  // }
  async function handleConfirm() {
    if (!props.branchId || !selectedSkill.value?.id) return;

    const params = new AddEducationSubjectSkillsParams({
      id: props.branchId,
      skills: [
        new SkillParams({
          skillId: selectedSkill.value.id,
          percentage: percentageValue.value,
        }),
      ],
    });

    const controller = EducationSkillsController.getInstance();

    await controller.create(params);

    dialogVisible.value = false;
  }
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :style="{ width: '30rem' }"
    :pt="{
      root: 'pricing-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <template #header>
      <div class="dialog-icon">
        <SubjectSkllsIcon />
      </div>
      <div class="dialog-header-text">
        <h3 class="dialog-title">{{ $t('skills') }}</h3>
        <p class="dialog-subtitle">
          {{ $t('Define and manage skills within the system.') }}
        </p>
      </div>
    </template>
    <div class="dialog-inputs">
      <div class="field-group select-group">
        <UpdatedCustomInputSelect
          id="skills"
          :label="`skills`"
          :params="indexSkills"
          :controller="controller"
          :model-value="selectedSkill"
          :placeholder="$t('skills')"
          @update:model-value="updateSelectedSkill"
        />
      </div>

      <div class="field-group">
        <label class="field-label" :for="`percentage-input-${level}`">
          {{ $t('percentage (%)') }}
        </label>
        <input
          :id="`percentage-input-${level}`"
          ref="inputRef"
          v-model="percentageValue"
          type="text"
          :placeholder="$t('enter_percentage')"
          class="field-input"
          @keydown.esc="dialogVisible = false"
          @keydown.enter="!isInputEmpty && handleConfirm()"
        />
      </div>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-primary" :disabled="isInputEmpty" @click="handleConfirm">
        {{ $t('add') }}
      </button>
      <button class="btn btn-secondary" @click="dialogVisible = false">{{ $t('cancel') }}</button>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
  .input-label {
    color: black;
  }

  .field-input {
    background-color: var(--bg-main);
    border-radius: 30px;
    margin-bottom: 1rem;

    ::placeholder {
      color: var(--bread-crumb-color-span);
    }
  }

  .dialog-inputs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 5px;

    .field-group {
      &:first-child {
        width: 60%;
      }

      &:last-child {
        width: 40%;
      }
    }
  }

  .field-input {
    margin: 0 !important;
  }
</style>

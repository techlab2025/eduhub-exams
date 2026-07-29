<script lang="ts" setup>
  import MultiSelect from 'primevue/multiselect';

  import Select from 'primevue/select';

  import { computed, ref, watch, toRefs } from 'vue';

  import type Params from '@/base/Core/Params/params';

  import ValidationService from '@/base/Presentation/Utils/validationService';

  import PlusIcon from '@/shared/icons/PlusIcon.vue';

  import type TitleInterface from '@/base/Data/Models/titleInterface';

  import type BaseController from '@/base/Presentation/Controller/baseController';
  import Dialog from 'primevue/dialog';
  import wordSlice from '@/base/Presentation/Utils/word_slice';
  import ReloadIcon from '../icons/CustomSelect/ReloadIcon.vue';

  export type ComponentType = 'select' | 'multiselect';

  interface Props {
    label?: string;

    options?: TitleInterface<string | number>[];

    staticOptions?: TitleInterface<string | number>[] | null;

    modelValue:
      | TitleInterface<string | number>
      | TitleInterface<string | number>[]
      | null
      | undefined;

    placeholder: string;

    controller?: BaseController<any>;

    params?: Params;

    type?: ComponentType | number;

    required?: boolean;

    id?: string;

    autoFill?: boolean;

    reload?: boolean;

    optional?: boolean;

    hascontent?: boolean;

    hasHeader?: boolean;
    isDialog?: boolean;
    dialogVisible?: boolean;
    onclick?: () => void;
  }

  const emit = defineEmits([
    'update:modelValue',
    'update:slot',
    'close',
    'update:dialogVisible',
    'reload',
  ]);

  const props = withDefaults(defineProps<Props>(), {
    type: 1,

    required: false,

    autoFill: false,

    id: 'custom-select-input',

    reload: true,

    staticOptions: null,

    optional: false,
  });

  const {
    modelValue,

    type,

    controller,

    params,

    staticOptions,

    autoFill,

    id,

    required,

    reload: enableReload,
  } = toRefs(props);

  // Reactive state

  const loading = ref(false);

  const message = ref('No Data Found');

  const localValue = ref(props.modelValue);

  const dynamicOptions = ref<TitleInterface<string | number>[]>([]);

  // Computed properties

  const isMultiselect = computed(() => Number(type.value) === 2);

  const mergedOptions = computed(() => staticOptions?.value ?? dynamicOptions.value);

  const multiselectProps = computed(() =>
    isMultiselect.value ? { display: 'chip', maxSelectedLabels: 6 } : {},
  );

  const selectedTitleMaxLength = 50;

  // Value handling

  const normalizedValue = computed({
    get: () => localValue.value,

    set: (newValue) => {
      localValue.value = isMultiselect.value ? ensureArray(newValue) : ensureSingle(newValue);

      emitUpdate();
    },
  });

  // Watchers

  watch(modelValue, syncLocalValue);

  watch([params, controller], handleOptionUpdates, { immediate: true });

  watch(mergedOptions, () => {
    if (!modelValue.value || Array.isArray(modelValue.value)) {
      syncLocalValue(modelValue.value);
      return;
    }
    const id = (modelValue.value as TitleInterface<string | number>).id;
    const match = mergedOptions.value.find((opt) => opt.id === id);
    if (match && match !== localValue.value) {
      localValue.value = match;
    }
  });

  // Initialization

  syncLocalValue(props.modelValue);

  // Methods

  function ensureArray(value: unknown): TitleInterface<string | number>[] {
    return Array.isArray(value) ? (value as TitleInterface<string | number>[]) : [];
  }

  function ensureSingle(value: unknown): TitleInterface<number | string> | null {
    if (value !== null && typeof value === 'object' && 'id' in value) {
      return value as TitleInterface<number | string>;
    }
    return null;
  }

  function getSelectedTitle(value: unknown): string {
    if (!value || typeof value !== 'object' || !('title' in value)) return '';

    const title = value.title;
    if (title === null || title === undefined || String(title).trim() === '') return '';

    return wordSlice(String(title), selectedTitleMaxLength);
  }

  function getFullSelectedTitle(value: unknown): string {
    if (!value || typeof value !== 'object' || !('title' in value)) return '';

    return value.title === null || value.title === undefined ? '' : String(value.title);
  }

  function syncLocalValue(newValue: typeof props.modelValue): void {
    if (newValue === localValue.value) return;

    // Handle multiselect (array)

    if (Array.isArray(newValue)) {
      // if (mergedOptions.value.length > 0) {
      localValue.value = newValue.map((item) => {
        const match = mergedOptions.value.find((opt) => opt.id === item.id);
        return match ?? item;
      });
      // } else {
      //   localValue.value = newValue;
      // }
      return;
    }

    // Handle single select
    if (newValue && mergedOptions.value.length > 0) {
      const id = (newValue as TitleInterface<string | number>).id;
      const match = mergedOptions.value.find((opt) => opt.id === id);
      localValue.value = match ?? newValue;
    } else {
      localValue.value = newValue;
    }
  }

  function emitUpdate(): void {
    // console.log(localValue.value, 'localValue.value');

    emit('update:modelValue', localValue.value);

    ValidationService.clearError(id.value);
  }

  async function handleOptionUpdates(): Promise<void> {
    if (params?.value && controller?.value) {
      await fetchOptions();
    } else {
      dynamicOptions.value = staticOptions?.value ?? [];
    }
  }

  async function fetchOptions(): Promise<void> {
    if (!controller?.value || !params?.value) return;

    try {
      loading.value = true;

      message.value = 'Loading Data';

      // Before: const response = await controller.value.fetch(params.value);

      const response = await controller.value.fetchAsOptions(params.value);

      dynamicOptions.value = response;

      updateControllerState();

      handleAutoFill(response);
    } catch (error) {
      handleFetchError(error);
    } finally {
      loading.value = false;
    }
  }

  function updateControllerState(): void {
    if (!controller?.value) return;

    if (controller.value.isListFailed()) {
      message.value = 'An Error Occurred';
    } else if (controller.value.isListSuccess()) {
      message.value = 'No Data Found';
    }
  }

  function handleAutoFill(options: TitleInterface<number | string>[]): void {
    if (autoFill?.value && options.length === 1) {
      normalizedValue.value = isMultiselect.value ? [options[0]!] : options[0]!;
    }
  }

  function handleFetchError(error: unknown): void {
    console.error('Fetch error:', error);

    message.value = 'Failed to load data';

    dynamicOptions.value = [];
  }

  async function reloadData(): Promise<void> {
    if (loading.value) return;

    await fetchOptions();

    normalizedValue.value = isMultiselect.value ? [] : null;
    emit('reload');
  }
  const DialogVisable = computed({
    get() {
      return props.dialogVisible;
    },
    set(val) {
      emit('update:dialogVisible', val);
      if (!val) {
        reloadData();
      }
    },
  });
  // const closeDailog = () => {
  //   emit('close', false);
  // };
</script>

<template>
  <div class="input-label flex justify-between w-full">
    <slot v-if="!hasHeader">
      <div class="flex items-center">
        <slot name="reloadHeader"></slot>

        <span
          v-if="enableReload"
          class="reload-icon cursor-pointer flex items-center gap-sm me-2 w-full"
          @click="reloadData"
        >
          <span v-if="optional" class="optional-text">({{ $t('optional') }})</span>

          <ReloadIcon />
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div v-if="onclick" class="add-dialog" @click="onclick">
          <PlusIcon />
        </div>

        <label :class="{ required: required }" class="input-label">
          <span v-if="required" class="text-red-500 color-red">*</span>

          {{ $t(label ?? '') }}
        </label>

        <slot name="LabelHeader"></slot>
      </div>
    </slot>

    <slot v-else name="Header"></slot>
  </div>

  <slot v-if="!hascontent">
    <Select
      v-if="!isMultiselect"
      v-model="normalizedValue"
      :options="mergedOptions"
      :placeholder="placeholder"
      class="input-select w-full"
      option-label="title"
      filter
      :loading="loading"
      :empty-message="message"
      :pt="{
        overlay: { class: 'custom-select-overlay' },
      }"
    >
      <template #value="{ value }">
        <span
          class="selected-value"
          :class="{ 'selected-value--placeholder': !getSelectedTitle(value) }"
          :title="getFullSelectedTitle(value)"
        >
          {{ getSelectedTitle(value) || placeholder }}
        </span>
      </template>
    </Select>

    <MultiSelect
      v-else
      v-model="normalizedValue"
      :options="mergedOptions"
      :placeholder="placeholder"
      class="input-select w-full"
      option-label="title"
      v-bind="multiselectProps"
      filter
      :loading="loading"
      :empty-message="message"
      :pt="{
        overlay: { class: 'custom-select-overlay' },
      }"
    />

    <input :id="id" type="text" class="hidden w-full" :value="normalizedValue" />
  </slot>

  <slot v-else name="content"> </slot>
  <div v-if="isDialog">
    <Dialog
      v-model:visible="DialogVisable"
      :pt="{
        root: 'custom-select-dialog',
      }"
      modal
      :dismissable-mask="true"
      :style="{ width: '60rem' }"
    >
      <slot name="Dialog"></slot>
    </Dialog>
  </div>
  <slot v-else name="CreatedDialog"></slot>
</template>

<style scoped lang="scss">
  .dialog {
    background-color: white !important;
  }

  .flex {
    display: flex;
    gap: 10px;
  }

  .reload-icon {
    z-index: 9999;
    cursor: pointer;
  }

  .add-dialog {
    width: 20px;
    height: 20px;
    margin-right: 6px;
    cursor: pointer;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .input-select {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    background-color: transparent;
    border-radius: 50px;

    :deep(.p-select-label),
    :deep(.p-multiselect-label-container),
    :deep(.p-multiselect-label) {
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
    }

    :deep(.p-select-label) {
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :deep(.p-multiselect-chip),
    :deep(.p-chip-label) {
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .selected-value {
      display: block;
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
    }

    &:focus {
      border: 1px solid #d9dbe9 !important;
    }
  }
</style>

<style lang="scss">
  .custom-select-overlay {
    max-width: min(90vw, 500px) !important;

    .p-select-option-label,
    .p-multiselect-option-label {
      white-space: normal;
      overflow-wrap: anywhere;
      line-height: 1.4;
    }
  }
  .color-red{
    color:red !important;
  }
</style>

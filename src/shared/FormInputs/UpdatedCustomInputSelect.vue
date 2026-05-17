<script lang="ts" setup>
  import MultiSelect from 'primevue/multiselect';
  import Select from 'primevue/select';
  import { computed, ref, watch, toRefs } from 'vue';
  import IconBackStage from '@/shared/icons/IconBackStage.vue';
  import Dialog from 'primevue/dialog';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  // import type { SelectControllerInterface } from '@/base/Presentation/Controller/selectControllerInterface';
  import type Params from '@/base/Core/Params/params';
  import validationService from '@/base/Presentation/Utils/validationService';
  import type BaseController from '@/base/Presentation/Controller/baseController';

  export type ComponentType = 'select' | 'multiselect';

  interface Props {
    label?: string;
    options?: TitleInterface<number>[];
    staticOptions?: TitleInterface<number>[] | null;
    modelValue: TitleInterface<number> | TitleInterface<number>[] | null;
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

  const emit = defineEmits(['update:modelValue', 'update:slot', 'close']);
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
  const dynamicOptions = ref<TitleInterface<number>[] | undefined>([]);

  // Computed properties
  const isMultiselect = computed(() => Number(type.value) === 2);
  const componentType = computed(() => (isMultiselect.value ? MultiSelect : Select));
  const mergedOptions = computed(() => staticOptions?.value ?? dynamicOptions.value);
  const multiselectProps = computed(() =>
    isMultiselect.value ? { display: 'chip', maxSelectedLabels: 6 } : {},
  );

  // Value handling
  const normalizedValue = computed({
    get: () => localValue.value,
    set: (newValue) => {
      localValue.value = isMultiselect.value ? ensureArray(newValue) : ensureSingle(newValue);
      // console.log(localValue.value, 'localValue.value');
      emitUpdate();
    },
  });

  // Watchers
  watch(modelValue, syncLocalValue);
  watch([params, controller], handleOptionUpdates, { immediate: true });

  // Initialization
  syncLocalValue(props.modelValue);

  // Methods
  function ensureArray(value: unknown): TitleInterface<number>[] {
    return Array.isArray(value) ? value : [];
  }

  function ensureSingle(value: unknown): TitleInterface<number> | null {
    // console.log(value , "single");
    if (value instanceof TitleInterface) {
      return value;
    }
    return null;
  }

  function syncLocalValue(newValue: typeof props.modelValue): void {
    if (newValue !== localValue.value) {
      // console.log(newValue);
      localValue.value = newValue;
    }
  }

  function emitUpdate(): void {
    // console.log(localValue.value);
    emit('update:modelValue', localValue.value);
    validationService.clearError(id.value);
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
      const response = await controller.value.fetchList(params.value);
      console.log(response, 'response');
      dynamicOptions.value = response.data?.map((item: any) => {
        return new TitleInterface({
          id: item.id,
          title: item.title,
        });
      });
      updateControllerState();
      handleAutoFill(dynamicOptions.value!);
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

  function handleAutoFill(options: TitleInterface<number>[]): void {
    if (autoFill?.value && options.length === 1) {
      normalizedValue.value = isMultiselect.value
        ? ([options[0]] as unknown as TitleInterface<number>[])
        : (options[0] as unknown as TitleInterface<number>);
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
  }

  const DialogVisable = ref(props.dialogVisible);
  watch(
    () => props.dialogVisible,
    (newVal) => {
      DialogVisable.value = newVal;
      if (!newVal) {
        reloadData();
      }
    },
  );

  const closeDailog = () => {
    // reloadData()
    emit('close', false);
  };
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
          <span class="optional-text" v-if="optional">({{ $t('optional') }})</span>
          <IconBackStage />
        </span>
      </div>

      <div class="flex items-center gap-2">
        <label :class="{ required: required }" class="input-label">
          <span v-if="required" class="text-red-500">*</span>
          {{ $t(label ?? '') }}
        </label>

        <slot name="LabelHeader"></slot>
      </div>
    </slot>
    <slot v-else name="Header"></slot>
  </div>

  <slot v-if="!hascontent">
    <component
      :is="componentType"
      v-model="normalizedValue"
      :options="mergedOptions"
      :placeholder="placeholder"
      class="input-select w-full"
      option-label="title"
      v-bind="multiselectProps"
      filter
      :loading="loading"
      :empty-message="message"
    />
    <input type="text" class="hidden w-full" :value="normalizedValue" :id="id" />
  </slot>
  <slot v-else name="content"> </slot>
  <div v-if="isDialog">
    <Dialog
      @hide="closeDailog"
      v-model:visible="DialogVisable"
      modal
      :dismissable-mask="true"
      :style="{ width: '50rem' }"
    >
      <slot name="Dialog"></slot>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
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
    background-color: transparent;
    border-radius: 24px;

    &:focus {
      border: 1px solid #d9dbe9 !important;
    }
  }
</style>

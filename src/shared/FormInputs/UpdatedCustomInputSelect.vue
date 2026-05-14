<script lang="ts" setup>
  import MultiSelect from 'primevue/multiselect';

  import Select from 'primevue/select';

  import { computed, ref, watch, toRefs } from 'vue';

  import type Params from '@/base/Core/Params/params';

  import ValidationService from '@/base/Presentation/Utils/validationService';

  import IconBackStage from '@/shared/icons/IconBackStage.vue';

  import PlusIcon from '@/shared/icons/PlusIcon.vue';

  import TitleInterface from '@/base/Data/Models/titleInterface';

  import type BaseController from '@/base/Presentation/Controller/baseController';

  export type ComponentType = 'select' | 'multiselect';

interface Props {
  label?: string
  options?: TitleInterface[]
  staticOptions?: TitleInterface[] | null
  modelValue: TitleInterface | TitleInterface[] | null
  placeholder: string
  controller?: SelectControllerInterface<any>
  params?: Params
  type?: ComponentType | number
  required?: boolean
  id?: string
  autoFill?: boolean
  reload?: boolean
  optional?: boolean
  hascontent?: boolean
  hasHeader?: boolean

  // ✅ Dialog props
  isDialog?: boolean
  dialogVisible?: boolean

  onclick?: () => void
}

const emit = defineEmits(['update:modelValue', 'update:slot', 'close'])

const props = withDefaults(defineProps<Props>(), {
  type: 1,
  required: false,
  autoFill: false,
  id: 'custom-select-input',
  reload: true,
  staticOptions: null,
  optional: false,
  isDialog: false,
  dialogVisible: false,
})

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
} = toRefs(props)

// ================= STATE =================
const loading = ref(false)
const message = ref('No Data Found')
const localValue = ref(props.modelValue)
const dynamicOptions = ref<TitleInterface[]>([])

// ================= DIALOG STATE =================
const DialogVisible = ref(props.dialogVisible ?? false)

// sync external → internal
watch(
  () => props.dialogVisible,
  (val) => {
    DialogVisible.value = !!val
  }
)

// ================= COMPUTED =================
const isMultiselect = computed(() => Number(type.value) === 2)
const componentType = computed(() => (isMultiselect.value ? MultiSelect : Select))
const mergedOptions = computed(() => staticOptions?.value ?? dynamicOptions.value)

const normalizedValue = computed({
  get: () => localValue.value,
  set: (newValue) => {
    localValue.value = isMultiselect.value
      ? (Array.isArray(newValue) ? newValue : [])
      : newValue
    emitUpdate()
  },
})

// ================= WATCHERS =================
watch(modelValue, syncLocalValue)
watch([params, controller], handleOptionUpdates, { immediate: true })

syncLocalValue(props.modelValue)

// ================= METHODS =================
function syncLocalValue(newValue: any) {
  localValue.value = newValue
}

function emitUpdate() {
  emit('update:modelValue', localValue.value)
  ValidationService.clearError(id.value)
}

async function handleOptionUpdates() {
  if (params?.value && controller?.value) {
    await fetchOptions()
  } else {
    dynamicOptions.value = staticOptions?.value ?? []
  }
}

async function fetchOptions() {
  if (!controller?.value || !params?.value) return

  try {
    loading.value = true
    message.value = 'Loading...'
    const response = await controller.value.fetch(params.value)
    dynamicOptions.value = response
  } catch (e) {
    message.value = 'Error loading data'
    dynamicOptions.value = []
  } finally {
    loading.value = false
  }
}

async function reloadData() {
  await fetchOptions()
  normalizedValue.value = isMultiselect.value ? [] : null
}

// ================= DIALOG CONTROL =================
function closeDialog() {
  DialogVisible.value = false
  emit('close', false)
}
</script>

<template>
  <!-- HEADER -->
  <div class="input-label flex justify-between w-full">
    <slot v-if="!hasHeader">
      <div class="flex items-center">
        <slot name="reloadHeader"></slot>

        <span
          v-if="enableReload"
          class="cursor-pointer flex items-center gap-2 me-2"
          @click="reloadData"
        >
          <IconBackStage />
        </span>
      </div>

      <label :class="{ required }" class="input-label">
        <span v-if="required" class="text-red-500">*</span>
        {{ $t(label ?? '') }}
      </label>
    </slot>

    <slot v-else name="Header"></slot>
  </div>

  <!-- INPUT -->
  <component
    :is="componentType"
    v-model="normalizedValue"
    :options="mergedOptions"
    :placeholder="placeholder"
    class="input-select w-full"
    option-label="title"
    filter
    :loading="loading"
    :empty-message="message"
  />

  <!-- HIDDEN INPUT -->
  <input type="hidden" :value="normalizedValue" :id="id" />

  <!-- ================= DIALOG ================= -->
  <Dialog
    v-if="isDialog"
    v-model:visible="DialogVisible"
    modal
    :dismissable-mask="true"
    :style="{ width: '50rem' }"
    @hide="closeDialog"
  >
    <slot name="Dialog" />
  </Dialog>
</template>

<style scoped lang="scss">
.input-select {
  width: 100%;
  border-radius: 24px;
}
</style>
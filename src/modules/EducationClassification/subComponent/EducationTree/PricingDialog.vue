<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue';
  import Dialog from 'primevue/dialog';
  import PricingDIalogIcon from '@/shared/icons/PricingDIalogIcon.vue';
  import AddEducationSubjectPricingParams from '../../core/params/EducationPricing/add.education.subject.pricing.params';
  import EducationPricingController from '../../presentation/controllers/EducationPricing/education.pricing.controller';
  import { DurationTypeEnum } from '../../core/constant/duration.type.enum';

  const props = defineProps<{
    visible: boolean;
    level: number;
    branchName: string;
    branchId?: number;
  }>();

  const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void;
    (
      e: 'confirm',
      data: { duration: number; pricing: number; level: number; branchId?: number },
    ): void;
  }>();

  const durationValue = ref<number>(0);
  const pricingValue = ref<number>(0);
  const inputRef = ref<HTMLInputElement | null>(null);

  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
  });

  watch(dialogVisible, async (val) => {
    if (val) {
      durationValue.value = 0;
      pricingValue.value = 0;
      await nextTick();
      inputRef.value?.focus();
    }
  });

  const isInputEmpty = computed(() => {
    return !durationValue.value || !pricingValue.value;
  });

  async function handleConfirm() {
    if (!props.branchId) return;

    await addPricing(props.branchId);
    dialogVisible.value = false;
  }

  const addPricing = async (id: number) => {
    const addEducationSubjectPricingParams = new AddEducationSubjectPricingParams({
      id: id,
      duration: durationValue.value,
      durationType: DurationTypeEnum.MONTH,
      price: pricingValue.value,
    });
    const educationPricingController = EducationPricingController.getInstance();
    await educationPricingController.create(addEducationSubjectPricingParams);
  };
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
        <PricingDIalogIcon />
      </div>
      <div class="dialog-header-text">
        <h3 class="dialog-title">{{ $t('subject pricing') }}</h3>
        <p class="dialog-subtitle">
          {{ $t('Manage how each subject is priced within your system.') }}
        </p>
      </div>
    </template>
    <div class="dialog-inputs">
      <div class="field-group">
        <label class="field-label" :for="`duration-input-${level}`">{{ $t('duration') }}</label>
        <input
          :id="`duration-input-${level}`"
          ref="inputRef"
          v-model="durationValue"
          type="number"
          :placeholder="$t('enter_duration')"
          class="field-input"
          @keydown.esc="dialogVisible = false"
        />
      </div>

      <div class="field-group">
        <label class="field-label" :for="`pricing-input-${level}`">{{ $t('pricing') }}</label>
        <input
          :id="`pricing-input-${level}`"
          ref="inputRef"
          v-model="pricingValue"
          type="number"
          :placeholder="$t('enter_pricing')"
          class="field-input"
          @keydown.esc="dialogVisible = false"
        />
      </div>
    </div>
    <!--  @keydown.enter="handleConfirm" -->
    <!-- @keydown.enter="handleConfirm" -->
    <div class="dialog-footer">
      <button class="btn btn-primary" :disabled="isInputEmpty" @click="handleConfirm">
        {{ $t('add') }}
      </button>
      <button class="btn btn-secondary" @click="dialogVisible = false">{{ $t('cancel') }}</button>
    </div>
  </Dialog>
</template>

<style scoped>
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
</style>

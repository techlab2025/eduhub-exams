<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import FaqsController from '../controllers/faqs.controller';
  import AddFaqsParams from '../../core/params/add.faqs.params';
  import FaqsDetailsParams from '../../core/params/faqs.details.params';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import MultiLangInput from '@/shared/MultiLangInput.vue';

  const emit = defineEmits(['update:data']);

  type FaqItem = {
    question: Record<string, string>;
    answer: Record<string, string>;
  };

  const createEmptyItem = (): FaqItem => ({
    question: {},
    answer: {},
  });

  const data = ref<FaqItem[]>([createEmptyItem()]);

  // ─── Add / Remove ───────────────────────
  const addNewItem = () => {
    data.value.push(createEmptyItem());
    updateData();
  };

  const removeItem = (index: number) => {
    data.value.splice(index, 1);
    updateData();
  };

  // ─── Update ─────────────────────────────
  const updateData = () => {
    emit('update:data', data.value);
  };

  // ─── Init ───────────────────────────────
  onMounted(() => {
    updateData();
  });

  const faqsController = FaqsController.getInstance();
  const SubmitData = () => {
    faqsController.create(
      new AddFaqsParams({
        faqs: data.value.map((el) => {
          return new FaqsDetailsParams({
            question: el.question,
            answer: el.answer,
          });
        }),
      }),
    );
  };

  const ShowFaqs = async () => {
    const result = await faqsController.fetchList();
    if (result instanceof DataSuccess) {
      data.value = result.data;
    }
  };

  onMounted(() => {
    ShowFaqs();
  });

  onUnmounted(() => {
    data.value = [];
  });
</script>

<template>
  <div class="faq-container">
    <!-- Header -->
    <div class="faq-header">
      <h3>FAQs</h3>
      <p>Add questions and answers dynamically</p>
    </div>

    <!-- List -->
    <div class="faq-list">
      <div v-for="(item, index) in data" :key="index" class="faq-card">
        <!-- Card Header -->
        <div class="card-header">
          <span>FAQ #{{ index + 1 }}</span>

          <button v-if="data.length > 1" class="delete-btn" @click="removeItem(index)">✕</button>
        </div>

        <!-- Question -->
        <div class="field">
          <MultiLangInput
            :field-key="`question`"
            :label="`question`"
            :languages="['en', 'ar', 'fr']"
            :model-value="item.question"
            @update:model-value="item.question = $event"
          />
        </div>

        <!-- Answer -->
        <div class="field">
          <MultiLangInput
            :field-key="`answer`"
            :label="`answer`"
            :languages="['en', 'ar', 'fr']"
            :model-value="item.answer"
            @update:model-value="item.answer = $event"
          />
        </div>
      </div>
    </div>

    <!-- Add Button -->
    <div class="btn-container">
      <button class="add-btn" @click="addNewItem">+ Add FAQ</button>
      <button class="add-btn" @click="SubmitData">Save</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .faq-container {
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: 16px;
    padding: 20px;
  }
</style>

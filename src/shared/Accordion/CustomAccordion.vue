<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import type { Component } from "vue";

interface Props {
  items: any[];
  header?: Component | string;
  content?: Component | string;
  multiple?: boolean;
  defaultValue?: string | string[];
  AccordionClass?: string;
  AccordionPanelClass?: string;
  AccordionHeaderClass?: string;
  AccordionContentClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  defaultValue: "0",
});
</script>

<template>
  <div class="custom-accordion">
    <Accordion
      :multiple="multiple"
      :value="defaultValue"
      :class="AccordionClass"
    >
      <AccordionPanel
        v-for="(item, index) in items"
        :key="index"
        :value="index.toString()"
        :class="AccordionPanelClass"
      >
        <AccordionHeader :class="AccordionHeaderClass">
          <slot name="header" :item="item" :index="index">
            <span v-if="typeof header === 'string'" class="header-text">{{
              header
            }}</span>
            <component :is="header" v-else-if="header" :item="item" />
            <span v-else class="header-text">
              {{
                item.header || item.title || item.label || `Panel ${index + 1}`
              }}
            </span>
          </slot>
        </AccordionHeader>
        <AccordionContent :class="AccordionContentClass">
          <slot name="content" :item="item" :index="index">
            <div v-if="typeof content === 'string'" class="content-body">
              {{ content }}
            </div>
            <component :is="content" v-else-if="content" :item="item" />
            <div v-else class="content-body">
              {{ item.content || item.body || item.description || "" }}
            </div>
          </slot>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<style scoped>
.custom-accordion {
  width: 100%;
}

:deep(.p-accordion) {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: none;
}

:deep(.p-accordionpanel) {
  border: 1px solid #e2e8f0;
  border-radius: 12px !important;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent !important;
}

:deep(.p-accordionpanel:hover) {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

:deep(.p-accordionheader) {
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

:deep(.p-accordionheader:hover) {
  background: #f8fafc;
}

:deep(.p-accordionheader-toggle-icon) {
  margin-left: auto;
  transition: transform 0.3s ease;
  color: #64748b;
}

:deep(.p-accordionpanel-active) {
  border-color: #3b82f6;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.12);
}

:deep(.p-accordionpanel-active .p-accordionheader) {
  color: #3b82f6;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.p-accordioncontent) {
  /* background: white; */
  background: #1e293b;
  color: #475569;
  padding: 0.2rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.header-text {
  flex-grow: 1;
}

.content-body {
  white-space: pre-wrap;
}

/* RTL Support */
[dir="rtl"] :deep(.p-accordionheader-toggle-icon) {
  margin-left: 0;
  margin-right: auto;
}
</style>

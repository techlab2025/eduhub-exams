<script setup lang="ts">
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";

defineProps<{
  title: string;
  description?: string;
  code: string;
}>();
</script>

<template>
  <div class="guide-panel">
    <!-- header -->
    <div class="panel-header">
      <h2>{{ title }}</h2>
    </div>

    <p v-if="description" class="panel-desc">
      {{ description }}
    </p>

    <!-- tabs -->
    <Tabs
      value="0"
      :pt="{
        root: { class: 'tabs-bg' },
      }"
    >
      <TabList>
        <Tab value="0">Demo</Tab>
        <Tab value="1">Code</Tab>
      </TabList>

      <TabPanels>
        <!-- Demo -->
        <TabPanel value="0">
          <slot />
        </TabPanel>

        <!-- Code -->
        <TabPanel value="1">
          <pre class="code-block"><code>{{ code }}</code></pre>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>
.tabs-bg {
  background-color: white !important;
  .p-tablist {
    background-color: white !important;
    color: black !important;
  }
  .p-tabpanels {
    background-color: white !important;
    color: black !important;
  }
}

.guide-panel {
  background: white;
  border-radius: 14px;
  padding: 22px;
  border: 1px solid #e5e7eb;
}

.panel-header h2 {
  font-size: 18px;
  font-weight: 600;
}

.panel-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 14px;
}

.code-block {
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  font-size: 12px;
  overflow: auto;
}
</style>

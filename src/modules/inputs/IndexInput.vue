<script setup lang="ts">
import { ref } from "vue";
import UpdatedCustomInputSelect from "@/shared/FormInputs/UpdatedCustomInputSelect.vue";
import { EmailController } from "../employee-email";
import FilterEmailParams from "../employee-email/core/params/filter.email.params";
import TitleInterface from "@/base/Data/Models/titleInterface";

// controller
const controller = EmailController.getInstance();
const filterEmailParams = new FilterEmailParams("", 1, 10, 1);

// states
const singleSelection = ref<TitleInterface<string | number> | null>(null);
const multiSelection = ref<TitleInterface<string | number>[]>([]);
const staticSelection = ref<TitleInterface<string | number> | null>(null);
const autoFillSelection = ref<TitleInterface<string | number> | null>(null);

// static options
const mockStaticOptions = ref<TitleInterface<string | number>[]>([
  new TitleInterface({ id: 1, title: "Personal Email" }),
  new TitleInterface({ id: 2, title: "Work Email" }),
  new TitleInterface({ id: 3, title: "Secondary Email" }),
]);
</script>

<template>
  <div class="select-guide">
    <!-- Page Header -->
    <header class="guide-header">
      <h1>Custom Input Select</h1>
      <p>Complete guide and examples for using the custom select component.</p>
    </header>

    <!-- Panels -->
    <div class="panel-grid">
      <!-- PANEL 1 -->
      <div class="guide-panel">
        <div class="panel-header blue">
          <h2>Dynamic API Select</h2>
          <span></span>
        </div>
             
        <p class="panel-desc">
          Fetches options from an API controller using filter params.
        </p>

        <UpdatedCustomInputSelect
          v-model="singleSelection"
          :controller="controller"
          :params="filterEmailParams"
          placeholder="Select from API..."
          label="Email Type"
        />

        <div class="panel-result">
          Selected: {{ singleSelection?.title || "None" }}
        </div>
      </div>

      <!-- PANEL 2 -->
      <div class="guide-panel">
        <div class="panel-header purple">
          <h2>Multi Select</h2>
          <span>Chip Mode</span>
        </div>

        <p class="panel-desc">
          Enable multi-selection by setting <code>:type="2"</code>.
        </p>

        <UpdatedCustomInputSelect
          v-model="multiSelection"
          :type="2"
          :controller="controller"
          :params="filterEmailParams"
          placeholder="Choose multiple..."
          label="Email Types"
        />

        <div class="panel-result">
          Selected Count: {{ multiSelection.length }}
        </div>
      </div>

      <!-- PANEL 3 -->
      <div class="guide-panel">
        <div class="panel-header green">
          <h2>Static Options</h2>
          <span>No API</span>
        </div>

        <p class="panel-desc">Use local options without a controller.</p>

        <UpdatedCustomInputSelect
          v-model="staticSelection"
          :static-options="mockStaticOptions"
          placeholder="Choose..."
          label="Static List"
          :reload="false"
        />
      </div>

      <!-- PANEL 4 -->
      <div class="guide-panel">
        <div class="panel-header orange">
          <h2>Custom Header</h2>
          <span>Slot Override</span>
        </div>

        <p class="panel-desc">
          Replace the default header using the <code>#Header</code> slot.
        </p>

        <UpdatedCustomInputSelect
          :model-value="singleSelection"
          :static-options="mockStaticOptions"
          @update:model-value="singleSelection = $event"
          :label="`static options`"
          :placeholder="`Select from API...`"
          :reload="false"
          has-header
        >
          <template #Header>
            <div class="custom-header">
              <span>Advanced Select</span>
              <button>Reload</button>
            </div>
          </template>
        </UpdatedCustomInputSelect>
      </div>

      <!-- PANEL 5 -->
      <div class="guide-panel">
        <div class="panel-header yellow">
          <h2>Custom Content</h2>
          <span>Full UI Override</span>
        </div>

        <p class="panel-desc">
          Hide the select component and insert your own UI.
        </p>

        <UpdatedCustomInputSelect
          v-model="singleSelection"
          hascontent
          label="Custom Content"
        >
          <template #content>
            <div class="custom-content">
              <p>Any component can be placed here.</p>
              <button>Select Item</button>
            </div>
          </template>
        </UpdatedCustomInputSelect>
      </div>

      <!-- PANEL 6 -->
      <div class="guide-panel">
        <div class="panel-header red">
          <h2>Validation</h2>
          <span>Required / Optional</span>
        </div>

        <p class="panel-desc">
          Demonstrates required fields and optional fields.
        </p>

        <UpdatedCustomInputSelect
          v-model="autoFillSelection"
          :controller="controller"
          :params="filterEmailParams"
          required
          auto-fill
          label="Required Field"
        />

        <UpdatedCustomInputSelect
          v-model="autoFillSelection"
          :static-options="mockStaticOptions"
          optional
          label="Optional Field"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-guide {
  padding: 40px;
  background: #f8fafc;
  min-height: 100vh;
}

/* header */

.guide-header {
  margin-bottom: 40px;
}

.guide-header h1 {
  font-size: 32px;
  font-weight: bold;
}

.guide-header p {
  color: #64748b;
}

/* grid */

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}

/* panel */

.guide-panel {
  background: white;
  border-radius: 14px;
  padding: 22px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.guide-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
}

/* header */

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.panel-header h2 {
  font-size: 18px;
  font-weight: 600;
}

.panel-header span {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  background: #f1f5f9;
}

/* colors */

.blue span {
  background: #e0f2fe;
}
.green span {
  background: #dcfce7;
}
.purple span {
  background: #ede9fe;
}
.orange span {
  background: #fed7aa;
}
.yellow span {
  background: #fef3c7;
}
.red span {
  background: #fee2e2;
}

/* description */

.panel-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 14px;
}

/* result */

.panel-result {
  margin-top: 10px;
  font-size: 12px;
  color: #2563eb;
}

/* custom slots */

.custom-header {
  display: flex;
  justify-content: space-between;
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 6px;
}

.custom-header button {
  background: #6366f1;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
}

.custom-content {
  border: 2px dashed #fbbf24;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}
</style>

<script lang="ts" setup generic="T">

export interface TableHeader {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

import { ref, computed } from "vue";

const props = defineProps<{
  headers: TableHeader[];
  items: T[];
  showIndex?: boolean;
  selectable?: boolean;
  emptyMessage?: string;
  rowKey?: string;
  striped?: boolean;
  hoverable?: boolean;
}>();

const emit = defineEmits<{
  (e: "row-click", item: T, index: number): void;
  (e: "sort", key: string, direction: "asc" | "desc"): void;
  (e: "selection-change", selectedItems: T[]): void;
}>();

// --- Sorting ---
const sortKey = ref<string | null>(null);
const sortDirection = ref<"asc" | "desc">("asc");

function handleSort(header: TableHeader) {
  if (!header.sortable) return;

  if (sortKey.value === header.key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = header.key;
    sortDirection.value = "asc";
  }

  emit("sort", header.key, sortDirection.value);
}

// --- Selection ---
const selectedRows = ref<Set<number>>(new Set());

const allSelected = computed(() => {
  return (
    props.items.length > 0 && selectedRows.value.size === props.items.length
  );
});

function toggleAll() {
  if (allSelected.value) {
    selectedRows.value.clear();
  } else {
    selectedRows.value = new Set(props.items.map((_, i) => i));
  }
  emitSelection();
}

function toggleRow(index: number) {
  if (selectedRows.value.has(index)) {
    selectedRows.value.delete(index);
  } else {
    selectedRows.value.add(index);
  }
  emitSelection();
}

function isRowSelected(index: number): boolean {
  return selectedRows.value.has(index);
}

function emitSelection() {
  const selected = props.items.filter((_, i) => selectedRows.value.has(i));
  emit("selection-change", selected);
}

// --- Row key ---
function getRowKey(item: T, index: number): string | number {
  const key = props.rowKey ?? "id";
  const val = (item as any)?.[key];
  return val !== undefined ? val : index;
}
</script>

<template>
  <div class="app-table-wrapper">
    <div class="table-responsive">
      <table class="app-table" :class="{ striped, hoverable }">
        <!-- Header -->
        <thead>
          <tr>
            <!-- Selection checkbox column -->
            <th v-if="selectable" class="th-checkbox">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAll"
              />
            </th>

            <!-- Index column -->
            <th v-if="showIndex" class="th-index">#</th>

            <!-- Data columns -->
            <th
              v-for="header in headers"
              :key="header.key"
              :style="{
                width: header.width,
                textAlign: header.align || 'left',
              }"
              :class="{
                sortable: header.sortable,
                active: sortKey === header.key,
              }"
              @click="handleSort(header)"
            >
              <div class="th-content">
                <span>{{ header.label }}</span>
                <span v-if="header.sortable" class="sort-icon">
                  <template v-if="sortKey === header.key">
                    {{ sortDirection === "asc" ? "▲" : "▼" }}
                  </template>
                  <template v-else>⇅</template>
                </span>
              </div>
            </th>

            <!-- Actions column (if slot provided) -->
            <th v-if="$slots.actions" class="th-actions">
              <slot name="actions-header">Actions</slot>
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <tr v-if="items.length === 0">
            <td
              :colspan="
                headers.length +
                (showIndex ? 1 : 0) +
                (selectable ? 1 : 0) +
                ($slots.actions ? 1 : 0)
              "
              class="empty-row"
            >
              {{ emptyMessage || "No data available" }}
            </td>
          </tr>

          <tr
            v-for="(item, index) in items"
            :key="getRowKey(item, index)"
            :class="{ selected: selectable && isRowSelected(index) }"
            @click="emit('row-click', item, index)"
          >
            <!-- Selection checkbox -->
            <td v-if="selectable" class="td-checkbox" @click.stop>
              <input
                type="checkbox"
                :checked="isRowSelected(index)"
                @change="toggleRow(index)"
              />
            </td>

            <!-- Row index -->
            <td v-if="showIndex" class="td-index">{{ index + 1 }}</td>

            <!-- Data cells -->
            <td
              v-for="header in headers"
              :key="header.key"
              :style="{ textAlign: header.align || 'left' }"
            >
              <!--
                Use named slot `cell-{key}` for custom rendering,
                otherwise fall back to item[key]
              -->
              <slot
                :name="`cell-${header.key}`"
                :item="item"
                :index="index"
                :value="(item as any)[header.key]"
              >
                {{ (item as any)[header.key] ?? "--" }}
              </slot>
            </td>

            <!-- Actions cell -->
            <td v-if="$slots.actions" class="td-actions" @click.stop>
              <slot name="actions" :item="item" :index="index" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.app-table-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--table-border, #e2e8f0);
}

.table-responsive {
  overflow-x: auto;
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

/* ---- Header ---- */
.app-table thead {
  background: var(--table-header-bg, #f8fafc);
}

.app-table th {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--table-header-color, #475569);
  text-align: left;
  border-bottom: 2px solid var(--table-border, #e2e8f0);
  white-space: nowrap;
  user-select: none;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.sortable {
  cursor: pointer;
  transition: color 0.2s;
}

.sortable:hover {
  color: var(--table-sort-hover, #6366f1);
}

.sortable.active {
  color: var(--table-sort-active, #6366f1);
}

.sort-icon {
  font-size: 0.7rem;
  opacity: 0.6;
}

.sortable.active .sort-icon {
  opacity: 1;
}

.th-checkbox,
.td-checkbox {
  width: 40px;
  text-align: center;
}

.th-index,
.td-index {
  width: 50px;
  text-align: center;
  color: var(--table-index-color, #94a3b8);
}

.th-actions,
.td-actions {
  text-align: center;
  white-space: nowrap;
}

/* ---- Body ---- */
.app-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--table-border, #e2e8f0);
  color: var(--table-cell-color, #1e293b);
}

.app-table tbody tr {
  transition: background-color 0.15s;
}

.app-table.striped tbody tr:nth-child(even) {
  background: var(--table-stripe-bg, #f8fafc);
}

.app-table.hoverable tbody tr:hover {
  background: var(--table-hover-bg, #f1f5f9);
}

.app-table tbody tr.selected {
  background: var(--table-selected-bg, #eef2ff);
}

.empty-row {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--table-empty-color, #94a3b8);
  font-style: italic;
}

/* ---- Checkbox ---- */
.app-table input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--table-checkbox-color, #6366f1);
}
</style>

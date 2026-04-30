<script lang="ts" setup generic="T">
  export interface TableHeader {
    key: string;
    label: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
  }

  import { ref, computed } from 'vue';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';

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
    (e: 'row-click', item: T, index: number): void;
    (e: 'sort', key: string, direction: 'asc' | 'desc'): void;
    (e: 'selection-change', selectedItems: T[]): void;
  }>();

  // --- Sorting ---
  const sortKey = ref<string | null>(null);
  const sortDirection = ref<'asc' | 'desc'>('asc');

  function handleSort(header: TableHeader) {
    if (!header.sortable) return;

    if (sortKey.value === header.key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = header.key;
      sortDirection.value = 'asc';
    }

    emit('sort', header.key, sortDirection.value);
  }

  // --- Selection ---
  const selectedRows = ref<Set<number>>(new Set());

  const allSelected = computed(() => {
    return props.items.length > 0 && selectedRows.value.size === props.items.length;
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
    emit('selection-change', selected);
  }

  // --- Row key ---
  function getRowKey(item: T, index: number): string | number {
    const key = props.rowKey ?? 'id';
    const val = (item as any)?.[key];
    return val !== undefined ? val : index;
  }

  // when double click on any filed copy to clipboard
  const copyToClipboard = async (value: unknown) => {
    const text = String(value ?? '').trim();

    if (!text || text === '--') return;

    try {
      await navigator.clipboard.writeText(text);

      dialogManager.toastSuccess('Copied to clipboard: ' + text, {
        duration: 2000,
      });
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };
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
              <input type="checkbox" :checked="allSelected" @change="toggleAll" />
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
                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
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
          <slot name="CustomRow"></slot>
          <tr v-if="items.length === 0">
            <td
              :colspan="
                headers.length +
                (showIndex ? 1 : 0) +
                (selectable ? 1 : 0) +
                ($slots.actions ? 1 : 0)
              "
              class="empty-row"
              @dblclick="copyToClipboard(emptyMessage || 'No data available')"
            >
              {{ emptyMessage || 'No data available' }}
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
              <input type="checkbox" :checked="isRowSelected(index)" @change="toggleRow(index)" />
            </td>

            <!-- Row index -->
            <td v-if="showIndex" class="td-index">{{ index + 1 }}</td>

            <!-- Data cells -->
            <td
              v-for="header in headers"
              :key="header.key"
              :style="{ textAlign: header.align || 'left' }"
              class="td-data"
              @dblclick.stop="copyToClipboard((item as any)?.[header.key])"
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
                {{ (item as any)[header.key] ?? '--' }}
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

<style lang="scss" scoped>
  /* ── Wrapper ────────────────────────────────────────────────── */
  .app-table-wrapper {
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    // background: #f5f5f5;
    // border: 1px solid var(--border-strong);
    // box-shadow:
    //   0 1px 3px rgba(0, 0, 0, 0.04),
    //   0 8px 32px rgba(0, 0, 0, 0.03);
    position: relative;
    // padding: 24px;

    // &::before {
    //   content: "";
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   right: 0;
    //   height: 1px;
    //   background: linear-gradient(
    //     90deg,
    //     transparent,
    //     rgba(99, 102, 241, 0.15),
    //     transparent
    //   );
    //   pointer-events: none;
    // }
  }

  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: var(--gray-100);
    }

    &::-webkit-scrollbar-thumb {
      background: var(--gray-300);
      border-radius: var(--radius-full);

      &:hover {
        background: var(--gray-400);
      }
    }
  }

  /* ── Table ─────────────────────────────────────────────────── */
  .app-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-family: var(--font-family);
    position: relative;

    /* ── Header ──────────────────────────────────────────────── */
    thead {
      position: sticky;
      top: 0;
      z-index: 10;

      tr th {
        // background: linear-gradient(
        //   180deg,
        //   var(--gray-50) 0%,
        //   var(--gray-100) 100%
        // );
        background: var(--gray-100);
        padding: 24px;
        text-align: left;
        color: var(--table-header-color);
        font-weight: 600;
        font-size: 12px;
        font-family: 'Medium';
        text-transform: uppercase;
        letter-spacing: 0.08em;
        border-bottom: 2px solid var(--border-weak);
        white-space: nowrap;
        user-select: none;

        &:first-child {
          padding-left: 20px;
        }

        &:last-child {
          padding-right: 20px;
        }

        &.sortable {
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: linear-gradient(
              180deg,
              var(--PrimaryColor-light) 0%,
              var(--PrimaryColor-alpha-12) 100%
            );
            color: var(--PrimaryColor);
          }
        }

        &.active {
          color: var(--PrimaryColor);
          background: linear-gradient(
            180deg,
            var(--PrimaryColor-light) 0%,
            var(--PrimaryColor-alpha-20) 100%
          );
          border-bottom-color: var(--PrimaryColor);
        }

        .th-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;

          .sort-icon {
            font-size: 0.65rem;
            opacity: 0.4;
            transition: all 0.2s ease;
          }

          &:hover .sort-icon {
            opacity: 0.8;
          }
        }
      }
    }

    /* ── Body ────────────────────────────────────────────────── */
    tbody {
      tr {
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;

        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: var(--border-weak);
          opacity: 0.6;
          pointer-events: none;
        }

        &:not(:last-child)::after {
          opacity: 1;
        }

        &.hoverable {
          &:hover {
            background: linear-gradient(
              90deg,
              var(--PrimaryColor-light) 0%,
              var(--PrimaryColor-alpha-12) 30%,
              transparent 100%
            );
            transform: scale(1.001);
            box-shadow:
              inset 0 0 0 1px var(--PrimaryColor-alpha-8),
              0 2px 8px var(--PrimaryColor-alpha-8);

            td {
              color: var(--gray-900);
            }
          }
        }

        &.striped:nth-child(even) {
          background: var(--gray-50);

          &:hover {
            background: linear-gradient(
              90deg,
              var(--PrimaryColor-light) 0%,
              var(--PrimaryColor-alpha-12) 30%,
              transparent 100%
            );
          }
        }

        &.selected {
          background: linear-gradient(
            90deg,
            var(--PrimaryColor-light) 0%,
            var(--PrimaryColor-alpha-20) 50%,
            transparent 100%
          ) !important;

          td {
            color: var(--PrimaryColor);
            font-weight: 600;
          }
        }

        td {
          padding: 14px 16px;
          color: var(--table-data-color);
          font-size: 15px;
          font-weight: 500;
          font-family: 'Medium';
          line-height: 1.5;
          transition: all 0.2s ease;

          &:first-child {
            padding-left: 20px;
          }

          &:last-child {
            padding-right: 20px;
          }

          &.td-data {
            cursor: pointer;
            position: relative;

            &::before {
              content: '';
              position: absolute;
              inset: 0;
              background: transparent;
              border-radius: var(--radius-sm);
              transition: background 0.2s ease;
            }

            &:hover::before {
              background: var(--PrimaryColor-alpha-4);
            }

            &:active::before {
              background: var(--PrimaryColor-alpha-8);
            }
          }

          &.td-index {
            font-weight: 700;
            color: var(--gray-400);
            font-size: 0.8rem;
            font-variant-numeric: tabular-nums;
            width: 40px;
            text-align: center;
          }
        }

        .empty-row {
          text-align: center;
          padding: 48px 20px;
          color: var(--gray-400);
          font-size: 0.95rem;
          font-style: italic;
        }
      }
    }

    /* ── Checkbox ────────────────────────────────────────────── */
    .th-checkbox,
    .td-checkbox {
      width: 44px;
      text-align: center;

      input[type='checkbox'] {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid var(--gray-300);
        border-radius: var(--radius-xs);
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        background: var(--bg-main);

        &:checked {
          background: linear-gradient(
            135deg,
            var(--PrimaryColor) 0%,
            var(--PrimaryColor-hover) 100%
          );
          border-color: var(--PrimaryColor);
          box-shadow: 0 2px 6px var(--PrimaryColor-alpha-20);

          &::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 1px;
            width: 6px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        }

        &:hover:not(:checked) {
          border-color: var(--PrimaryColor);
          box-shadow: 0 0 0 3px var(--PrimaryColor-light);
        }
      }
    }

    /* ── Actions ─────────────────────────────────────────────── */
    .th-actions,
    .td-actions {
      width: 1%;
      white-space: nowrap;
      text-align: center;
    }
  }
</style>

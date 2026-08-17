import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Component from '../SubscriptionIndex.vue';

const mocks = vi.hoisted(() => ({
  fetchList: vi.fn().mockResolvedValue(undefined),
  fetchStats: vi.fn().mockResolvedValue(undefined),
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('../../controllers/subscription.controller', () => ({
  default: {
    getInstance: () => ({
      listState: { value: {} },
      stats: { value: null },
      pagination: { value: null },
      fetchList: mocks.fetchList,
      fetchStats: mocks.fetchStats,
      delete: mocks.remove,
    }),
  },
}));

vi.mock(
  '@/modules/EducationClassification/presentation/controllers/educationClassification.controller',
  () => ({ default: { getInstance: () => ({}) } }),
);

vi.mock('@/modules/Plan/presentation/controllers/plan.controller', () => ({
  default: { getInstance: () => ({}) },
}));

describe('SubscriptionIndex', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows selected quick filters and allows clearing them', async () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: {
          FilterDialog: {
            template:
              '<div class="filter-dialog-stub"><slot name="content" /><slot name="footer" /></div>',
          },
          UpdatedCustomInputSelect: {
            props: ['modelValue', 'placeholder'],
            emits: ['update:modelValue'],
            template: `
              <button
                class="select-stub"
                @click="$emit('update:modelValue', { id: 1, title: placeholder })"
              >
                {{ placeholder }}
              </button>
            `,
          },
        },
      },
    });

    expect(wrapper.findAll('.subscription-filter-section')).toHaveLength(6);
    expect(wrapper.find('.filter-actions').exists()).toBe(true);
    expect(wrapper.find('.selected-filter-summary').exists()).toBe(false);

    await wrapper.findAll('.select-stub')[0].trigger('click');

    expect(wrapper.find('.selected-filter-summary').exists()).toBe(true);
    expect(wrapper.find('.selected-filter-chip').text()).toContain('education_type');

    await wrapper.find('.clear-filter-button').trigger('click');

    expect(wrapper.find('.selected-filter-summary').exists()).toBe(false);
    expect(mocks.fetchList).toHaveBeenCalled();
  });

  it('keeps active subscription rows selectable', () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: '<div><slot name="success" :data="[]" /></div>',
          },
          AppTable: {
            props: ['selectable', 'rowSelectable'],
            template: '<div class="app-table-stub" />',
          },
          FilterDialog: true,
          UpdatedCustomInputSelect: true,
          Pagination: true,
        },
      },
    });

    expect(wrapper.getComponent('.app-table-stub').props('selectable')).toBe(true);
    expect(wrapper.getComponent('.app-table-stub').props('rowSelectable')).toBeUndefined();
  });

  it('blocks bulk deletion when the selection contains an active subscription', async () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: `
              <slot
                name="success"
                :data="[
                  { id: 7, status: 1, student: { name: 'Active' }, plan: { title: 'Plan' } },
                  { id: 8, status: 2, student: { name: 'Expired' }, plan: { title: 'Plan' } }
                ]"
              />
            `,
          },
          AppTable: {
            props: ['items'],
            emits: ['selection-change'],
            template: `
              <button class="select-rows" @click="$emit('selection-change', items)">
                select
              </button>
            `,
          },
          SubscriptionBulkDeleteWarningDialog: {
            props: ['modelValue'],
            template: '<div v-if="modelValue" class="bulk-warning-dialog-stub" />',
          },
          SubscriptionDeleteWarningDialog: true,
          SubscriptionDetailsDialog: true,
          FilterDialog: true,
          UpdatedCustomInputSelect: true,
          Pagination: true,
        },
      },
    });

    await wrapper.find('.select-rows').trigger('click');
    await wrapper.find('.num-deleted').trigger('click');

    expect(wrapper.find('.bulk-warning-dialog-stub').exists()).toBe(true);
    expect(mocks.remove).not.toHaveBeenCalled();
  });

  it('blocks deleting an active subscription and opens the warning dialog', async () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: `
              <div>
                <slot
                  name="success"
                  :data="[{ id: 7, status: 1, student: { name: 'Student' }, plan: { title: 'Plan' } }]"
                />
              </div>
            `,
          },
          AppTable: {
            props: ['items'],
            template: '<div><slot name="actions" :item="items[0]" /></div>',
          },
          DropList: {
            props: ['actionList'],
            template: `
              <div>
                <button class="view-action" @click="actionList[0].action()">view</button>
                <button class="delete-action" @click="actionList[1].action()">delete</button>
              </div>
            `,
          },
          SubscriptionDetailsDialog: {
            props: ['modelValue', 'subscriptionId'],
            template:
              '<div v-if="modelValue" class="details-dialog-stub">{{ subscriptionId }}</div>',
          },
          SubscriptionDeleteWarningDialog: {
            props: ['modelValue'],
            template: '<div v-if="modelValue" class="warning-dialog-stub" />',
          },
          FilterDialog: true,
          UpdatedCustomInputSelect: true,
          Pagination: true,
        },
      },
    });

    await wrapper.find('.delete-action').trigger('click');

    expect(wrapper.find('.warning-dialog-stub').exists()).toBe(true);
    expect(mocks.remove).not.toHaveBeenCalled();
  });

  it('opens the details dialog with the selected subscription from the view action', async () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: `
              <slot
                name="success"
<<<<<<< HEAD
                  :data="[{ id: 7, status: 2, student: { name: 'Student' }, plan: { title: 'Plan' } }]"
=======
                :data="[{ id: 7, status: 2, student: { name: 'Student' }, plan: { title: 'Plan' } }]"
>>>>>>> ci/cd
              />
            `,
          },
          AppTable: {
            props: ['items'],
            template: '<div><slot name="actions" :item="items[0]" /></div>',
          },
          DropList: {
            props: ['actionList'],
            template: '<button class="view-action" @click="actionList[0].action()">view</button>',
          },
          SubscriptionDetailsDialog: {
            props: ['modelValue', 'subscriptionId'],
            template:
              '<div v-if="modelValue" class="details-dialog-stub">{{ subscriptionId }}</div>',
          },
          SubscriptionDeleteWarningDialog: true,
          FilterDialog: true,
          UpdatedCustomInputSelect: true,
          Pagination: true,
        },
      },
    });

    await wrapper.find('.view-action').trigger('click');

    expect(wrapper.find('.details-dialog-stub').exists()).toBe(true);
    expect(wrapper.find('.details-dialog-stub').text()).toBe('7');
  });
});

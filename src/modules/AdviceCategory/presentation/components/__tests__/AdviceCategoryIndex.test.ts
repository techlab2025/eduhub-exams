/* eslint-disable vue/one-component-per-file */
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdviceCategoryIndex from '../AdviceCategoryIndex.vue';

const {
  categories,
  createMock,
  deleteMock,
  fetchListMock,
  fetchOneMock,
  replaceMock,
  toastErrorMock,
  updateMock,
} = vi.hoisted(() => ({
  categories: [
    {
      id: 7,
      title: 'Planning',
      translations: { en: 'Planning', ar: 'التخطيط' },
      createdAt: '2026-09-06',
      status: true,
    },
  ],
  createMock: vi.fn().mockResolvedValue({ hasError: false }),
  deleteMock: vi.fn().mockResolvedValue({ hasError: false }),
  fetchListMock: vi.fn().mockResolvedValue({ hasError: false }),
  fetchOneMock: vi.fn(),
  replaceMock: vi.fn(),
  toastErrorMock: vi.fn(),
  updateMock: vi.fn().mockResolvedValue({ hasError: false }),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: { toastError: toastErrorMock },
}));

vi.mock('@/modules/AdviceCategory/presentation/controllers/advice.category.controller', () => ({
  default: {
    getInstance: () => ({
      listState: { value: { data: categories } },
      pagination: { value: null },
      create: createMock,
      delete: deleteMock,
      fetchList: fetchListMock,
      fetchOne: fetchOneMock,
      update: updateMock,
    }),
  },
}));

const DataStatusBuilderStub = defineComponent({
  props: { controller: { type: Object, required: true } },
  template: '<div><slot name="success" :data="controller.data" /></div>',
});

const AppTableStub = defineComponent({
  props: { items: { type: Array, required: true } },
  template: `
    <div class="app-table-stub">
      <div v-for="item in items" :key="item.id" class="category-row">
        <span class="category-title">{{ item.title }}</span>
        <slot name="cell-createdAt" :item="item" />
        <slot name="cell-status" :item="item" />
        <slot name="actions" :item="item" />
      </div>
    </div>
  `,
});

const DropListStub = defineComponent({
  props: { actionList: { type: Array, required: true } },
  template: `
    <div>
      <button class="edit-action" @click="actionList[0].action()">edit</button>
      <button class="delete-action" @click="actionList[1].action()">delete</button>
    </div>
  `,
});

const DialogStub = defineComponent({
  props: { visible: Boolean },
  template: '<div v-if="visible" class="dialog-stub"><slot name="container" /></div>',
});

const FeedbackDialogStub = defineComponent({
  props: {
    modelValue: Boolean,
    variant: { type: String, required: true },
    message: { type: String, default: '' },
  },
  emits: ['confirm', 'update:modelValue'],
  template: `
    <div v-if="modelValue" class="feedback-dialog-stub" :data-variant="variant">
      <span class="feedback-message">{{ message }}</span>
      <button class="feedback-confirm" @click="$emit('confirm')">confirm</button>
    </div>
  `,
});

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    DataStatusBuilder: DataStatusBuilderStub,
    AppTable: AppTableStub,
    DropList: DropListStub,
    Dialog: DialogStub,
    AdviceCategoryFeedbackDialog: FeedbackDialogStub,
    MultiLangInput: {
      name: 'MultiLangInput',
      props: { modelValue: { type: Object, required: true } },
      template: '<div class="multi-lang-input-stub" />',
    },
    Pagination: true,
    TableSkelaton: true,
    EmptyFolderIcon: true,
    FolderCrudIcon: true,
    CategoryEditIcon: true,
  },
};

const mountPage = () => mount(AdviceCategoryIndex, { global });

describe('AdviceCategoryIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMock.mockResolvedValue({ hasError: false });
    deleteMock.mockResolvedValue({ hasError: false });
    fetchListMock.mockResolvedValue({ hasError: false });
    fetchOneMock.mockResolvedValue({ data: categories[0], hasError: false });
    updateMock.mockResolvedValue({ hasError: false });
  });

  it('loads and displays category metadata', async () => {
    const wrapper = mountPage();
    await flushPromises();

    expect(fetchListMock).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('Planning');
    expect(wrapper.text()).toContain('2026-09-06');
    expect(wrapper.find('.advice-category-page__status--active').exists()).toBe(true);
  });

  it('creates a category with trimmed translated titles', async () => {
    const wrapper = mountPage();
    wrapper.getComponent({ name: 'MultiLangInput' }).vm.$emit('update:modelValue', {
      en: '  Health  ',
      ar: ' الصحة ',
    });
    await wrapper.vm.$nextTick();
    await wrapper.get('.advice-category-page__save').trigger('click');
    await flushPromises();

    expect(createMock.mock.calls[0]?.[0].toMap()).toEqual({
      translations: { title: { en: 'Health', ar: 'الصحة' } },
    });
    expect(fetchListMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ pageNumber: 1, perPage: 10 }),
    );
  });

  it('loads a category and updates it from the edit dialog', async () => {
    const wrapper = mountPage();
    await wrapper.get('.edit-action').trigger('click');
    await flushPromises();

    expect(fetchOneMock.mock.calls[0]?.[0].toMap()).toEqual({ advice_category_id: 7 });

    const inputs = wrapper.findAllComponents({ name: 'MultiLangInput' });
    inputs[1]?.vm.$emit('update:modelValue', { en: 'Updated category' });
    await wrapper.vm.$nextTick();
    await wrapper.get('.advice-category-edit-dialog__actions button').trigger('click');
    await flushPromises();

    expect(updateMock.mock.calls[0]?.[0].toMap()).toEqual({
      advice_category_id: 7,
      translations: { title: { en: 'Updated category' } },
    });
    expect(wrapper.find('.dialog-stub').exists()).toBe(false);
  });

  it('shows the exact backend message when deleting a category is blocked', async () => {
    const backendMessage = 'This category contains 4 tips or advice.';
    deleteMock.mockResolvedValueOnce({
      hasError: true,
      error: { displayMessage: backendMessage },
    });
    const wrapper = mountPage();

    await wrapper.get('.delete-action').trigger('click');
    expect(wrapper.get('.feedback-dialog-stub').attributes('data-variant')).toBe('delete-confirm');

    await wrapper.get('.feedback-confirm').trigger('click');
    await flushPromises();

    expect(deleteMock.mock.calls[0]?.[0].toMap()).toEqual({ advice_category_id: 7 });
    expect(deleteMock.mock.calls[0]?.[2]).toBe(false);
    expect(wrapper.get('.feedback-dialog-stub').attributes('data-variant')).toBe('delete-error');
    expect(wrapper.get('.feedback-message').text()).toBe(backendMessage);
  });
});

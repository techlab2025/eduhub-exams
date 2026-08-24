import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdviceCategoryDialog from '../AdviceCategoryDialog.vue';

const { categories, createMock, deleteMock, fetchListMock, fetchOneMock, updateMock } = vi.hoisted(
  () => ({
    categories: [{ id: 7, title: 'Planning', translations: { en: 'Planning' } }],
    createMock: vi.fn().mockResolvedValue(undefined),
    deleteMock: vi.fn().mockResolvedValue(undefined),
    fetchListMock: vi.fn().mockResolvedValue(undefined),
    fetchOneMock: vi.fn().mockResolvedValue({
      data: { translations: { en: 'Planning', ar: 'التخطيط' } },
    }),
    updateMock: vi.fn().mockResolvedValue(undefined),
  }),
);

vi.mock('@/modules/AdviceCategory/presentation/controllers/advice.category.controller', () => ({
  default: {
    getInstance: () => ({
      listData: { value: categories },
      create: createMock,
      delete: deleteMock,
      fetchList: fetchListMock,
      fetchOne: fetchOneMock,
      update: updateMock,
    }),
  },
}));

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    Dialog: {
      props: ['visible'],
      template: '<div v-if="visible"><slot name="header" /><slot /></div>',
    },
    MultiLangInput: {
      name: 'MultiLangInput',
      props: ['modelValue'],
      template: '<div class="multi-lang-input-stub" />',
    },
    DeleteDialog: {
      emits: ['delete'],
      template: '<button class="delete-category" @click="$emit(\'delete\')" />',
    },
    IndexAddIcon: true,
    IndexDelete: true,
    EditeIcon: true,
  },
};

describe('AdviceCategoryDialog', () => {
  beforeEach(() => vi.clearAllMocks());

  it('opens and fetches the category list', async () => {
    const wrapper = mount(AdviceCategoryDialog, { global });
    await wrapper.get('button.btn-primary').trigger('click');
    await flushPromises();

    expect(fetchListMock).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('Planning');
  });

  it('creates a category with translated titles', async () => {
    const wrapper = mount(AdviceCategoryDialog, { global });
    await wrapper.get('button.btn-primary').trigger('click');
    wrapper.getComponent({ name: 'MultiLangInput' }).vm.$emit('update:modelValue', {
      en: 'Health',
      ar: 'الصحة',
    });
    await wrapper.vm.$nextTick();
    await wrapper.get('.save-category').trigger('click');
    await flushPromises();

    expect(createMock.mock.calls[0]?.[0].toMap()).toEqual({
      translations: { title: { en: 'Health', ar: 'الصحة' } },
    });
  });

  it('loads a category for editing and deletes categories', async () => {
    const wrapper = mount(AdviceCategoryDialog, { global });
    await wrapper.get('button.btn-primary').trigger('click');
    await wrapper.get('.edit-category').trigger('click');
    await flushPromises();

    expect(fetchOneMock.mock.calls[0]?.[0].toMap()).toEqual({ advice_category_id: 7 });
    await wrapper.get('.save-category').trigger('click');
    await flushPromises();
    expect(updateMock.mock.calls[0]?.[0].toMap()).toMatchObject({ advice_category_id: 7 });

    await wrapper.get('.delete-category').trigger('click');
    await flushPromises();
    expect(deleteMock.mock.calls[0]?.[0].toMap()).toEqual({ advice_category_id: 7 });
  });
});

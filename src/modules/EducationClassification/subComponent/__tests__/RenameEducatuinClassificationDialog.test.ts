import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RenameEducatuinClassificationDialog from '../RenameEducatuinClassificationDialog.vue';

const { fetchOneMock, updateMock } = vi.hoisted(() => ({
  fetchOneMock: vi.fn(),
  updateMock: vi.fn(),
}));

vi.mock('../../presentation/controllers/educationClassification.controller', () => ({
  default: {
    getInstance: () => ({
      fetchOne: fetchOneMock,
      update: updateMock,
    }),
  },
}));

vi.mock('primevue/dialog', () => ({
  default: {
    props: ['visible'],
    emits: ['update:visible'],
    template: '<div><slot name="header" /><slot /></div>',
  },
}));

vi.mock('@/shared/MultiLangInput.vue', () => ({
  default: {
    props: ['modelValue'],
    template:
      '<div class="multi-lang-input" :data-en="modelValue.en" :data-ar="modelValue.ar" />',
  },
}));

describe('RenameEducatuinClassificationDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchOneMock.mockResolvedValue({
      data: {
        titles: [
          { locale: 'en', title: 'English title' },
          { locale: 'ar', title: 'Arabic title' },
        ],
      },
    });
  });

  it('loads the selected classification titles when opened', async () => {
    const wrapper = mount(RenameEducatuinClassificationDialog, {
      props: { visable: true, itemId: 7 },
      global: { mocks: { $t: (key: string) => key } },
    });

    await flushPromises();

    expect(fetchOneMock).toHaveBeenCalledOnce();
    expect(fetchOneMock.mock.calls[0]?.[0].toMap()).toEqual({
      education_classification_id: 7,
    });
    expect(wrapper.get('.multi-lang-input').attributes('data-en')).toBe('English title');
    expect(wrapper.get('.multi-lang-input').attributes('data-ar')).toBe('Arabic title');
  });
});

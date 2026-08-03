import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DocumentTypeDialog from '../DocumentTypeDialog.vue';

const { fetchListMock, toggleStatusMock } = vi.hoisted(() => ({
  fetchListMock: vi.fn().mockResolvedValue(undefined),
  toggleStatusMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock(
  '@/modules/document/presentation/controllers/DocumentType/document.type.controller',
  () => ({
    default: {
      getInstance: () => ({
        listState: {
          value: {
            data: [{ id: 7, title: 'PDF', status: true }],
          },
        },
        fetchList: fetchListMock,
        toggleStatus: toggleStatusMock,
      }),
    },
  }),
);

const global = {
  mocks: { $t: (msg: string) => msg },
  stubs: {
    Dialog: {
      props: ['visible'],
      template: '<div v-if="visible"><slot name="header" /><slot /></div>',
    },
    ToggleSwitch: {
      name: 'ToggleSwitch',
      props: ['modelValue'],
      emits: ['update:modelValue'],
      template:
        '<button class="toggle-switch" @click="$emit(\'update:modelValue\', !modelValue)" />',
    },
    MultiLangInput: true,
    DeleteDialog: { template: '<div />' },
    IndexAddIcon: true,
    EditeIcon: true,
  },
};

describe('DocumentTypeDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without errors', () => {
    const wrapper = mount(DocumentTypeDialog, {
      global,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the current status and toggles the document type', async () => {
    const wrapper = mount(DocumentTypeDialog, { global });
    await wrapper.get('button.btn-primary').trigger('click');
    await flushPromises();

    const toggle = wrapper.getComponent({ name: 'ToggleSwitch' });
    expect(toggle.props('modelValue')).toBe(true);

    await toggle.get('.toggle-switch').trigger('click');
    await flushPromises();

    expect(toggleStatusMock).toHaveBeenCalledOnce();
    expect(toggleStatusMock.mock.calls[0]?.[0].toMap()).toEqual({ document_type_id: 7 });
    expect(fetchListMock).toHaveBeenCalledTimes(2);
  });
});

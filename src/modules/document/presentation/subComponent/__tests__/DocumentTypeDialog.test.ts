import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DocumentTypeDialog from '../DocumentTypeDialog.vue';

const { documentTypeList, fetchListMock, toggleStatusMock } = vi.hoisted(() => ({
  documentTypeList: [{ id: 7, title: 'PDF', status: true }],
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
            data: documentTypeList,
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
    const [documentType] = documentTypeList;
    if (documentType) documentType.title = 'PDF';
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

  it('renders the full title for CSS truncation and exposes it on hover', async () => {
    const [documentType] = documentTypeList;
    if (documentType) documentType.title = 'A'.repeat(110);
    const wrapper = mount(DocumentTypeDialog, { global });

    await wrapper.get('button.btn-primary').trigger('click');

    const renderedTitle = wrapper.get('.item-main-title');
    expect(renderedTitle.text()).toBe('A'.repeat(110));
    expect(renderedTitle.attributes('title')).toBe('A'.repeat(110));
  });
});

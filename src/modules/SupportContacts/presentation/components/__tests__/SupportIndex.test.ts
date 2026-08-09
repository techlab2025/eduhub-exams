import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import SupportContactsController from '../../controllers/support.controller';
import SupportIndex from '../SupportIndex.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { country_code: 'eg' },
    query: { page: '1', word: '' },
    fullPath: '/eg/support',
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  createRouter: vi.fn(() => ({
    getRoutes: vi.fn(() => []),
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}));

const globalConfig = {
  plugins: [createPinia()],
  stubs: {
    'router-link': true,
    DataStatusBuilder: { template: '<div><slot name="success" /></div>' },
    AppTable: true,
    Pagination: true,
    DeleteDialog: {
      props: ['title', 'message', 'hasbtn'],
      template: '<button class="delete-dialog-stub"><slot name="btn" /></button>',
    },
  },
  mocks: {
    $t: (msg: string) => msg,
  },
};

describe('SupportIndex.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    const controller = SupportContactsController.getInstance();
    controller.listState.value = new DataSuccess({
      data: [
        {
          id: 1,
          titles: 'Support',
          supportContacts: [
            { id: 1, key: 'phonenumbers', value: '01011111111', type: '' },
            { id: 2, key: 'phonenumbers', value: '01022222222', type: '' },
            { id: 3, key: 'whatsapp_numbers', value: '01033333333', type: '' },
            { id: 4, key: 'emails', value: 'support@example.com', type: '' },
            { id: 5, key: 'telegram_numbers', value: '01044444444', type: '' },
          ],
        },
      ],
    });
    vi.spyOn(controller, 'fetchList').mockResolvedValue(controller.listState.value);
  });

  it('renders the support contact page container', () => {
    const wrapper = mount(SupportIndex, { global: globalConfig });

    expect(wrapper.find('.support-contact-page').exists()).toBe(true);
  });

  it('renders the delete dialog trigger', () => {
    const wrapper = mount(SupportIndex, { global: globalConfig });

    expect(wrapper.find('.delete-dialog-stub .action-btn.delete').exists()).toBe(true);
  });

  it('renders every contact value grouped by its API key', () => {
    const wrapper = mount(SupportIndex, { global: globalConfig });

    expect(wrapper.get('[data-contact-group="phonenumbers"]').text()).toContain('01011111111');
    expect(wrapper.get('[data-contact-group="phonenumbers"]').text()).toContain('01022222222');
    expect(wrapper.get('[data-contact-group="whatsapp_numbers"]').text()).toContain('01033333333');
    expect(wrapper.get('[data-contact-group="emails"]').text()).toContain('support@example.com');
    expect(wrapper.get('[data-contact-group="telegram_numbers"]').text()).toContain('01044444444');
    expect(wrapper.findAll('.contact-value-chip')).toHaveLength(5);
  });
});

import { defineComponent } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import en from '@/locales/en.json';
import DashboardLayout from '../DashboardLayout.vue';
import FeatureHeader from '../../FeatureHeader/FeatureHeader.vue';
import SidebarNavigation from '../SubComponents/SidebarNavigation.vue';
import Navbar from '../SubComponents/Navbar.vue';
import DocumentIndexProgressOverlay from '@/modules/DocumentIndex/presentation/components/DocumentIndexProgressOverlay.vue';

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    meta: {
      headerAction: {
        icon: 'plus',
        label: 'notification_plan.add',
        to: '/notification-plans/add',
      },
    },
  }),
  useRouter: () => ({ push: pushMock }),
}));

const FeatureHeaderStub = defineComponent({
  name: 'FeatureHeader',
  template: '<header><slot name="actions" /></header>',
});

const mountLayout = () =>
  shallowMount(DashboardLayout, {
    slots: {
      default: '<div class="test-slot-content">Slot Content</div>',
    },
    global: {
      plugins: [createI18n({ legacy: false, locale: 'en', messages: { en } })],
      stubs: { FeatureHeader: FeatureHeaderStub },
    },
  });

describe('DashboardLayout.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the layout components', () => {
    const wrapper = mountLayout();

    expect(wrapper.findComponent(SidebarNavigation).exists()).toBe(true);
    expect(wrapper.findComponent(Navbar).exists()).toBe(true);
    expect(wrapper.findComponent(FeatureHeader).exists()).toBe(true);
    expect(wrapper.findComponent(DocumentIndexProgressOverlay).exists()).toBe(true);
  });

  it('renders the default slot content', () => {
    const wrapper = mountLayout();

    expect(wrapper.html()).toContain('Slot Content');
    expect(wrapper.find('.test-slot-content').exists()).toBe(true);
  });

  it('renders and executes the route header action without teleporting it', async () => {
    const wrapper = mountLayout();
    const action = wrapper.get('.feature-header__action');

    expect(action.text()).toBe('Add Notification Plan');
    expect(wrapper.find('teleport-stub').exists()).toBe(false);
    await action.trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/notification-plans/add');
  });
});

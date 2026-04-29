import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Navbar from '../Navbar.vue';

// ── Stores ────────────────────────────────────────────────────────────────────
vi.mock('@/stores/user', () => ({
  useUserStore: () => ({
    logout: vi.fn(),
  }),
}));

vi.mock('@/stores/theme', () => ({
  useThemeStore: () => ({
    toggle: vi.fn(),
  }),
}));

// ── Router ────────────────────────────────────────────────────────────────────
const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// ── Assets ────────────────────────────────────────────────────────────────────
vi.mock('@/assets/images/headerIMages/employee.jpg', () => ({
  default: 'mock-employee.jpg',
}));

describe('Navbar.vue', () => {
  const mountOptions = {
    global: {
      mocks: {
        $t: (msg: string) => msg,
      },
      stubs: {
        SearchIcon: true,
        HeaderSettingIcon: true,
        HeaderDarkModeIcon: true,
        HeaderMessgaesIcon: true,
        HeaderNotificationIcon: true,
        HeaderSidebarIcon: true,
        IconLogout: true,
        SidebarNavigation: true,
        Drawer: {
          template: '<div class="drawer-stub"><slot /><slot name="header" /></div>',
          props: ['visible', 'position'],
        },
      },
    },
  };

  it('renders the header element', () => {
    const wrapper = mount(Navbar, mountOptions);
    expect(wrapper.find('header.header').exists()).toBe(true);
  });

  it('renders the nav element', () => {
    const wrapper = mount(Navbar, mountOptions);
    expect(wrapper.find('nav.nav').exists()).toBe(true);
  });

  it('renders the user avatar image', () => {
    const wrapper = mount(Navbar, mountOptions);
    expect(wrapper.find('img[alt="user"]').exists()).toBe(true);
  });

  it('dropdown menu is hidden by default', () => {
    const wrapper = mount(Navbar, mountOptions);
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
  });

  it('toggles dropdown menu on user div click', async () => {
    const wrapper = mount(Navbar, mountOptions);
    const userDiv = wrapper.find('.user.dropdown-trigger');
    await userDiv.trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);

    await userDiv.trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
  });

  it('calls logout and navigates to /choose-country on logout click', async () => {
    const wrapper = mount(Navbar, mountOptions);

    // Open dropdown first
    await wrapper.find('.user.dropdown-trigger').trigger('click');

    const logoutItem = wrapper.find('.dropdown-menu li');
    await logoutItem.trigger('click');

    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});

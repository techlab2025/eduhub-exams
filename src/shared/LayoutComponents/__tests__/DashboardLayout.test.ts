import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import DashboardLayout from '../DashboardLayout.vue';
import BreadCrumb from '../SubComponents/BreadCrumb.vue';
import SidebarNavigation from '../SubComponents/SidebarNavigation.vue';
import Navbar from '../SubComponents/Navbar.vue';
import NavigationBarMobile from '../SubComponents/NavigationBarMobile.vue';

describe('DashboardLayout.vue', () => {
  it('renders the layout components', () => {
    const wrapper = shallowMount(DashboardLayout, {
      slots: {
        default: '<div class="test-slot-content">Slot Content</div>',
      },
    });

    expect(wrapper.findComponent(SidebarNavigation).exists()).toBe(true);
    expect(wrapper.findComponent(Navbar).exists()).toBe(true);
    expect(wrapper.findComponent(BreadCrumb).exists()).toBe(true);
    expect(wrapper.findComponent(NavigationBarMobile).exists()).toBe(true);
  });

  it('renders the default slot content', () => {
    const wrapper = shallowMount(DashboardLayout, {
      slots: {
        default: '<div class="test-slot-content">Slot Content</div>',
      },
    });

    expect(wrapper.html()).toContain('Slot Content');
    expect(wrapper.find('.test-slot-content').exists()).toBe(true);
  });
});

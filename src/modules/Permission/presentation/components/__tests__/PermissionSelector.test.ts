import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PermissionSelector from '../PermissionSelector.vue';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

describe('PermissionSelector', () => {
  it('checks permissions received from the backend', () => {
    const wrapper = mount(PermissionSelector, {
      props: { permissions: ['OE01'] },
      global: { plugins: [i18n] },
    });
    const selectedPills = wrapper.findAll('.permission-pill--selected');
    expect(selectedPills).toHaveLength(1);
    expect(selectedPills[0]?.text()).toContain('permission.actions.fetch');
  });

  it('starts with no selected pills when the employee has no permissions', () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    expect(wrapper.findAll('.permission-pill--selected')).toHaveLength(0);
  });

  it('emits the group all code when its All pill is selected', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    await wrapper.find('.permission-pill').trigger('click');
    const emitted = wrapper.emitted('update:permissions');
    expect(emitted?.at(-1)?.[0]).toEqual(['OE00']);
  });

  it('selects every permission from the organization checkbox', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    await wrapper.find('.permission-module__check input').setValue(true);
    const emitted = wrapper.emitted('update:permissions');
    expect(emitted?.at(-1)?.[0]).toEqual([
      'OE00',
      'OE01',
      'OE02',
      'OE03',
      'OE04',
      'OE05',
      'NP00',
      'NP01',
      'NP02',
      'NP03',
      'NP04',
      'NP05',
    ]);
  });
});

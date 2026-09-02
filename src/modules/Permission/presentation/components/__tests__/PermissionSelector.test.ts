import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PermissionSelector from '../PermissionSelector.vue';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

describe('PermissionSelector', () => {
  it('checks permissions received from the backend', () => {
    const wrapper = mount(PermissionSelector, {
      props: { permissions: ['ADM01'] },
      global: { plugins: [i18n] },
    });
    const selectedPills = wrapper.findAll('.permission-pill--selected');
    expect(selectedPills).toHaveLength(1);
    expect(selectedPills[0]?.text()).toContain('permission.actions.fetch');
  });

  it('starts with no selected pills when the employee has no permissions', () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    expect(wrapper.findAll('.permission-pill--selected')).toHaveLength(0);
    expect(wrapper.text()).not.toContain('permission.actions.all');
  });

  it('selects every group permission from the Select all button', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    await wrapper.find('.permission-group__bulk-actions button').trigger('click');

    const employeeGroup = wrapper.find('.permission-group');
    expect(employeeGroup.findAll('.permission-pill--selected')).toHaveLength(5);

    const emitted = wrapper.emitted('update:permissions');
    expect(emitted?.at(-1)?.[0]).toEqual(['ADM01', 'ADM02', 'ADM03', 'ADM04', 'ADM05']);
  });

  it('clears every group permission from the Clear all button', async () => {
    const wrapper = mount(PermissionSelector, {
      props: { permissions: ['ADM00', 'ADM01', 'ADM02', 'ADM03', 'ADM04', 'ADM05'] },
      global: { plugins: [i18n] },
    });

    await wrapper.findAll('.permission-group__bulk-actions button')[1]?.trigger('click');

    const employeeGroup = wrapper.find('.permission-group');
    expect(employeeGroup.findAll('.permission-pill--selected')).toHaveLength(0);
    expect(wrapper.emitted('update:permissions')?.at(-1)?.[0]).toEqual([]);
  });

  it('selects every supplied permission from the settings checkbox', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    await wrapper.find('.permission-module__check input').setValue(true);
    const selected = wrapper.emitted('update:permissions')?.at(-1)?.[0];

    expect(selected).toHaveLength(180);
    expect(selected).toContain('ADM01');
    expect(selected).toContain('DI10');
    expect(selected).not.toContain('ADM00');
  });

  it('renders and selects the supplied admin permissions', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    const settingsModule = wrapper.findAll('.permission-module')[0];
    const adminGroup = settingsModule?.findAll('.permission-group')[0];

    expect(settingsModule?.findAll('.permission-group')).toHaveLength(39);
    await adminGroup?.find('.permission-group__bulk-actions button').trigger('click');

    expect(wrapper.emitted('update:permissions')?.at(-1)?.[0]).toEqual([
      'ADM01',
      'ADM02',
      'ADM03',
      'ADM04',
      'ADM05',
    ]);
  });
});

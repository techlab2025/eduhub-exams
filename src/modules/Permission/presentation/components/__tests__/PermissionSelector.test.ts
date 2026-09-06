import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import PermissionSelector from '../PermissionSelector.vue';
import { PermissionsEnum } from '../../../core/enums/permissions.enum';
import { createAdminPermissions } from '../../../core/constants/admin.permissions';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

describe('PermissionSelector', () => {
  it('checks permissions received from the backend', () => {
    const wrapper = mount(PermissionSelector, {
      props: { permissions: ['ADM01'] },
      global: { plugins: [i18n] },
    });
    const selectedPills = wrapper.findAll('.permission-pill--selected');
    expect(selectedPills).toHaveLength(1);
    expect(selectedPills[0]?.text()).toContain(en.permission.actions.fetch);
  });

  it('starts with no selected pills when the employee has no permissions', () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    expect(wrapper.findAll('.permission-pill--selected')).toHaveLength(0);
    expect(wrapper.text()).not.toContain('permission.actions.all');
  });

  it('selects every group permission from the Select all button', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    const adminGroup = wrapper.get(`[data-permission-group="${PermissionsEnum.ADMIN_ALL}"]`);
    await adminGroup.find('.permission-group__bulk-actions button').trigger('click');

    expect(adminGroup.findAll('.permission-pill--selected')).toHaveLength(5);

    const emitted = wrapper.emitted('update:permissions');
    expect(emitted?.at(-1)?.[0]).toEqual(['ADM01', 'ADM02', 'ADM03', 'ADM04', 'ADM05']);
  });

  it('clears every group permission from the Clear all button', async () => {
    const wrapper = mount(PermissionSelector, {
      props: { permissions: ['ADM00', 'ADM01', 'ADM02', 'ADM03', 'ADM04', 'ADM05'] },
      global: { plugins: [i18n] },
    });

    const adminGroup = wrapper.get(`[data-permission-group="${PermissionsEnum.ADMIN_ALL}"]`);
    await adminGroup.findAll('.permission-group__bulk-actions button')[1]?.trigger('click');

    expect(adminGroup.findAll('.permission-pill--selected')).toHaveLength(0);
    expect(wrapper.emitted('update:permissions')?.at(-1)?.[0]).toEqual([]);
  });

  it('selects every permission inside one design section', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    const questionsSection = wrapper.get('.permission-module');
    const sectionPermissionCount = questionsSection.findAll('.permission-pill').length;
    await questionsSection.find('.permission-module__check input').setValue(true);
    const selected = wrapper.emitted('update:permissions')?.at(-1)?.[0];

    expect(selected).toHaveLength(sectionPermissionCount);
    expect(selected).toContain(PermissionsEnum.QUESTION_FETCH);
    expect(selected).toContain(PermissionsEnum.GENERATE_QUESTION_ALL);
    expect(selected).not.toContain(PermissionsEnum.ADMIN_FETCH);
  });

  it('renders all permissions across the five design sections', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    const sourceModules = createAdminPermissions();
    const sourceGroups = sourceModules.flatMap((module) => module.permissions);
    const sourcePermissions = sourceGroups.flatMap((group) => group.permissions);
    const renderedGroupCodes = wrapper
      .findAll('[data-permission-group]')
      .map((group) => group.attributes('data-permission-group'))
      .sort();
    const renderedPermissionCodes = wrapper
      .findAll('[data-permission-code]')
      .map((permission) => permission.attributes('data-permission-code'))
      .sort();

    expect(wrapper.findAll('.permission-module')).toHaveLength(5);
    expect(wrapper.findAll('.permission-group')).toHaveLength(sourceGroups.length);
    expect(wrapper.findAll('.permission-pill')).toHaveLength(sourcePermissions.length);
    expect(renderedGroupCodes).toEqual(sourceGroups.map(({ code }) => code).sort());
    expect(renderedPermissionCodes).toEqual(sourcePermissions.map(({ code }) => code).sort());
    expect(wrapper.text()).toContain('Questions');
    expect(wrapper.text()).toContain('Documents');
    expect(wrapper.text()).toContain('Configuration');
    expect(wrapper.text()).toContain('Students Management');
    expect(wrapper.text()).toContain('Plans And Packages');
  });

  it('renders and selects the supplied admin permissions', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    const adminGroup = wrapper.get(`[data-permission-group="${PermissionsEnum.ADMIN_ALL}"]`);

    expect(adminGroup.findAll('.permission-pill')).toHaveLength(5);
    await adminGroup.find('.permission-group__bulk-actions button').trigger('click');

    expect(wrapper.emitted('update:permissions')?.at(-1)?.[0]).toEqual([
      'ADM01',
      'ADM02',
      'ADM03',
      'ADM04',
      'ADM05',
    ]);
  });

  it('opens only the first section initially and closes it when another section opens', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    const sections = wrapper.findAll('.permission-module');
    const sectionBodies = sections.map((section) => section.get('.permission-groups'));

    expect(sections[0]?.get('.permission-module__chevron').attributes('aria-expanded')).toBe(
      'true',
    );
    expect(sectionBodies[0]?.attributes('style') ?? '').not.toContain('display: none');
    sectionBodies.slice(1).forEach((body) => {
      expect(body.attributes('style')).toContain('display: none');
    });

    await sections[1]?.get('.permission-module__chevron').trigger('click');

    expect(sectionBodies[0]?.attributes('style')).toContain('display: none');
    expect(sectionBodies[1]?.attributes('style') ?? '').not.toContain('display: none');
    expect(sections[0]?.get('.permission-module__chevron').attributes('aria-expanded')).toBe(
      'false',
    );
    expect(sections[1]?.get('.permission-module__chevron').attributes('aria-expanded')).toBe(
      'true',
    );
  });

  it('opens and closes section and permission accordions independently', async () => {
    const wrapper = mount(PermissionSelector, { global: { plugins: [i18n] } });
    const section = wrapper.get('.permission-module');
    const sectionBody = section.get('.permission-groups');
    const group = section.get('.permission-group');
    const groupBody = group.get('.permission-group__body');

    await section.get('.permission-module__chevron').trigger('click');
    expect(sectionBody.attributes('style')).toContain('display: none');

    await section.get('.permission-module__chevron').trigger('click');
    await group.get('.permission-group__toggle').trigger('click');
    expect(groupBody.attributes('style')).toContain('display: none');
  });
});

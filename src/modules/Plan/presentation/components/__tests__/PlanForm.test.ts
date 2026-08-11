import { beforeEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PlanForm from '../PlanForm.vue';

const routeMock = vi.hoisted(() => ({
  params: {} as Record<string, string>,
  query: {} as Record<string, string>,
}));

vi.mock('vue-router', () => ({ useRoute: () => routeMock }));

vi.mock('@/modules/HighlightBadge/presentation/controllers/highlightBadge.controller', () => ({
  default: { getInstance: () => ({}) },
}));

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

describe('PlanForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    routeMock.params = {};
    routeMock.query = {};
  });

  it('renders all three sections at the same time', () => {
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    expect(wrapper.findAll('.plan-section')).toHaveLength(3);
    expect(wrapper.find('#plan-basic').exists()).toBe(true);
    expect(wrapper.find('#plan-pricing').exists()).toBe(true);
    expect(wrapper.find('#plan-features').exists()).toBe(true);
  });

  it('uses the section tabs as scroll navigation', async () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    await wrapper.findAll('.plan-tabs button')[2].trigger('click');

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(wrapper.findAll('.plan-tabs button')[2].classes()).toContain('active');
    expect(wrapper.findAll('.plan-section')).toHaveLength(3);
  });

  it('reports that the initial incomplete form cannot be published', () => {
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    expect(wrapper.emitted('validityChange')?.at(-1)).toEqual([false]);
  });

  it('shows required errors and scrolls to the first invalid field on validation', async () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    const isValid = await (
      wrapper.vm as unknown as { validate: () => Promise<boolean> }
    ).validate();

    expect(isValid).toBe(false);
    expect(wrapper.findAll('[data-plan-validation-error]').length).toBeGreaterThan(0);
    expect(wrapper.find('.basic-info-fields [data-plan-validation-error]').exists()).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
  });

  it('accepts one language for both title and description', async () => {
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });
    const translationInputs = wrapper.findAllComponents({ name: 'MultiLangInput' });

    translationInputs[0]?.vm.$emit('update:modelValue', { en: 'English title' });
    translationInputs[1]?.vm.$emit('update:modelValue', { en: 'English description' });
    await wrapper.vm.$nextTick();
    await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate();

    expect(wrapper.text()).not.toContain('plan_title_required');
    expect(wrapper.text()).not.toContain('plan_description_required');
  });

  it('shows and validates only the section selected by the edit query', async () => {
    routeMock.params = { id: '8' };
    routeMock.query = { section: 'pricing' };
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    expect(wrapper.findAll('.plan-section')).toHaveLength(1);
    expect(wrapper.find('#plan-pricing').exists()).toBe(true);
    expect(wrapper.find('#plan-basic').exists()).toBe(false);
    expect(wrapper.find('#plan-features').exists()).toBe(false);
    expect(wrapper.find('.plan-tabs').exists()).toBe(false);
    expect(await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate()).toBe(
      true,
    );
  });

  it.each([
    ['basic', '#plan-basic'],
    ['features', '#plan-features'],
  ])('shows only the %s section for its edit query', (section, selector) => {
    routeMock.params = { id: '8' };
    routeMock.query = { section };
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    expect(wrapper.findAll('.plan-section')).toHaveLength(1);
    expect(wrapper.find(selector).exists()).toBe(true);
    expect(wrapper.find('.plan-tabs').exists()).toBe(false);
  });
});

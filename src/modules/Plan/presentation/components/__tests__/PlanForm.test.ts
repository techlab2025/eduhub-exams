import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PlanForm from '../PlanForm.vue';
import PlanDetailsModel from '../../../core/models/plan.details.model';
import { PlanDurationTypeEnum } from '../../../core/enums/plan.duration.enum';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';

const routeMock = vi.hoisted(() => ({
  params: {} as Record<string, string>,
  query: {} as Record<string, string>,
}));
const fetchPlanFeaturesMock = vi.hoisted(() => vi.fn());

const featureCatalog = [
  {
    id: 1,
    title: 'Report',
    description: 'Detailed student performance reports',
    code: '1',
    subFeatures: [
      {
        id: 2,
        title: 'Show Overall Score',
        description: 'Shows the total assessment score',
        code: '1.1',
        hasLimit: false,
      },
      { id: 3, title: 'Show Skill Analysis', code: '1.2', hasLimit: false },
      { id: 4, title: 'Show Curriculum Analysis', code: '1.3', hasLimit: false },
      { id: 5, title: 'Allow Report Download', code: '1.4', hasLimit: false },
      { id: 6, title: 'Maximum Reports', code: '1.5', hasLimit: true },
      { id: 7, title: 'Maximum Downloads', code: '1.6', hasLimit: true },
    ],
  },
  {
    id: 8,
    title: 'Progress Tracking',
    code: '2',
    subFeatures: [
      { id: 9, title: 'Overall Progress', code: '2.1', hasLimit: false },
      { id: 10, title: 'Needs Focus', code: '2.2', hasLimit: false },
      { id: 11, title: 'Tracked Subjects', code: '2.3', hasLimit: true },
      { id: 12, title: 'Progress History', code: '2.4', hasLimit: true },
    ],
  },
  {
    id: 13,
    title: 'Home Study Schedule',
    code: '3',
    subFeatures: [
      { id: 14, title: 'View Schedule', code: '3.1', hasLimit: false },
      { id: 15, title: 'Set Reminders', code: '3.2', hasLimit: false },
      { id: 16, title: 'Maximum Schedules', code: '3.3', hasLimit: true },
    ],
  },
  {
    id: 17,
    title: 'What Did You Study',
    code: '4',
    subFeatures: [
      { id: 18, title: 'Show Subjects', code: '4.1', hasLimit: false },
      { id: 19, title: 'Maximum Items', code: '4.2', hasLimit: true },
    ],
  },
  {
    id: 20,
    title: 'Learning Resources',
    code: '5',
    subFeatures: [
      { id: 21, title: 'Mind Maps', code: '5.1', hasLimit: false },
      { id: 22, title: 'Flash Cards', code: '5.2', hasLimit: false },
      { id: 23, title: 'Practice Exams', code: '5.3', hasLimit: false },
      { id: 24, title: 'Maximum Mind Maps', code: '5.4', hasLimit: true },
      { id: 25, title: 'Maximum Flash Cards', code: '5.5', hasLimit: true },
    ],
  },
];

vi.mock('vue-router', () => ({ useRoute: () => routeMock }));

vi.mock('@/modules/HighlightBadge/presentation/controllers/highlightBadge.controller', () => ({
  default: { getInstance: () => ({}) },
}));

vi.mock('../../controllers/plan.controller', () => ({
  default: { getInstance: () => ({ fetchFeatures: fetchPlanFeaturesMock }) },
}));

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

describe('PlanForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    routeMock.params = {};
    routeMock.query = {};
    fetchPlanFeaturesMock.mockReset();
    fetchPlanFeaturesMock.mockResolvedValue({ data: featureCatalog });
  });

  it('fetches feature definitions and renders API titles', async () => {
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });
    await flushPromises();

    expect(fetchPlanFeaturesMock).toHaveBeenCalledOnce();
    expect(wrapper.findAll('.feature-card')).toHaveLength(5);
    expect(wrapper.find('.feature-card .feature-copy strong').text()).toBe('Report');
    expect(wrapper.find('.feature-card .feature-description').text()).toBe(
      'Detailed student performance reports',
    );

    wrapper
      .find('.feature-card')
      .findComponent({ name: 'ToggleSwitch' })
      .vm.$emit('update:modelValue', true);
    await wrapper.vm.$nextTick();
    const descriptions = wrapper.findAll('.feature-card .feature-description');
    expect(descriptions[1]?.text()).toBe('Shows the total assessment score');
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

  it('marks required plan fields with red asterisks', async () => {
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });
    const translationFields = wrapper.findAllComponents({ name: 'MultiLangInput' });
    const badgeField = wrapper.getComponent({ name: 'UpdatedCustomInputSelect' });

    expect(translationFields[0]?.element.parentElement?.classList).toContain('required-field');
    expect(translationFields[1]?.element.parentElement?.classList).toContain('required-field');
    expect(badgeField.props('required')).toBe(false);
    expect(wrapper.findAll('.required-marker').length).toBeGreaterThanOrEqual(4);
    expect(wrapper.find('.trial-heading .required-marker').exists()).toBe(false);

    await wrapper.findComponent({ name: 'ToggleSwitch' }).vm.$emit('update:modelValue', true);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.trial-heading .required-marker').exists()).toBe(true);
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

  it('allows basic plan information without highlight badges', async () => {
    routeMock.params = { id: '8' };
    routeMock.query = { section: 'basic' };
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });
    const translationInputs = wrapper.findAllComponents({ name: 'MultiLangInput' });

    translationInputs[0]?.vm.$emit('update:modelValue', { en: 'English title' });
    translationInputs[1]?.vm.$emit('update:modelValue', { en: 'English description' });
    await wrapper.get('#plan-number-of-subjects').setValue(1);

    expect(await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate()).toBe(
      true,
    );
    expect(wrapper.text()).not.toContain('plan_badge_required');
  });

  it('prefills and maps the number of subjects when editing basic information', async () => {
    routeMock.params = { id: '8' };
    routeMock.query = { section: 'basic' };
    const plan = PlanDetailsModel.fromJson({
      id: 8,
      status: 1,
      number_of_subjects: 6,
      title: [{ locale: 'en', title: 'Plan' }],
      description: [{ locale: 'en', description: 'Description' }],
      highlight_badge: [],
      pricing: [],
      features: [],
    });
    const wrapper = shallowMount(PlanForm, {
      props: { plan },
      global: { plugins: [i18n] },
    });

    const input = wrapper.get('#plan-number-of-subjects');
    expect((input.element as HTMLInputElement).value).toBe('6');

    await input.setValue(9);
    const params = wrapper.emitted('updateData')?.at(-1)?.[0] as {
      toMap: () => Record<string, unknown>;
    };

    expect(params.toMap().number_of_subjects).toBe(9);
  });

  it('shows pricing errors below the complete row and defaults duration type to month', async () => {
    routeMock.params = { id: '8' };
    routeMock.query = { section: 'pricing' };
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    expect(wrapper.findAll('.plan-section')).toHaveLength(1);
    expect(wrapper.find('#plan-pricing').exists()).toBe(true);
    expect(wrapper.find('#plan-basic').exists()).toBe(false);
    expect(wrapper.find('#plan-features').exists()).toBe(false);
    expect(wrapper.find('.plan-tabs').exists()).toBe(false);
    expect(await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate()).toBe(
      false,
    );
    expect(wrapper.get('#pricing-0-price-error').text()).toBe('plan_price_required');
    expect(wrapper.get('#pricing-0-duration-error').text()).toBe('plan_duration_required');
    expect(wrapper.get('#pricing-0-price-error').element.parentElement?.classList).toContain(
      'pricing-row-errors',
    );
    expect(wrapper.get('#pricing-0-duration-error').element.parentElement?.classList).toContain(
      'pricing-row-errors',
    );
    expect(wrapper.get('#pricing-0-price').classes()).toContain('field-invalid');
    expect(wrapper.get('#pricing-0-duration').classes()).toContain('field-invalid');
    expect((wrapper.get('#pricing-0-duration-type').element as HTMLSelectElement).value).toBe(
      String(PlanDurationTypeEnum.MONTH),
    );
    expect(wrapper.find('#pricing-0-duration-type-error').exists()).toBe(false);
  });

  it('shows added pricing tiers as removable summary chips', async () => {
    routeMock.params = {};
    routeMock.query = { section: 'pricing' };
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    await wrapper.get('#pricing-0-price').setValue(150);
    await wrapper.get('#pricing-0-duration').setValue(1);
    await wrapper.get('.pricing-action--add').trigger('click');

    expect(wrapper.get('.pricing-chip').text()).toContain('150');
    expect(wrapper.get('.pricing-chip').text()).toContain('1 month');
    expect(wrapper.find('#pricing-1-price').exists()).toBe(true);

    await wrapper.get('.pricing-chip-remove').trigger('click');
    expect(wrapper.find('.pricing-chip').exists()).toBe(false);
    expect(wrapper.find('#pricing-0-price').exists()).toBe(true);
  });

  it('rejects a duplicate price, duration, and duration type combination', async () => {
    routeMock.params = {};
    routeMock.query = { section: 'pricing' };
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    await wrapper.get('#pricing-0-price').setValue(150);
    await wrapper.get('#pricing-0-duration').setValue(1);
    await wrapper.get('.pricing-action--add').trigger('click');
    await wrapper.get('#pricing-1-price').setValue(150);
    await wrapper.get('#pricing-1-duration').setValue(1);
    await wrapper.get('.pricing-action--add').trigger('click');

    expect(wrapper.find('#pricing-2-price').exists()).toBe(false);
    expect(wrapper.get('#pricing-1-duplicate-error').text()).toBe('plan_pricing_duplicate');
    expect(wrapper.get('#pricing-1-price').classes()).toContain('field-invalid');
    expect(wrapper.get('#pricing-1-duration').classes()).toContain('field-invalid');
    expect(wrapper.get('#pricing-1-duration-type').classes()).toContain('field-invalid');
    expect(wrapper.get('#pricing-1-price').attributes('aria-describedby')).toBe(
      'pricing-1-duplicate-error',
    );
    expect(await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate()).toBe(
      false,
    );
  });

  it('accepts a positive price with valid duration values', async () => {
    routeMock.params = { id: '8' };
    routeMock.query = { section: 'pricing' };
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

    await wrapper.get('#pricing-0-price').setValue(50);
    await wrapper.get('#pricing-0-duration').setValue(3);
    await wrapper.get('#pricing-0-duration-type').setValue(PlanDurationTypeEnum.MONTH);

    expect(await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate()).toBe(
      true,
    );
    expect(wrapper.findAll('#plan-pricing [data-plan-validation-error]')).toHaveLength(0);
  });

  it('prevents entering string, negative, or starting with 0 on number inputs', async () => {
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });
    const input = wrapper.get('#plan-number-of-subjects');

    const preventDefaultMock = vi.fn();
    await input.trigger('keydown', { key: '-', preventDefault: preventDefaultMock });
    expect(preventDefaultMock).toHaveBeenCalled();

    preventDefaultMock.mockClear();
    await input.trigger('keydown', { key: 'e', preventDefault: preventDefaultMock });
    expect(preventDefaultMock).toHaveBeenCalled();

    preventDefaultMock.mockClear();
    await input.trigger('keydown', { key: '0', preventDefault: preventDefaultMock });
    expect(preventDefaultMock).toHaveBeenCalled();

    await input.setValue(-5);
    expect((input.element as HTMLInputElement).value).toBe('');

    await input.setValue(0);
    expect((input.element as HTMLInputElement).value).toBe('');

    await input.setValue(10);
    expect((input.element as HTMLInputElement).value).toBe('10');
  });

  it.each([0, -1, 'not-a-number'])(
    'rejects a non-positive or non-numeric price: %s',
    async (price) => {
      routeMock.params = { id: '8' };
      routeMock.query = { section: 'pricing' };
      const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

      await wrapper.get('#pricing-0-price').setValue(price);
      await wrapper.get('#pricing-0-duration').setValue(3);

      expect(await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate()).toBe(
        false,
      );
      expect(wrapper.get('#pricing-0-price-error').text()).toBe('plan_price_required');
      expect(wrapper.get('#pricing-0-price').attributes('aria-invalid')).toBe('true');
    },
  );

  it.each([
    [PlanDurationTypeEnum.DAY, 5, 6],
    [PlanDurationTypeEnum.WEEK, 2, 15],
    [PlanDurationTypeEnum.MONTH, 1, 31],
    [PlanDurationTypeEnum.YEAR, 1, 366],
  ])(
    'blocks trial days longer than pricing duration type %s',
    async (durationType, duration, trialDays) => {
      routeMock.params = { id: '8' };
      routeMock.query = { section: 'pricing' };
      const toastWarningSpy = vi
        .spyOn(dialogManager, 'toastWarning')
        .mockImplementation(() => 'toast-id');
      const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });

      await wrapper.get('#pricing-0-price').setValue(10);
      await wrapper.get('#pricing-0-duration').setValue(duration);
      await wrapper.get('#pricing-0-duration-type').setValue(durationType);
      wrapper.findComponent({ name: 'ToggleSwitch' }).vm.$emit('update:modelValue', true);
      await wrapper.vm.$nextTick();
      await wrapper.get('.trial-section input').setValue(trialDays);

      expect(await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate()).toBe(
        false,
      );
      expect(wrapper.get('#trial-days-error').text()).toBe('plan_trial_days_exceed_duration');
      expect(toastWarningSpy).toHaveBeenCalledWith('plan_trial_days_exceed_duration', {
        title: 'invalid_input_warning_title',
      });
    },
  );

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

  it('mutes unselected features and sub-features only while editing features', async () => {
    routeMock.params = { id: '5' };
    routeMock.query = { section: 'features' };
    const plan = PlanDetailsModel.fromJson({
      id: 2,
      features: [
        {
          feature_type: '1',
          feature_title: [
            { locale: 'ar', title: 'التقارير' },
            { locale: 'en', title: 'Report' },
          ],
          sub_features: [
            { sub_type: '1.1', is_active: true, limit: -1 },
            { sub_type: '1.2', is_active: true, limit: -1 },
            { sub_type: '1.3', is_active: true, limit: -1 },
            { sub_type: '1.4', is_active: true, limit: -1 },
            { sub_type: '1.5', is_active: true, limit: 10 },
            { sub_type: '1.6', is_active: true, limit: 20 },
          ],
        },
        {
          feature_id: 17,
          feature_title: [
            { locale: 'en', title: 'What Did You Study' },
            { locale: 'ar', title: 'ماذا درست؟' },
          ],
          sub_features: [
            { sub_feature_id: 18, is_active: true, limit: -1 },
            { sub_feature_id: 19, is_active: true, limit: 30 },
          ],
        },
        {
          feature_id: 20,
          feature_title: [
            { locale: 'en', title: 'Learning Resources' },
            { locale: 'ar', title: 'مصادر التعلم' },
          ],
          sub_features: [
            { sub_feature_id: 23, is_active: true, limit: -1 },
            { sub_feature_id: 24, is_active: true, limit: 40 },
            { sub_feature_id: 25, is_active: true, limit: 50 },
          ],
        },
      ],
    });
    const wrapper = shallowMount(PlanForm, {
      props: { plan },
      global: { plugins: [i18n] },
    });
    await flushPromises();

    const featureCards = wrapper.findAll('.feature-card');
    expect(featureCards[0]?.classes()).not.toContain('edit-selection-inactive');
    expect(featureCards[1]?.classes()).toContain('edit-selection-inactive');
    expect(featureCards[2]?.classes()).toContain('edit-selection-inactive');
    expect(featureCards[3]?.classes()).not.toContain('edit-selection-inactive');
    expect(featureCards[4]?.classes()).not.toContain('edit-selection-inactive');

    const reportSubFeatures = featureCards[0]?.findAll('.sub-features .feature-row') ?? [];
    expect(reportSubFeatures).toHaveLength(6);
    reportSubFeatures.forEach((subFeature) => {
      expect(subFeature.classes()).not.toContain('edit-selection-inactive');
    });
    expect((reportSubFeatures[4]?.get('input').element as HTMLInputElement).value).toBe('10');
    expect((reportSubFeatures[5]?.get('input').element as HTMLInputElement).value).toBe('20');

    const learningSubFeatures = featureCards[4]?.findAll('.sub-features .feature-row') ?? [];
    expect(learningSubFeatures[0]?.classes()).toContain('edit-selection-inactive');
    expect(learningSubFeatures[1]?.classes()).toContain('edit-selection-inactive');
    expect(learningSubFeatures[2]?.classes()).not.toContain('edit-selection-inactive');
    expect(reportSubFeatures[4]?.classes()).not.toContain('edit-selection-inactive');

    const progressSubFeatures = featureCards[1]?.findAll('.sub-features .feature-row') ?? [];
    expect((progressSubFeatures[2]?.get('input').element as HTMLInputElement).value).toBe('0');
    await progressSubFeatures[2]?.get('input').setValue(12);
    expect(progressSubFeatures[2]?.classes()).not.toContain('edit-selection-inactive');

    await reportSubFeatures[4]?.get('input').setValue(0);
    expect(reportSubFeatures[4]?.classes()).toContain('edit-selection-inactive');

    featureCards[1]?.findComponent({ name: 'ToggleSwitch' }).vm.$emit('update:modelValue', true);
    await wrapper.vm.$nextTick();
    expect(featureCards[1]?.classes()).not.toContain('edit-selection-inactive');
  });

  it('requires at least one sub-feature for each enabled feature', async () => {
    routeMock.params = { id: '8' };
    routeMock.query = { section: 'features' };
    const wrapper = shallowMount(PlanForm, { global: { plugins: [i18n] } });
    await flushPromises();
    const firstFeature = wrapper.findAll('.feature-card')[0];

    firstFeature?.findComponent({ name: 'ToggleSwitch' }).vm.$emit('update:modelValue', true);
    await wrapper.vm.$nextTick();

    const limitInput = firstFeature?.findAll('input.feature-limit')[0];
    expect((limitInput?.element as HTMLInputElement).value).toBe('0');

    expect(await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate()).toBe(
      false,
    );
    expect(wrapper.find('.feature-limit-error').exists()).toBe(false);
    expect(wrapper.get('.feature-sub-feature-error').text()).toBe('plan_sub_feature_required');

    const latestParams = wrapper.emitted('updateData')?.at(-1)?.[0] as {
      toMap: () => Record<string, unknown>;
    };
    const payload = latestParams.toMap();
    expect(payload.features).toBeUndefined();

    await limitInput?.setValue(1);
    expect(await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate()).toBe(
      true,
    );
    expect(wrapper.find('.feature-sub-feature-error').exists()).toBe(false);
    const updatedParams = wrapper.emitted('updateData')?.at(-1)?.[0] as {
      toMap: () => Record<string, unknown>;
    };
    const updatedFeatures = updatedParams.toMap().features as Array<{
      feature_type: string;
      feature_sub_type: Array<{ sub_type: string; limit?: number }>;
    }>;

    expect(updatedFeatures[0]?.feature_type).toBe('1');
    expect(updatedFeatures[0]?.feature_sub_type).toContainEqual({ sub_type: '1.5', limit: 1 });
  });
});

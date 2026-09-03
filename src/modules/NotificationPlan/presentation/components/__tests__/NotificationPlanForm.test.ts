import { flushPromises, shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import TitleInterface from '@/base/Data/Models/titleInterface';
import en from '@/locales/en.json';
import { NotificationPlanActions } from '../../../core/constants/NotificationPlanActions';
import { NotificationPlanQuestionActionEnum } from '../../../core/enums/notification.plan.question.enum';
import NotificationPlanModel from '../../../core/models/notification.plan.model';
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
import NotificationPlanForm from '../NotificationPlanForm.vue';

const mountForm = (plan?: NotificationPlanModel) =>
  shallowMount(NotificationPlanForm, {
    props: { plan },
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: 'en',
          messages: { en },
        }),
      ],
    },
  });

describe('NotificationPlanForm', () => {
  it('renders the create layout from the notification-plan design', () => {
    const wrapper = mountForm();

    expect(wrapper.find('h1').text()).toBe('Create notification plan');
    expect(wrapper.find('.notification-plan-card--details').exists()).toBe(true);
    expect(wrapper.find('.notification-plan-triggers').exists()).toBe(true);
    expect(wrapper.findAll('.notification-plan-feature__header')).toHaveLength(
      NotificationPlanActions.length,
    );
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(
      NotificationPlanActions[0]?.sub_feature[0]?.actions.length,
    );
    expect(wrapper.findAll('.notification-plan-checkbox').map((item) => item.text())).toEqual(
      expect.arrayContaining([
        'Add Question',
        'Approve Question',
        'Reject Question',
        'Edit Question',
      ]),
    );
    expect(wrapper.findAll('.notification-plan-radio-card')).toHaveLength(2);
  });

  it('opens and closes feature and sub-feature accordions', async () => {
    const wrapper = mountForm();
    const featureHeaders = wrapper.findAll('.notification-plan-feature__header');

    expect(wrapper.findAll('.notification-plan-action')).toHaveLength(3);
    await featureHeaders[0]?.trigger('click');
    expect(wrapper.findAll('.notification-plan-action')).toHaveLength(0);

    await featureHeaders[0]?.trigger('click');
    await wrapper.findAll('.notification-plan-action__header')[1]?.trigger('click');
    expect(wrapper.find('.notification-plan-action__empty').text()).toBe(
      'No notification actions are configured for this section yet.',
    );

    await featureHeaders[1]?.trigger('click');
    expect(wrapper.findAll('.notification-plan-action')).toHaveLength(0);
    expect(wrapper.find('.notification-plan-action__empty').exists()).toBe(true);
  });

  it('emits the supported API payload and validates completed fields', async () => {
    const wrapper = mountForm();
    const employee = new TitleInterface({ id: 8, title: 'Ahmed Hawam' });

    await wrapper.find('input[type="text"]').setValue('Question activity alerts');
    wrapper.getComponent(UpdatedCustomInputSelect).vm.$emit('update:modelValue', [employee]);
    await wrapper.find('input[type="checkbox"]').setValue(true);
    await flushPromises();

    expect((wrapper.vm as unknown as { validate: () => boolean }).validate()).toBe(true);
    expect(wrapper.emitted('updateData')?.at(-1)?.[0]).toMatchObject({
      title: 'Question activity alerts',
      employeeIds: [8],
      actionValues: [
        {
          action: NotificationPlanQuestionActionEnum.Add_Question,
          sub_action: null,
        },
      ],
      isActive: true,
    });
    expect(wrapper.find('.notification-plan-template').exists()).toBe(true);
  });

  it('edits free message text while keeping system values locked', async () => {
    const wrapper = mountForm();
    const employee = new TitleInterface({ id: 8, title: 'Ahmed Hawam' });

    wrapper.getComponent(UpdatedCustomInputSelect).vm.$emit('update:modelValue', [employee]);
    await wrapper.find('input[type="checkbox"]').setValue(true);
    await wrapper.find('.notification-plan-template__edit').trigger('click');

    expect(wrapper.findAll('.notification-plan-template__token')).toHaveLength(3);
    const editableInputs = wrapper.findAll('.notification-plan-template__editor input');
    expect(editableInputs).toHaveLength(4);
    expect(editableInputs.some((input) => input.element.value === 'Ahmed Hawam')).toBe(false);

    await editableInputs[0]?.setValue('Alert:');
    await editableInputs[3]?.setValue('Review it now.');
    await wrapper.find('.notification-plan-template__save').trigger('click');

    expect(wrapper.find('.notification-plan-template__display').text()).toBe(
      'Alert: Ahmed Hawam has Add Question Questions Review it now.',
    );
  });

  it('uses edit copy and pre-fills an existing plan', async () => {
    const wrapper = mountForm(
      NotificationPlanModel.fromJson({
        notification_plan_id: 12,
        title: 'Document updates',
        is_active: false,
        actions: [
          {
            value: NotificationPlanQuestionActionEnum.Add_Question,
            label: 'Add Question',
            displayed_message:
              'Updated: Sara Ali has Add Question Questions. Please review the latest change.',
          },
        ],
        employees: [{ id: 4, name: 'Sara Ali' }],
      }),
    );
    await flushPromises();

    expect(wrapper.find('h1').text()).toBe('Edit notification plan');
    expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe(
      'Document updates',
    );
    expect(wrapper.findAll('input[type="radio"]')[1]?.element).toMatchObject({
      checked: true,
    });
    expect(wrapper.find('.notification-plan-template__display').text()).toBe(
      'Updated: Sara Ali has Add Question Questions. Please review the latest change.',
    );

    await wrapper.find('.notification-plan-template__edit').trigger('click');
    expect(
      (wrapper.findAll('.notification-plan-template__editor input')[0]?.element as HTMLInputElement)
        .value,
    ).toBe('Updated:');
  });
});

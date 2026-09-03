import { NotificationPlanQuestionActionEnum } from '../enums/notification.plan.question.enum';

type NotificationPlanTranslationKey = `notification_plan.${string}`;

export interface NotificationPlanActionDefinition {
  readonly action_title: NotificationPlanTranslationKey;
  readonly action_id: number;
}

export interface NotificationPlanSubFeatureDefinition {
  readonly id: string;
  readonly sub_feature_title: NotificationPlanTranslationKey;
  readonly sub_feature_description: NotificationPlanTranslationKey;
  readonly message: NotificationPlanTranslationKey;
  readonly actions: readonly NotificationPlanActionDefinition[];
}

export interface NotificationPlanFeatureDefinition {
  readonly id: string;
  readonly feature_title: NotificationPlanTranslationKey;
  readonly sub_feature: readonly NotificationPlanSubFeatureDefinition[];
}

export const NotificationPlanActions = [
  {
    id: 'questions',
    feature_title: 'notification_plan.features.questions',
    sub_feature: [
      {
        id: 'question-control',
        sub_feature_title: 'notification_plan.form.question_control',
        sub_feature_description: 'notification_plan.form.trigger_item_description',
        message: 'notification_plan.form.template_suffix',
        actions: [
          {
            action_title: 'notification_plan.actions.add_question',
            action_id: NotificationPlanQuestionActionEnum.Add_Question,
          },
          {
            action_title: 'notification_plan.actions.approve_question',
            action_id: NotificationPlanQuestionActionEnum.Approve_Question,
          },
          {
            action_title: 'notification_plan.actions.reject_question',
            action_id: NotificationPlanQuestionActionEnum.Reject_Question,
          },
          {
            action_title: 'notification_plan.actions.edit_question',
            action_id: NotificationPlanQuestionActionEnum.Edit_Question,
          },
        ],
      },
      {
        id: 'generate-questions',
        sub_feature_title: 'notification_plan.form.generate_questions',
        sub_feature_description: 'notification_plan.form.trigger_item_description',
        message: 'notification_plan.form.template_suffix',
        actions: [],
      },
      {
        id: 'question-batches',
        sub_feature_title: 'notification_plan.form.question_batches',
        sub_feature_description: 'notification_plan.form.trigger_item_description',
        message: 'notification_plan.form.template_suffix',
        actions: [],
      },
    ],
  },
  {
    id: 'documents',
    feature_title: 'notification_plan.features.documents',
    sub_feature: [],
  },
] as const satisfies readonly NotificationPlanFeatureDefinition[];

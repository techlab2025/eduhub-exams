import { describe, expect, it } from 'vitest';
import { NotificationPlanQuestionActionEnum } from '../../enums/notification.plan.question.enum';
import { NotificationPlanActions } from '../NotificationPlanActions';

describe('NotificationPlanActions', () => {
  it('includes the configured notification trigger hierarchy', () => {
    expect(NotificationPlanActions.map(({ id }) => id)).toEqual(
      expect.arrayContaining(['questions', 'documents']),
    );
    expect(
      NotificationPlanActions.find(({ id }) => id === 'questions')?.sub_feature.map(({ id }) => id),
    ).toEqual(
      expect.arrayContaining(['question-control', 'generate-questions', 'question-batches']),
    );
  });

  it('maps question-control actions to their API values', () => {
    const questions = NotificationPlanActions.find(({ id }) => id === 'questions');
    const questionControl = questions?.sub_feature.find(({ id }) => id === 'question-control');

    expect(questionControl?.actions.map(({ action_id }) => action_id)).toEqual(
      expect.arrayContaining([
        NotificationPlanQuestionActionEnum.Add_Question,
        NotificationPlanQuestionActionEnum.Approve_Question,
        NotificationPlanQuestionActionEnum.Reject_Question,
        NotificationPlanQuestionActionEnum.Edit_Question,
      ]),
    );
  });
});

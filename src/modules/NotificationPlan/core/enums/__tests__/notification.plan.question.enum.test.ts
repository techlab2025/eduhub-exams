import { describe, expect, it } from 'vitest';
import { NotificationPlanQuestionActionEnum } from '../notification.plan.question.enum';

describe('NotificationPlanQuestionActionEnum', () => {
  it('exposes the supported question action values', () => {
    expect(NotificationPlanQuestionActionEnum).toMatchObject({
      Add_Question: 1,
      Approve_Question: 2,
      Reject_Question: 3,
      Edit_Question: 4,
    });
  });
});

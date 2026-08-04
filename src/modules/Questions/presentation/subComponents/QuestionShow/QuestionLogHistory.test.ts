import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
import type QuestionHistoryModel from '@/modules/Questions/core/models/question.history.model';
import QuestionLogHistory from './QuestionLogHistory.vue';

const passthroughStub = { template: '<div><slot /></div>' };

const mountComponent = (status: QuestionStatusEnum) =>
  mount(QuestionLogHistory, {
    props: {
      logs: [
        {
          questionId: 1,
          status: { value: status, name: 'Status' },
          caretedAt: '2026-08-04',
          employee: { name: 'Reviewer' },
        } as QuestionHistoryModel,
      ],
    },
    global: {
      stubs: {
        Accordion: passthroughStub,
        AccordionPanel: passthroughStub,
        AccordionHeader: passthroughStub,
        AccordionContent: passthroughStub,
      },
    },
  });

describe('QuestionLogHistory', () => {
  it.each([
    [QuestionStatusEnum.CREATED, 'status-created'],
    [QuestionStatusEnum.APPROVED, 'status-approved'],
    [QuestionStatusEnum.REJECTED, 'status-rejected'],
    [QuestionStatusEnum.DRAFT, 'status-draft'],
    [QuestionStatusEnum.NOT_REVIEW, 'status-not-reviewed'],
    [QuestionStatusEnum.ARCHIVED, 'status-archived'],
    [QuestionStatusEnum.REVISION, 'status-revision'],
  ])('uses the enum color class for status %s', (status, className) => {
    const wrapper = mountComponent(status);

    expect(wrapper.get('.log-date').classes()).toContain(className);
    expect(wrapper.get('.log-content h4').classes()).toContain(className);
  });
});

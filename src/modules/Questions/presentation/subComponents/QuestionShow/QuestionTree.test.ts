import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import QuestionTree from './QuestionTree.vue';

describe('QuestionTree', () => {
  it('renders the subject path, sequence, document, and skills', () => {
    const questionData = {
      subjectTree: { title: 'Physics', full_title: 'Science -> Physics' },
      sequenceTree: { title: 'Mechanics', children: [{ id: 2, title: 'Motion' }] },
      questionDocuments: [{ title: 'Reference', source: 'Chapter 1' }],
      skills: [{ id: 3, skill: 'Reasoning' }],
    } as ShowQuestionsModel;

    const wrapper = mount(QuestionTree, {
      props: { questionData },
      global: {
        stubs: {
          Arrow: true,
          Articlearrow: true,
          NextStepIcon: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Science');
    expect(wrapper.text()).toContain('Physics');
    expect(wrapper.text()).toContain('Mechanics');
    expect(wrapper.text()).toContain('Motion');
    expect(wrapper.text()).toContain('Reference');
    expect(wrapper.text()).toContain('Chapter 1');
    expect(wrapper.text()).toContain('Reasoning');
  });
});

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ArticleQuestionCreateDialog from '../ArticleQuestionCreateDialog.vue';

const global = {
  stubs: {
    Dialog: {
      props: ['visible'],
      template: '<div v-if="visible"><slot name="header" /><slot /></div>',
    },
    QuestionsAdd: {
      name: 'QuestionsAdd',
      props: {
        embedded: Boolean,
        articleId: Number,
        subjectId: Number,
        sequenceId: Number,
      },
      emits: ['saved', 'close'],
      template: '<div class="questions-add-stub" />',
    },
  },
  mocks: { $t: (key: string) => key },
};

describe('ArticleQuestionCreateDialog', () => {
  it('passes article configuration to the embedded question form', () => {
    const wrapper = mount(ArticleQuestionCreateDialog, {
      props: { visible: true, articleId: 42, subjectId: 17, sequenceId: 18 },
      global,
    });

    expect(wrapper.getComponent({ name: 'QuestionsAdd' }).props()).toMatchObject({
      embedded: true,
      articleId: 42,
      subjectId: 17,
      sequenceId: 18,
    });
  });

  it('closes and emits saved after question creation', () => {
    const wrapper = mount(ArticleQuestionCreateDialog, {
      props: { visible: true, articleId: 42 },
      global,
    });

    wrapper.getComponent({ name: 'QuestionsAdd' }).vm.$emit('saved');

    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
    expect(wrapper.emitted('saved')).toHaveLength(1);
  });
});

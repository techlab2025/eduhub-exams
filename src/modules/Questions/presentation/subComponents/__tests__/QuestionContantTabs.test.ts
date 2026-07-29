import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import QuestionContantTabs from '../QuestionContantTabs.vue';
import ShowQuestionsModel from '../../../core/models/show.questions.model';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
const fetchFullSubjectTree = vi.hoisted(() => vi.fn());
const fetchTopics = vi.hoisted(() => vi.fn());

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' },
    query: {},
  }),
}));

vi.mock('../../../presentation/controllers/FullSubjectTree/full.subject.tree.controller', () => ({
  default: {
    getInstance: () => ({
      fetchList: fetchFullSubjectTree,
    }),
  },
}));

vi.mock(
  '@/modules/EducationClassification/presentation/controllers/EducationTopics/education.topics.controller',
  () => ({
    default: {
      getInstance: () => ({
        listData: { value: [] },
        fetchList: fetchTopics,
      }),
    },
  }),
);

vi.mock('@/modules/Skills/presentation/controllers/skills.controller', () => ({
  default: {
    getInstance: () => ({
      listData: { value: [] },
    }),
  },
}));

vi.mock('@/modules/Stages/presentation/controllers/stage.controller', () => ({
  default: {
    getInstance: () => ({
      listData: { value: [] },
      fetchList: vi.fn(),
    }),
  },
}));

const globalConfig = {
  plugins: [createPinia(), i18n],
  stubs: {
    UpdatedCustomInputSelect: true,
  },
  mocks: {
    $t: (msg: string) => msg,
  },
};

describe('QuestionContantTabs.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    fetchFullSubjectTree.mockResolvedValue({
      data: [
        {
          id: 284,
          e_c_subject_id: 284,
          title: 'mostafa 2',
          full_title: 'mostafa 1 -> mostafa 2',
          children: [],
        },
        {
          id: 285,
          e_c_subject_id: 285,
          title: 'mostafa 3',
          full_title: 'mostafa 1 -> mostafa 3',
          children: [],
        },
      ],
    });
    fetchTopics.mockResolvedValue({
      data: [{ id: 20, title: 'Topic 1' }],
    });
  });

  it('renders correctly', () => {
    const mockContentData = new ShowQuestionsModel({
      id: 1,
      questionTitle: 'Test Question',
      difficulty: 1,
      topics: [],
      skills: [],
      subjectTree: { id: 1, title: 'Branch' },
      sequenceTree: { id: 2, title: 'Sequence' },
    });

    const wrapper = mount(QuestionContantTabs, {
      props: {
        ContentData: mockContentData,
      },
      global: globalConfig,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('shows returned root subjects in the question sequence options', async () => {
    const wrapper = mount(QuestionContantTabs, {
      props: {
        ContentData: new ShowQuestionsModel({
          id: 1,
          questionTitle: 'Test Question',
          difficulty: 1,
          topics: [],
          skills: [],
          subjectTree: { id: 1, title: 'Branch' },
          sequenceTree: { id: 2, title: 'Sequence' },
        }),
      },
      global: globalConfig,
    });

    wrapper.findComponent('#doc-branch').vm.$emit('update:modelValue', {
      id: 10,
      title: 'mostafa 1',
    });
    await flushPromises();

    expect(wrapper.findComponent('#question-sequence').props('staticOptions')).toEqual([
      expect.objectContaining({ id: 284, title: 'mostafa 1 -> mostafa 2' }),
      expect.objectContaining({ id: 285, title: 'mostafa 1 -> mostafa 3' }),
    ]);
  });

  it('clears dependent selections when a parent selection changes or is removed', async () => {
    const wrapper = mount(QuestionContantTabs, {
      props: {
        ContentData: new ShowQuestionsModel({
          id: 1,
          questionTitle: 'Test Question',
          difficulty: 1,
          topics: [],
          skills: [],
          subjectTree: { id: 1, title: 'Branch' },
          sequenceTree: { id: 2, title: 'Sequence' },
        }),
      },
      global: globalConfig,
    });

    const branchSelect = wrapper.findComponent('#doc-branch');
    const sequenceSelect = wrapper.findComponent('#question-sequence');
    const topicsSelect = wrapper.findComponent('#topics');

    sequenceSelect.vm.$emit('update:modelValue', { id: 284, title: 'Sequence 1' });
    await flushPromises();
    expect(topicsSelect.props('staticOptions')).toEqual([
      expect.objectContaining({ id: 20, title: 'Topic 1' }),
    ]);
    topicsSelect.vm.$emit('update:modelValue', [{ id: 20, title: 'Topic 1' }]);

    branchSelect.vm.$emit('update:modelValue', { id: 11, title: 'Another subject' });
    await flushPromises();

    expect(sequenceSelect.props('modelValue')).toBeNull();
    expect(topicsSelect.props('modelValue')).toEqual([]);
    expect(topicsSelect.props('staticOptions')).toEqual([]);

    topicsSelect.vm.$emit('update:modelValue', [{ id: 21, title: 'Topic 2' }]);
    sequenceSelect.vm.$emit('update:modelValue', { id: 285, title: 'Sequence 2' });
    await flushPromises();
    expect(topicsSelect.props('modelValue')).toEqual([]);

    topicsSelect.vm.$emit('update:modelValue', [{ id: 22, title: 'Topic 3' }]);
    const topicFetchCalls = fetchTopics.mock.calls.length;
    sequenceSelect.vm.$emit('update:modelValue', null);
    await flushPromises();
    expect(fetchTopics).toHaveBeenCalledTimes(topicFetchCalls);
    expect(topicsSelect.props('modelValue')).toEqual([]);
    expect(topicsSelect.props('staticOptions')).toEqual([]);

    const subjectFetchCalls = fetchFullSubjectTree.mock.calls.length;
    branchSelect.vm.$emit('update:modelValue', null);
    await flushPromises();
    expect(fetchFullSubjectTree).toHaveBeenCalledTimes(subjectFetchCalls);
    expect(sequenceSelect.props('modelValue')).toBeNull();
    expect(topicsSelect.props('modelValue')).toEqual([]);
    expect(sequenceSelect.props('staticOptions')).toEqual([]);
    expect(topicsSelect.props('staticOptions')).toEqual([]);
  });
});

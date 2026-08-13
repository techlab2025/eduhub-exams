import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
import questionsAdd from '../questionsAdd.vue';

const createMock = vi.hoisted(() => vi.fn());
const routerPushMock = vi.hoisted(() => vi.fn());
const routerBackMock = vi.hoisted(() => vi.fn());
const routeLeaveRegistrationMock = vi.hoisted(() => vi.fn());

// Mock dependencies
vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
    replace: vi.fn(),
  },
}));

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: routeLeaveRegistrationMock,
  useRoute: vi.fn(() => ({
    fullPath: '/eg/questions/add',
  })),
  useRouter: vi.fn(() => ({
    push: routerPushMock,
    back: routerBackMock,
  })),
}));

vi.mock('../../controllers/questions.controller', () => ({
  default: {
    getInstance: () => ({
      create: createMock,
      errorMessage: { value: '' },
    }),
  },
}));

const globalConfig = {
  plugins: [createPinia()],
  stubs: {
    questionsForm: {
      name: 'questionsForm',
      props: ['articleId', 'subjectId', 'sequenceId'],
      template: '<div class="questions-form-stub" />',
    },
    WithReviewDialog: {
      name: 'WithReviewDialog',
      props: ['saveStatus'],
      emits: ['with-review', 'without-review'],
      template: `
        <div :data-save-status="saveStatus">
          <button class="with-review" @click="$emit('with-review')">with review</button>
          <button class="without-review" @click="$emit('without-review')">without review</button>
        </div>
      `,
    },
    CancelQuestionDialog: {
      template: '<button class="btn-cancel">cancel</button>',
    },
    UnsavedQuestionChangesDialog: {
      name: 'UnsavedQuestionChangesDialog',
      props: ['visible'],
      emits: ['update:visible', 'discard', 'stay'],
      template: `
        <div v-if="visible" class="unsaved-dialog">
          <button class="discard" @click="$emit('discard')">discard</button>
          <button class="stay" @click="$emit('stay')">stay</button>
        </div>
      `,
    },
    AppButton: true,
    IconAccept: true,
  },
  mocks: {
    $t: (msg: string) => msg,
  },
};

describe('questionsAdd.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(questionsAdd, { global: globalConfig });
    expect(wrapper.exists()).toBe(true);
  });

  it('contains the "Save Employee" button', () => {
    const wrapper = mount(questionsAdd, { global: globalConfig });
    const saveButton = wrapper.find('.save-emp');
    expect(saveButton.exists()).toBe(true);
  });

  it('contains the "Save As draft" button', () => {
    const wrapper = mount(questionsAdd, { global: globalConfig });
    const draftButton = wrapper.find('.btn-draft');
    expect(draftButton.exists()).toBe(true);
  });

  it('contains the "cancel" button', () => {
    const wrapper = mount(questionsAdd, { global: globalConfig });
    const cancelButton = wrapper.find('.btn-cancel');
    expect(cancelButton.exists()).toBe(true);
  });

  it.each([
    { saveStatus: 1, label: 'Save' },
    { saveStatus: 2, label: 'Save & New' },
  ])('does not navigate when $label returns no result', async ({ saveStatus }) => {
    createMock.mockResolvedValueOnce(undefined);
    const wrapper = mount(questionsAdd, { global: globalConfig });
    wrapper.findComponent({ name: 'questionsForm' }).vm.$emit('update-data', { parentId: 1 });

    await wrapper.get(`[data-save-status="${saveStatus}"] .without-review`).trigger('click');
    await flushPromises();

    expect(createMock).toHaveBeenCalledOnce();
    expect(routerPushMock).not.toHaveBeenCalled();
    expect(routerBackMock).not.toHaveBeenCalled();
  });

  it('navigates after Save returns a successful result', async () => {
    createMock.mockResolvedValueOnce(new DataSuccess({ data: {} }));
    const wrapper = mount(questionsAdd, { global: globalConfig });
    wrapper.findComponent({ name: 'questionsForm' }).vm.$emit('update-data', { parentId: 1 });

    await wrapper.get('[data-save-status="1"] .without-review').trigger('click');
    await flushPromises();

    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Article questions',
      params: { artical_id: 1 },
    });
  });

  it('emits saved without routing when embedded in the article dialog', async () => {
    createMock.mockResolvedValueOnce(new DataSuccess({ data: {} }));
    const wrapper = mount(questionsAdd, {
      props: { embedded: true, articleId: 42 },
      global: globalConfig,
    });
    const params = { parentId: 42, status: QuestionStatusEnum.NOT_REVIEW };
    wrapper.findComponent({ name: 'questionsForm' }).vm.$emit('update-data', params);

    await wrapper.get('.embedded-save-button').trigger('click');
    await flushPromises();

    expect(params.status).toBeUndefined();
    expect(createMock).toHaveBeenCalledWith(params, undefined, '/eg/questions/add');
    expect(wrapper.emitted('saved')).toHaveLength(1);
    expect(routerPushMock).not.toHaveBeenCalled();
    expect(routerBackMock).not.toHaveBeenCalled();
  });

  it('passes the article subject and sequence into the embedded question form', () => {
    const wrapper = mount(questionsAdd, {
      props: { embedded: true, articleId: 42, subjectId: 290, sequenceId: 304 },
      global: globalConfig,
    });

    expect(wrapper.findComponent({ name: 'questionsForm' }).props()).toMatchObject({
      articleId: 42,
      subjectId: 290,
      sequenceId: 304,
    });
  });

  it('shows direct Save and Cancel actions without review choices when embedded', () => {
    const wrapper = mount(questionsAdd, {
      props: { embedded: true, articleId: 42 },
      global: globalConfig,
    });

    expect(wrapper.find('.embedded-save-button').exists()).toBe(true);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'WithReviewDialog' }).exists()).toBe(false);
  });

  it('does not navigate when saving a draft returns no result', async () => {
    createMock.mockResolvedValueOnce(undefined);
    const wrapper = mount(questionsAdd, { global: globalConfig });
    wrapper.findComponent({ name: 'questionsForm' }).vm.$emit('update-data', { parentId: 1 });

    await wrapper.get('.btn-draft').trigger('click');
    await flushPromises();

    expect(routerPushMock).not.toHaveBeenCalled();
    expect(routerBackMock).not.toHaveBeenCalled();
  });

  it('blocks route navigation until unsaved changes are discarded', async () => {
    const wrapper = mount(questionsAdd, { global: globalConfig });
    await flushPromises();
    wrapper.findComponent({ name: 'questionsForm' }).vm.$emit('update-data', {
      toMap: () => ({ question: 'Changed question' }),
    });
    await flushPromises();

    const guard = routeLeaveRegistrationMock.mock.calls.at(-1)?.[0];
    const stayResult = guard();
    await wrapper.vm.$nextTick();
    await wrapper.get('.unsaved-dialog .stay').trigger('click');
    expect(await stayResult).toBe(false);

    const discardResult = guard();
    await wrapper.vm.$nextTick();
    await wrapper.get('.unsaved-dialog .discard').trigger('click');
    expect(await discardResult).toBe(true);
  });
});

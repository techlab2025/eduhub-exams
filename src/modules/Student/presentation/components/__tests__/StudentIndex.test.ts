import { flushPromises, shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Component from '../StudentIndex.vue';

const mocks = vi.hoisted(() => ({
  fetchList: vi.fn().mockResolvedValue(undefined),
  fetchOne: vi.fn().mockResolvedValue(undefined),
  fetchStats: vi.fn().mockResolvedValue(undefined),
  changeStatus: vi.fn().mockResolvedValue(undefined),
  forceLogout: vi.fn().mockResolvedValue(undefined),
  addNote: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('../../controllers/student.controller', () => ({
  default: {
    getInstance: () => ({
      listState: { value: {} },
      stats: { value: null },
      pagination: { value: null },
      fetchList: mocks.fetchList,
      fetchOne: mocks.fetchOne,
      fetchStats: mocks.fetchStats,
      changeStatus: mocks.changeStatus,
      forceLogout: mocks.forceLogout,
      addNote: mocks.addNote,
    }),
  },
}));

vi.mock(
  '@/modules/EducationClassification/presentation/controllers/educationClassification.controller',
  () => ({ default: { getInstance: () => ({}) } }),
);

vi.mock('@/modules/Plan/presentation/controllers/plan.controller', () => ({
  default: { getInstance: () => ({}) },
}));

const defaultStubs = {
  DataStatusBuilder: true,
  FilterDialog: true,
  UpdatedCustomInputSelect: true,
  Pagination: true,
};

describe('StudentIndex', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches the student list and statistics on mount', async () => {
    shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: defaultStubs,
      },
    });

    await flushPromises();

    expect(mocks.fetchList).toHaveBeenCalledOnce();
    expect(mocks.fetchList.mock.calls[0][0].toMap()).toMatchObject({
      page: 1,
      per_page: 10,
      with_pagination: 1,
    });
    expect(mocks.fetchStats).toHaveBeenCalledOnce();
  });

  it('requests archived students when the archive tab is selected', async () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: defaultStubs,
      },
    });
    await flushPromises();
    mocks.fetchList.mockClear();

    await wrapper.findAll('.student-mode-tabs button')[1].trigger('click');
    await flushPromises();

    expect(mocks.fetchList).toHaveBeenCalledOnce();
    expect(mocks.fetchList.mock.calls[0][0].toMap()).toMatchObject({ status: '2' });
  });

  it('opens the archive dialog and confirms archiving an active student', async () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: `
              <slot
                name="success"
                :data="[{
                  id: 7,
                  name: 'Ahmed',
                  image: '',
                  status: '1',
                  educationType: null,
                  educationStage: null,
                  grade: null,
                  currentPlan: null
                }]"
              />
            `,
          },
          AppTable: {
            props: ['items'],
            template: '<div><slot name="actions" :item="items[0]" /></div>',
          },
          DropList: {
            props: ['actionList', 'variant'],
            template: `
              <div class="actions-stub" :data-variant="variant">
                <span v-for="action in actionList" :key="action.text">{{ action.text }}</span>
                <button class="archive-action" @click="actionList[1].action()">archive</button>
                <button class="block-action" @click="actionList[4].action()">block</button>
              </div>
            `,
          },
          StudentArchiveDialog: {
            props: ['modelValue'],
            emits: ['confirm'],
            template: `
              <button v-if="modelValue" class="archive-dialog-confirm" @click="$emit('confirm')">
                confirm archive
              </button>
            `,
          },
          StudentBlockDialog: {
            props: ['modelValue'],
            emits: ['confirm'],
            template: `
              <button v-if="modelValue" class="block-dialog-confirm" @click="$emit('confirm')">
                confirm block
              </button>
            `,
          },
          FilterDialog: true,
          UpdatedCustomInputSelect: true,
          Pagination: true,
        },
      },
    });

    expect(wrapper.find('.actions-stub').attributes('data-variant')).toBe('student');
    expect(wrapper.find('.actions-stub').text()).toContain('viewarchiveadd_noteforce_logoutblock');

    await wrapper.find('.archive-action').trigger('click');
    await flushPromises();

    expect(wrapper.find('.archive-dialog-confirm').exists()).toBe(true);
    expect(mocks.changeStatus).not.toHaveBeenCalled();

    await wrapper.find('.archive-dialog-confirm').trigger('click');
    await flushPromises();

    expect(mocks.changeStatus).toHaveBeenCalledOnce();
    expect(mocks.changeStatus.mock.calls[0][0].toMap()).toEqual({
      student_id: 7,
      status: '2',
      block_reason: undefined,
    });
  });

  it('opens the block dialog and confirms blocking an active student', async () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: `
              <slot
                name="success"
                :data="[{
                  id: 8,
                  name: 'Ali',
                  image: '',
                  status: '1',
                  educationType: null,
                  educationStage: null,
                  grade: null,
                  currentPlan: null
                }]"
              />
            `,
          },
          AppTable: {
            props: ['items'],
            template: '<div><slot name="actions" :item="items[0]" /></div>',
          },
          DropList: {
            props: ['actionList'],
            template: '<button class="block-action" @click="actionList[4].action()">block</button>',
          },
          StudentArchiveDialog: true,
          StudentBlockDialog: {
            props: ['modelValue'],
            emits: ['confirm'],
            template: `
              <button
                v-if="modelValue"
                class="block-dialog-confirm"
                @click="$emit('confirm', 'Policy violation: Repeated misuse')"
              >
                confirm block
              </button>
            `,
          },
          FilterDialog: true,
          UpdatedCustomInputSelect: true,
          Pagination: true,
        },
      },
    });

    await wrapper.find('.block-action').trigger('click');

    expect(wrapper.find('.block-dialog-confirm').exists()).toBe(true);
    expect(mocks.changeStatus).not.toHaveBeenCalled();

    await wrapper.find('.block-dialog-confirm').trigger('click');
    await flushPromises();

    expect(mocks.changeStatus).toHaveBeenCalledOnce();
    expect(mocks.changeStatus.mock.calls[0][0].toMap()).toEqual({
      student_id: 8,
      status: '3',
      block_reason: 'Policy violation: Repeated misuse',
    });
  });

  it('opens the private note dialog for the selected student', async () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: `
              <slot
                name="success"
                :data="[{
                  id: 9,
                  name: 'Mona',
                  image: '',
                  status: '1',
                  educationType: null,
                  educationStage: null,
                  grade: null,
                  currentPlan: null
                }]"
              />
            `,
          },
          AppTable: {
            props: ['items'],
            template: '<div><slot name="actions" :item="items[0]" /></div>',
          },
          DropList: {
            props: ['actionList'],
            template: '<button class="note-action" @click="actionList[2].action()">note</button>',
          },
          StudentArchiveDialog: true,
          StudentBlockDialog: true,
          StudentNoteDialog: {
            props: ['modelValue', 'studentId'],
            emits: ['save'],
            template: `
              <button
                v-if="modelValue"
                class="note-dialog-save"
                :data-student-id="studentId"
                @click="$emit('save', { studentId, note: 'Draft', pinned: false, language: 'en' })"
              >
                save note
              </button>
            `,
          },
          FilterDialog: true,
          UpdatedCustomInputSelect: true,
          Pagination: true,
        },
      },
    });

    await wrapper.find('.note-action').trigger('click');

    expect(wrapper.find('.note-dialog-save').attributes('data-student-id')).toBe('9');

    await wrapper.find('.note-dialog-save').trigger('click');
    await flushPromises();

    expect(mocks.addNote).toHaveBeenCalledOnce();
    expect(mocks.addNote.mock.calls[0][0].toMap()).toEqual({
      student_id: 9,
      note: 'Draft',
    });
    expect(wrapper.find('.note-dialog-save').exists()).toBe(false);
  });

  it('opens the force logout dialog and confirms the selected student', async () => {
    const wrapper = shallowMount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: `
              <slot
                name="success"
                :data="[{
                  id: 11,
                  name: 'Omar',
                  image: '',
                  status: '1',
                  educationType: null,
                  educationStage: null,
                  grade: null,
                  currentPlan: null
                }]"
              />
            `,
          },
          AppTable: {
            props: ['items'],
            template: '<div><slot name="actions" :item="items[0]" /></div>',
          },
          DropList: {
            props: ['actionList'],
            template:
              '<button class="force-logout-action" @click="actionList[3].action()">logout</button>',
          },
          StudentArchiveDialog: true,
          StudentBlockDialog: true,
          StudentNoteDialog: true,
          StudentForceLogoutDialog: {
            props: ['modelValue'],
            emits: ['confirm'],
            template: `
              <button
                v-if="modelValue"
                class="force-logout-dialog-confirm"
                @click="$emit('confirm')"
              >
                confirm logout
              </button>
            `,
          },
          FilterDialog: true,
          UpdatedCustomInputSelect: true,
          Pagination: true,
        },
      },
    });

    await wrapper.find('.force-logout-action').trigger('click');

    expect(wrapper.find('.force-logout-dialog-confirm').exists()).toBe(true);
    expect(mocks.forceLogout).not.toHaveBeenCalled();

    await wrapper.find('.force-logout-dialog-confirm').trigger('click');
    await flushPromises();

    expect(mocks.forceLogout).toHaveBeenCalledOnce();
    expect(mocks.forceLogout.mock.calls[0][0].toMap()).toEqual({ student_id: 11 });
    expect(wrapper.find('.force-logout-dialog-confirm').exists()).toBe(false);
  });
});

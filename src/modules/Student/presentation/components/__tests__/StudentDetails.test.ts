import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ShowStudentModel from '../../../core/models/show.student.model';
import { StudentStatusEnum } from '../../../core/models/student.model';
import Component from '../StudentDetails.vue';

const mocks = vi.hoisted(() => ({
  route: { params: { id: '17' }, query: {} as Record<string, string> },
  itemData: { value: null as unknown },
  fetchOne: vi.fn().mockResolvedValue(undefined),
  changeStatus: vi.fn().mockResolvedValue(undefined),
  forceLogout: vi.fn().mockResolvedValue(undefined),
  addNote: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ locale: { value: 'en' }, t: (key: string) => key }),
}));

vi.mock('vue-router', () => ({
  useRoute: () => mocks.route,
}));

vi.mock('../../controllers/student.controller', () => ({
  default: {
    getInstance: () => ({
      itemData: mocks.itemData,
      itemState: { value: {} },
      fetchOne: mocks.fetchOne,
      changeStatus: mocks.changeStatus,
      forceLogout: mocks.forceLogout,
      addNote: mocks.addNote,
    }),
  },
}));

describe('StudentDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.route.query = {};
    mocks.itemData.value = ShowStudentModel.example;
  });

  it('fetches one student using the route id and renders the typed details model', async () => {
    const wrapper = mount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: '<div><slot name="success" /></div>',
          },
        },
      },
    });

    await flushPromises();

    expect(mocks.fetchOne).toHaveBeenCalledOnce();
    expect(mocks.fetchOne.mock.calls[0][0].toMap()).toEqual({ student_id: 17 });
    expect(wrapper.find('h1').text()).toBe('Ahmed Hawam');
    expect(wrapper.text()).toContain('Premium');
    expect(wrapper.text()).toContain('performance_snapshot');
    expect(wrapper.text()).toContain('This plan included unlimited access');
    expect(wrapper.find('.student-section-title svg').exists()).toBe(true);
  });

  it.each([
    [StudentStatusEnum.ACTIVE, 'active', 'student_account_active'],
    [StudentStatusEnum.ARCHIVE, 'archived', 'student_account_archived'],
  ])('renders the %s account status message', async (status, className, messageKey) => {
    mocks.route.query = { status };
    mocks.itemData.value = ShowStudentModel.fromJson({
      id: 17,
      name: 'Ahmed Hawam',
      status: StudentStatusEnum.ACTIVE,
    });

    const wrapper = mount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: '<div><slot name="success" /></div>',
          },
        },
      },
    });
    await flushPromises();

    const accountMessage = wrapper.find('.student-account-message');
    expect(accountMessage.classes()).toContain(className);
    expect(accountMessage.text()).toContain(messageKey);
    expect(wrapper.find('.student-account-block-details').exists()).toBe(false);
  });

  it('renders the block details returned for a blocked student', async () => {
    mocks.route.query = { status: StudentStatusEnum.BLOCK };
    mocks.itemData.value = ShowStudentModel.fromJson({
      id: 17,
      name: 'Ahmed Hawam',
      status: StudentStatusEnum.ACTIVE,
      blocked_by: { id: 3, name: 'Ahmed Ali' },
      block_date: '2026-05-20',
      reason: 'Multiple Policy Violations',
    });

    const wrapper = mount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: '<div><slot name="success" /></div>',
          },
        },
      },
    });
    await flushPromises();

    const accountMessage = wrapper.find('.student-account-message');
    const blockDetails = wrapper.findAll('.student-account-block-details > div');
    expect(accountMessage.classes()).toContain('blocked');
    expect(accountMessage.text()).toContain('student_account_blocked');
    expect(blockDetails[0].find('dt').text()).toBe('student_blocked_by:');
    expect(blockDetails[0].find('dd').text()).toBe('Ahmed Ali');
    expect(blockDetails[1].find('dt').text()).toBe('student_blocked_since:');
    expect(blockDetails[1].find('dd').text()).toBe('20 May 2026');
    expect(wrapper.find('.student-account-block-reason').text()).toContain(
      'student_block_reason: Multiple Policy Violations',
    );
  });

  it.each([
    {
      status: StudentStatusEnum.ARCHIVE,
      expectedActions: ['un_archive'],
      recoveryActionIndex: 0,
    },
    {
      status: StudentStatusEnum.BLOCK,
      expectedActions: ['archive', 'un_block'],
      recoveryActionIndex: 1,
    },
  ])('shows only the allowed actions for status $status', async (scenario) => {
    mocks.route.query = { status: scenario.status };

    const wrapper = mount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: '<div><slot name="success" /></div>',
          },
          DropList: {
            props: ['actionList'],
            template: `
              <div class="status-actions">
                <button
                  v-for="action in actionList"
                  :key="action.text"
                  type="button"
                  :data-danger="action.danger"
                  @click="action.action()"
                >
                  {{ action.text }}
                </button>
              </div>
            `,
          },
        },
      },
    });
    await flushPromises();

    const actions = wrapper.findAll('.status-actions button');
    expect(actions.map((action) => action.text())).toEqual(scenario.expectedActions);
    if (scenario.status === StudentStatusEnum.BLOCK) {
      expect(actions[1].attributes('data-danger')).toBe('true');
    }

    await actions[scenario.recoveryActionIndex].trigger('click');
    await flushPromises();
    expect(mocks.changeStatus.mock.calls[0][0].toMap()).toEqual({
      student_id: 1,
      status: StudentStatusEnum.ACTIVE,
    });
  });

  it('expands and collapses the notes accordion', async () => {
    const wrapper = mount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: '<div><slot name="success" /></div>',
          },
        },
      },
    });
    await flushPromises();

    const trigger = wrapper.find('.student-notes-trigger');
    const panel = wrapper.find('#student-notes-panel');

    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(panel.isVisible()).toBe(true);

    await trigger.trigger('click');

    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(panel.attributes('style')).toContain('display: none');

    await trigger.trigger('click');

    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(panel.attributes('style')).not.toContain('display: none');
  });

  it('shows the student actions and connects them to their dialogs', async () => {
    const wrapper = mount(Component, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          DataStatusBuilder: {
            template: '<div><slot name="success" /></div>',
          },
          DropList: {
            props: ['actionList'],
            template: `
              <div class="details-actions">
                <slot name="icon" />
                <span v-for="action in actionList" :key="action.text">{{ action.text }}</span>
                <button class="archive-action" @click="actionList[0].action()">archive</button>
                <button class="note-action" @click="actionList[1].action()">note</button>
                <button class="force-action" @click="actionList[2].action()">force</button>
                <button class="block-action" @click="actionList[3].action()">block</button>
              </div>
            `,
          },
          StudentArchiveDialog: {
            props: ['modelValue'],
            emits: ['confirm'],
            template: `
              <button v-if="modelValue" class="archive-confirm" @click="$emit('confirm')">
                confirm archive
              </button>
            `,
          },
          StudentBlockDialog: {
            props: ['modelValue'],
            emits: ['confirm'],
            template: `
              <button
                v-if="modelValue"
                class="block-confirm"
                @click="$emit('confirm', 12, 'Policy violation: Repeated misuse')"
              >
                confirm block
              </button>
            `,
          },
          StudentForceLogoutDialog: {
            props: ['modelValue'],
            emits: ['confirm'],
            template: `
              <button v-if="modelValue" class="force-confirm" @click="$emit('confirm')">
                confirm force logout
              </button>
            `,
          },
          StudentNoteDialog: {
            props: ['modelValue', 'studentId'],
            emits: ['save'],
            template: `
              <button
                v-if="modelValue"
                class="note-save"
                @click="$emit('save', { studentId, note: 'Private note' })"
              >
                save note
              </button>
            `,
          },
        },
      },
    });
    await flushPromises();

    expect(wrapper.find('.student-more-button').exists()).toBe(true);
    expect(wrapper.find('.details-actions').text()).toContain('archiveadd_noteforce_logoutblock');

    await wrapper.find('.note-action').trigger('click');
    await wrapper.find('.note-save').trigger('click');
    await flushPromises();
    expect(mocks.addNote.mock.calls[0][0].toMap()).toEqual({
      student_id: 1,
      note: 'Private note',
    });

    await wrapper.find('.force-action').trigger('click');
    await wrapper.find('.force-confirm').trigger('click');
    await flushPromises();
    expect(mocks.forceLogout.mock.calls[0][0].toMap()).toEqual({ student_id: 1 });

    mocks.changeStatus.mockClear();
    await wrapper.find('.block-action').trigger('click');
    await wrapper.find('.block-confirm').trigger('click');
    await flushPromises();
    expect(mocks.changeStatus.mock.calls[0][0].toMap()).toEqual({
      student_id: 1,
      status: '3',
      block_reason_id: [12],
      block_reason: 'Policy violation: Repeated misuse',
    });

    mocks.changeStatus.mockClear();
    await wrapper.find('.archive-action').trigger('click');
    await wrapper.find('.archive-confirm').trigger('click');
    await flushPromises();
    expect(mocks.changeStatus.mock.calls[0][0].toMap()).toEqual({
      student_id: 1,
      status: '2',
    });
  });
});

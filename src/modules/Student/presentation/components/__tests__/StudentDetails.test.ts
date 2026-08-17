import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ShowStudentModel from '../../../core/models/show.student.model';
import Component from '../StudentDetails.vue';

const mocks = vi.hoisted(() => ({
  fetchOne: vi.fn().mockResolvedValue(undefined),
  changeStatus: vi.fn().mockResolvedValue(undefined),
  forceLogout: vi.fn().mockResolvedValue(undefined),
  addNote: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '17' } }),
}));

vi.mock('../../controllers/student.controller', () => ({
  default: {
    getInstance: () => ({
      itemData: { value: ShowStudentModel.example },
      itemState: { value: {} },
      fetchOne: mocks.fetchOne,
      changeStatus: mocks.changeStatus,
      forceLogout: mocks.forceLogout,
      addNote: mocks.addNote,
    }),
  },
}));

describe('StudentDetails', () => {
  beforeEach(() => vi.clearAllMocks());

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
    expect(wrapper.find('.student-section-title-with-icon svg').exists()).toBe(true);
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
                @click="$emit('confirm', 'Policy violation: Repeated misuse')"
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

    await wrapper.find('.archive-action').trigger('click');
    await wrapper.find('.archive-confirm').trigger('click');
    await flushPromises();
    expect(mocks.changeStatus.mock.calls[0][0].toMap()).toEqual({
      student_id: 1,
      status: '2',
      block_reason: undefined,
    });

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
      block_reason: 'Policy violation: Repeated misuse',
    });
  });
});

import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ShowStudentModel from '../../../core/models/show.student.model';
import Component from '../StudentDetails.vue';

const mocks = vi.hoisted(() => ({
  fetchOne: vi.fn().mockResolvedValue(undefined),
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
  });
});

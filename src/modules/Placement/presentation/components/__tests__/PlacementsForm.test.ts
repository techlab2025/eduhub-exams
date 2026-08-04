import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AddPlacementParams from '../../../core/params/add.placement.params';
import PlacementsForm from '../PlacementsForm.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {} }),
}));

describe('PlacementsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('emits add parameters initially so the form can be saved', () => {
    const wrapper = shallowMount(PlacementsForm, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    });

    const emittedParams = wrapper.emitted('updateData')?.at(-1)?.[0];

    expect(emittedParams).toBeInstanceOf(AddPlacementParams);
  });

  it('emits the current placement values when fields change', async () => {
    const wrapper = shallowMount(PlacementsForm, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    });
    const inputs = wrapper.findAll('input[type="number"]');

    await inputs[0].setValue(30);
    await inputs[1].setValue(45);

    const emittedParams = wrapper.emitted('updateData')?.at(-1)?.[0] as AddPlacementParams;

    expect(emittedParams.toMap()).toMatchObject({
      question_count: 30,
      easy_questions_count: 0,
      medium_questions_count: 0,
      hard_questions_count: 0,
      minute_count: 45,
    });
  });
});

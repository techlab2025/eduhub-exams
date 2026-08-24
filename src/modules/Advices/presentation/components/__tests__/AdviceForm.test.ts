import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdviceModel from '../../../core/models/advice.model';
import AdviceForm from '../AdviceForm.vue';

const { routeParams } = vi.hoisted(() => ({ routeParams: {} as Record<string, string> }));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: routeParams }),
}));

vi.mock('@/modules/AdviceCategory/presentation/controllers/advice.category.controller', () => ({
  default: {
    getInstance: () => ({ fetchAsOptions: vi.fn().mockResolvedValue([]) }),
  },
}));

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    MultiLangInput: true,
    UpdatedCustomInputSelect: {
      name: 'UpdatedCustomInputSelect',
      props: ['modelValue', 'type', 'label', 'placeholder', 'controller', 'params'],
      emits: ['update:modelValue'],
      template: '<div class="category-select-stub" />',
    },
  },
};

describe('AdviceForm', () => {
  beforeEach(() => {
    delete routeParams.id;
  });

  it('emits the selected advice category in add params', async () => {
    const wrapper = mount(AdviceForm, { global });
    wrapper.getComponent({ name: 'UpdatedCustomInputSelect' }).vm.$emit('update:modelValue', {
      id: 8,
      title: 'Planning',
    });
    await wrapper.vm.$nextTick();

    const params = wrapper.emitted('updateData')?.at(-1)?.[0];
    expect(params?.toMap()).toMatchObject({ advice_category_id: 8 });
  });

  it('prefills the category while editing an advice', () => {
    routeParams.id = '4';
    const advice = AdviceModel.fromJson({
      id: 4,
      title: [],
      description: [],
      advice_category: { id: 8, title: 'Planning' },
    });
    const wrapper = mount(AdviceForm, { props: { advice }, global });

    expect(wrapper.getComponent({ name: 'UpdatedCustomInputSelect' }).props('modelValue')).toEqual({
      id: 8,
      title: 'Planning',
    });
  });
});

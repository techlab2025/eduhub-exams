import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import AddAdviceParams from '../../../core/params/add.advice.params';
import AdviceAdd from '../AdviceAdd.vue';

const { createMock, fetchListMock, routeLeaveRegistrationMock, routerPushMock } = vi.hoisted(
  () => ({
    createMock: vi.fn(),
    fetchListMock: vi.fn(),
    routeLeaveRegistrationMock: vi.fn(),
    routerPushMock: vi.fn(),
  }),
);

vi.mock('../../controllers/advice.controller', () => ({
  default: {
    getInstance: () => ({ create: createMock, fetchList: fetchListMock }),
  },
}));

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: routeLeaveRegistrationMock,
  useRoute: () => ({ fullPath: '/advices/add' }),
  useRouter: () => ({ push: routerPushMock }),
}));

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    AdviceForm: {
      name: 'AdviceForm',
      emits: ['updateData'],
      template: '<div class="advice-form-stub" />',
    },
    AdviceUnsavedChangesDialog: {
      name: 'AdviceUnsavedChangesDialog',
      props: ['modelValue'],
      emits: ['update:modelValue', 'continue', 'discard'],
      template: `
        <div v-if="modelValue" class="advice-unsaved-dialog-stub">
          <button class="continue-editing" @click="$emit('continue')">Continue Editing</button>
          <button class="discard-changes" @click="$emit('discard')">Discard Changes</button>
        </div>
      `,
    },
  },
};

const makeParams = (title = '', adviceCategoryId = 0) =>
  new AddAdviceParams({
    adviceCategoryId,
    translations: new TranslationParams({
      title: title ? { en: title } : {},
      description: {},
    }),
  });

const emitFormParams = async (wrapper: ReturnType<typeof mount>, params: AddAdviceParams) => {
  wrapper.getComponent({ name: 'AdviceForm' }).vm.$emit('updateData', params);
  await wrapper.vm.$nextTick();
};

describe('AdviceAdd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerPushMock.mockResolvedValue(undefined);
    fetchListMock.mockResolvedValue(undefined);
    createMock.mockResolvedValue({ data: {}, hasError: false });
  });

  it('opens the Cancel dialog even before the form changes', async () => {
    const wrapper = mount(AdviceAdd, { global });
    await emitFormParams(wrapper, makeParams());

    await wrapper.get('.btn-cancel').trigger('click');

    expect(wrapper.find('.advice-unsaved-dialog-stub').exists()).toBe(true);
    expect(routerPushMock).not.toHaveBeenCalled();

    await wrapper.get('.discard-changes').trigger('click');
    await flushPromises();

    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Advices' });
  });

  it('keeps the entered data or discards it from the Cancel dialog', async () => {
    const wrapper = mount(AdviceAdd, { global });
    await emitFormParams(wrapper, makeParams());
    await emitFormParams(wrapper, makeParams('Useful advice', 4));

    await wrapper.get('.btn-cancel').trigger('click');

    expect(wrapper.find('.advice-unsaved-dialog-stub').exists()).toBe(true);
    expect(routerPushMock).not.toHaveBeenCalled();

    await wrapper.get('.continue-editing').trigger('click');
    expect(wrapper.find('.advice-unsaved-dialog-stub').exists()).toBe(false);
    expect(routerPushMock).not.toHaveBeenCalled();

    await wrapper.get('.btn-cancel').trigger('click');
    await wrapper.get('.discard-changes').trigger('click');
    await flushPromises();

    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Advices' });
  });

  it('guards other navigation while there are unsaved changes', async () => {
    const wrapper = mount(AdviceAdd, { global });
    await emitFormParams(wrapper, makeParams());
    await emitFormParams(wrapper, makeParams('Useful advice', 4));

    const guard = routeLeaveRegistrationMock.mock.calls.at(-1)?.[0] as () =>
      | boolean
      | Promise<boolean>;
    const stayResult = guard();
    await wrapper.vm.$nextTick();
    await wrapper.get('.continue-editing').trigger('click');

    expect(await stayResult).toBe(false);

    const leaveResult = guard();
    await wrapper.vm.$nextTick();
    await wrapper.get('.discard-changes').trigger('click');

    expect(await leaveResult).toBe(true);
    expect(routerPushMock).not.toHaveBeenCalled();
  });

  it('saves normally and clears the navigation warning after success', async () => {
    const wrapper = mount(AdviceAdd, { global });
    const changedParams = makeParams('Useful advice', 4);
    await emitFormParams(wrapper, makeParams());
    await emitFormParams(wrapper, changedParams);

    await wrapper.get('.btn-primary').trigger('click');
    await flushPromises();

    expect(createMock).toHaveBeenCalledWith(changedParams);
    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Advices' });
    expect(fetchListMock).toHaveBeenCalledOnce();

    const guard = routeLeaveRegistrationMock.mock.calls.at(-1)?.[0] as () => boolean;
    expect(guard()).toBe(true);
  });
});

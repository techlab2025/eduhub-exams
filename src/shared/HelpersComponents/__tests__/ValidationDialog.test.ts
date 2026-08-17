import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ValidationService from '@/base/Presentation/Utils/validationService';
import ValidationDialog from '../ValidationDialog.vue';

describe('ValidationDialog', () => {
  beforeEach(() => ValidationService.clearValidation());

  it('renders the current validation message only while open', async () => {
    const wrapper = mount(ValidationDialog);
    expect(wrapper.find('.dialog-overlay').exists()).toBe(false);

    ValidationService.message.value = 'Name is required';
    ValidationService.isOpen.value = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.dialog-message').text()).toBe('Name is required');
  });

  it('clears validation from the close button', async () => {
    const clear = vi.spyOn(ValidationService, 'clearValidation');
    ValidationService.isOpen.value = true;
    const wrapper = mount(ValidationDialog);

    await wrapper.find('.dialog-close-btn').trigger('click');
    expect(clear).toHaveBeenCalledOnce();
  });
});

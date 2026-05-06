import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import GeneralLoginForm from '../GeneralLoginForm.vue';
import LoginController from '../../controllers/login.controller';
import LoginParams from '../../../core/params/login.params';

vi.mock('../../controllers/login.controller', () => ({
  default: {
    getInstance: vi.fn(),
  },
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ locale: { value: 'en' } }),
}));

describe('GeneralLoginForm.vue', () => {
  let mockGeneralLogin: any;

  beforeEach(() => {
    mockGeneralLogin = vi.fn();
    (LoginController.getInstance as any).mockReturnValue({
      generalLogin: mockGeneralLogin,
    });
  });

  const mountOptions = {
    global: {
      mocks: {
        $t: (msg: string) => msg,
      },
    },
  };

  it('renders general login form properly', () => {
    const wrapper = mount(GeneralLoginForm, mountOptions);
    expect(wrapper.find('form.login-form').exists()).toBe(true);
    expect(wrapper.find('input#email').exists()).toBe(true);
    expect(wrapper.find('input#password').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe('Log In');
  });

  it('calls generalLogin controller with correct params on submit', async () => {
    const wrapper = mount(GeneralLoginForm, mountOptions);

    const emailInput = wrapper.find('input#email');
    const passwordInput = wrapper.find('input#password');

    await emailInput.setValue('admin@example.com');
    await passwordInput.setValue('admin123');

    await wrapper.find('form.login-form').trigger('submit.prevent');

    expect(mockGeneralLogin).toHaveBeenCalledTimes(1);
    const expectedParams = new LoginParams('admin@example.com', 'admin123');
    expect(mockGeneralLogin).toHaveBeenCalledWith(expectedParams);
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    const wrapper = mount(GeneralLoginForm, mountOptions);
    const passwordInput = wrapper.find('input#password');

    expect(passwordInput.attributes('type')).toBe('password');

    const eyeIcon = wrapper.find('.icon-eye');
    if (eyeIcon.exists()) {
      await eyeIcon.trigger('click');
      expect(wrapper.find('input#password').attributes('type')).toBe('text');
    }
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginForm from '../LoginForm.vue';
import LoginController from '../../controllers/login.controller';
import LoginParams from '../../../core/params/login.params';

vi.mock('../../controllers/login.controller', () => {
  return {
    default: {
      getInstance: vi.fn(),
    },
  };
});

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ locale: { value: 'en' } }),
}));

describe('LoginForm.vue', () => {
  let mockLogin: any;

  beforeEach(() => {
    mockLogin = vi.fn();
    (LoginController.getInstance as any).mockReturnValue({
      login: mockLogin,
    });
  });

  const mountOptions = {
    global: {
      mocks: {
        $t: (msg: string) => msg,
      },
    },
  };

  it('renders login form properly', () => {
    const wrapper = mount(LoginForm, mountOptions);
    expect(wrapper.find('form.login-form').exists()).toBe(true);
    expect(wrapper.find('input#phone').exists()).toBe(true);
    expect(wrapper.find('input#password').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe('Log In');
  });

  it('calls login controller with correct params on submit', async () => {
    const wrapper = mount(LoginForm, mountOptions);

    const phoneInput = wrapper.find('input#phone');
    const passwordInput = wrapper.find('input#password');

    await phoneInput.setValue('01012345678');
    await passwordInput.setValue('password123');

    await wrapper.find('form.login-form').trigger('submit.prevent');

    expect(mockLogin).toHaveBeenCalledTimes(1);
    const expectedParams = new LoginParams('01012345678', 'password123');
    expect(mockLogin).toHaveBeenCalledWith(expectedParams);
  });
});

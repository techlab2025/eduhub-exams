import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import type AboutModel from '../../../core/models/about.model';
import AboutForm from '../AboutForm.vue';

const mockRoute = vi.hoisted(() => ({
  params: {} as Record<string, string>,
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {}, params: mockRoute.params, fullPath: '/about/edit' }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  createRouter: vi.fn(() => ({
    install: vi.fn(),
    push: vi.fn(),
    afterEach: vi.fn(),
    beforeEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}));

vi.mock('@/shared/MultiLangInput.vue', () => ({
  default: {
    name: 'MultiLangInput',
    template: '<div />',
    props: ['fieldKey', 'label', 'languages', 'modelValue', 'type'],
    emits: ['update:modelValue'],
  },
}));

vi.mock('@/shared/FormInputs/HandleFilesUpload.vue', () => ({
  default: {
    name: 'HandleFilesUpload',
    template: '<div class="upload-stub" />',
    props: ['maxFiles'],
    emits: ['change'],
  },
}));

vi.mock('@/shared/icons/UploadImage/UplaodImageInput.vue', () => ({
  default: { name: 'UplaodImageInput', template: '<div />' },
}));

vi.mock('@/shared/icons/SocialIcons/LinksIcon.vue', () => ({
  default: { name: 'LinksIcon', template: '<span />' },
}));

const mockAbout = {
  id: 1,
  translations: { title: { en: 'About', ar: 'عن' }, description: { en: 'Desc', ar: 'وصف' } },
  images: '',
  socialMedia: [],
} as unknown as AboutModel;

describe('AboutForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockRoute.params = {};
    vi.clearAllMocks();
  });

  it('renders without errors', () => {
    const wrapper = mount(AboutForm, {
      props: { formKey: 'test-key', about: mockAbout },
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { Teleport: true, Transition: true },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('limits the main image and social icons to one file each', () => {
    const wrapper = mount(AboutForm, {
      props: { formKey: 'test-key', about: mockAbout },
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { Teleport: true, Transition: true },
      },
    });

    const uploaders = wrapper.findAllComponents({ name: 'HandleFilesUpload' });

    expect(uploaders).toHaveLength(2);
    expect(uploaders.every((uploader) => uploader.props('maxFiles') === 1)).toBe(true);
  });

  it('does not send unchanged social icon for existing links', async () => {
    const wrapper = mount(AboutForm, {
      props: {
        formKey: 'test-key',
        about: {
          ...mockAbout,
          socialMedia: [
            {
              id: 10,
              link: 'https://facebook.com',
              icon: 'https://example.com/facebook.png',
            },
          ],
        } as unknown as AboutModel,
      },
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { Teleport: true, Transition: true },
      },
    });

    await wrapper.find('.sm-input').setValue('https://facebook.com/new');

    const emittedPayload = wrapper.emitted('updateData')?.at(-1)?.[0] as {
      socialMedia: Array<Record<string, unknown>>;
    };

    const firstSocial = emittedPayload.socialMedia[0];
    if (!firstSocial) throw new Error('Expected social media payload');

    expect(firstSocial).toMatchObject({
      social_link_id: 10,
      link: 'https://facebook.com/new',
    });
    expect(Object.prototype.hasOwnProperty.call(firstSocial, 'icon')).toBe(false);
  });

  it('sends social icon for new uploaded links', () => {
    const icon = 'data:image/png;base64,aWNvbg==';
    const wrapper = mount(AboutForm, {
      props: {
        formKey: 'test-key',
        about: mockAbout,
      },
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { Teleport: true, Transition: true },
      },
    });

    wrapper.findAllComponents({ name: 'HandleFilesUpload' })[1]?.vm.$emit('change', [
      {
        base64: icon,
      },
    ]);

    const emittedPayload = wrapper.emitted('updateData')?.at(-1)?.[0] as {
      socialMedia: Array<Record<string, unknown>>;
    };

    expect(emittedPayload.socialMedia[0]).toMatchObject({
      icon,
    });
  });
});

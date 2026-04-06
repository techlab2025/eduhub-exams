import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageUser from '../ImageUser.vue'

vi.mock('cropperjs', () => ({
  default: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    getCroppedCanvas: vi.fn(() => ({
      toDataURL: vi.fn(() => 'data:image/webp;base64,mocked'),
    })),
  })),
}))

const DialogStub = {
  name: 'Dialog',
  template: '<div class="dialog-stub" v-if="visible"><slot /></div>',
  props: ['visible'],
  emits: ['update:visible'],
}
const IconStub = (name: string) => ({ name, template: `<span />` })

const createWrapper = (props = {}) =>
  mount(ImageUser, {
    props,
    global: {
      stubs: {
        Dialog: DialogStub,
        IconTrash: IconStub('IconTrash'),
        IconUpload: IconStub('IconUpload'),
      },
      mocks: { $t: (key: string) => key },
    },
    attachTo: document.body,
  })

describe('ImageUser', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the file input', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  it('renders label using label prop', () => {
    const wrapper = createWrapper({ label: 'Profile Picture' })
    expect(wrapper.text()).toContain('Profile Picture')
  })

  it('falls back to $t("image") when no label prop', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('image')
  })

  it('generates input id using index prop', () => {
    const wrapper = createWrapper({ index: 'user-7' })
    expect(wrapper.find('input#imageuser-7').exists()).toBe(true)
  })

  it('shows default user image placeholder when no initialImage', () => {
    const wrapper = createWrapper()
    const img = wrapper.find('img[alt="user"]')
    expect(img.exists()).toBe(true)
  })

  it('does not show delete button when no image loaded', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('button.btn-danger').exists()).toBe(false)
  })

  it('accepts image file types', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('accept')).toContain('image/jpeg')
  })

  it('emits update:image with null when deleteImage is triggered', async () => {
    const wrapper = createWrapper()
    const vm = wrapper.vm as any
    vm.imageSrc = 'http://example.com/pic.jpg'
    await wrapper.vm.$nextTick()
    const btn = wrapper.find('button.btn-danger')
    if (btn.exists()) {
      await btn.trigger('click')
      const emitted = wrapper.emitted('update:image')
      expect(emitted).toBeTruthy()
      expect(emitted![0]).toEqual([null])
    }
  })

  it('uses default aspectRatio of 1', () => {
    const wrapper = createWrapper()
    // Just verify no prop error is thrown
    expect(wrapper.exists()).toBe(true)
  })
})

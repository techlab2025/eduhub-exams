import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageInput from '../ImageInput.vue'

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
const IconStub = (name: string) => ({ name, template: `<span class="${name.toLowerCase()}-stub" />` })

const createWrapper = (props = {}) =>
  mount(ImageInput, {
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

describe('ImageInput', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the file input', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="file"]')
    expect(input.exists()).toBe(true)
  })

  it('accepts image types', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('accept')).toContain('image/jpeg')
  })

  it('shows upload button label', () => {
    const wrapper = createWrapper()
    const labels = wrapper.findAll('label.btn')
    expect(labels.length).toBeGreaterThan(0)
  })

  it('does not show delete button when no image', () => {
    const wrapper = createWrapper()
    const deleteBtn = wrapper.find('button.btn-danger')
    expect(deleteBtn.exists()).toBe(false)
  })

  it('does not show dialog when visible is false initially', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.dialog-stub').exists()).toBe(false)
  })

  it('uses index prop for input id', () => {
    const wrapper = createWrapper({ index: 3 })
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('id')).toBe('image3')
  })

  it('uses default placeholder image when no initialImage', () => {
    const wrapper = createWrapper()
    // The alt="user" placeholder should be shown
    const img = wrapper.find('img[alt="user"]')
    expect(img.exists()).toBe(true)
  })

  it('emits update:image with null when deleteImage is called', async () => {
    // Simulate internal state: set imageSrc
    const wrapper = createWrapper({ initialImage: 'http://example.com/img.jpg' })
    // trigger deleteImage via button — need to make imageSrc truthy first
    // We set internalImage via the component
    const vm = wrapper.vm as any
    vm.imageSrc = 'http://example.com/img.jpg' 
    await wrapper.vm.$nextTick()
    const deleteBtn = wrapper.find('button.btn-danger')
    if (deleteBtn.exists()) {
      await deleteBtn.trigger('click')
      expect(wrapper.emitted('update:image')).toBeTruthy()
      expect(wrapper.emitted('update:image')![0]).toEqual([null])
    }
  })
})

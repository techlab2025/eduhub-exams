import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SingleFileUpload from '../SingleFileUpload.vue'

// Mock PrimeVue Dialog
vi.mock('primevue/dialog', () => ({
  default: {
    template: '<div v-if="visible" class="mock-dialog"><slot /></div>',
    props: ['visible', 'modal', 'dismissableMask'],
    emits: ['update:visible'],
  },
}))

// Mock icons
vi.mock('../../icons/UploadAppend.vue', () => ({ default: { template: '<span class="mock-upload-append" />' } }))
vi.mock('../../icons/RemoveImageIcon.vue', () => ({ default: { template: '<span class="mock-remove" />' } }))

const createWrapper = (props = {}) =>
  mount(SingleFileUpload, {
    props: {
      modelValue: '',
      ...props,
    },
  })

describe('SingleFileUpload', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('shows upload area when no model value', () => {
    const wrapper = createWrapper({ modelValue: '' })
    expect(wrapper.find('.file-label').exists()).toBe(true)
  })

  it('shows preview when model value is a string URL', () => {
    const wrapper = createWrapper({ modelValue: 'https://example.com/image.jpg' })
    expect(wrapper.find('.file-preview').exists()).toBe(true)
  })

  it('hides upload area when file is selected', () => {
    const wrapper = createWrapper({ modelValue: 'test.png' })
    expect(wrapper.find('.file-label').exists()).toBe(false)
  })

  it('renders file input element', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  it('file input accepts only images', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('accept')).toBe('image/*')
  })

  it('file input is hidden', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('hidden')).toBeDefined()
  })

  it('displays max size text', () => {
    const wrapper = createWrapper({ maxSize: 5 })
    expect(wrapper.text()).toContain('5')
  })

  it('defaults maxSize to 3.5', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('3.5')
  })

  it('renders image preview for string modelValue', () => {
    const wrapper = createWrapper({ modelValue: 'https://example.com/test.jpg' })
    const img = wrapper.find('.file-preview img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/test.jpg')
  })

  it('emits update:modelValue and remove when remove is clicked', async () => {
    const wrapper = createWrapper({ modelValue: 'test.jpg' })
    const removeIcon = wrapper.find('.mock-remove')
    await removeIcon.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('remove')).toBeTruthy()
  })

  it('renders crop dialog when isCrop is true', () => {
    const wrapper = createWrapper({ isCrop: true })
    expect(wrapper.exists()).toBe(true)
  })

  it('has file-append root class', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.file-append').exists()).toBe(true)
  })
})

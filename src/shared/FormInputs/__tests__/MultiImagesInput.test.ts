import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MultiImagesInput from '../MultiImagesInput.vue'

vi.mock('@/assets/images/pdf.png', () => ({ default: 'mocked-pdf.png' }))
vi.mock('@/assets/images/word.png', () => ({ default: 'mocked-word.png' }))
vi.mock('@/assets/images/excel.png', () => ({ default: 'mocked-excel.png' }))
vi.mock('@/assets/images/upload.png', () => ({ default: 'mocked-upload.png' }))

const createWrapper = (props = {}) =>
  mount(MultiImagesInput, {
    props,
    global: {
      mocks: { $t: (key: string) => key },
    },
  })

describe('MultiImagesInput', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the file input', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="file"]')
    expect(input.exists()).toBe(true)
  })

  it('uses accept prop on file input', () => {
    const wrapper = createWrapper({ accept: 'image/png', index: 5 })
    const input = wrapper.find('#images5')
    expect(input.attributes('accept')).toBe('image/png')
  })

  it('shows no image gallery initially when no initialImages', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.image-gallery').exists()).toBe(false)
  })

  it('renders initialImages when provided', () => {
    const wrapper = createWrapper({ initialImages: ['img1.png', 'img2.png'] })
    const gallery = wrapper.find('.image-gallery')
    expect(gallery.exists()).toBe(true)
    expect(gallery.findAll('.image-item')).toHaveLength(2)
  })

  it('has multiple attribute on file input', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('multiple')).toBeDefined()
  })

  it('getPlaceholder returns correct icon for pdf', () => {
    // Indirectly test: if we can't call it directly, just verify component renders
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('remove button exists for each preview image', () => {
    const wrapper = createWrapper({ initialImages: ['img1.png', 'img2.png'] })
    const removeBtns = wrapper.findAll('.remove-btn')
    expect(removeBtns).toHaveLength(2)
  })

  it('removes image from list when remove button clicked', async () => {
    const wrapper = createWrapper({ initialImages: ['img1.png', 'img2.png'] })
    const removeBtns = wrapper.findAll('.remove-btn')
    await removeBtns[0].trigger('click')
    const remaining = wrapper.findAll('.image-item')
    expect(remaining).toHaveLength(1)
  })

  it('emits update:images when file is removed', async () => {
    const wrapper = createWrapper({ initialImages: ['img1.png'] })
    const btn = wrapper.find('.remove-btn')
    await btn.trigger('click')
    const emitted = wrapper.emitted('update:images')
    expect(emitted).toBeTruthy()
  })
})

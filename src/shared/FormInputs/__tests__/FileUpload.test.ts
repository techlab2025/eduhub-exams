import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload from '../FileUpload.vue'

vi.mock('@/assets/images/pdf.png', () => ({ default: 'mocked-pdf.png' }))
vi.mock('@/assets/images/word.png', () => ({ default: 'mocked-word.png' }))
vi.mock('@/assets/images/excel.png', () => ({ default: 'mocked-excel.png' }))
vi.mock('@/assets/images/dwg-file.png', () => ({ default: 'mocked-dwg.png' }))
vi.mock('@/assets/images/rar-file.png', () => ({ default: 'mocked-rar.png' }))

const IconStub = (name: string) => ({ name, template: `<span class="${name.toLowerCase()}-stub" />` })

const createWrapper = (props = {}) =>
  mount(FileUpload, {
    props,
    global: {
      stubs: {
        IconUploadFile: IconStub('IconUploadFile'),
        IconVideo: IconStub('IconVideo'),
        IconAudio: IconStub('IconAudio'),
        IconDeleteAttachment: IconStub('IconDeleteAttachment'),
        CloudIcon: IconStub('CloudIcon'),
        TrashIcon: IconStub('TrashIcon'),
      },
      mocks: { $t: (key: string) => key },
    },
  })

describe('FileUpload', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a file input element', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  it('accepts files of all types by default (accept="/*")', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('accept')).toBe('/*')
  })

  it('uses custom accept prop', () => {
    const wrapper = createWrapper({ accept: 'image/*' })
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('accept')).toBe('image/*')
  })

  it('does not have multiple attribute by default', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('multiple')).toBeUndefined()
  })

  it('has multiple attribute when multiable is true', () => {
    const wrapper = createWrapper({ multiable: true })
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('multiple')).toBeDefined()
  })

  it('shows single file upload text when multiable is false', () => {
    const wrapper = createWrapper({ multiable: false })
    expect(wrapper.find('span').text()).toContain('Attach a file no larger than 3.5MB.')
  })

  it('shows multiple files upload text when multiable is true', () => {
    const wrapper = createWrapper({ multiable: true })
    expect(wrapper.text()).toContain('Attach files (up to 10 files')
  })

  it('shows no image gallery when no files loaded', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.image-gallery').exists()).toBe(false)
  })

  it('renders with initialFileData as array of URLs', async () => {
    const wrapper = createWrapper({ initialFileData: ['http://example.com/file.jpg'] })
    await wrapper.vm.$nextTick()
    // fileUrls should be populated
    expect(wrapper.find('.image-gallery').exists()).toBe(true)
  })

  it('renders with initialFileData as single string', async () => {
    const wrapper = createWrapper({ initialFileData: 'http://example.com/doc.pdf' })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.image-gallery').exists()).toBe(true)
  })

  it('shows delete overlay when canDelete is true', async () => {
    const wrapper = createWrapper({ initialFileData: ['http://example.com/img.jpg'] })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.overlay').exists()).toBe(true)
  })

  it('hides delete overlay when canDelete is false', async () => {
    const wrapper = createWrapper({ canDelete: false, initialFileData: ['http://example.com/img.jpg'] })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.overlay').exists()).toBe(false)
  })
})

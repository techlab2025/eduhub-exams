import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FormHeaderSection from '../FormHeaderSection.vue'

// Mock icon
vi.mock('../../icons/HeaderEditIcon.vue', () => ({ default: { template: '<span class="mock-edit-icon" />' } }))

// Mock background image
vi.mock('@/assets/images/HeaderBack.png', () => ({ default: 'mocked-header-back.png' }))

const routerLinkStub = {
  template: '<a :href="to" :class="$attrs.class"><slot /></a>',
  props: ['to'],
}

const createWrapper = (props = {}) =>
  mount(FormHeaderSection, {
    props: {
      title: 'Section Title',
      subtitle: 'Section Subtitle',
      editLink: '/edit/1',
      ...props,
    },
    global: {
      stubs: { 'router-link': routerLinkStub },
    },
  })

describe('FormHeaderSection', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the title', () => {
    const wrapper = createWrapper({ title: 'Employee Info' })
    expect(wrapper.find('.title').text()).toBe('Employee Info')
  })

  it('displays the subtitle', () => {
    const wrapper = createWrapper({ subtitle: 'Personal details' })
    expect(wrapper.find('.subtiltle').text()).toBe('Personal details')
  })

  it('renders edit link with correct href', () => {
    const wrapper = createWrapper({ editLink: '/edit/42' })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/edit/42')
  })

  it('renders edit text', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.edit').text()).toContain('Edit')
  })

  it('renders the edit icon', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.mock-edit-icon').exists()).toBe(true)
  })

  it('has form-header-container class', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.form-header-container').exists()).toBe(true)
  })
})

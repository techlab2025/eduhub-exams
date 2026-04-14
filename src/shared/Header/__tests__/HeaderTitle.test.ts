import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderTitle from '../HeaderTitle.vue'

const createWrapper = (props = {}) =>
  mount(HeaderTitle, { props })

describe('HeaderTitle', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the title text', () => {
    const wrapper = createWrapper({ title: 'My Section' })
    expect(wrapper.find('.title').text()).toBe('My Section')
  })

  it('defaults title to empty string', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.title').text()).toBe('')
  })

  it('displays number when no icon is provided', () => {
    const wrapper = createWrapper({ number: 5 })
    expect(wrapper.find('.icon span').text()).toBe('5')
  })

  it('defaults number to 1', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.icon span').text()).toBe('1')
  })

  it('renders icon component when provided', () => {
    const IconStub = { template: '<span class="test-icon" />' }
    const wrapper = createWrapper({ icon: IconStub })
    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('hides number span when icon is provided', () => {
    const IconStub = { template: '<span class="test-icon" />' }
    const wrapper = createWrapper({ icon: IconStub })
    // When icon is provided, v-if renders the component, v-else (number span) is hidden
    const iconDiv = wrapper.find('.icon')
    // The inner span (number) should not exist — only the component renders
    const spans = iconDiv.findAll('span')
    // The test-icon span is the component output, not the number span
    expect(iconDiv.find('span:not(.test-icon)').exists()).toBe(false)
  })

  it('has the correct root class', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.header-title').exists()).toBe(true)
  })
})

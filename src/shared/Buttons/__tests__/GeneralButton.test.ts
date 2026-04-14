import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GeneralButton from '../GeneralButton.vue'

const routerLinkStub = {
  template: '<a :class="$attrs.class" :href="to"><slot /></a>',
  props: ['to'],
}

const createWrapper = (props = {}) =>
  mount(GeneralButton, {
    props,
    global: {
      stubs: { 'router-link': routerLinkStub },
    },
  })

describe('GeneralButton', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders as a button by default', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders as a router-link when isLink is true', () => {
    const wrapper = createWrapper({ isLink: true, link: '/test' })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('sets the correct button type', () => {
    const wrapper = createWrapper({ type: 'submit' })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('defaults button type to "button"', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('button').attributes('type')).toBe('button')
  })

  it('displays the title text', () => {
    const wrapper = createWrapper({ title: 'Click Me' })
    expect(wrapper.text()).toContain('Click Me')
  })

  it('applies default CSS classes', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('button').classes()).toContain('btn')
    expect(wrapper.find('button').classes()).toContain('btn-primary')
  })

  it('applies custom CSS class', () => {
    const wrapper = createWrapper({ class: 'btn btn-danger' })
    expect(wrapper.find('button').classes()).toContain('btn-danger')
  })

  it('passes link to router-link', () => {
    const wrapper = createWrapper({ isLink: true, link: '/dashboard' })
    expect(wrapper.find('a').attributes('href')).toBe('/dashboard')
  })

  it('renders icon component when provided', () => {
    const IconStub = { template: '<span class="test-icon" />' }
    const wrapper = createWrapper({ icon: IconStub })
    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('does not render icon when icon is false', () => {
    const wrapper = createWrapper({ icon: false })
    // No component should be rendered for false
    expect(wrapper.find('button').exists()).toBe(true)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BreadCrumb from '../BreadCrumb.vue'

// Mock icon
vi.mock('../../icons/ArrowIcons.vue', () => ({ default: { template: '<span class="mock-arrow" />' } }))

const createWrapper = (props = {}) =>
  mount(BreadCrumb, {
    props: {
      BreadCramps: [
        { title: 'Home', link: '/' },
        { title: 'Users', link: '/users' },
        { title: 'Details', link: '/users/1' },
      ],
      ...props,
    },
  })

describe('BreadCrumb', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders correct number of breadcrumb items', () => {
    const wrapper = createWrapper()
    const items = wrapper.findAll('li')
    expect(items).toHaveLength(3)
  })

  it('displays breadcrumb titles', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Users')
    expect(wrapper.text()).toContain('Details')
  })

  it('renders arrow separators between items (not after last)', () => {
    const wrapper = createWrapper()
    const arrows = wrapper.findAll('.mock-arrow')
    // 3 items → 2 separators
    expect(arrows).toHaveLength(2)
  })

  it('does not render arrow after last item', () => {
    const items = [{ title: 'Home', link: '/' }]
    const wrapper = createWrapper({ BreadCramps: items })
    const arrows = wrapper.findAll('.mock-arrow')
    expect(arrows).toHaveLength(0)
  })

  it('has breadcrumbs root class', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.breadcrumbs').exists()).toBe(true)
  })

  it('handles empty breadcrumbs', () => {
    const wrapper = createWrapper({ BreadCramps: [] })
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('handles single breadcrumb', () => {
    const wrapper = createWrapper({ BreadCramps: [{ title: 'Home', link: '/' }] })
    expect(wrapper.findAll('li')).toHaveLength(1)
    expect(wrapper.findAll('.mock-arrow')).toHaveLength(0)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ListItemsAddition from '../ListItemsAddition.vue'

// Mock icons
vi.mock('../../icons/ActionsSection.vue', () => ({ default: { template: '<span class="mock-actions-section" />' } }))
vi.mock('../../icons/ItemAddIcon.vue', () => ({ default: { template: '<span class="mock-item-add" />' } }))
vi.mock('../../icons/RemoveItemIcon.vue', () => ({ default: { template: '<span class="mock-remove-item" />' } }))

const createWrapper = () =>
  mount(ListItemsAddition, {
    global: {
      mocks: { $t: (key: string) => key },
    },
  })

describe('ListItemsAddition', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes with one item on mount', async () => {
    const wrapper = createWrapper()
    await nextTick()
    const inputs = wrapper.findAll('input[type="text"]')
    expect(inputs).toHaveLength(1)
  })

  it('adds a new item when add button is clicked', async () => {
    const wrapper = createWrapper()
    await nextTick()
    const addBtn = wrapper.find('.add-item')
    await addBtn.trigger('click')

    const inputs = wrapper.findAll('input[type="text"]')
    expect(inputs).toHaveLength(2)
  })

  it('emits update:items when item is added', async () => {
    const wrapper = createWrapper()
    await nextTick()
    const addBtn = wrapper.find('.add-item')
    await addBtn.trigger('click')

    expect(wrapper.emitted('update:items')).toBeTruthy()
  })

  it('removes item when remove button is clicked (with 2+ items)', async () => {
    const wrapper = createWrapper()
    await nextTick()

    // Add a second item first
    await wrapper.find('.add-item').trigger('click')
    expect(wrapper.findAll('input[type="text"]')).toHaveLength(2)

    // Remove first item
    const removeBtns = wrapper.findAll('.remove-item')
    await removeBtns[0].trigger('click')

    expect(wrapper.findAll('input[type="text"]')).toHaveLength(1)
  })

  it('does not remove the last item', async () => {
    const wrapper = createWrapper()
    await nextTick()

    // Only 1 item — removeItem guards against length <= 1
    const removeBtn = wrapper.find('.remove-item')
    await removeBtn.trigger('click')

    // Should still have 1 item
    expect(wrapper.findAll('input[type="text"]')).toHaveLength(1)
  })

  it('emits update:items when input value changes', async () => {
    const wrapper = createWrapper()
    await nextTick()

    const input = wrapper.find('input[type="text"]')
    await input.trigger('input')

    expect(wrapper.emitted('update:items')).toBeTruthy()
  })

  it('displays the header title', async () => {
    const wrapper = createWrapper()
    await nextTick()
    expect(wrapper.text()).toContain('Drop-down items')
  })

  it('shows correct item number labels', async () => {
    const wrapper = createWrapper()
    await nextTick()
    await wrapper.find('.add-item').trigger('click')

    expect(wrapper.text()).toContain('Title Item 1')
    expect(wrapper.text()).toContain('Title Item 2')
  })
})

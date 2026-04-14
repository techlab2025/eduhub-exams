import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionsButtons from '../ActionsButtons.vue'

// Mock child components
vi.mock('../../icons/ActionsSection.vue', () => ({ default: { template: '<span class="mock-actions-section" />' } }))
vi.mock('../../icons/ChecklistIcon.vue', () => ({ default: { template: '<span class="mock-checklist" />' } }))
vi.mock('../../icons/DropDownListIcon.vue', () => ({ default: { template: '<span class="mock-dropdown" />' } }))
vi.mock('../../icons/TextAreaIcon.vue', () => ({ default: { template: '<span class="mock-textarea" />' } }))
vi.mock('../../ItemsList/ListItemsAddition.vue', () => ({ default: { template: '<div class="mock-list-items" />', emits: ['update:items'] } }))

// Asset mocks are in setup.ts

const createWrapper = (props = {}) =>
  mount(ActionsButtons, {
    props: {
      checkboxVisable: true,
      dropdownVisable: true,
      textareaVisable: true,
      ...props,
    },
    global: {
      mocks: { $t: (key: string) => key },
    },
  })

describe('ActionsButtons', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders checkbox option when checkboxVisable is true', () => {
    const wrapper = createWrapper({ checkboxVisable: true })
    expect(wrapper.find('#checkbox-btn').exists()).toBe(true)
  })

  it('hides checkbox option when checkboxVisable is false', () => {
    const wrapper = createWrapper({ checkboxVisable: false })
    expect(wrapper.find('#checkbox-btn').exists()).toBe(false)
  })

  it('renders dropdown option when dropdownVisable is true', () => {
    const wrapper = createWrapper({ dropdownVisable: true })
    expect(wrapper.find('#drop-down').exists()).toBe(true)
  })

  it('hides dropdown option when dropdownVisable is false', () => {
    const wrapper = createWrapper({ dropdownVisable: false })
    expect(wrapper.find('#drop-down').exists()).toBe(false)
  })

  it('renders textarea option when textareaVisable is true', () => {
    const wrapper = createWrapper({ textareaVisable: true })
    expect(wrapper.find('#text-area').exists()).toBe(true)
  })

  it('hides textarea option when textareaVisable is false', () => {
    const wrapper = createWrapper({ textareaVisable: false })
    expect(wrapper.find('#text-area').exists()).toBe(false)
  })

  it('emits update:action with default value 1 on mount', () => {
    const wrapper = createWrapper()
    expect(wrapper.emitted('update:action')).toBeTruthy()
    expect(wrapper.emitted('update:action')![0][0]).toBe(1)
  })

  it('emits update:action when radio selection changes', async () => {
    const wrapper = createWrapper()
    const dropdownRadio = wrapper.find('#drop-down')
    await dropdownRadio.setValue('2')
    await dropdownRadio.trigger('change')

    const emitted = wrapper.emitted('update:action')!
    // Last emitted value should be 2 (the dropdown option)
    expect(emitted[emitted.length - 1][0]).toBe('2')
  })

  it('applies active class to selected action', () => {
    const wrapper = createWrapper()
    // Default is CheckedButton = 1
    const checkboxLabel = wrapper.find('label[for="checkbox-btn"]')
    expect(checkboxLabel.classes()).toContain('active')
  })

  it('has correct title text for actions', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Actions')
    expect(wrapper.text()).toContain('Check Box')
  })
})

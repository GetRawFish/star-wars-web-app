import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SortButton from '@/components/SortButton.vue'
import { SortDirection } from '@/types/enums'

describe('SortButton', () => {
  const defaultProps = {
    id: 'test-button',
    label: 'Test Label',
  }

  it('renders correctly with default props', () => {
    const wrapper = mount(SortButton, { props: defaultProps })

    expect(wrapper.attributes('id')).toBe(defaultProps.id)
    expect(wrapper.find('.sort-button__label').text()).toBe(defaultProps.label)
    expect(wrapper.attributes('aria-pressed')).toBe('false')
  })

  it('shows active sort-up icon when sortBy is asc', () => {
    const wrapper = mount(SortButton, {
      props: { ...defaultProps, sortBy: SortDirection.asc },
    })

    expect(wrapper.find('.icon--sort-up').classes()).toContain('active')
    expect(wrapper.find('.icon--sort-down').classes()).not.toContain('active')
    expect(wrapper.attributes('aria-pressed')).toBe('true')
  })

  it('shows active sort-down icon when sortBy is desc', () => {
    const wrapper = mount(SortButton, {
      props: { ...defaultProps, sortBy: SortDirection.desc },
    })

    expect(wrapper.find('.icon--sort-down').classes()).toContain('active')
    expect(wrapper.find('.icon--sort-up').classes()).not.toContain('active')
    expect(wrapper.attributes('aria-pressed')).toBe('true')
  })

  it('emits doSort event when clicked', async () => {
    const wrapper = mount(SortButton, { props: defaultProps })

    await wrapper.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('doSort')
  })

  it('has correct aria-label', () => {
    const wrapper = mount(SortButton, { props: defaultProps })

    expect(wrapper.attributes('aria-label')).toBe(
      `Sort items by ${defaultProps.label.toLowerCase()}`,
    )
  })

  it('has proper typing for emitted events', () => {
    const wrapper = mount(SortButton, { props: defaultProps })

    // Simulate click and check emitted event type
    wrapper.trigger('click')
    const emitted = wrapper.emitted('doSort')
    expect(emitted).toBeDefined()
    expect(emitted?.length).toBe(1)
    expect(emitted?.[0]).toEqual([]) // Should be empty array as per component
  })
})

import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SearchField from '@/components/SearchField.vue'

describe('SearchField', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchField, { props: { label: 'Search by name' } })
    expect(wrapper.text()).toContain('Search by name')
  })
})

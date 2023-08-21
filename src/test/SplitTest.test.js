import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import SplitTestTest from './SplitTestTest.svelte'

describe('SplitTest.svelte', () => {
  it('Renders with minimal given props', () => {
    const { container } = render(SplitTestTest)

    expect(container).toBeTruthy()
  })

  it('Should show slot for test A with given identifier that would result test A being shown', () => {
    // It's coincidental that the identifier "a" gives results for test "a", but I'll take it
    const { queryByText } = render(SplitTestTest, { identifier: 'a' })

    expect(queryByText('Test A')).toBeTruthy()
    expect(queryByText('Test B')).not.toBeTruthy()
  })

  it('Should show slot for test B with given identifier that would result test B being shown', () => {
    const { queryByText } = render(SplitTestTest, { identifier: '123' })

    expect(queryByText('Test A')).not.toBeTruthy()
    expect(queryByText('Test B')).toBeTruthy()
  })
})

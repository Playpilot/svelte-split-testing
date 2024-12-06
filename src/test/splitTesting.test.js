import { describe, expect, it, vi } from 'vitest'

import { performSplitTestAction } from '../lib/splitTesting.js'

describe('splitTesting.js', () => {
  describe('performSplitTestAction', () => {
    it('Should return the expected variant', () => {
      expect(performSplitTestAction({ key: 'a', variants: ['Variant A', 'Variant B'] })).toBe('Variant A')
    })

    it('Should return the forced variant regardless of key', () => {
      expect(performSplitTestAction({ key: 'a', variants: ['Variant A', 'Variant B'], force: 'Variant B' })).toBe('Variant B')
    })

    it('Should call the given function', () => {
      const mock = vi.fn()
      performSplitTestAction({ trackingFunction: mock })
      expect(mock).toHaveBeenCalled()
    })
  })
})

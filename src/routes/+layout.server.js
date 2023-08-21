import { serverGetSplitTestIdentifier } from '$lib/splitTesting.js'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const splitTestIdentifier = serverGetSplitTestIdentifier(cookies)

  return {
    splitTestIdentifier,
  }
}

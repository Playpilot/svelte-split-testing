import { serverGetSplitTestingIdentifier } from '$lib/splitTesting.js'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const splitTestingIdentifier = serverGetSplitTestingIdentifier(cookies)

  return {
    splitTestingIdentifier,
  }
}

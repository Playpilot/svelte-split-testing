import { BROWSER } from 'esm-env'
import { v4 as uuidv4 } from 'uuid'
import { prng_alea as seedrandom } from 'esm-seedrandom'

const oneYear = 365 * 864e5

/**
 * Retrieves or generates a split testing identifier for a user, using cookies or an optional user identifier.
 * This Identifier will be used for all split tests.
 * This is to be used server side only, in a layout.server file.
 *
 * @param {object} serverCookies - An object representing the cookies as served from the server.
 * @param {object} options - Optional parameters.
 * @param {string|null} options.userIdentifier - An optional user identifier to use as the identifier. This is used to show a user the same split test across different devices, as long as they have the same identifier. If an identifier was already set before the user identifier was given the original cookie will be used instead. Be aware that this value will be saved in the cookie as a plain string. Do not use any data that you might not want to be public.
 * @param {string} options.cookieName - The name of the cookie used to store the split testing identifier.
 * @returns {string} The split testing identifier for the user.
 */
export function serverGetSplitTestIdentifier(serverCookies, { userIdentifier = null, cookieName = 'splitTestIdentifier' } = {}) {
  let identifier = serverCookies.get(cookieName)

  if (identifier) return identifier

  identifier = userIdentifier || uuidv4()
  serverCookies.set(cookieName, identifier, {
    expires: new Date(Date.now() + oneYear),
    hostOnly: true,
    httpOnly: false,
    path: '/',
    sameSite: false,
    secure: false,
  })

  return identifier
}

/**
 * Retrieves or generates a split testing identifier for a user, using cookies or an optional user identifier.
 * This Identifier will be used for all split tests.
 * This is to be used client side only.
 * @param {object} options - Optional parameters.
 * @param {string|null} options.userIdentifier - An optional user identifier to use as the identifier. This is used to show a user the same split test across different devices, as long as they have the same identifier. If an identifier was already set before the user identifier was given the original cookie will be used instead. Be aware that this value will be saved in the cookie as a plain string. Do not use any data that you might not want to be public.
 * @param {string} options.cookieName - The name of the cookie used to store the split testing identifier.
 * @returns {string} The split testing identifier for the user.
 */
export function clientGetSplitTestIdentifier({ userIdentifier = null, cookieName = 'splitTestIdentifier' } = {}) {
  if (!BROWSER) return

  let identifier = clientGetSplitTestCookie(cookieName)

  if (identifier) return identifier

  identifier = userIdentifier || uuidv4()
  clientSetSplitTestCookie(cookieName, identifier)

  return identifier
}

function clientSetSplitTestCookie(cookieName, identifier) {
  if (!BROWSER) return

  const expires = new Date(Date.now() + oneYear).toUTCString()

  document.cookie = `${cookieName}=${identifier}; expires=${expires}; path=/`;
}

function clientGetSplitTestCookie(cookieName) {
  if (!BROWSER) return

  return document.cookie?.split(';').reduce((r, v) => {
    const [name, value] = v?.split('=').map(item => item.trim())
    return name === cookieName ? decodeURIComponent(value) : r.trim()
  }, '')
}

/**
 * Generate a random number based on a seed, meaning it will always be
 * the same outcome as long as the identifier is the same.
 * The key is also included to prevent one user from always seeing test A
 * for every test case.
 * @param {object} options - Optional parameters.
 * @param {string} options.key - Key used to identify the current test
 * @param {string[]} options.variants - Array of strings with all possible variants
 * @param {string} options.identifier - Identifier used to find the current variants. Either from cookie or from user identifier.
 * @param {string} options.force - Force a particular split test by string.
 * @returns {string} The variant to be used
 */
export function getVariant({ key, variants = [], identifier, force }) {
  const randomized = seedrandom(identifier + key).quick()
  const index = Math.floor(randomized * variants.length)
  return force && variants.includes(force) ? force : variants[index]
}

/**
 * Perform a split test outside of a component. The variant is generated and returned from this function. It will perform a view action when called.
 * @param {object} options - Optional parameters.
 * @param {string} options.key - Key used to identify the current test
 * @param {string} options.action - Action send to analytics tracking
 * @param {string[]} options.variants - Array of strings with all possible variants
 * @param {string|null} options.userIdentifier - Optional user identifier to override the cookie identifier
 * @param {string} options.force - Force a particular split test by string.
 * @param {Function} options.trackingFunction - Function to override the default GTM data layer tracking. `{ action, key, variant }` is passed as the first and only parameter.
 * @returns {string} The variant that was used
 * @example `
 * const variant = performSplitTestAction({ ... })
 * if (variant === "A") doThingA()
 * else if (variant === "B") doThingB()
 */
export function performSplitTestAction({ key = '', action = 'view', variants = [], userIdentifier = null, force = null, trackingFunction = null } = {}) {
  const identifier = clientGetSplitTestIdentifier({ userIdentifier })
  const variant = getVariant({ key, variants, identifier, force })

  typeof trackingFunction === "function" ? trackingFunction({ action, key, variant }) : sendToDataLayer({ action, key, variant })

  return variant
}

/**
 * Send an event to GTM data layer
 * @param {object} options - Parameters.
 * @param {string} options.action - Action send to analytics tracking
 * @param {string} options.key - Key used to identify the current test
 * @param {string} options.variant - The current variant being used
 * @example `
 * const variant = performSplitTestAction({ ... })
 * if (variant === "A") doThingA()
 * else if (variant === "B") doThingB()
 */
export function sendToDataLayer({ action, key, variant } = {}) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: 'Split Test', action, label: key, value: variant })
}

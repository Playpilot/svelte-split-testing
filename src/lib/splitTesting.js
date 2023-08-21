import { BROWSER } from 'esm-env'
import { v4 as uuidv4 } from 'uuid'

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
    console.log(name, value)
    return name === cookieName ? decodeURIComponent(value) : r.trim()
  }, '')
}

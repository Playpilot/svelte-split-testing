<script>
  import { BROWSER } from 'esm-env'
  import { getContext, onMount } from 'svelte'
  import { clientGetSplitTestIdentifier, getVariant, sendToDataLayer } from './splitTesting.js'

  /**
   * @typedef {Object} Props
   * @property {string} [key] - Key to identify this split test. This is the name you will see in GTM.
   * @property {function|null} [onView] - Optional function to be calling the view tracking action to override the default GTM action
   * @property {string[]} [variants] - Different variants to be used in the split test. The actual names don't matter, but they will help you identify the shown variant in GTM.
   * @property {string} [variant] - Current variant. This is exported to be used with `bind:variant`
   * @property {import('svelte').Snippet<[any]>} [children]
   */

  /** @type {Props} */
  let {
    key = 'Some Key',
    onView = null,
    variants = ['Variant A', 'Variant B'],
    variant = $bindable(''),
    children
  } = $props()

  const identifier = getContext('splitTestIdentifier') ?? clientGetSplitTestIdentifier()
  const force = getParam()

  variant = getVariant({ key, variants, identifier, force })

  onMount(() => {
    if (!BROWSER) return

    if (typeof onView === "function") onView({ key, variant, action: 'view' })
    else performAction('view')
  })

  // Get the "force-split-test" param from the current url to override the shown
  // variant. This only works client side, you might see a different variant SSR.
  // We're not using $page because this needs to work without Kit as well.
  function getParam() {
    if (!BROWSER) return

    const searchParams = new URLSearchParams(window.location.search)
    const param = searchParams.get('force-split-test')

    if (!param) return

    if (variants.includes(param)) return param
  }

  // Send an event to GTM
  function performAction(action = 'click') {
    if (!BROWSER) return

    sendToDataLayer({ action, key, variant })
  }
</script>

{@render children?.({ variant, performAction })}

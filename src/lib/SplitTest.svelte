<script>
  import { BROWSER } from 'esm-env'
  import { getContext, onMount } from 'svelte'
  import { clientGetSplitTestIdentifier, getVariant, sendToDataLayer } from './splitTesting.js'

  const identifier = getContext('splitTestIdentifier') ?? clientGetSplitTestIdentifier()

  // Key to identify this split test. This is the name you will see in GTM.
  export let key = 'Some Key'
  // Optional function to be calling the view tracking action to override
  // the default GTM action
  export let onView = null

  // Different variants to be used in the split test. The actual names don't matter,
  // but they will help you identify the shown variant in GTM.
  export let variants = ['Variant A', 'Variant B']

  // Current variant. This is exported to be used with `bind:variant`
  export let variant = getVariant({ key, variants, identifier })

  $: force = getParam()
  $: variant = getVariant({ key, variants, identifier, force })

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

<slot {variant} {performAction} />

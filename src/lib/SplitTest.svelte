<script>
  import { BROWSER } from 'esm-env'
  import { prng_alea as seedrandom } from 'esm-seedrandom'
  import { getContext, onMount } from 'svelte'

  // Key to identify this split test. This is the name you will see in GTM.
  export let key = 'Some Key'
  // Optional function to be calling the view tracking action to override
  // the default GTM action
  export let onView = null

  // Different variants to be used in the split test. The actual names don't matter,
  // but they will help you identify the shown variant in GTM.
  export let variants = ['Variant A', 'Variant B']

  const identifier = getContext('splitTestingIdentifier')

  // Generate a random number based on a seed, meaning it will always be
  // the same outcome as long as the identifier is the same..
  // The key is also included to prevent one user from always seeing test A
  // for every test case.
  const randomized = seedrandom(identifier + key).quick()
  const index = Math.floor(randomized * variants.length)

  $: force = getParam()
  $: variant = force || variants[index]

  onMount(() => {
    if (typeof onView === "function") onView({ key, variant })
    else performAction('view')
  })

  // Get the "force-split-test" param from the current url to override the shown
  // variant. This only works client side, you might see a different variant SSR.
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
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'Split Test', action, label: key, value: variant })
  }
</script>

<slot {variant} {performAction} />

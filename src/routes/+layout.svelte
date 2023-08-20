<script>
  import { clientGetSplitTestingIdentifier } from '$lib/splitTesting.js'
  import { setContext } from 'svelte'

  export let data

  setContext('splitTestingIdentifier', data?.splitTestingIdentifier || clientGetSplitTestingIdentifier())
</script>

<slot />

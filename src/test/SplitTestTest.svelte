<script>
  import { setContext } from 'svelte'
  import SplitTest from '../lib/SplitTest.svelte'

  export let identifier = 'A'

  setContext('splitTestIdentifier', identifier)
</script>

<SplitTest let:variant>
  {#if variant === 'Variant A'}<p>Test A</p>{/if}
  {#if variant === 'Variant B'}<p>Test B</p>{/if}
</SplitTest>

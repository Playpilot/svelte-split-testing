<script>
  import { setContext } from 'svelte'
  import SplitTest from '../lib/SplitTest.svelte'

  /** @type {{ identifier: string }} */
  const { identifier = 'A' } = $props()

  setContext('splitTestIdentifier', identifier)
</script>

<SplitTest >
  {#snippet children({ variant })}
    {#if variant === 'Variant A'}<p>Test A</p>{/if}
    {#if variant === 'Variant B'}<p>Test B</p>{/if}
  {/snippet}
</SplitTest>

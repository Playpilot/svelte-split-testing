<script>
  import { setContext } from 'svelte'

  const { data, children } = $props()

  setContext('splitTestIdentifier', data?.splitTestIdentifier)
</script>

{@render children?.()}

<script>
  import { setContext } from 'svelte'

  export let data

  setContext('splitTestingIdentifier', data?.splitTestingIdentifier)
</script>

<slot />

<script>
  import { setContext } from 'svelte'

  export let data

  setContext('splitTestIdentifier', data?.splitTestIdentifier)
</script>

<slot />

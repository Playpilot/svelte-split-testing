<script>
  import SplitTest from "$lib/SplitTest.svelte"

</script>
<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<SplitTest let:variant>
  {#if variant === "Variant A"}
    Variant A is showing
  {:else}
    Variant B is showing
  {/if}
</SplitTest>

<style>
  :global(body) {
    background: black;
    color: lightgray;
  }
</style>

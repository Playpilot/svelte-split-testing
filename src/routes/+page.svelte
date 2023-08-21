<script>
  import { page } from "$app/stores";
  import SplitTest from "$lib/SplitTest.svelte"

  const colors = {
    Pink: '#FF73F8',
    Blue: '#2E80FF',
    Orange: '#FEA03C',
    Green: '#08D3C3',
  }
</script>

<title>Svelte Split Testing</title>

<div class="wrapper">
	<header class="header">
		<h1><mark>Svelte</mark> Split Testing</h1>
  </header>

  <div class="block">
    <p>Split tests (or A/B tests) allow you to display different features or variants to test their effectiveness. Unfortunately popular options are very pricey, bloated, and don't work SSR. This package attempts to remedy all of that.</p>
    <p>This package works with <strong>Svelte</strong> and <strong>SvelteKit</strong>.</p>
    <p><em>Uses Google Tag Manager by default to keep track of your analytics, but this can be replaced with other methods.</em></p>
    <p><a target="_blank" href="https://github.com/Mitcheljager/svelte-split-testing">GitHub</a></p>
  </div>

  <div class="block">
    <h2>Demo</h2>

    <p>What you are doing with your split tests is completely up to you of course. These examples show some basics of how it all works, but the sky is the limit.</p>

    {#key $page.url.searchParams.get('force-split-test')}
      <SplitTest let:variant>
        <h4 class="well">You are currently being shown split test <mark>{variant}</mark></h4>
      </SplitTest>
    {/key}


    <p>Split tests are randomized based on a cookie or a given user identifier. You can override this by adding <code>?force-split-test=[Variant name]</code> to the url. This is only meant for debugging.</p>

    <div class="well">
      <div class="buttons">
        <a class="button" data-sveltekit-noscroll href="/">Don't force any test</a>
        <a class="button" data-sveltekit-noscroll href="/?force-split-test=Variant A">Force test A</a>
        <a class="button" data-sveltekit-noscroll href="/?force-split-test=Variant B">Force test B</a>
      </div>

      {#key $page.url.searchParams.get('force-split-test')}
        <SplitTest let:variant>
          <strong>{variant}</strong> is showing
        </SplitTest>
      {/key}
    </div>

    <p><small>Note: Forcing the variant doesn't work SSR, if you're viewing this page without Javascript you might not see a difference. Regular split tests do work during SSR.</small></p>

    <p>You can include as many variants as you like.</p>

    <div class="well">
      <div class="buttons">
        <a class="button" data-sveltekit-noscroll href="/">Don't force any test</a>
        {#each Object.entries(colors) as [name, value]}
          <a class="button" data-sveltekit-noscroll href="/?force-split-test={name}" style:background-color={value}>{name}</a>
        {/each}
      </div>

      {#key $page.url.searchParams.get('force-split-test')}
        <SplitTest variants={Object.keys(colors)} let:variant>
          <strong style:color={colors[variant]}>{variant}</strong> is showing
        </SplitTest>
      {/key}
      </div>
  </div>

  <div class="block">
    <h2>Set up</h2>

    <p>Install using Yarn or NPM.</p>
    <code class="well">yarn add <mark>svelte-split-testing</mark> --dev</code>
    <code class="well">npm install <mark>svelte-split-testing</mark> --save-dev</code>

    <p>The component isn't quite plug-and-play, we will need to set up some details.</p>

    <h3>SvelteKit</h3>

    <p>When using SvelteKit we need to make sure the same identifier is set on the server as is set on the client.</p>

    <p>In your (main) <code>+layout.server.js</code> load function import and set the identifier and pass it along.</p>

    <code class="well"><pre>
import &#123; <mark>serverGetSplitTestingIdentifier</mark> &#125; from <mark class="string">'svelte-split-testing/splitTesting'</mark>

<mark class="comment">/** @type &#123;import('./$types').LayoutServerLoad&#125; */</mark>
export async function load(&#123; <mark>cookies</mark> &#125;) &#123;
  const <mark>splitTestingIdentifier</mark> = <mark>serverGetSplitTestingIdentifier</mark>(<mark>cookies</mark>)

  return &#123;
    <mark>splitTestingIdentifier</mark>,
  &#125;
&#125;
</pre></code>

    <p>Important here is that you pass along the SSR cookies object.</p>

    <p>Next, in your (main) <code>+layout.js</code> load function pass the identifier along again. We don't actually need to do anything with it just yet.</p>

    <code class="well"><pre>
export async function load(&#123; <mark>data</mark> &#125;) &#123;
  const &#123; <mark>splitTestingIdentifier</mark> &#125 = data || &#123;&#125

  return &#123;
    <mark>splitTestingIdentifier</mark>,
  &#125;
&#125;
</pre></code>

    <p>This is a bit verbose, but this is assuming you have other stuff going on in the file as well. If you don't, you could simply pass it as <code>return &#123; ...data &#125;</code>.

    <p>Next, in your (main) <code>+layout.svelte</code> set the identifier using the Context API. Make sure to use the correct key.</p>

<code class="well"><pre>
&lt;script&gt;
  import &#123; <mark>clientGetSplitTestingIdentifier</mark> &#125; from <mark class="string">'svelte-split-testing/splitTesting'</mark>
  import &#123; <mark>setContext</mark> &#125; from <mark class="string">'svelte'</mark>

  export let data

  <mark>setContext</mark>(<mark class="string">'splitTestingIdentifier'</mark>, data?.<mark>splitTestingIdentifier</mark>)
&lt;/script&gt;

&lt;slot /&gt;
</pre></code>

    <p>And that's the basic set up for SvelteKit. Next up will we go in to usage.</p>

    <h3>Svelte (without Kit)</h3>

    <p>For Svelte (without Kit) we do not yet need any set up. There might be some set up depending on your needs, but we will get to that in the Usage section.</p>
  </div>

  <div class="block">
    <h2>Usage</h2>

  </div>
</div>

<style>
	:global(:root) {
		--primary: #ff3e00;
		--primary-light: #ff602b;
		--text-color: #444;
		--text-color-light: #999;
		--text-color-lightest: black;
		--border-color: #edf3f0;
		--bg-well: #f6fafd;
		--bg-body: #fff;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--text-color: #b7c0d1;
			--text-color-light: #8e99af;
			--text-color-lightest: white;
			--border-color: #363d49;
			--bg-well: #21242c;
			--bg-body: #16181d;
		}
	}

	:global(body) {
		padding: 0;
		margin: 0;
		background: var(--bg-body);
		color: var(--text-color);
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		overflow-x: hidden;
	}

	h1 {
		margin: 0;
		color: var(--text-color-lightest);
	}

	h2 {
		margin: 0 0 1.5rem;
		color: var(--text-color-lightest);
	}

	h3 {
		margin-top: 2rem;
    color: var(--text-color-lightest);
	}

	code {
		margin-top: 1rem;
		color: var(--text-color-light);
		font-size: .75rem;
		line-height: 1.5em;
	}

  pre {
    margin: 0;
  }

	mark {
		background: none;
		color: var(--primary);
	}

  mark.string {
    color: #98C379;
  }

  mark.comment {
    color: #6A7277;
  }

	a {
		color: var(--primary);
	}

	p:first-child {
		margin-top: 0;
	}

	.button {
		appearance: none;
		-webkit-appearance: none;
		background: var(--primary);
		padding: 0.5rem 0.75rem;
		margin: 0.25rem 0;
		border: 0;
		border-radius: 0.25rem;
		cursor: pointer;
		transition: outline 100ms, transform 100ms;
		font-size: 1rem;
		color: white;
    text-decoration: none;
	}

	.button:hover {
		background: var(--primary-light);
	}

	.button:focus-visible:not(:active) {
		outline: 3px solid var(--text-color-lightest);
	}

	.button:active {
		transform: scale(0.95);
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.5rem;
	}

	.button-code-group {
		display: grid;
		grid-template-columns: 7rem auto;
		align-items: center;
		gap: 1rem;
		margin: 0.5rem 0;
	}

	.button-code-group button {
		width: 100%;
	}

	.button-code-group code {
		margin: 0;
	}

	.well {
    display: block;
		padding: .35rem .5rem;
		border-radius: .5rem;
		border: 1px solid var(--border-color);
		background: var(--bg-well);
    overflow-x: auto;
	}

	.header {
		margin: 6rem 0 0;
	}

	:global(.header svg) {
		width: 100%;
		height: 5px;
	}

	.wrapper {
		max-width: 540px;
		margin: 0 auto;
		padding: 0 1rem 6rem;
	}

	.block {
		padding: 3rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.description {
		margin-bottom: 1rem;
	}

	@media (min-width: 600px) {
		.description {
			margin-bottom: 0;
		}
	}

	.table {
		display: grid;
		grid-template-columns: 1fr 1fr 3fr;
		grid-gap: 1rem .5rem;
	}

	.table strong {
		color: var(--text-color);
	}

	.table code {
		margin-top: 0;
		line-height: 1.3rem;
	}
</style>

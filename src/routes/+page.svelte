<script>
  import { page } from "$app/stores"
  import SplitTest from "$lib/SplitTest.svelte"

  const colors = {
    Pink: '#d453f7',
    Blue: '#55cbf2',
    Yellow: '#f7c74e',
    Green: '#409b83',
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

    <ul>
      <li>Works SSR</li>
      <li>Works with or without Kit</li>
      <li>Works with GTM and GA4, or any other analytics solution</li>
      <li>Lightweight</li>
      <li>It's free!</li>
    </ul>

    <div class="buttons">
      <a class="button" target="_blank" href="https://github.com/Playpilot/svelte-split-testing">GitHub</a>
      <a class="button" target="_blank" href="https://www.npmjs.com/package/svelte-split-testing">NPM</a>
    </div>
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
  </div>

  <div class="block">
    <h3>SvelteKit</h3>

    <p>When using SvelteKit we need to make sure the same identifier is set on the server as is set on the client.</p>
    <p>In your (main) <code>+layout.server.js</code> load function import and set the identifier and pass it along.</p>

<code class="well"><pre>
import &#123; <mark>serverGetSplitTestIdentifier</mark> &#125; from <mark class="string">'svelte-split-testing/splitTesting'</mark>

<mark class="comment">/** @type &#123;import('./$types').LayoutServerLoad&#125; */</mark>
export async function load(&#123; <mark>cookies</mark> &#125;) &#123;
  const <mark>splitTestIdentifier</mark> = <mark>serverGetSplitTestIdentifier</mark>(<mark>cookies</mark>)

  return &#123;
    <mark>splitTestIdentifier</mark>,
  &#125;
&#125;
</pre></code>

    <p>Important here is that you pass along the SSR cookies object.</p>
    <p>Next, in your (main) <code>+layout.js</code> load function pass the identifier along again. We don't actually need to do anything with it just yet.</p>

<code class="well"><pre>
export async function load(&#123; <mark>data</mark> &#125;) &#123;
  const &#123; <mark>splitTestIdentifier</mark> &#125 = data || &#123;&#125

  return &#123;
    <mark>splitTestIdentifier</mark>,
  &#125;
&#125;
</pre></code>

    <p>This is a bit verbose, but this is assuming you have other stuff going on in the file as well. If you don't, you could simply pass it as <code>return &#123; ...data &#125;</code>.
    <p>Next, in your (main) <code>+layout.svelte</code> set the identifier using the Context API. Make sure to use the correct key.</p>

<code class="well"><pre>
&lt;script&gt;
  import &#123; <mark>clientGetSplitTestIdentifier</mark> &#125; from <mark class="string">'svelte-split-testing/splitTesting'</mark>
  import &#123; <mark>setContext</mark> &#125; from <mark class="string">'svelte'</mark>

  export let data

  <mark>setContext</mark>(<mark class="string">'splitTestIdentifier'</mark>, data?.<mark>splitTestIdentifier</mark>)
&lt;/script&gt;

&lt;slot /&gt;
</pre></code>

    <p>And that's the basic set up for SvelteKit. Next up will we go in to usage.</p>
  </div>

  <div class="block">
    <h3>Svelte (without Kit)</h3>

    <p>For Svelte (without Kit) we do not yet need any set up. There might be some set up depending on your needs, but we will get to that in the Usage section.</p>
  </div>

  <div class="block">
    <h2>Usage</h2>

    <code class="well">
      import &#123; <mark>SplitTest</mark> &#125; from <mark class="string">'svelte-split-testing'</mark><br>
      <br>
      &lt;<mark>SplitTest</mark>&gt;...&lt;/<mark>SplitTest</mark>&gt;
    </code>

		<p>At it's most basic <code>SplitTest</code> is a wrapper component that takes care of some business, but for you as the user it's really just a slot. This components has a slot prop called <code>variant</code>, this will be used by you to determine what is shown in what variant.</p>
		<p>When using the component there's 2 important props: <code>key</code> and <code>variants</code>.</p>
		<p><code>key</code> Is the name of the split test. It isn't very important for functionally what this key is, is doesn't even need to be unique. It's only used to identify what split test is for your analytics tracking.</p>
		<p><code>variants</code> Is an array of strings with each variant you want to include. What the names are is not important, but this name is what will be used in your analytics tracking. You could go for something simple like <code>['A', 'B']</code>, or give them more explicit names like <code>['Large Sign Up', 'Small Sign Up']</code>, it's up to you.</p>
  </div>

  <div class="block">
    <h3>Variants</h3>

    <p>In the following example we have two variants, each having 50% chance to show. We use the slot prop <code>variant</code> to determine what to show for each variant.</p>

<code class="well"><pre>
&lt;<mark>SplitTest</mark>
  <mark>key</mark>=<mark class="string">"Some test"</mark>
  <mark>variants</mark>=&#123;[<mark class="string">'Variant A'</mark>, <mark class="string">'Variant B'</mark>]&#125;
  let:<mark>variant</mark>&gt;

  &#123;#if <mark>variant</mark> === <mark class="string">'Variant A'</mark>&#125;
    &lt;button&gt;Do the thing&lt;/button&gt;
  &#123;/if&#125;

  &#123;#if <mark>variant</mark> === <mark class="string">'Variant B'</mark>&#125;
    &lt;button&gt;Do the thing, but different&lt;/button&gt;
  &#123;/if&#125;
&lt;/<mark>SplitTest</mark>&gt;
</pre></code>

    <p>You don't have to use <code>if</code> statements, you could use it like any other variable.</p>

<code class="well"><pre>
&lt;<mark>SplitTest</mark>
  <mark>key</mark>=<mark class="string">"Some test"</mark>
  <mark>variants</mark>=&#123;[<mark class="string">'Variant A'</mark>, <mark class="string">'Variant B'</mark>]&#125;
  let:<mark>variant</mark>&gt;

  Current showing variant: &#123;<mark>variant</mark>&#125;
&lt;/<mark>SplitTest</mark>&gt;
</pre></code>

    <p>Using this you could quickly set up the use of different styles, for example.</p>

<code class="well"><pre>
&lt;script&gt;
  const <mark>variants</mark> = &#123;
    Plain: <mark class="string">'button-plain</mark>',
    Colorful: <mark class="string">'button-colorful</mark>',
  &#125;
&lt;/script&gt;

&lt;<mark>SplitTest</mark>
  <mark>key</mark>=<mark class="string">"Some test"</mark>
  <mark>variants</mark>=&#123;Object.keys(<mark>variants</mark>)&#125;
  let:<mark>variant</mark>&gt;

  &lt;button class=&#123;<mark>variants</mark>[<mark>variant</mark>]&#125;&gt;...&lt;/button&gt;
&lt;/<mark>SplitTest</mark>&gt;
</pre></code>
  </div>

  <div class="block">
    <h3>Tracking</h3>

    <p>By default the Split Test will use Google Tag Manager, using the data layer, to keep track of your events. This can be changed to any other method, which will we go in to later.</p>

    <p>When a split test is shown an event is send to GTM with the given key as the label, and the current variant as the value.</p>

    <p>To fire an event when a button is clicked, or any other action is performed, you can use the <code>performAction</code> slot prop. This will fire an event to GTM. You can optionally pass a value to change the event type from 'click' to whatever else.</p>

    <p>The data sent looks a little like: <code>&#123; event: 'Split Test', action: [given action], label: [given key], value: [current variant] &#125;</code>.</p>

<code class="well"><pre>
&lt;<mark>SplitTest</mark>
  <mark>key</mark>=<mark class="string">"Some test"</mark>
  let:<mark>variant</mark>
  let:<mark>performAction</mark>&gt;

  &lt;button on:click=&#123;<mark>performAction</mark>&#125;&gt;...&lt;/button&gt;
&lt;/<mark>SplitTest</mark>&gt;
</pre></code>

    <p>Of course you might want to track more than just clicks, for this you can pass any string to the <code>performAction</code> function. Once again, this is just for tracking purposes, what the string is doesn't matter.</p>

<code class="well"><pre>
&lt;<mark>SplitTest</mark>
  let:<mark>variant</mark>
  let:<mark>performAction</mark>&gt;

  &lt;form on:submit=&#123;() =&gt; <mark>performAction</mark>(<mark class="string">'form submit'</mark>)&#125;&gt;
    ...
  &lt;/form&gt;
&lt;/<mark>SplitTest</mark>&gt;
</pre></code>

    <p>If your action takes place outside of the component you can bind the property instead.</p>

<code class="well"><pre>
&lt;script&gt;
  let <mark>performAction</mark>

  function doTheThing() &#123;
    <mark>performAction</mark>()
  &#125;
&lt;/script&gt;

&lt;<mark>SplitTest</mark>
  let:<mark>variant</mark>
  bind:<mark>performAction</mark>&gt;

  &lt;form on:submit=&#123;doTheThing&#125;&gt;
    ...
  &lt;/form&gt;
&lt;/<mark>SplitTest</mark>&gt;
</pre></code>
  </div>

  <div class="block">
    <h3>Using different analytics methods</h3>

    <p>If you do not wish to use GTM you can bring your own solution. Simply pass a function to the <code>onView</code> property, and this function will be used instead. This function will be fired every time the component is mounted in CSR. It will not fire during SSR.</p>

<code class="well"><pre>
&lt;<mark>SplitTest</mark> <mark>onView</mark>=&#123;(data) =&gt; console.log(data)&#125;&gt;...&lt;/<mark>SplitTest</mark>&gt;
</pre></code>
<code class="well"><pre>
&lt;script&gt;
  function customTracking(data) &#123;
    ...
  &#125;
&lt;/script&gt;

&lt;<mark>SplitTest</mark> <mark>onView</mark>=&#123;customTracking&#125;&gt;...&lt;/<mark>SplitTest</mark>&gt;
</pre></code>

    <p>The data returns an object <code>&#123; key, variant, action: 'view' &#125;</code>. What you do with this data is up to you.</p>

    <p>For example, you could use GA4 using <code>gtag</code>.</p>

<code class="well"><pre>
&lt;script&gt;
  function customTracking(data) &#123;
    gtag('event', 'Split Test', data)
  &#125;
&lt;/script&gt;

&lt;<mark>SplitTest</mark> <mark>onView</mark>=&#123;customTracking&#125;&gt;...&lt;/<mark>SplitTest</mark>&gt;
</pre></code>

    <p>To track custom events other than views, you can use whatever method you like and use the <code>variant</code> slot prop to determine the current variant.</p>

<code class="well"><pre>
&lt;script&gt;
  const key = 'Some test'

  function trackClick(variant) &#123;
    ...
  &#125;
&lt;/script&gt;

&lt;<mark>SplitTest</mark>
  &#123;<mark>key</mark>&#125;
  <mark>variants</mark>=&#123;["A", "B"]&#125;
  let:<mark>variant</mark>&gt;

  &lt;button on:click=&#123;() =&gt; trackClick(<mark>variant</mark>)&#125;&gt;...&lt;/button&gt;
&lt;/<mark>SplitTest</mark>&gt;
</pre></code>
  </div>

  <div class="block">
    <h3>Other config options</h3>

    <h4>serverGetSplitTestIdentifier</h4>
    <p>This function is used in the set up to set the identifier for SSR. The second parameter in this function is an object of options.<p>

    <code class="well">
      <mark>serverGetSplitTestIdentifier</mark>(servercookies, &#123; userIdentifier, cookieName &#125;)
    </code>

    <p><code>userIdentifier</code> is used to pass an identifier to the function that will be used instead of a random identifier. This way you can make sure a user sees the same page across different devices, as long as they use the same identifier. Be aware that will identifier will be saved as a plain string in a cookie.</p>
    <p><code>cookieName</code> can be used to change the name of the cookie. Defaults to <code>splitTestIdentifier</code></p>
    <p>If you are setting this as done in the set up, you will need to make sure to pass it along to the client side as well, using <code>clientGetSplitTestIdentifier</code> with the same options, as a fallback value. This needs to be done when setting the context (refer back to the Set Up section). This is a safety net in case the value was not set as expected.</p>
    <code class="well">setContext('splitTestIdentifier', data?.splitTestIdentifier || <mark>clientGetSplitTestIdentifier</mark>(&#123; userIdentifier, cookieName &#125;))</code>

    <h4>clientGetSplitTestIdentifier</h4>
    <p>This used to set the identifier client side, this is optional if you are also using SSR. If you are using Svelte without Kit, this will be the only function you use. The first and only parameter is an object of options.<p>

    <code class="well">
      <mark>clientGetSplitTestIdentifier</mark>(&#123; userIdentifier, cookieName &#125;)
    </code>

    <p><code>userIdentifier</code> is used to pass an identifier to the function that will be used instead of a random identifier. This way you can make sure a user sees the same page across different devices, as long as they use the same identifier. Be aware that will identifier will be saved as a plain string in a cookie.</p>
    <p><code>cookieName</code> can be used to change the name of the cookie. Defaults to <code>splitTestIdentifier</code></p>
  </div>


	<div class="block">
    <h2>Properties</h2>

		<p>This is a list of all configurable properties for each component and function.</p>

    <h4>SplitTest</h4>

		<div class="table">
			<strong>Property</strong> <strong>Default</strong> <strong>Description</strong>

			<code>key</code> <code>'Some Key'</code> <div>Key used to identify the current Split Test. This is primary used during analytics tracking.</div>
      <code>variants</code> <code>['Variant A', 'Variant B']</code> <div>An array of variant names. Can be as many variants as you like. What the names are is not important, but they show up during analytics tracking.</div>
      <code>onView</code> <code>null</code> <div>Optional function to be passed to track views of the current variant. Replaces the default GTM method.</div>
		</div>

    <h4>serverGetSplitTestIdentifier</h4>

		<div class="table">
			<strong>Property</strong> <strong>Default</strong> <strong>Description</strong>

			<code>serverCookies</code> <code>null</code> <div>Cookies object as served from +layout.server.js during SSR.</div>
			<code>options</code> <code>&#123; userIdentifier, cookieName &#125;</code> <div>Object of configurable options</div>
      <code>options.userIdentifier</code> <code>null</code> <div>An optional user identifier to use as the identifier. This is used to show a user the same split test across different devices, as long as they have the same identifier. If an identifier was already set before the user identifier was given the original cookie will be used instead. Be aware that this value will be saved in the cookie as a plain string. Do not use any data that you might not want to be public.</div>
      <code>options.cookieName</code> <code>'splitTestIdentifier'</code> <div>The name of the cookie used to store the split testing identifier.</div>
		</div>

    <h4>clientGetSplitTestIdentifier</h4>

		<div class="table">
			<strong>Property</strong> <strong>Default</strong> <strong>Description</strong>

			<code>options</code> <code>&#123; userIdentifier, cookieName &#125;</code> <div>Object of configurable options</div>
      <code>options.userIdentifier</code> <code>null</code> <div>An optional user identifier to use as the identifier. This is used to show a user the same split test across different devices, as long as they have the same identifier. If an identifier was already set before the user identifier was given the original cookie will be used instead. Be aware that this value will be saved in the cookie as a plain string. Do not use any data that you might not want to be public.</div>
      <code>options.cookieName</code> <code>'splitTestIdentifier'</code> <div>The name of the cookie used to store the split testing identifier.</div>
		</div>
	</div>

  <div class="block">
		Developed by <a target="_blank" href="https://playpilot.com/">PlayPilot</a>
	</div>
</div>

<style>
	:global(:root) {
		--primary: #fa548a;
		--primary-light: #f47a8d;
    --text-color: #bed0de;
    --text-color-light: #9cb8cd;
    --text-color-lightest: white;
    --border-color: #41527c;
    --bg-well: #162036;
    --bg-body: #101426;
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
		margin-top: 0;
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

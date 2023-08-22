# Svelte Split Testing

[![npm version](https://badgen.net/npm/v/svelte-split-testing)](https://www.npmjs.com/package/svelte-split-testing)
[![npm downloads](https://badgen.net/npm/dt/svelte-split-testing)](https://www.npmjs.com/package/svelte-split-testing)
[![bundle size](https://badgen.net/bundlephobia/minzip/svelte-split-testing)](https://bundlephobia.com/package/svelte-split-testing)

Run Split Tests (or A/B tests) with the power of Svelte(Kit). Split tests (or A/B tests) allow you to display different features or variants to test their effectiveness. Unfortunately popular options are very pricey, bloated, and don't work SSR. This package attempts to remedy all of that.

This package works with Svelte and SvelteKit.

- Works SSR
- Works with or without Kit
- Works with GTM and GA4, or any other analytics solution
- Lightweight
- Free, of course

**Demo and Docs**: https://svelte-split-testing.pages.dev/

### Installation

Install using Yarn or NPM.
```js
yarn add svelte-split-testing
```
```js
npm install --save-dev svelte-split-testing
```

Include the component in your app.
```js
import { SplitTest } from "svelte-split-testing"
```
```svelte
<SplitTest>...</SplitTest>
```

### Configuration

For more configuration refer to the documentation: https://svelte-split-testing.pages.dev/

#### Properties

This is a list of all configurable properties for each component and function.

##### SplitTest

| Property | Default | Description |
| --- | --- | --- |
| key | 'Some Key' | Key used to identify the current Split Test. This is primary used during analytics tracking. |
| variants | ['Variant A', 'Variant B'] | An array of variant names. Can be as many variants as you like. What the names are is not important, but they show up during analytics tracking. |
| onView | null | Optional function to be passed to track views of the current variant. Replaces the default GTM method. |

##### serverGetSplitTestIdentifier

| Property | Default | Description |
| --- | --- | --- |
| serverCookies | null | Cookies object as served from +layout.server.js during SSR. |
| options | &#123; userIdentifier, cookieName &#125; | Object of configurable options |
| options.userIdentifier | null | An optional user identifier to use as the identifier. This is used to show a user the same split test across different devices, as long as they have the same identifier. If an identifier was already set before the user identifier |was given the original cookie will be used instead. Be aware that this value will be saved in the cookie as a plain string. Do not use any data that you might not want to be public. |
| options.cookieName | 'splitTestIdentifier' | The name of the cookie used to store the split testing identifier. |

##### clientGetSplitTestIdentifier

| Property | Default | Description |
| --- | --- | --- |
| options | &#123; userIdentifier, cookieName &#125; | Object of configurable options |
| options.userIdentifier | null | An optional user identifier to use as the identifier. This is used to show a user the same split test across different devices, as long as they have the same identifier. If an identifier was already set before the user identifier |was given the original cookie will be used instead. Be aware that this value will be saved in the cookie as a plain string. Do not use any data that you might not want to be public. |
| options.cookieName | 'splitTestIdentifier' | The name of the cookie used to store the split testing identifier. |

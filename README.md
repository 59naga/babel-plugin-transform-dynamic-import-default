Experimental syntax dynamic import
---

<p align="right">
  <a href="https://www.npmjs.com/package/babel-plugin-experimental-syntax-dynamic-import">
    <img alt="Npm version" src="https://badge.fury.io/js/babel-plugin-experimental-syntax-dynamic-import.svg">
  </a>
  <a href="https://travis-ci.org/59naga/babel-plugin-experimental-syntax-dynamic-import">
    <img alt="Build Status" src="https://travis-ci.org/59naga/babel-plugin-experimental-syntax-dynamic-import.svg?branch=master">
  </a>
</p>

plugin of automate default access at dynamic import.

Installation
---
```
yarn add babel-plugin-experimental-syntax-dynamic-import
```

Usage
---

[Real dynamic-import syntax will force the `.default`](https://github.com/tc39/proposal-dynamic-import/issues/37), but this plugin will omit it.

```bash
babel index.js --plugins=experimental-syntax-dynamic-import
```

```js
// index.js
(async () => {
  var assert = await import("assert");
})();
```

becomes:

```js
(async () => {
  var assert = await import("assert").then(module => module.default);
})();
```

If you want to do multiple imports using destructuring objects, this plugin doesn't transform anything.

```
(async () => {
  var { strictEqual, deepEqual } = await import("assert");
})();
```

becomes(nothing happens):

```
(async () => {
  var { strictEqual, deepEqual } = await import("assert");
})();
```

See also
---
* [named-import](https://github.com/59naga/named-import)

License
---
MIT

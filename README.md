Transform dynamic import default
---

<p align="right">
  <a href="https://www.npmjs.com/package/babel-plugin-transform-dynamic-import-default">
    <img alt="Npm version" src="https://badge.fury.io/js/babel-plugin-transform-dynamic-import-default.svg">
  </a>
  <a href="https://travis-ci.org/59naga/babel-plugin-transform-dynamic-import-default">
    <img alt="Build Status" src="https://travis-ci.org/59naga/babel-plugin-transform-dynamic-import-default.svg?branch=master">
  </a>
</p>

Add `.default` to `dynamicImport` using `AwaitExpression`.

Installation
---
```
yarn add babel-plugin-transform-dynamic-import-default
```

Usage
---

[Real dynamic-import syntax will force the `.default`](https://github.com/tc39/proposal-dynamic-import/issues/37), but this plugin will omit it.

```js
// index.js
(async () => {
  var assert = await import("assert");
})();
```

```bash
babel index.js --plugins=transform-dynamic-import-default
```

becomes:

```js
(async () => {
  var assert = (await import("assert")).default;
})();
```

If you want to do multiple imports using destructuring objects, this plugin doesn't transform anything.

```js
(async () => {
  var { strictEqual, deepEqual } = await import("assert");
})();
```

becomes(nothing happens):

```js
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

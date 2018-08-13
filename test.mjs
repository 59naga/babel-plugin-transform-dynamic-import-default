import spec from "eastern";
import { strictEqual } from "assert";
import babel from "@babel/core";
import plugin from "./";

const trimAsync = code => {
  return code
    .split("\n")
    .slice(1, -1)
    .join("\n")
    .trim();
};

[
  {
    describe: "should import default entry",
    in: `
      (async () => {
        const fixture = await import('./fixture')
      })()
    `,
    out({ code }) {
      strictEqual(
        trimAsync(code),
        `const fixture = await import("./fixture").then(module => module.default);`
      );
    }
  },
  {
    describe: "should import identifier entry",
    in: `
      (async () => {
        const fixture = await import(foo)
      })()
    `,
    out({ code }) {
      strictEqual(
        trimAsync(code),
        `const fixture = await import(foo).then(module => module.default);`
      );
    }
  },
  {
    describe: "should inherit webpackChunkName",
    in: `
      (async () => {
        const fixture = await import(/* webpackChunkName: "vue" */ 'vue')
      })()
    `,
    out({ code }) {
      strictEqual(
        trimAsync(code),
        `const fixture = await import(\n  /* webpackChunkName: "vue" */\n  "vue").then(module => module.default);`
      );
    }
  },
  {
    describe: "should be not transform when assign to destructuring objects",
    in: `
      (async () => {
        const { default: fixture } = await import('./fixture')
      })()
    `,
    out({ code }) {
      strictEqual(
        trimAsync(code),
        `const {\n    default: fixture\n  } = await import('./fixture');`
      );
    }
  },
  {
    describe: "should be not transform when default property access",
    in: `
      (async () => {
        const fixture = (await import("./fixture")).default
      })()
    `,
    out({ code }) {
      strictEqual(
        trimAsync(code),
        `const fixture = (await import("./fixture")).default;`
      );
    }
  },
  {
    describe: "should be not transform when .then called",
    in: `
      (async () => {
        const fixture = await import("./fixture").then()
      })()
    `,
    out({ code }) {
      strictEqual(
        trimAsync(code),
        `const fixture = await import("./fixture").then();`
      );
    }
  }
].forEach(fixture => {
  spec(fixture.describe, () => {
    fixture.out(
      babel.transform(fixture.in, {
        plugins: [plugin]
      })
    );
  });
});

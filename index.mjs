export default ({ template }) => {
  const visitor = {
    AwaitExpression(path) {
      if (path.get("argument.callee.type").node !== "Import") {
        return;
      }
      if (!path.parentPath.isVariableDeclarator()) {
        return;
      }
      if (!path.parentPath.get("id").isIdentifier()) {
        return;
      }
      const [url] = path.get("argument.arguments");
      const argument = url.isIdentifier()
        ? url.node.name
        : `"${url.node.value}"`;

      const experimentalDynamicImport = template(
        `import(${argument}).then(module => module.default)`,
        // https://babeljs.io/docs/en/next/babel-template#options
        { plugins: ["dynamicImport"] }
      )();

      // inherit argument comment (eg /* webpackChunkName: "vue" */)
      if (url.node.leadingComments) {
        const arg =
          experimentalDynamicImport.expression.callee.object.arguments[0];
        arg.leadingComments = url.node.leadingComments;
      }

      path.get("argument").replaceWith(experimentalDynamicImport);
    }
  };

  return {
    manipulateOptions(opts, parserOpts) {
      // https://github.com/babel/babel/blob/v7.0.0-rc.1/packages/babel-plugin-syntax-dynamic-import/src/index.js
      parserOpts.plugins.push("dynamicImport");
    },
    pre(fileMap) {
      // HACK: transform import syntax before @babel/env
      fileMap.path.traverse(visitor);
    }
  };
};

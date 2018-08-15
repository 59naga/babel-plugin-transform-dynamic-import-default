export default ({ template, types }) => {
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

      // https://babeljs.io/docs/en/next/babel-template#options
      const importExpression = template(`import(${argument})`, {
        plugins: ["dynamicImport"]
      })().expression;

      // inherit argument comment (eg /* webpackChunkName: "vue" */)
      if (url.node.leadingComments) {
        const arg = importExpression.arguments[0];
        arg.leadingComments = url.node.leadingComments;
      }

      path.replaceWith(
        types.memberExpression(
          types.awaitExpression(importExpression),
          types.identifier("default")
        )
      );
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

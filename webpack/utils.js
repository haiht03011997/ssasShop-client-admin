const path = require("path");
const tsconfig = require("../tsconfig.json");

const _root = path.resolve(__dirname, "..");

function root(...args) {
  return path.resolve(_root, ...args);
}

function mapTypescriptAliasToWebpackAlias(alias = {}) {
  const webpackAliases = { ...alias };

  if (!tsconfig.compilerOptions.paths) {
    return webpackAliases;
  }

  Object.entries(tsconfig.compilerOptions.paths).forEach(([key, value]) => {
    if (value.length > 0) {
      const aliasKey = key.replace(/\/\*$/, "");
      const aliasValue = value[0].replace(/\/\*$/, "");
      webpackAliases[aliasKey] = root(aliasValue);
    }
  });

  return webpackAliases;
}

module.exports = { root, mapTypescriptAliasToWebpackAlias };

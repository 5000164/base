const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const sharedPath = path.join(__dirname, "../shared");
const schemaPath = path.join(__dirname, "../schema");
module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat([sharedPath, schemaPath]);
      }
      return webpackConfig;
    },
  },
};

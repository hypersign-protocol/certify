const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  configureWebpack: {
    plugins: [new NodePolyfillPlugin(
      {
        includeAliases:['crypto','Buffer','stream']
      }
    )],
    optimization: {
      splitChunks: {
        chunks: "all",
      }
    }
  }
})

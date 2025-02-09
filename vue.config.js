const webpack = require('webpack');

module.exports = {
  lintOnSave: false,

  devServer: {
    port: 8081,
    open: true
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    },

    //  Defines global feature flags to suppress Vue warnings and improve tree-shaking(removes unused code).
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],

  },
};

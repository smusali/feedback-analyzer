module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
    port: 8080,
  },
  outputDir: "dist",
  assetsDir: "static",
};

module.exports = {
  // Other config...
  resolve: {
    fallback: {
      process: require.resolve('process/browser'),
    },
  },
};

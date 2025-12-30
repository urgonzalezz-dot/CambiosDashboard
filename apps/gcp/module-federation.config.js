/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
module.exports = {
  name: 'gcp',
  exposes: {
    './Module': './src/remote-entry.js',
  },
};

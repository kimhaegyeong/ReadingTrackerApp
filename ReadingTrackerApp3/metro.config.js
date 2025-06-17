const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro configuration
module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add support for TypeScript files
  config.resolver.sourceExts.push('ts', 'tsx');

  // Add aliases
  config.resolver.extraNodeModules = new Proxy(
    {},
    {
      get: (target, name) => {
        if (target.hasOwnProperty(name)) {
          return target[name];
        }
        return path.join(process.cwd(), `node_modules/${name}`);
      },
    }
  );

  return config;
})();

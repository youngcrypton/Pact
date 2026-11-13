import { Config } from '@remotion/cli/config';

// Set locally installed Edge headless browser executable
Config.setBrowserExecutable(
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
);

// Configure Webpack to handle NodeNext / ESM .js imports in TypeScript
Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      extensionAlias: {
        '.js': ['.ts', '.tsx', '.js'],
      },
    },
  };
});


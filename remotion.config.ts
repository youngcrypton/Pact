import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setBrowserExecutable('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe');

Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      extensionAlias: {
        '.js': ['.ts', '.tsx', '.js', '.jsx'],
        '.mjs': ['.mts', '.mjs'],
        '.cjs': ['.cts', '.cjs'],
      },
    },
  };
});

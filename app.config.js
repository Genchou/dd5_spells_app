const IS_OSS = process.env.APP_VARIANT === 'oss';

module.exports = {
  expo: {
    name: 'Dæëndé',
    slug: 'dd5_spells',
    version: '1.1.3',
    orientation: 'portrait',
    icon: './assets/images/whatever.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/whatever.png',
      resizeMode: 'contain',
      backgroundColor: '#000',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_OSS ? 'be.gvonh.dd5_spells_oss' : 'be.gvonh.dd5_spells',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/whatever.png',
        backgroundColor: '#ffffff',
      },
      userInterfaceStyle: 'automatic',
      package: IS_OSS ? 'be.gvonh.dd5_spells_oss' : 'be.gvonh.dd5_spells',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '9e4b385e-21c6-447f-a3db-08496457cade',
      },
    },
    owner: 'genchou',
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};

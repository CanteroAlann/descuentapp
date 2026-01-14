module.exports = function(api) {
  api.cache(true);
  
  const isTest = process.env.NODE_ENV === 'test';
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Solo incluir nativewind en no-test environments
      ...(isTest ? [] : ['nativewind/babel']),
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@features': './src/features',
            '@shared': './src/shared',
            '@infrastructure': './src/infrastructure',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};

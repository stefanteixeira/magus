module.exports = {
  plugins: [
    'postcss-import',
    'tailwindcss/nesting',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
          'nesting-rules': false,
        },
      },
    ],
    ['tailwindcss', {}],
    ['autoprefixer', {}],
  ],
}

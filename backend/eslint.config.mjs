import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules', 'music', 'data']
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'off'
    }
  }
];

module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/prettier',
    '@vue/typescript',
    'plugin:promise/recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    eqeqeq: [
      'error',
      'always',
      {
        null: 'ignore'
      }
    ],
    quotes: ['error', 'single'],
    //强制不使用分号结尾
    semi: ['error', 'never'],
    'prettier/prettier': ['error']
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  plugins: ['promise', 'typescript']
}

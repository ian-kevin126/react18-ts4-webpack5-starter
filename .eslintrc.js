module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  // extends 数组的顺序非常重要。基本上每次向阵列添加新配置时，它都会覆盖以前的配置
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime'
    // 'plugin:prettier/recommended'
    // 'prettier'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off'
    // semi: 2,
    // indent: [
    //   'error',
    //   4,
    //   {
    //     VariableDeclarator: 2,
    //     SwitchCase: 1
    //   }
    // ]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}

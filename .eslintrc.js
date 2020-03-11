module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: 'babel-eslint'
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/recommended',
      'prettier/vue',
      'plugin:prettier/recommended'
    ],
    // required to lint *.vue files
    plugins: [
      'vue'
    ],
    // add your custom rules here
    rules: {
        'semi': [0, 'never'],
        'no-console': 'off',
        'vue/max-attributes-per-line': 'off',
        'prettier/prettier': ['error', { 'semi': false }],
        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-unused-vars": 'off',
        "vue/no-template-shadow": "off"
    },
    globals: {
        $nuxt: true
    },
  }

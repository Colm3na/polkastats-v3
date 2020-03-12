module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    "cypress/globals": true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "prettier/vue",
    "plugin:prettier/recommended"
  ],
  // required to lint *.vue files
  plugins: ["vue", "cypress"],
  // add your custom rules here
  rules: {
    "no-console": "off",
    "vue/max-attributes-per-line": "off",
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": "off",
    "vue/no-template-shadow": "off",
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-force": "warn"
  },
  globals: {
    $nuxt: true
  }
};

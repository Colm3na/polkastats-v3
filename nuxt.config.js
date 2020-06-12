export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Polkadot network statistics"
      }
    ],
    link: [{ rel: "icon", type: "image/png", href: "/img/favicon.png" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/fontawesome.js", "~/plugins/i18n"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    "bootstrap-vue/nuxt",
    // https://www.npmjs.com/package/nuxt-clipboard2
    "nuxt-clipboard2",
    // https://www.npmjs.com/package/cookie-universal-nuxt
    ["cookie-universal-nuxt", { alias: "cookies" }],
    ["@nuxtjs/apollo"],
    "@nuxtjs/toast"
  ],
  buildModules: [
    // https://github.com/nuxt-community/analytics-module
    [
      "@nuxtjs/google-analytics",
      {
        id: "UA-144344973-1"
      }
    ]
  ],
  /*
   ** Apollo module configuration
   ** See https://github.com/nuxt-community/apollo-module
   */
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: "https://v3dev1.polkastats.io/api/v3",
        wsEndpoint: "wss://v3dev1.polkastats.io/api/v3",
        websocketsOnly: true
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },
  router: {
    middleware: "i18n"
  },
  toast: {
    position: "top-right"
  }
};

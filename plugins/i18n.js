import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export default ({ app, store }) => {
  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: navigator.language.slice(0, 2),
    fallbackLocale: "en",
    messages: {
      en: require("~/locales/en.json"),
      es: require("~/locales/es.json")
    }
  });
};

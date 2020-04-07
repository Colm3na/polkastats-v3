<template>
  <div>
    <b-dropdown
      id="languages"
      variant="none"
      class="language_selector"
      :text="lang"
    >
      <b-dropdown-item @click="setLanguage('en')">English</b-dropdown-item>
      <b-dropdown-item @click="setLanguage('es')">Español</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      lang: null
    };
  },
  created: function() {
    const { locale } = this.$store.state.locales;
    this.setLanguage(locale);
  },
  methods: {
    setLanguage(locale) {
      switch (locale) {
        case "en":
          this.lang = "English";
          this.$store.commit("locales/SET_LANG", locale);
          this._i18n.locale = locale;
          break;
        case "es":
          this.lang = "Español";
          this.$store.commit("locales/SET_LANG", locale);
          this._i18n.locale = locale;
          break;
        default:
          this.lang = "English";
          this.$store.commit("locales/SET_LANG", locale);
          this._i18n.locale = locale;
          break;
      }
    }
  }
};
</script>

<style>
#languages {
  margin-bottom: 0;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
#languages .btn-none {
  color: white;
}
#languages button,
#languages button:hover,
#languages button:visited,
#languages button:focus,
#languages button:active {
  padding: 0;
  margin-left: 1rem;
  font-size: 0.9rem;
}
</style>

export default function({ isHMR, app, store }) {
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) {
    return;
  }

  const locale = app.i18n.locale || app.i18n.fallbackLocale;
  store.commit("locales/SET_LANG", locale);
}

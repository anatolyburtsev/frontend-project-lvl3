import i18next from 'i18next';
import resources from './locales';
import App from './app.js';

export default () => {
  const i18Instance = i18next.createInstance();
  return i18Instance.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => App(i18Instance));
};

import i18next from 'i18next';
import ru from './locales/ru';
import App from './app.js';

export default () => {
  const i18Instance = i18next.createInstance();
  i18Instance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  })
    .then(() => App(i18Instance));
};

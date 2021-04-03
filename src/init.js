import i18next from 'i18next';
import ru from './locales/ru';
import App from './app.js';

export default () => i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru,
  },
})
  .then(() => App());

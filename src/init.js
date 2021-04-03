import i18next from 'i18next';
import ru from './locales/ru';
import App from './app.js';

export default () => i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
})
  .then(() => App());

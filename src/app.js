import onChange from 'on-change';
import isValidRssUrl from './validator';

export default () => {
  const state = {
    feedUrl: {
      valid: true,
    },
  };

  const inputUrl = document.querySelector('input[name="url"]');

  // eslint-disable-next-line no-unused-vars
  const watchedState = onChange(state, (path, value, prevValue, name) => {
    if (path === 'feedUrl.valid') {
      if (!value) {
        inputUrl.classList.add('is-invalid');
      } else {
        inputUrl.classList.remove('is-invalid');
      }
    }
  });

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const rssUrl = formData.get('url');
    const isUrlValid = isValidRssUrl(rssUrl);
    watchedState.feedUrl.valid = isUrlValid;
    if (!isUrlValid) {
      return;
    }

    inputUrl.value = '';
  });
};

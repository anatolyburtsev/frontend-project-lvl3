import elements from './elements';

export default (path, value) => {
  const inputUrl = elements.inputUrlEl();
  const feedbackEl = elements.feedbackEl();

  if (path === 'feed.urlValid') {
    if (!value) {
      inputUrl.classList.add('is-invalid');
    } else {
      inputUrl.classList.remove('is-invalid');
    }
  }
  if (path === 'feed.error') {
    if (value !== '') {
      feedbackEl.classList.add('text-danger');
      // add i18next here
      feedbackEl.textContent = value; // 'Resource doesn\'t contain a valid RSS feed';
    } else {
      feedbackEl.classList.remove('text-danger');
      feedbackEl.textContent = '';
    }
  }
};

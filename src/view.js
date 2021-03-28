import i18next from 'i18next';
import elements from './elements';
import strings from './locales/stringConstants';

export default (path, value) => {
  const inputUrl = elements.inputUrlEl();
  const feedbackEl = elements.feedbackEl();
  const feedsEl = elements.feedsEl();
  const postsEl = elements.postsEl();
  const btnEl = elements.buttonEl();

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
      feedbackEl.classList.remove('text-success');
      feedbackEl.textContent = i18next.t(value);
    } else {
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.add('text-success');
      feedbackEl.textContent = i18next.t(strings.rssAddedSuccessfully);
    }
  }

  if (path === 'feed.processing') {
    if (value) {
      btnEl.setAttribute('disabled', '');
    } else {
      btnEl.removeAttribute('disabled');
    }
  }

  if (path === 'feeds') {
    feedsEl.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = i18next.t(strings.feeds);
    feedsEl.appendChild(title);
    const list = document.createElement('ul');
    list.classList.add('list-group', 'mb-5');
    value.forEach((feed) => {
      const item = document.createElement('li');
      item.classList.add('list-group-item');
      const itemTitle = document.createElement('h3');
      itemTitle.textContent = feed.title;
      const itemDescription = document.createElement('p');
      itemDescription.textContent = feed.description;
      item.appendChild(itemTitle);
      item.appendChild(itemDescription);
      list.appendChild(item);
    });
    feedsEl.appendChild(list);
  }

  if (path === 'posts') {
    postsEl.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = i18next.t(strings.posts);
    postsEl.appendChild(title);
    const list = document.createElement('ul');
    list.classList.add('list-group');
    value.forEach((post) => {
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

      const link = document.createElement('a');
      link.classList.add('font-weight-bold');
      link.setAttribute('href', post.link);
      link.dataset.id = post.id;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.textContent = post.title;

      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-primary', 'btn-sm');
      btn.type = 'button';
      btn.dataset.id = post.id;
      btn.dataset.toggle = 'modal';
      btn.dataset.target = '#modal';
      btn.textContent = i18next.t(strings.view);

      item.appendChild(link);
      item.appendChild(btn);
      list.appendChild(item);
    });

    postsEl.appendChild(list);
  }
};

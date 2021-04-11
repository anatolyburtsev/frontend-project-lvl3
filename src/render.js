import strings from './locales/stringConstants';

export const getElements = (document) => ({
  formEl: document.querySelector('#main-form'),
  inputUrlEl: document.querySelector('input[name="url"]'),
  feedbackEl: document.querySelector('.feedback'),
  feedsEl: document.querySelector('.feeds'),
  postsEl: document.querySelector('.posts'),
  buttonEl: document.querySelector('[aria-label="add"]'),
  modalTitleEl: document.querySelector('.modal-title'),
  modalBodyEl: document.querySelector('.modal-body'),
  modalMoreInfoBtnEl: document.querySelector('.full-article'),
});

export const renderFeeds = (feeds, elements, i18nInstance) => {
  elements.feedsEl.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = i18nInstance.t(strings.feeds);
  elements.feedsEl.appendChild(title);
  const list = document.createElement('ul');
  list.classList.add('list-group', 'mb-5');
  feeds.forEach((feed) => {
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
  elements.feedsEl.appendChild(list);
};

export const renderPosts = (posts, elements, i18nInstance) => {
  elements.postsEl.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = i18nInstance.t(strings.posts);
  elements.postsEl.appendChild(title);
  const list = document.createElement('ul');
  list.classList.add('list-group');
  posts.forEach((post) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

    const link = document.createElement('a');
    if (post.visited) {
      link.classList.add('font-weight-normal');
    } else {
      link.classList.add('font-weight-bold');
    }
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
    btn.textContent = i18nInstance.t(strings.view);

    item.appendChild(link);
    item.appendChild(btn);
    list.appendChild(item);
  });

  elements.postsEl.appendChild(list);
};

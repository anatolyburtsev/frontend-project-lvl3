import i18next from 'i18next';
import $ from 'jquery';
import strings from './locales/stringConstants';
import { appStates } from './constants';

export const formEl = document.querySelector('.rss-form');

const elements = {
  inputUrlEl: document.querySelector('input[name="url"]'),
  feedbackEl: document.querySelector('.feedback'),
  feedsEl: document.querySelector('.feeds'),
  postsEl: document.querySelector('.posts'),
  buttonEl: document.querySelector('[aria-label="add"]'),
  modalEl: document.querySelector('modal'),
  modalTitleEl: document.querySelector('.modal-title'),
  modalBodyEl: document.querySelector('.modal-body'),
  modalMoreInfoBtnEl: document.querySelector('.full-article'),
};

const showError = (textKey) => {
  elements.feedbackEl.classList.add('text-danger');
  elements.feedbackEl.textContent = i18next.t(textKey);
};

const hideError = () => {
  elements.feedbackEl.classList.remove('text-danger');
  elements.feedbackEl.textContent = '';
};

const showFeedback = (textKey) => {
  elements.feedbackEl.classList.add('text-success');
  elements.feedbackEl.textContent = i18next.t(textKey);
};

const hideFeedback = () => {
  elements.feedbackEl.classList.remove('text-success');
  elements.feedbackEl.textContent = '';
};

const clearInput = () => {
  elements.inputUrlEl.value = '';
};

const getPostById = (state, id) => state.posts[id];

const setupModal = (state) => {
  $('#modal')
    .on('show.bs.modal', (event) => {
      const btn = event.relatedTarget;
      const { id } = btn.dataset;
      const post = getPostById(state, id);
      post.visited = true;
      elements.modalTitleEl.textContent = post.title;
      elements.modalBodyEl.textContent = post.description;
      elements.modalMoreInfoBtnEl.setAttribute('href', post.link);
    });
};

export const initView = (state) => {
  setupModal(state);
};

const renderFeeds = (feeds) => {
  elements.feedsEl.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = i18next.t(strings.feeds);
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

const renderPosts = (posts) => {
  elements.postsEl.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = i18next.t(strings.posts);
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
    btn.textContent = i18next.t(strings.view);

    item.appendChild(link);
    item.appendChild(btn);
    list.appendChild(item);
  });

  elements.postsEl.appendChild(list);
};

const appViewStateMachine = {
  [appStates.idle]: {
    enter: () => {
    },
    leave: () => {
    },
  },
  [appStates.invalidUrl]: {
    enter: () => {
      elements.inputUrlEl.classList.add('is-invalid');
      showError(strings.alerts.invalidUrl);
    },
    leave: () => {
      elements.inputUrlEl.classList.remove('is-invalid');
      hideError();
    },
  },
  [appStates.processing]: {
    enter: () => {
      elements.buttonEl.setAttribute('disabled', '');
    },
    leave: () => {
      elements.buttonEl.removeAttribute('disabled');
    },
  },
  [appStates.generalError]: {
    enter: (state) => {
      console.log('Error happens');
      console.error(state.error);
      console.log('state for debug:');
      console.dir(state);
      showError(state.error);
    },
    leave: () => {
      hideError();
    },
  },
  [appStates.success]: {
    enter: () => {
      clearInput();
      showFeedback(strings.alerts.rssAddedSuccessfully);
    },
    leave: () => {
      hideFeedback();
    },
  },
};

export const updateView = (path, value, previousValue, state) => {
  if (path === 'state') {
    console.log(`state is changing from ${previousValue} to ${value}`);
    appViewStateMachine[previousValue].leave();
    appViewStateMachine[value].enter(state);
  }

  if (path.startsWith('feeds')) {
    renderFeeds(state.feeds);
  }

  if (path.startsWith('posts')) {
    renderPosts(state.posts);
  }
};

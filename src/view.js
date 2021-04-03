import i18next from 'i18next';
import $ from 'jquery';
import strings from './locales/stringConstants';
import { appStates } from './constants';
import { elements, renderFeeds, renderPosts } from './render';

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

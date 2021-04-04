import i18next from 'i18next';
import $ from 'jquery';
import strings from './locales/stringConstants';
import { appStates } from './constants';
import { renderFeeds, renderPosts } from './render';

const showError = (textKey, elements) => {
  elements.feedbackEl.classList.add('text-danger');
  elements.feedbackEl.textContent = i18next.t(textKey);
};

const hideError = (elements) => {
  elements.feedbackEl.classList.remove('text-danger');
  elements.feedbackEl.textContent = '';
};

const showFeedback = (textKey, elements) => {
  elements.feedbackEl.classList.add('text-success');
  elements.feedbackEl.textContent = i18next.t(textKey);
};

const hideFeedback = (elements) => {
  elements.feedbackEl.classList.remove('text-success');
  elements.feedbackEl.textContent = '';
};

const clearInput = (elements) => {
  elements.inputUrlEl.value = '';
};

const getPostById = (state, id) => state.posts[id];

const setupModal = (state, elements) => {
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

export const initView = (state, elements) => {
  setupModal(state, elements);
};

const appViewStateMachine = (elements) => ({
  [appStates.idle]: {
    enter: () => {
    },
    leave: () => {
    },
  },
  [appStates.invalidUrl]: {
    enter: () => {
      elements.inputUrlEl.classList.add('is-invalid');
      showError(strings.alerts.invalidUrl, elements);
    },
    leave: () => {
      elements.inputUrlEl.classList.remove('is-invalid');
      hideError(elements);
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
      showError(state.error, elements);
    },
    leave: () => {
      hideError(elements);
    },
  },
  [appStates.success]: {
    enter: () => {
      clearInput(elements);
      showFeedback(strings.alerts.rssAddedSuccessfully, elements);
    },
    leave: () => {
      hideFeedback(elements);
    },
  },
});

export const updateView = (path, value, previousValue, state, elements) => {
  if (path === 'state') {
    appViewStateMachine(elements)[previousValue].leave();
    appViewStateMachine(elements)[value].enter(state);
  }

  if (path.startsWith('feeds')) {
    renderFeeds(state.feeds, elements);
  }

  if (path.startsWith('posts')) {
    renderPosts(state.posts, elements);
  }
};

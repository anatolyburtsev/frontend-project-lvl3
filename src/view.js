import i18next from 'i18next';
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
      elements.inputUrlEl.setAttribute('readonly', '');
    },
    leave: () => {
      elements.buttonEl.removeAttribute('disabled');
      elements.inputUrlEl.removeAttribute('readonly');
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

const fillModal = (state, elements) => {
  const id = state.ui.modal.postId;
  const post = getPostById(state, id);
  elements.modalTitleEl.textContent = post.title;
  elements.modalBodyEl.textContent = post.description;
  elements.modalMoreInfoBtnEl.setAttribute('href', post.link);
};

// eslint-disable-next-line import/prefer-default-export
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

  if (path === 'ui.modal.postId') {
    fillModal(state, elements);
  }
};

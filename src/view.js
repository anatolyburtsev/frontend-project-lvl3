import strings from './locales/stringConstants';
import { appStates } from './constants';
import { renderFeeds, renderPosts } from './render';

const showError = (elements, i18nInstance, textKey) => {
  elements.feedbackEl.classList.add('text-danger');
  elements.feedbackEl.textContent = i18nInstance.t(textKey);
};

const hideError = (elements) => {
  elements.feedbackEl.classList.remove('text-danger');
  elements.feedbackEl.textContent = '';
};

const showFeedback = (elements, i18nInstance, textKey) => {
  elements.feedbackEl.classList.add('text-success');
  elements.feedbackEl.textContent = i18nInstance.t(textKey);
};

const hideFeedback = (elements) => {
  elements.feedbackEl.classList.remove('text-success');
  elements.feedbackEl.textContent = '';
};

const clearInput = (elements) => {
  elements.inputUrlEl.value = '';
};

const showInputInvalid = (elements) => {
  elements.inputUrlEl.classList.add('is-invalid');
};

const hideInputInvalid = (elements) => {
  elements.inputUrlEl.classList.remove('is-invalid');
};

const enableReadonly = (elements) => {
  elements.buttonEl.setAttribute('disabled', '');
  elements.inputUrlEl.setAttribute('readonly', '');
};

const disableReadonly = (elements) => {
  elements.buttonEl.removeAttribute('disabled');
  elements.inputUrlEl.removeAttribute('readonly');
};

const getPostById = (state, id) => state.posts[id];

const appViewStateMachine = (elements, i18nInstance) => ({
  [appStates.idle]: {
    enter: () => {
    },
    leave: () => {
    },
  },
  [appStates.invalidUrl]: {
    enter: () => {
      showInputInvalid(elements);
      showError(elements, i18nInstance, strings.alerts.invalidUrl);
    },
    leave: () => {
      hideInputInvalid(elements);
      hideError(elements);
    },
  },
  [appStates.processing]: {
    enter: () => {
      enableReadonly(elements);
    },
    leave: () => {
      disableReadonly(elements);
    },
  },
  [appStates.generalError]: {
    enter: (state) => {
      showError(elements, i18nInstance, state.error);
    },
    leave: () => {
      hideError(elements);
    },
  },
  [appStates.success]: {
    enter: () => {
      clearInput(elements);
      showFeedback(elements, i18nInstance, strings.alerts.rssAddedSuccessfully);
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
export const updateView = (path, value, previousValue, state, elements, i18nInstance) => {
  if (path === 'state') {
    appViewStateMachine(elements, i18nInstance)[previousValue].leave();
    appViewStateMachine(elements, i18nInstance)[value].enter(state);
  }

  if (path.startsWith('feeds')) {
    renderFeeds(state.feeds, elements, i18nInstance);
  }

  if (path.startsWith('posts')) {
    renderPosts(state, elements, i18nInstance);
  }

  if (path === 'ui.modal.postId') {
    fillModal(state, elements);
  }
};

import strings from './locales/stringConstants';
import { appStates } from './constants';
import { renderFeeds, renderPosts } from './render';

export class UiHelpers {
  constructor(i18nInstance, elements) {
    this.i18nInstance = i18nInstance;
    this.elements = elements;
  }

  showError(textKey) {
    this.elements.feedbackEl.classList.add('text-danger');
    this.elements.feedbackEl.textContent = this.i18nInstance.t(textKey);
  }

  hideError() {
    this.elements.feedbackEl.classList.remove('text-danger');
    this.elements.feedbackEl.textContent = '';
  }

  showFeedback(textKey) {
    this.elements.feedbackEl.classList.add('text-success');
    this.elements.feedbackEl.textContent = this.i18nInstance.t(textKey);
  }

  hideFeedback() {
    this.elements.feedbackEl.classList.remove('text-success');
    this.elements.feedbackEl.textContent = '';
  }

  clearInput() {
    this.elements.inputUrlEl.value = '';
  }

  showInputInvalid() {
    this.elements.inputUrlEl.classList.add('is-invalid');
  }

  hideInputInvalid() {
    this.elements.inputUrlEl.classList.remove('is-invalid');
  }

  enableReadonly() {
    this.elements.buttonEl.setAttribute('disabled', '');
    this.elements.inputUrlEl.setAttribute('readonly', '');
  }

  disableReadonly() {
    this.elements.buttonEl.removeAttribute('disabled');
    this.elements.inputUrlEl.removeAttribute('readonly');
  }
}

const getPostById = (state, id) => state.posts[id];

const appViewStateMachine = (uiHelper) => ({
  [appStates.idle]: {
    enter: () => {
    },
    leave: () => {
    },
  },
  [appStates.invalidUrl]: {
    enter: () => {
      uiHelper.showInputInvalid();
      uiHelper.showError(strings.alerts.invalidUrl);
    },
    leave: () => {
      uiHelper.hideInputInvalid();
      uiHelper.hideError();
    },
  },
  [appStates.processing]: {
    enter: () => {
      uiHelper.enableReadonly();
    },
    leave: () => {
      uiHelper.disableReadonly();
    },
  },
  [appStates.generalError]: {
    enter: (state) => {
      uiHelper.showError(state.error);
    },
    leave: () => {
      uiHelper.hideError();
    },
  },
  [appStates.success]: {
    enter: () => {
      uiHelper.clearInput();
      uiHelper.showFeedback(strings.alerts.rssAddedSuccessfully);
    },
    leave: () => {
      uiHelper.hideFeedback();
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

export const updateView = (path, value, previousValue, state, uiHelper, i18nInstance) => {
  if (path === 'state') {
    appViewStateMachine(uiHelper)[previousValue].leave();
    appViewStateMachine(uiHelper)[value].enter(state);
  }

  if (path.startsWith('feeds')) {
    renderFeeds(state.feeds, uiHelper.elements, i18nInstance);
  }

  if (path.startsWith('posts')) {
    renderPosts(state.posts, uiHelper.elements, i18nInstance);
  }

  if (path === 'ui.modal.postId') {
    fillModal(state, uiHelper.elements);
  }
};

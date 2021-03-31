const inputUrlEl = () => document.querySelector('input[name="url"]');

const feedbackEl = () => document.querySelector('.feedback');

const feedsEl = () => document.querySelector('.feeds');

const postsEl = () => document.querySelector('.posts');

const buttonEl = () => document.querySelector('button');

const formEl = () => document.querySelector('.rss-form');

const modalEl = () => document.querySelector('modal');
const modalTitleEl = () => document.querySelector('.modal-title');
const modalBodyEl = () => document.querySelector('.modal-body');
const modalMoreInfoBtnEl = () => document.querySelector('.full-article');

export default {
  inputUrlEl,
  feedbackEl,
  feedsEl,
  postsEl,
  buttonEl,
  formEl,
  modalEl,
  modalTitleEl,
  modalBodyEl,
  modalMoreInfoBtnEl,
};
